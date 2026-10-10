# JIDict — Kamus Jepang-Indonesia

PWA offline-first. Cari kanji / kana / romaji. Engine kamus dari [Yomitan](https://github.com/yomidevs/yomitan) (vendored, bukan fork).

- Framework: Next.js App Router + Serwist PWA + IndexedDB (Dexie)
- Lisensi: **GPL-3.0-or-later** (wajib karena vendoring Yomitan)
- Deploy: Vercel (hubungkan repo ini di dashboard Vercel)

## Data

- Kamus utama: https://github.com/philiaspaceai/JIDict-yomitan/releases/latest/download/JIDict-yomitan.zip
- Versi: https://github.com/philiaspaceai/JIDict-yomitan/releases/latest/download/JIDict.json
- Frekuensi + pitch accent: dibundel dari repo ini (`public/dictionaries/*.zip`)

Onboarding mengunduh sekali, lalu full offline. Splash setiap buka mengecek update kamus + update app.

## Dev

```bash
npm install --ignore-scripts # workaround bila postinstall esbuild gagal spawn sh ENOENT di sandbox
npm run dev
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Folder `references/` (clone `--depth 1` Yomitan) tidak di-push — lihat `.gitignore`. Jangan edit `references/third_party`.

`assets/logos/app-icon.png` hanya untuk app icon (`public/icons/`), tidak dipakai di UI/splash.
Logo UI: `public/logo/app-logo.png` (light) / `app-logo-dark.png` (dark).
Maskot: `public/mascots/1-7.png` untuk empty-state.
