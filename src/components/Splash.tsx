"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { BUNDLED_DICTS, DICT_DOWNLOAD_URL } from "@/lib/constants";
import { getDictDB } from "@/lib/dict/client";
import { clearDictData, importDictZip } from "@/lib/dict/importer";
import { checkAppUpdate, markAppUpdated } from "@/lib/app-update";
import { fetchRemoteDictIndex, isNewerVersion } from "@/lib/update-check";
import { decideSplashAction, downloadFraction, formatMB, type SplashFlowState } from "@/lib/splash";

const META_SOURCE: Record<string, string> = {
  pitch_accent: "pitch",
  jpdb_freq: "jpdb",
  youtube_freq: "youtube",
  jlpt_freq: "jlpt",
};

function sourceOf(file: string): string {
  const base = file.split("/").pop()?.replace(".zip", "") ?? file;
  return META_SOURCE[base] ?? base;
}

async function downloadBytes(url: string, onProgress: (done: number, total: number) => void): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Unduh gagal (${res.status})`);
  const total = Number(res.headers.get("content-length") ?? 0);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let done = 0;
  for (;;) {
    const { value, done: finished } = await reader.read();
    if (finished) break;
    if (value) {
      chunks.push(value);
      done += value.length;
      onProgress(done, total);
    }
  }
  const out = new Uint8Array(done);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

const STAGE_LABEL: Record<string, string> = {
  "checking-app": "Memeriksa pembaruan…",
  "updating-app": "Memperbarui aplikasi…",
  "checking-dict": "Memeriksa kamus…",
  downloading: "Mengunduh data…",
  importing: "Memasang kamus…",
};

export function Splash({ onDone }: { onDone: () => void }) {
  const { resolvedTheme } = useTheme();
  const [flow, setFlow] = useState<SplashFlowState>("checking-app");
  const [progress, setProgress] = useState(0);
  const [bytes, setBytes] = useState({ done: 0, total: 0 });
  const [detail, setDetail] = useState("");
  const [runId, setRunId] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const run = useCallback(async (cancelled: () => boolean) => {
    // 1. Update aplikasi (wajib reload dulu bila berubah).
    setFlow("checking-app");
    try {
      await navigator.serviceWorker?.getRegistration().then((r) => r?.update()).catch(() => {});
    } catch {
      // abaikan — lanjut cek versi
    }
    const app = await checkAppUpdate(fetch, localStorage);
    if (cancelled()) return;
    if (app.available && app.sha) {
      setFlow("updating-app");
      markAppUpdated(localStorage, app.sha);
      location.reload();
      return;
    }

    // 2. Status kamus lokal vs remote.
    setFlow("checking-dict");
    const dict = getDictDB();
    const [count, marker] = await Promise.all([
      dict.terms.count().catch(() => 0),
      dict.dictInfo.get("format:glossary").catch(() => undefined),
    ]);
    const dictReady = count > 0 && marker?.value === "raw-v2";
    const remote = await fetchRemoteDictIndex();
    if (cancelled()) return;
    const local = await dict.dictInfo.get("revision:jidict").catch(() => undefined);
    const action = decideSplashAction({
      appChanged: false,
      dictReady,
      dictChanged: isNewerVersion(remote?.version ?? null, local?.value ?? null),
      online: remote !== null,
    });
    if (action === "enter") {
      setFlow("ready");
      setProgress(1);
      doneRef.current();
      return;
    }
    if (action === "needs-network") {
      setFlow("needs-network");
      return;
    }

    // 3. Unduh + impor (progress nyata).
    await clearDictData(dict);
    setFlow("downloading");
    const main = await downloadBytes(DICT_DOWNLOAD_URL, (done, total) => {
      if (cancelled()) return;
      setBytes({ done, total });
      setProgress(downloadFraction(done, total) * 0.5);
    });
    if (cancelled()) return;
    setFlow("importing");
    setDetail("");
    await importDictZip(dict, main, {
      kind: "main",
      source: "jidict",
      onProgress: (d, t) => {
        if (!cancelled()) setProgress(0.5 + (d / t) * 0.2);
      },
    });
    let i = 0;
    for (const d of BUNDLED_DICTS) {
      if (cancelled()) return;
      const name = sourceOf(d.file);
      setDetail(name);
      const buf = await downloadBytes(d.file, () => {});
      await importDictZip(dict, buf, { kind: "meta", source: name });
      i += 1;
      if (!cancelled()) setProgress(0.7 + (i / BUNDLED_DICTS.length) * 0.3);
    }
    if (cancelled()) return;
    setFlow("ready");
    setProgress(1);
    doneRef.current();
  }, []);

  useEffect(() => {
    let cancelled = false;
    run(() => cancelled).catch(() => {
      if (!cancelled) setFlow("needs-network");
    });
    return () => {
      cancelled = true;
    };
  }, [run, runId]);

  if (flow === "needs-network") {
    return (
      <div data-testid="splash" className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <Image src="/mascots/5.png" alt="" width={120} height={120} />
        <p className="text-sm text-[var(--muted-foreground)]">Butuh internet untuk unduh pertama</p>
        <button
          onClick={() => {
            setProgress(0);
            setBytes({ done: 0, total: 0 });
            setRunId((n) => n + 1);
          }}
          className="rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const pct = Math.round(progress * 100);
  const label =
    flow === "downloading" && bytes.total > 0
      ? `${formatMB(bytes.done)} / ${formatMB(bytes.total)}`
      : flow === "importing" && detail
        ? `Memasang ${detail}…`
        : (STAGE_LABEL[flow] ?? "");

  return (
    <div data-testid="splash" className="splash-enter flex min-h-dvh flex-col items-center justify-center gap-6 bg-[var(--background)]">
      <Image
        src={resolvedTheme === "dark" ? "/logo/app-logo-dark.png" : "/logo/app-logo.png"}
        alt="JIDict"
        width={180}
        height={52}
        priority
      />
      <div className="w-44">
        <div className="h-0.5 overflow-hidden rounded bg-[var(--border)]">
          <div className="h-full rounded bg-[var(--primary)] transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
