import { describe, expect, it } from "vitest";
import { deinflect } from "@/lib/dict/deinflect";

describe("deinflect (vendored Yomitan transforms)", () => {
  it("includes dictionary form for た past", () => {
    expect(deinflect("食べた")).toContain("食べる");
  });
  it("includes dictionary form for 行った", () => {
    expect(deinflect("行った")).toContain("行く");
  });
  it("includes する for しない", () => {
    expect(deinflect("しない")).toContain("する");
  });
  it("always includes the original text", () => {
    expect(deinflect("たべる")[0]).toBe("たべる");
  });
});
