"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

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
            <button className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm text-white">JPDB</button>
            <button className="rounded-full bg-[var(--muted)] px-4 py-1.5 text-sm">Youtube</button>
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
