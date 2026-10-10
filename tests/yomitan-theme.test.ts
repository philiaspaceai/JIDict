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
  const sc = readFileSync("src/vendor/yomitan/css/structured-content.css", "utf8");
  const theme = readFileSync("src/app/yomitan-theme.css", "utf8");
  const darkIndex = theme.indexOf("\n.dark");
  expect(darkIndex, "blok .dark tidak ada").toBeGreaterThan(0);
  const light = theme.slice(0, darkIndex);
  const dark = theme.slice(darkIndex);
  for (const v of usedVars(sc)) {
    expect(light, `${v} hilang di :root`).toContain(`${v}:`);
    expect(dark, `${v} hilang di .dark`).toContain(`${v}:`);
  }
});
