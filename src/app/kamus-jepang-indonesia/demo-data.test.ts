import { describe, expect, it } from "vitest";
import { DEMO_ENTRIES, filterDemo } from "./demo-data";

describe("filterDemo", () => {
  it("punya 100+ entri", () => {
    expect(DEMO_ENTRIES.length).toBeGreaterThanOrEqual(100);
  });

  it("arti Indonesia ketemu", () => {
    expect(filterDemo("makan").map((e) => e.expression)).toContain("食べる");
  });

  it("kanji ketemu", () => {
    expect(filterDemo("猫").map((e) => e.reading)).toContain("ねこ");
  });

  it("kana ketemu", () => {
    expect(filterDemo("ありがとう").length).toBeGreaterThan(0);
  });

  it("kosong untuk query kosong + batas limit", () => {
    expect(filterDemo("   ")).toEqual([]);
    expect(filterDemo("あ", 2).length).toBeLessThanOrEqual(2);
  });
});
