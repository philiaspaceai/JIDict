# Vendored Yomitan engine + renderer (verbatim)

Source: https://github.com/yomidevs/yomitan @ `e7334a9`
License: GPL-3.0-or-later (same as this repo).

Files copied verbatim (headers intact) from `ext/js/` and `ext/css/` of the
Yomitan checkout in `references/third_party/yomitan` (git-ignored):

- `core/event-dispatcher.js`, `core/event-listener-collection.js`,
  `core/extension-error.js`, `core/log.js`
- `data/array-buffer-util.js`
- `language/CJK-util.js`, `language/language-transforms.js`,
  `language/language-transformer.js`, `language/text-utilities.js`
- `language/ja/japanese.js`, `language/ja/japanese-kana-romaji-dicts.js`,
  `language/ja/japanese-wanakana.js`, `language/ja/japanese-transforms.js`
- `language/zh/chinese.js` (dibutuhkan text-utilities)
- `display/structured-content-generator.js` (renderer glossary — dipakai apa adanya)
- `display/display-content-manager.js` (hanya untuk instanceof di generator;
  JIDict memakai adapter sendiri `src/lib/dict/render.ts`)
- `templates/anki-template-renderer-content-manager.js` (hanya untuk instanceof)
- `css/structured-content.css` (diimpor di `src/app/globals.css`)

Prinsip: JIDict menyesuaikan ke Yomitan — nol baris file-file ini yang diubah.

Heavier Yomitan parts (IndexedDB DictionaryDatabase dengan resvg-wasm,
workers, extension APIs, Anki/media) are intentionally NOT vendored — JIDict
uses its own minimal Dexie store + importer (see `src/lib/dict/`).
Glossary disimpan mentah verbatim dan dirender oleh generator di atas.
