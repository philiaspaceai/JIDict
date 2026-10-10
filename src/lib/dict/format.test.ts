import { describe, expect, it } from "vitest";
import {
  parseTermEntry,
  parseTermMeta,
  type TermMeta,
} from "@/lib/dict/format";

describe("parseTermEntry (Yomitan term_bank v3)", () => {
  it("parses standard 8-field entry", () => {
    const r = parseTermEntry(["食べる", "たべる", "v1", "v5", 10, ["to eat"], 1234, ""]);
    expect(r).toMatchObject({ expression: "食べる", reading: "たべる", score: 10, sequence: 1234 });
    expect(r!.glossary).toEqual(["to eat"]);
  });
  it("joins structured glossary text", () => {
    const r = parseTermEntry(["a", "b", "", "", 0, [{ type: "text", text: "makan" }, "minum"], 0, ""]);
    expect(r!.glossary).toEqual(["makan", "minum"]);
  });
  it("rejects malformed entry", () => {
    expect(parseTermEntry(["only"])).toBeNull();
    expect(parseTermEntry(null)).toBeNull();
  });
});

describe("parseTermMeta", () => {
  it("parses jpdb freq (bare value)", () => {
    const m = parseTermMeta(["の", "freq", { value: 1, displayValue: "1㋕" }], "jpdb") as TermMeta;
    expect(m).toMatchObject({ expression: "の", mode: "freq", source: "jpdb", value: 1 });
  });
  it("parses jlpt freq (nested frequency + N-level)", () => {
    const m = parseTermMeta(
      ["あからさま", "freq", { reading: "あからさま", frequency: { value: -1, displayValue: "N1" } }],
      "jlpt",
    ) as TermMeta;
    expect(m).toMatchObject({ mode: "jlpt", jlpt: "N1" });
  });
  it("parses pitch", () => {
    const m = parseTermMeta(
      ["ああ", "pitch", { reading: "ああ", pitches: [{ position: 0 }] }],
      "pitch",
    ) as TermMeta;
    expect(m).toMatchObject({ mode: "pitch", reading: "ああ" });
    expect((m as { positions: number[] }).positions).toEqual([0]);
  });
  it("rejects unknown mode", () => {
    expect(parseTermMeta(["a", "xxx", {}], "jpdb")).toBeNull();
  });
});
