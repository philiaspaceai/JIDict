"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Segmented } from "@/components/Segmented";
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
    <>
      <h1 className="font-display text-xl font-bold tracking-tight">Setelan</h1>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="rounded-card border bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold">Tema</h2>
          <div className="mt-2">
            <Segmented
              ariaLabel="Tema"
              options={["system", "light", "dark"] as const}
              value={(theme as "system" | "light" | "dark" | undefined) ?? "system"}
              onChange={setTheme}
              labels={{ system: "Auto", light: "Terang", dark: "Gelap" }}
            />
          </div>
        </section>

        <section className="rounded-card border bg-[var(--card)] p-4">
          <h2 className="text-sm font-semibold">Frekuensi</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Menentukan urutan hasil.</p>
          <div className="mt-2">
            <Segmented
              ariaLabel="Sumber frekuensi"
              options={["jpdb", "youtube"] as const}
              value={freq}
              onChange={(s) => {
                setFrequencySource(s);
                setFreq(s);
              }}
              labels={{ jpdb: "JPDB", youtube: "Youtube" }}
            />
          </div>
        </section>

        <section className="rounded-card border bg-[var(--card)] p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Data</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Kamus: {version ?? "belum terpasang"}
          </p>
          {status && <p className="mt-1 text-xs">{status}</p>}
          <div className="mt-2 flex gap-2">
            <button
              onClick={checkUpdate}
              disabled={busy}
              className="rounded-full bg-[var(--muted)] px-4 py-1.5 text-sm transition-transform active:scale-95 disabled:opacity-60"
            >
              Periksa
            </button>
            <button onClick={wipe} className="rounded-full bg-[var(--muted)] px-4 py-1.5 text-sm transition-transform active:scale-95">
              Hapus data
            </button>
          </div>
        </section>

        <section className="rounded-card border bg-[var(--card)] p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Tentang</h2>
          <div className="mt-2 flex items-center gap-3">
            <Image src="/logo/community-logo.png" alt="Philia Space" width={48} height={48} />
            <p className="text-xs text-[var(--muted-foreground)]">JIDict · GPL-3.0 · Engine Yomitan</p>
          </div>
        </section>
      </div>
    </>
  );
}
