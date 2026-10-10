# Vendored Yomitan engine (verbatim)

Source: https://github.com/yomidevs/yomitan @ `e7334a9`
License: GPL-3.0-or-later (same as this repo).

Files copied verbatim (headers intact) from `ext/js/` of the Yomitan
checkout in `references/third_party/yomitan` (git-ignored):

- `core/event-dispatcher.js`, `core/extension-error.js`, `core/log.js`
- `language/CJK-util.js`, `language/language-transforms.js`,
  `language/language-transformer.js`
- `language/ja/japanese.js`, `language/ja/japanese-kana-romaji-dicts.js`,
  `language/ja/japanese-wanakana.js`, `language/ja/japanese-transforms.js`

These are the pure language pieces (kana utils, deinflection rules).
Heavier Yomitan parts (DictionaryDatabase with resvg-wasm, workers,
extension APIs, Anki/media) are intentionally NOT vendored — JIDict
uses its own minimal Dexie store + importer (see `src/lib/dict/`).
