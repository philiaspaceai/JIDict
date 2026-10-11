import { describe, expect, it, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { DictDB } from "@/lib/dict/store";
import { suggestTerms } from "@/lib/dict/engine";

let n = 100;
async function seedDB() {
  const db = new DictDB(`suggest-${Date.now()}-${n++}`);
  await db.terms.bulkAdd([
    { expression: "食べる", reading: "たべる", score: 10, glossary: ["makan"], sequence: 1, tags: "" },
    { expression: "食べ物", reading: "たべもの", score: 5, glossary: ["makanan"], sequence: 2, tags: "" },
    { expression: "行く", reading: "いく", score: 8, glossary: ["pergi"], sequence: 3, tags: "" },
  ]);
  return db;
}

describe("suggestTerms", () => {
  let db: DictDB;
  beforeEach(async () => {
    db = await seedDB();
  });

  it("prefix kana", async () => {
    const r = await suggestTerms(db, "食べ");
    expect(r.map((s) => s.expression).sort()).toEqual(["食べる", "食べ物"].sort());
  });

  it("romaji parsial ikut tersaran", async () => {
    const r = await suggestTerms(db, "tab");
    expect(r.some((s) => s.expression === "食べる")).toBe(true);
  });

  it("katakana dinormalisasi", async () => {
    const r = await suggestTerms(db, "タベ");
    expect(r.some((s) => s.expression === "食べる")).toBe(true);
  });

  it("kosong untuk query kosong + batas limit", async () => {
    await expect(suggestTerms(db, "   ")).resolves.toEqual([]);
    const r = await suggestTerms(db, "た", 1);
    expect(r.length).toBeLessThanOrEqual(1);
  });
});
