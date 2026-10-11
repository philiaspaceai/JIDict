import { expect, test } from "vitest";
import { readFileSync } from "node:fs";

/**
 * structured-content.css Yomitan memakai var() tema. JIDict wajib
 * mendefinisikan semuanya untuk light (:root) dan dark (.dark),
 * kalau tidak deklarasi Yomitan gugur dan render rusak.
 * Nilai disalin dari ext/css/material.css + display.css (Yomitan @ e7334a9).
 */
/* var() yang di-set oleh JS inline atau didefinisikan di CSS Yomitan itu sendiri */
const PROVIDED_ELSEWHERE = new Set(["--image", "--shadow-settings"]);

function usedVars(css: string): string[] {
  const out = new Set<string>();
  for (const m of css.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
    if (!PROVIDED_ELSEWHERE.has(m[1])) out.add(m[1]);
  }
  return [...out].sort();
}

test("semua var() Yomitan terdefinisi di :root dan .dark", () => {
  const files = [
    "src/vendor/yomitan/css/structured-content.css",
    "src/vendor/yomitan/css/display-pronunciation.css",
  ];
  const theme = readFileSync("src/app/yomitan-theme.css", "utf8");
  const darkIndex = theme.indexOf("\n.dark");
  expect(darkIndex, "blok .dark tidak ada").toBeGreaterThan(0);
  const light = theme.slice(0, darkIndex);
  const dark = theme.slice(darkIndex);
  const vars = new Set<string>();
  for (const f of files) {
    for (const v of usedVars(readFileSync(f, "utf8"))) vars.add(v);
  }
  // Catatan: --pronunciation-annotation-color memang didefinisikan di CSS
  // Yomitan itu sendiri, TETAPI di bawah :root[data-theme=dark] yang tidak
  // pernah menyala di app ini (hook dark = kelas .dark). Maka tema app
  // wajib menyediakannya juga — test ini memastikan itu.
  for (const v of [...vars].sort()) {
    expect(light, `${v} hilang di :root`).toContain(`${v}:`);
    expect(dark, `${v} hilang di .dark`).toContain(`${v}:`);
  }
});
