"use client";

import { useState } from "react";
import Image from "next/image";
import { BUNDLED_DICTS, DICT_DOWNLOAD_URL } from "@/lib/constants";
import { getDictDB } from "@/lib/dict/client";
import { clearDictData, importDictZip } from "@/lib/dict/importer";
import { getDB } from "@/lib/db";

async function downloadBytes(url: string, onProgress: (p: number) => void): Promise<Uint8Array> {
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
      if (total) onProgress(done / total);
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

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const dict = getDictDB();
      // Bersihkan dulu agar tidak duplikat (mis. migrasi format lama).
      await clearDictData(dict);
      // 1. Kamus utama (~43MB)
      setStage("Mengunduh kamus…");
      const main = await downloadBytes(DICT_DOWNLOAD_URL, (p) => setProgress(p * 0.5));
      setStage("Memasang kamus…");
      await importDictZip(dict, main, {
        kind: "main",
        source: "jidict",
        onProgress: (d, t) => setProgress(0.5 + (d / t) * 0.2),
      });
      // 2. Frekuensi + pitch dari repo ini
      let i = 0;
      for (const d of BUNDLED_DICTS) {
        setStage(`Memasang ${sourceOf(d.file)}…`);
        const bytes = await downloadBytes(d.file, (p) =>
          setProgress(0.7 + ((i + p) / BUNDLED_DICTS.length) * 0.3),
        );
        await importDictZip(dict, bytes, { kind: "meta", source: sourceOf(d.file) });
        i += 1;
      }
      await getDB().meta.put({ key: "dictReady", value: new Date().toISOString() });
      setProgress(1);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unduhan gagal. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <Image src="/mascots/1.png" alt="" width={140} height={140} priority />
      <div>
        <h1 className="text-xl font-bold">Selamat datang di JIDict</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Unduh data sekali, pakai offline.</p>
      </div>
      <div className="h-1.5 w-56 overflow-hidden rounded bg-[var(--border)]">
        <div className="h-full rounded bg-[var(--primary)] transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      {stage && busy && <p className="text-xs text-[var(--muted-foreground)]">{stage}</p>}
      {error && <p className="text-sm text-[var(--primary)]">{error}</p>}
      <button
        onClick={start}
        disabled={busy}
        className="rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Mengunduh…" : progress > 0 && error ? "Coba lagi" : "Unduh data"}
      </button>
    </div>
  );
}
