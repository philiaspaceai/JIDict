import { describe, expect, it } from "vitest";
import "fake-indexeddb/auto";
// jsdom's Blob lacks arrayBuffer/stream which @zip.js needs — restore Node's.
import { Blob as NodeBlob } from "node:buffer";
if (!Blob.prototype.arrayBuffer) {
  globalThis.Blob = NodeBlob as unknown as typeof Blob;
}
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from "@zip.js/zip.js";
import { DictDB } from "@/lib/dict/store";
import { importDictZip } from "@/lib/dict/importer";

async function makeZip(files: Record<string, string>): Promise<Uint8Array> {
  const writer = new ZipWriter(new Uint8ArrayWriter());
  for (const [name, text] of Object.entries(files)) {
    await writer.add(name, new Uint8ArrayReader(new TextEncoder().encode(text)));
  }
  return await writer.close();
}

describe("importDictZip", () => {
  it("imports main term banks + index", async () => {
    const db = new DictDB(`imp-main-${Date.now()}`);
    const bytes = await makeZip({
      "index.json": JSON.stringify({ title: "JIDict", format: 3, revision: "9" }),
      "term_bank_1.json": JSON.stringify([
        ["食べる", "たべる", "v1", "v5", 10, ["makan"], 1, ""],
        ["BAD"],
      ]),
    });
    const r = await importDictZip(db, bytes, { kind: "main", source: "jidict" });
    expect(r.terms).toBe(1);
    expect(await db.terms.count()).toBe(1);
    expect(await db.dictInfo.get("revision:jidict")).toMatchObject({ value: "9" });
  });

  it("imports meta banks with source tag", async () => {
    const db = new DictDB(`imp-meta-${Date.now()}`);
    const bytes = await makeZip({
      "index.json": JSON.stringify({ title: "x", format: 3, revision: "1" }),
      "term_meta_bank_1.json": JSON.stringify([
        ["食べる", "freq", { value: 7, displayValue: "7" }],
      ]),
    });
    const r = await importDictZip(db, bytes, { kind: "meta", source: "jpdb" });
    expect(r.meta).toBe(1);
    const row = await db.termMeta.where("expression").equals("食べる").first();
    expect(row).toMatchObject({ source: "jpdb", value: 7 });
  });

  it("rejects non-zip bytes", async () => {
    const db = new DictDB(`imp-bad-${Date.now()}`);
    await expect(
      importDictZip(db, new Uint8Array([1, 2, 3]), { kind: "main", source: "jidict" }),
    ).rejects.toThrow();
  });
});
