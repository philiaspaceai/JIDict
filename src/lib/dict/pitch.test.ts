import { describe, expect, it } from "vitest";
import pitchFixtures from "@/lib/dict/pitch-fixtures.test.json";
import { parseTermMeta } from "@/lib/dict/format";
import { renderPronunciation } from "@/lib/dict/render";

describe("parseTermMeta pitch (verbatim, tanpa data loss)", () => {
  it("menyimpan nasal + devoice tiap pitch", () => {
    const row = [
      "食べる",
      "pitch",
      { reading: "たべる", pitches: [{ position: 2, nasal: [1], devoice: [2] }] },
    ];
    const m = parseTermMeta(row, "pitch");
    expect(m).toMatchObject({
      mode: "pitch",
      reading: "たべる",
      pitches: [{ position: 2, nasal: [1], devoice: [2] }],
    });
  });
});

describe("renderPronunciation (Yomitan PronunciationGenerator, verbatim)", () => {
  it("たべる ②: teks mora + grafik + notasi [2]", () => {
    const fx = pitchFixtures.taberu as { reading: string; pitches: Array<{ position: number; nasal: number[]; devoice: number[] }> };
    const { node } = renderPronunciation(fx.reading, fx.pitches[0]);
    // Teks mora: たべる = 3 mora
    expect(node.querySelectorAll(".pronunciation-mora").length).toBe(3);
    expect(node.textContent).toContain("たべる");
    // Grafik SVG ala Yomitan
    const svg = node.querySelector("svg.pronunciation-graph");
    expect(svg).not.toBeNull();
    expect(svg!.querySelectorAll("circle").length).toBeGreaterThanOrEqual(3);
    // Notasi downstep [2]
    expect(node.querySelector(".pronunciation-downstep-notation-number")?.textContent).toBe("2");
    // Dataset mirror _createPronunciationPitchAccent
    expect((node as HTMLElement).dataset.pitchAccentDownstepPosition).toBe("2");
  });

  it("あいのこ ⓪ (heiban): mora pertama low, sisanya high", () => {
    const fx = pitchFixtures.ainoko as { reading: string; pitches: Array<{ position: number; nasal: number[]; devoice: number[] }> };
    const { node } = renderPronunciation(fx.reading, fx.pitches[0]);
    const morae = [...node.querySelectorAll(".pronunciation-mora")];
    expect(morae.length).toBe(4);
    expect((morae[0] as HTMLElement).dataset.pitch).toBe("low");
    expect((morae[1] as HTMLElement).dataset.pitch).toBe("high");
    expect(node.querySelector(".pronunciation-downstep-notation-number")?.textContent).toBe("0");
  });
});
