"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Splash } from "@/components/Splash";
import { BottomNav } from "@/components/BottomNav";
import { getDictDB } from "@/lib/dict/client";
import { clearDictData, importDictZip } from "@/lib/dict/importer";
import { DICT_DOWNLOAD_URL } from "@/lib/constants";
import { fetchRemoteDictIndex, isNewerVersion } from "@/lib/update-check";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dict = getDictDB();
        const count = await dict.terms.count();
        if (cancelled || count === 0) return;
        const local = await dict.dictInfo.get("revision:jidict");
        const remote = await fetchRemoteDictIndex();
        if (!cancelled && remote && isNewerVersion(remote.version, local?.value ?? null)) {
          setRemoteVersion(remote.version);
        }
      } catch {
        // offline — stay usable
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function applyUpdate() {
    setUpdating(true);
    setUpdateProgress(0);
    try {
      const res = await fetch(DICT_DOWNLOAD_URL);
      if (!res.ok || !res.body) throw new Error();
      const total = Number(res.headers.get("content-length") ?? 0);
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let done = 0;
      for (;;) {
        const { value, done: fin } = await reader.read();
        if (fin) break;
        if (value) {
          chunks.push(value);
          done += value.length;
          if (total) setUpdateProgress((done / total) * 0.6);
        }
      }
      const bytes = new Uint8Array(done);
      let off = 0;
      for (const c of chunks) {
        bytes.set(c, off);
        off += c.length;
      }
      const dict = getDictDB();
      await clearDictData(dict);
      const r = await importDictZip(dict, bytes, {
        kind: "main",
        source: "jidict",
        onProgress: (d, t) => setUpdateProgress(0.6 + (d / t) * 0.4),
      });
      // Re-import bundled meta (ships with app)
      for (const [file, source] of [
        ["/dictionaries/pitch_accent.zip", "pitch"],
        ["/dictionaries/jpdb_freq.zip", "jpdb"],
        ["/dictionaries/youtube_freq.zip", "youtube"],
        ["/dictionaries/jlpt_freq.zip", "jlpt"],
      ] as const) {
        const b = await (await fetch(file)).arrayBuffer();
        await importDictZip(dict, new Uint8Array(b), { kind: "meta", source });
      }
      void r;
      setRemoteVersion(null);
    } catch {
      // keep banner; user can retry
    } finally {
      setUpdating(false);
    }
  }

  if (!splashDone) {
    return <Splash onDone={() => setSplashDone(true)} updateAvailable={remoteVersion !== null} />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 border-b bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          {mounted && (
            <Image
              src={resolvedTheme === "dark" ? "/logo/app-logo-dark.png" : "/logo/app-logo.png"}
              alt="JIDict"
              width={96}
              height={28}
              priority
            />
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4">
        {remoteVersion && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border bg-[var(--card)] p-3 text-sm">
            <span>Update kamus {remoteVersion} tersedia</span>
            <button
              onClick={applyUpdate}
              disabled={updating}
              className="shrink-0 rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {updating ? `${Math.round(updateProgress * 100)}%` : "Update"}
            </button>
          </div>
        )}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
