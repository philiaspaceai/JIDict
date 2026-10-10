"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { AppShell } from "@/components/AppShell";
import { getDictDB } from "@/lib/dict/client";
import { clearDictData } from "@/lib/dict/importer";
import { fetchRemoteDictIndex, isNewerVersion } from "@/lib/update-check";
import { clearHistory, getFrequencySource, setFrequencySource } from "@/lib/user";
import type { FrequencySource } from "@/lib/constants";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [freq, setFreq] = useState<FrequencySource>("jpdb");
  const [version, setVersion] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFreq(getFrequencySource());
    getDictDB().dictInfo.get("revision:jidict").then((r) => setVersion(r?.value ?? null)).catch(() => {});
  }, []);

  async function checkUpdate() {
    setBusy(true);
    setStatus("Memeriksa…");
    try {
      const remote = await fetchRemoteDictIndex();
      if (!remote) setStatus("Offline — versi lokal dipakai");
      else if (isNewerVersion(remote.version, version)) setStatus(`Update tersedia: ${remote.version}`);
      else setStatus("Sudah terbaru");
    } catch {
      setStatus("Gagal memeriksa");
    } finally {
      setBusy(false);
    }
  }

  async function wipe() {
    if (!confirm("Hapus semua data kamus + riwayat?")) return;
    await clearDictData(getDictDB());
    await clearHistory();
    location.reload();
  }

  return (
    <AppShell>
      <h1 className="text-lg font-bold">Setelan</h1>
      <div className="mt-4 space-y-3">
        <section className="rounded-xl border bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold">Tema</h2>
          <div className="mt-2 flex gap-2">
            {(["system", "light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={`rounded-full px-4 py-1.5 text-sm capitalize ${
                  theme === t ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)]"
                }`}
              >
                {t === "system" ? "Auto" : t === "light" ? "Terang" : "Gelap"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold">Frekuensi</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Menentukan urutan hasil.</p>
          <div className="mt-2 flex gap-2">
            {(["jpdb", "youtube"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setFrequencySource(s);
                  setFreq(s);
                }}
                aria-pressed={freq === s}
                className={`rounded-full px-4 py-1.5 text-sm ${
                  freq === s ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)]"
                }`}
              >
                {s === "jpdb" ? "JPDB" : "Youtube"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold">Data</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Kamus: {version ?? "belum terpasang"}
          </p>
          {status && <p className="mt-1 text-xs">{status}</p>}
          <div className="mt-2 flex gap-2">
            <button
              onClick={checkUpdate}
              disabled={busy}
              className="rounded-full bg-[var(--muted)] px-4 py-1.5 text-sm disabled:opacity-60"
            >
              Cek update
            </button>
            <button onClick={wipe} className="rounded-full bg-[var(--muted)] px-4 py-1.5 text-sm">
              Hapus data
            </button>
          </div>
        </section>

        <section className="rounded-xl border bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold">Tentang</h2>
          <div className="mt-2 flex items-center gap-3">
            <Image src="/logo/community-logo.png" alt="Philia Space" width={48} height={48} />
            <p className="text-xs text-[var(--muted-foreground)]">JIDict · GPL-3.0 · Engine Yomitan</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
