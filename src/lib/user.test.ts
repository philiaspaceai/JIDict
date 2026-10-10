import { describe, expect, it } from "vitest";
import { getFrequencySource, setFrequencySource } from "@/lib/user";

describe("frequency source pref", () => {
  it("defaults to jpdb", () => {
    localStorage.clear();
    expect(getFrequencySource()).toBe("jpdb");
  });
  it("persists youtube", () => {
    setFrequencySource("youtube");
    expect(getFrequencySource()).toBe("youtube");
    setFrequencySource("jpdb");
    expect(getFrequencySource()).toBe("jpdb");
  });
});
