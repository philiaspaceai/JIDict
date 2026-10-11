import type { Metadata } from "next";
import Link from "next/link";
import { SeoJsonLd } from "@/components/SeoJsonLd";

export const metadata: Metadata = {
  title: "Cara Memasang JIDict di Android, iPhone & Desktop",
  description:
    "Pasang kamus Jepang–Indonesia JIDict langsung dari browser: Android, iPhone, dan desktop. Gratis, lalu full offline setelah unduh data pertama.",
  alternates: { canonical: "/pasang" },
};

const STEPS: Array<{ device: string; items: string[] }> = [
  {
    device: "Android (Chrome)",
    items: [
      "Buka JIDict di Chrome.",
      "Ketuk menu ⋮ → “Install aplikasi” atau “Add to Home screen”.",
      "Buka dari home screen, unduh data sekali — selesai.",
    ],
  },
  {
    device: "iPhone (Safari)",
    items: [
      "Buka JIDict di Safari.",
      "Ketuk tombol Share → “Add to Home Screen”.",
      "Buka dari home screen, unduh data sekali — selesai.",
    ],
  },
  {
    device: "Desktop (Chrome/Edge)",
    items: [
      "Buka JIDict di browser.",
      "Klik ikon install di address bar.",
      "JIDict berjalan di jendela sendiri, bisa dipakai offline.",
    ],
  },
];

export default function PasangPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
      <SeoJsonLd />
      <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        Cara memasang JIDict
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
        JIDict adalah PWA: tanpa Play Store/App Store, langsung dipasang dari browser.
        Butuh internet sekali untuk unduh data kamus, setelah itu full offline.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.device} className="rounded-card border bg-[var(--card)] p-4">
            <h2 className="text-sm font-semibold">{s.device}</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-[var(--muted-foreground)]">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
      >
        Buka JIDict
      </Link>
    </div>
  );
}
