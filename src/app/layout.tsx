import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/AppShell";
import { SITE_URL } from "@/lib/seo";

const outfit = localFont({
  src: "./fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JIDict — Kamus Jepang-Indonesia Offline",
    template: "%s | JIDict",
  },
  description:
    "Kamus Jepang–Indonesia offline & gratis: 300.000+ entri, grafik pitch accent, frekuensi JPDB & Youtube, JLPT N5–N1. Cari kanji, kana, romaji tanpa internet.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    title: "JIDict — Kamus Jepang-Indonesia Offline",
    description:
      "300.000+ entri Jepang–Indonesia, grafik pitch accent, full offline. Gratis, tanpa iklan.",
    type: "website",
    siteName: "JIDict",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "JIDict — Kamus Jepang-Indonesia Offline",
    description: "300.000+ entri, pitch accent, full offline. Gratis.",
    images: ["/icons/icon-512.png"],
  },
  appleWebApp: { capable: true, title: "JIDict", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#131313" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={outfit.variable}>
      <head>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="JIDict"
          href="/opensearch.xml"
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
