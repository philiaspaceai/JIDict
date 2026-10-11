import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Download, MicVocal, OfflineCloud } from "@/components/LandingIcons";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { DemoSearch } from "./DemoSearch";
import { FAQS } from "./faq";

export const metadata: Metadata = {
  title: "Kamus Jepang Indonesia Offline + Pitch Accent | JIDict",
  description:
    "Kamus Jepang–Indonesia offline & gratis: 300.000+ entri, grafik pitch accent, frekuensi JPDB & Youtube, JLPT N5–N1. Cari kanji, kana, romaji tanpa internet.",
  alternates: { canonical: "/kamus-jepang-indonesia" },
  openGraph: {
    title: "JIDict — Kamus Jepang Indonesia Offline + Pitch Accent",
    description:
      "300.000+ entri Jepang–Indonesia, grafik pitch accent, full offline. Gratis, tanpa iklan.",
    type: "website",
  },
};

const FEATURES = [
  {
    Icon: OfflineCloud,
    title: "Full offline",
    body: "Unduh data sekali saat pertama dibuka, setelah itu seluruh kamus bisa dicari tanpa koneksi internet.",
  },
  {
    Icon: MicVocal,
    title: "Grafik pitch accent",
    body: "Pola nada tiap kosakata ditampilkan seperti di Yomitan — penting agar terdengar natural bagi penutur asli.",
  },
  {
    Icon: BookOpen,
    title: "Frekuensi JPDB & Youtube",
    body: "Urutan hasil mengikuti seberapa umum kata dipakai, lengkap dengan label JLPT N5 sampai N1.",
  },
  {
    Icon: Download,
    title: "PWA yang bisa dipasang",
    body: "Pasang dari browser di Android, iPhone, maupun desktop, lalu berjalan seperti aplikasi asli.",
  },
];

const STATS: Array<[string, string]> = [
  ["300.000+", "entri Jepang–Indonesia"],
  ["N5–N1", "cakupan level JLPT"],
  ["100%", "bisa offline"],
  ["Rp0", "gratis, tanpa iklan"],
];

export default function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
      <SeoJsonLd faq={FAQS} />
      <p className="inline-block rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
        Kamus Jepang–Indonesia
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Kamus Jepang Indonesia offline dengan pitch accent
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
        Cari 300.000+ kosakata Jepang–Indonesia lewat kanji, kana, atau romaji.
        Lengkap dengan grafik pitch accent, frekuensi JPDB &amp; Youtube, dan label JLPT.
        Gratis, tanpa iklan, full offline setelah unduh pertama.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/"
          className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          Buka JIDict
        </Link>
        <Link
          href="/pasang"
          className="rounded-full bg-[var(--muted)] px-6 py-3 text-sm font-semibold transition-transform active:scale-95"
        >
          Cara pasang aplikasi
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STATS.map(([v, label]) => (
          <div key={label} className="rounded-card border bg-[var(--card)] p-4 text-center">
            <dt className="order-2 mt-1 block text-xs text-[var(--muted-foreground)]">{label}</dt>
            <dd className="font-display text-2xl font-bold text-[var(--primary)]">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">Coba cari kata</h2>
      <div className="mt-3">
        <DemoSearch />
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">Kenapa JIDict?</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-card border bg-[var(--card)] p-4">
            <f.Icon size={22} className="text-[var(--primary)]" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold">{f.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">{f.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">Pasang dalam semenit</h2>
      <ol className="mt-3 space-y-2">
        {[
          "Buka JIDict di browser (Chrome/Safari/Edge).",
          "Pilih Install / Add to Home Screen dari menu browser.",
          "Buka aplikasi, unduh data sekali — selesai, full offline.",
        ].map((s, i) => (
          <li key={s} className="flex gap-3 rounded-card border bg-[var(--card)] p-4 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <Link
        href="/pasang"
        className="mt-3 inline-block rounded-full bg-[var(--muted)] px-5 py-2.5 text-sm font-semibold transition-transform active:scale-95"
      >
        Panduan lengkap per perangkat
      </Link>

      <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">Pertanyaan umum</h2>
      <div className="mt-3 space-y-2">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-card border bg-[var(--card)] px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-card bg-[var(--primary)] p-6 text-center text-white">
        <p className="font-display text-xl font-bold">Mulai mencari sekarang</p>
        <p className="mt-1 text-xs opacity-90">Gratis · Offline · Tanpa iklan</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[var(--primary)] transition-transform active:scale-95"
        >
          Buka JIDict
        </Link>
      </div>
    </div>
  );
}
