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
            <p className="text-sm font-semibold">Philia Space Community</p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
            JIDict adalah aplikasi kamus Jepang-Indonesia berformat Yomitan Dictionary pertama di Indonesia,
            dengan jumlah entri lebih dari 300.000. Kamus ini dikembangkan oleh Philia Space Community selaku
            komunitas belajar bahasa Jepang asal Indonesia yang bersifat non-profit dan memiliki tiga peran utama,
            yaitu sebagai tempat belajar bersama melalui diskusi, latihan, dan berbagi pengalaman belajar bahasa
            Jepang, sebagai tempat mengembangkan berbagai tools dan resource belajar seperti kamus JIDict, deck Anki,
            bot latihan JLPT, hingga skill AI agent yang semuanya bersifat open-source, serta sebagai tempat
            menampung dan mengkurasi resource dari berbagai komunitas luar negeri seperti TheMoeWay agar mudah
            ditemukan dan dimanfaatkan oleh para pejuang bahasa Jepang Indonesia.
          </p>
          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex gap-2">
              <dt className="shrink-0 text-[var(--muted-foreground)]">Data kamus</dt>
              <dd>
                © Utawnyan &amp; Demonkzz ·{" "}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[var(--primary)]"
                >
                  CC BY-NC 4.0
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-[var(--muted-foreground)]">Aplikasi</dt>
              <dd>
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.html"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[var(--primary)]"
                >
                  GPL-3.0
                </a>{" "}
                · Engine{" "}
                <a
                  href="https://github.com/yomidevs/yomitan"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[var(--primary)]"
                >
                  Yomitan
                </a>{" "}
                ·{" "}
                <a
                  href="https://github.com/philiaspaceai/JIDict"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[var(--primary)]"
                >
                  Kode sumber
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
