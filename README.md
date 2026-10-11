# JIDict — Kamus Jepang-Indonesia

PWA offline-first untuk mencari kosakata Jepang–Indonesia (kanji / kana / romaji),
dengan grafik pitch-accent, frekuensi JPDB & Youtube, markah, dan riwayat.

- Live: https://jidict.vercel.app
- Data: [philiaspaceai/JIDict-yomitan](https://github.com/philiaspaceai/JIDict-yomitan)
- Dikembangkan oleh Philia Space Community (komunitas belajar bahasa Jepang, non-profit, Indonesia).

## Fitur

- **Cari** — kanji/kana/romaji + deinfleksi (食べた → 食べる), saran live, urutan
  menurut frekuensi JPDB/Youtube, badge JLPT, grafik pitch-accent ala Yomitan.
- **Markah & Riwayat** — tersimpan lokal (IndexedDB), bertahan offline.
- **Setelan** — tema Auto/Terang/Gelap, sumber frekuensi, cek update, hapus data, tentang.
- **Splash sebagai gerbang** — tiap buka: cek update aplikasi (auto-reload),
  cek update kamus (auto-unduh + impor). Tidak bisa di-skip; full offline setelahnya.

## Arsitektur

- Next.js App Router + Serwist (PWA) + Dexie (IndexedDB) + Motion/Vaul/Lucide (UI).
- Prinsip: **JIDict menyesuaikan ke Yomitan, bukan sebaliknya.** Glossary disimpan
  mentah verbatim dan dirender oleh `StructuredContentGenerator` + `PronunciationGenerator`
  Yomitan yang di-vendor tanpa diubah (`src/vendor/yomitan/`, test paritas otomatis).
- Lisensi: **GPL-3.0-or-later** (wajib karena vendoring Yomitan).
  Data kamus © Utawnyan & Demonkzz, [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

## Data

- Kamus utama: https://philiaspaceai.github.io/JIDict-yomitan/JIDict-yomitan.zip
- Versi: https://philiaspaceai.github.io/JIDict-yomitan/JIDict.json
- (Mirror CORS via GitHub Pages dari rilis JIDict-yomitan — github.com memblokir CORS browser.
  Dipublish otomatis tiap rilis oleh workflow `publish-pages.yml` di repo itu.)
- Frekuensi + pitch accent dibundel dari repo ini (`public/dictionaries/*.zip`).

## Dev

```bash
npm install --ignore-scripts # bila postinstall esbuild gagal spawn sh ENOENT
npm run dev        # SERWIST_SUPPRESS_TURBOPACK_WARNING=1 next dev
npm run typecheck  # tsc --noEmit
npm run test       # vitest (unit + integrasi)
npm run test:e2e   # playwright (butuh browser; lokal: PW_USE_SYSTEM_CHROME=1)
npm run build      # next build --webpack (Serwist stabil masih webpack)
```

Struktur penting:

```text
src/app/            # App Router: layout, page (cari), bookmark, history, settings, offline
src/components/     # Splash (gerbang update), SearchBar, EntryCard/Detail, BottomNav
src/lib/dict/       # engine: kana, deinflect, store, importer zip, search, render
src/lib/            # splash, update-check, app-update, user (markah/riwayat)
src/vendor/yomitan/ # file Yomitan verbatim — DILARANG EDIT (dijaga test paritas)
e2e/                # smoke + fitur (mock zip mini, deterministik)
references/         # clone --depth 1 Yomitan, TIDAK di-push (lihat .gitignore)
```

Konvensi aset:

- `assets/logos/app-icon.png` hanya sumber app icon (`public/icons/`), tidak dipakai di UI.
- Logo UI: `public/logo/app-logo.png` (light) / `app-logo-dark.png` (dark), dipilih via CSS.
- Maskot `public/mascots/1-7.png` untuk empty-state.

## Deploy

Vercel: import repo ini, framework Next.js, biarkan default. Tiap push ke `main`
ter-deploy otomatis; CI (typecheck + test + build + E2E) berjalan di GitHub Actions.
