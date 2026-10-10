import { describe, expect, it } from "vitest";
import { isRomajiQuery, normalizeQuery, sortByFrequency, type DictEntry } from "@/lib/search";

const mk = (id: string, partial: Partial<DictEntry> = {}): DictEntry => ({
  id,
  expression: id,
  reading: id,
  glossary: ["arti"],
  score: 0,
  ...partial,
});

describe("normalizeQuery", () => {
  it("trims and limits length", () => {
    expect(normalizeQuery("  たべる  ")).toBe("たべる");
    expect(normalizeQuery("a".repeat(200))).toHaveLength(100);
  });
});

describe("isRomajiQuery", () => {
  it("detects romaji", () => {
    expect(isRomajiQuery("taberu")).toBe(true);
    expect(isRomajiQuery("たべる")).toBe(false);
    expect(isRomajiQuery("")).toBe(false);
  });
});

describe("sortByFrequency", () => {
  it("jpdb: lower freq first", () => {
    const a = mk("a", { freqJpdb: 100, score: 1 });
    const b = mk("b", { freqJpdb: 5, score: 0 });
    expect(sortByFrequency([a, b], "jpdb")[0].id).toBe("b");
  });
  it("youtube source respected", () => {
    const a = mk("a", { freqYoutube: 50, score: 1 });
    const b = mk("b", { freqYoutube: 2, score: 0 });
    expect(sortByFrequency([a, b], "youtube")[0].id).toBe("b");
  });
  it("missing freq falls back to score", () => {
    const a = mk("a", { score: 10 });
    const b = mk("b", { score: 1 });
    expect(sortByFrequency([a, b], "jpdb")[0].id).toBe("a");
  });
});
