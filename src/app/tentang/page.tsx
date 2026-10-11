import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SeoJsonLd } from "@/components/SeoJsonLd";

export const metadata: Metadata = {
  title: "Tentang JIDict & Philia Space Community",
  description:
    "JIDict dikembangkan oleh Philia Space Community: komunitas belajar bahasa Jepang asal Indonesia. Kamus Jepang–Indonesia open-source, data CC BY-NC 4.0, aplikasi GPL-3.0.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
      <SeoJsonLd />
      <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        Tentang JIDict &amp; Philia Space Community
      </h1>
      <div className="mt-4 flex items-center gap-3">
        <Image src="/logo/community-logo.png" alt="Philia Space" width={56} height={56} />
        <p className="text-sm font-semibold">Philia Space Community</p>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
        <p>
          JIDict adalah aplikasi kamus Jepang-Indonesia berformat Yomitan Dictionary pertama di Indonesia,
          dengan jumlah entri lebih dari 300.000. Kamus ini dikembangkan oleh Philia Space Community selaku
          komunitas belajar bahasa Jepang asal Indonesia yang bersifat non-profit dan memiliki tiga peran utama,
          yaitu sebagai tempat belajar bersama melalui diskusi, latihan, dan berbagi pengalaman belajar bahasa
          Jepang, sebagai tempat mengembangkan berbagai tools dan resource belajar seperti kamus JIDict, deck Anki,
          bot latihan JLPT, hingga skill AI agent yang semuanya bersifat open-source, serta sebagai tempat
          menampung dan mengkurasi resource dari berbagai komunitas luar negeri seperti TheMoeWay agar mudah
          ditemukan dan dimanfaatkan oleh para pejuang bahasa Jepang Indonesia.
        </p>
      </div>
      <h2 className="mt-8 font-display text-xl font-bold tracking-tight">Tautan</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {[
          ["Kode sumber aplikasi", "https://github.com/philiaspaceai/JIDict"],
          ["Data kamus JIDict-yomitan", "https://github.com/philiaspaceai/JIDict-yomitan"],
          ["Engine kamus Yomitan", "https://github.com/yomidevs/yomitan"],
        ].map(([label, href]) => (
          <li key={href} className="rounded-card border bg-[var(--card)] px-4 py-3">
            <a href={href} target="_blank" rel="noreferrer noopener" className="text-[var(--primary)]">
              {label}
            </a>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-xl font-bold tracking-tight">Lisensi</h2>
      <div className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
        <p>
          Data kamus © Utawnyan &amp; Demonkzz, berlisensi{" "}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noreferrer noopener" className="text-[var(--primary)]">
            CC BY-NC 4.0
          </a>
          . Aplikasi JIDict bersifat open-source berlisensi{" "}
          <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noreferrer noopener" className="text-[var(--primary)]">
            GPL-3.0
          </a>
          .
        </p>
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
