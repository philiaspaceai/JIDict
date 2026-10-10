import { describe, expect, it } from "vitest";
import { toHiragana } from "@/lib/dict/kana";

describe("toHiragana (vendored Yomitan wanakana)", () => {
  it("converts romaji to hiragana", () => {
    expect(toHiragana("taberu")).toBe("たべる");
  });
  it("converts katakana to hiragana", () => {
    expect(toHiragana("テレビ")).toBe("てれび");
  });
  it("passes hiragana through", () => {
    expect(toHiragana("たべる")).toBe("たべる");
  });
  it("handles empty", () => {
    expect(toHiragana("")).toBe("");
  });
});
