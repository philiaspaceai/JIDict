import { describe, expect, it, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { DictDB } from "@/lib/dict/store";
import { searchDict } from "@/lib/dict/engine";

let n = 0;
async function seedDB() {
  const db = new DictDB(`test-${Date.now()}-${n++}`);
  await db.terms.bulkAdd([
    { expression: "食べる", reading: "たべる", score: 10, glossary: ["makan"], sequence: 1, tags: "" },
    { expression: "食べ物", reading: "たべもの", score: 5, glossary: ["makanan"], sequence: 2, tags: "" },
    { expression: "行く", reading: "いく", score: 8, glossary: ["pergi"], sequence: 3, tags: "" },
  ]);
  await db.termMeta.bulkAdd([
    { expression: "食べる", source: "jpdb", mode: "freq", value: 50 },
    { expression: "食べ物", source: "jpdb", mode: "freq", value: 5 },
    { expression: "食べる", source: "pitch", mode: "pitch", reading: "たべる", positions: [2] },
  ]);
  return db;
}

describe("searchDict", () => {
  let db: DictDB;
  beforeEach(async () => {
    db = await seedDB();
  });

  it("finds exact kanji", async () => {
    const r = await searchDict(db, "食べる", { source: "jpdb" });
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].expression).toBe("食べる");
    expect(r[0].glossary).toEqual(["makan"]);
  });

  it("finds via romaji", async () => {
    const r = await searchDict(db, "taberu", { source: "jpdb" });
    expect(r.some((e) => e.expression === "食べる")).toBe(true);
  });

  it("finds inflected form via deinflection", async () => {
    const r = await searchDict(db, "食べた", { source: "jpdb" });
    expect(r.some((e) => e.expression === "食べる")).toBe(true);
  });

  it("sorts by jpdb frequency (lower first)", async () => {
    const r = await searchDict(db, "食べ", { source: "jpdb" });
    expect(r[0].expression).toBe("食べ物");
  });

  it("attaches pitch", async () => {
    const r = await searchDict(db, "食べる", { source: "jpdb" });
    expect(r[0].pitch?.length).toBeGreaterThan(0);
  });

  it("returns empty for blank query", async () => {
    await expect(searchDict(db, "   ", { source: "jpdb" })).resolves.toEqual([]);
  });
});
