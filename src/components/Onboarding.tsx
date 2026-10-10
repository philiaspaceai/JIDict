"use client";

import { useState } from "react";
import Image from "next/image";
import { BUNDLED_DICTS, DICT_DOWNLOAD_URL } from "@/lib/constants";
import { getDB } from "@/lib/db";

async function downloadWithProgress(url: string, onProgress: (p: number) => void): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Unduh gagal: ${url}`);
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
  return new Blob(chunks as BlobPart[]);
}

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const db = getDB();
      // 1. Kamus utama JIDict-yomitan
      setProgress(0.05);
      await downloadWithProgress(DICT_DOWNLOAD_URL, (p) => setProgress(0.05 + p * 0.7));
      // 2. Frekuensi + pitch dari repo ini
      let i = 0;
      for (const d of BUNDLED_DICTS) {
        await downloadWithProgress(d.file, (p) =>
          setProgress(0.75 + (i + p) / BUNDLED_DICTS.length / 4),
        );
        i += 1;
      }
      await db.meta.put({ key: "dictReady", value: new Date().toISOString() });
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
      {error && <p className="text-sm text-[var(--primary)]">{error}</p>}
      <button
        onClick={start}
        disabled={busy}
        className="rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Mengunduh…" : "Unduh data"}
      </button>
    </div>
  );
}
