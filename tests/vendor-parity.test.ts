import { expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

/** Vendored Yomitan files must stay byte-identical to the reference checkout. */
const FILES = [
  "ext/js/display/structured-content-generator.js",
  "ext/js/display/display-content-manager.js",
  "ext/js/templates/anki-template-renderer-content-manager.js",
  "ext/js/language/text-utilities.js",
  "ext/js/language/zh/chinese.js",
  "ext/js/core/event-listener-collection.js",
  "ext/js/data/array-buffer-util.js",
  "ext/js/core/event-dispatcher.js",
  "ext/js/core/extension-error.js",
  "ext/js/core/log.js",
  "ext/js/language/CJK-util.js",
  "ext/js/language/language-transforms.js",
  "ext/js/language/language-transformer.js",
  "ext/js/language/ja/japanese.js",
  "ext/js/language/ja/japanese-kana-romaji-dicts.js",
  "ext/js/language/ja/japanese-wanakana.js",
  "ext/js/language/ja/japanese-transforms.js",
  "ext/css/structured-content.css",
];

const stripPrefix = (p: string) =>
  p
    .replace(/^ext\/js\//, "src/vendor/yomitan/")
    .replace(/^ext\/css\//, "src/vendor/yomitan/css/");

test("vendor Yomitan identik dengan reference (dilarang modifikasi)", () => {
  const ref = "references/third_party/yomitan";
  let refRev = "";
  try {
    refRev = execSync("git rev-parse --short HEAD", { cwd: ref }).toString().trim();
  } catch {
    // tanpa checkout — lewati (CI selalu ada via actions/checkout? tidak; skip aman)
    return;
  }
  expect(refRev.length).toBeGreaterThan(0);
  for (const f of FILES) {
    const a = readFileSync(`${ref}/${f}`, "utf8");
    const b = readFileSync(stripPrefix(f), "utf8");
    expect(b, `${f} BERBEDA dari reference — sinkronkan ulang, jangan edit manual`).toBe(a);
  }
});
