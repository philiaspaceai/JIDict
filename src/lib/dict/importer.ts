import { TextWriter, Uint8ArrayReader, ZipReader, type Entry, type FileEntry } from "@zip.js/zip.js";
import { parseTermEntry, parseTermMeta, type TermMeta } from "@/lib/dict/format";
import type { DictDB, TermMetaRow, TermRow } from "@/lib/dict/store";

export interface ImportOptions {
  kind: "main" | "meta";
  source: string;
  onProgress?: (done: number, total: number) => void;
}

export interface ImportResult {
  terms: number;
  meta: number;
  title: string;
  revision: string;
}

const CHUNK = 2000;

async function readJson(entry: FileEntry): Promise<unknown> {
  const text = await entry.getData(new TextWriter());
  return JSON.parse(text);
}

/** Import a Yomitan-format dictionary zip into the Dexie store. */
export async function importDictZip(
  db: DictDB,
  bytes: Uint8Array,
  opts: ImportOptions,
): Promise<ImportResult> {
  const reader = new ZipReader(new Uint8ArrayReader(bytes));
  let entries: Entry[];
  try {
    entries = await reader.getEntries();
  } catch (e) {
    await reader.close().catch(() => {});
    throw new Error(`Zip rusak: ${e instanceof Error ? e.message : e}`);
  }

  const byName = new Map(entries.map((e) => [e.filename, e]));
  const indexEntry = byName.get("index.json") as FileEntry | undefined;
  if (!indexEntry) {
    await reader.close().catch(() => {});
    throw new Error("index.json tidak ditemukan");
  }
  const index = (await readJson(indexEntry)) as { title?: string; revision?: string | number; format?: number };
  const title = typeof index.title === "string" ? index.title : opts.source;
  const revision = String(index.revision ?? "unknown");

  const isBank = (prefix: string) => (name: string) =>
    name.startsWith(prefix) && name.endsWith(".json");
  const bankNames: string[] =
    opts.kind === "main"
      ? [...byName.keys()].filter(isBank("term_bank_"))
      : [...byName.keys()].filter(isBank("term_meta_bank_"));
  const total = bankNames.length || 1;
  let terms = 0;
  let meta = 0;

  const yieldUi = () => new Promise<void>((r) => setTimeout(r, 0));

  for (let i = 0; i < bankNames.length; i++) {
    const entry = byName.get(bankNames[i]) as FileEntry | undefined;
    if (!entry) continue;
    const rows = (await readJson(entry)) as unknown[];
    if (!Array.isArray(rows)) continue;

    if (opts.kind === "main") {
      let batch: TermRow[] = [];
      const flush = async () => {
        if (batch.length) {
          await db.terms.bulkAdd(batch);
          terms += batch.length;
          batch = [];
        }
      };
      for (const row of rows) {
        const t = parseTermEntry(row);
        if (t) batch.push(t);
        if (batch.length >= CHUNK) await flush();
      }
      await flush();
    } else {
      let batch: TermMetaRow[] = [];
      const flush = async () => {
        if (batch.length) {
          await db.termMeta.bulkAdd(batch);
          meta += batch.length;
          batch = [];
        }
      };
      for (const row of rows) {
        const m: TermMeta | null = parseTermMeta(row, opts.source);
        if (!m) continue;
        if (m.mode === "freq") {
          batch.push({ expression: m.expression, source: opts.source, mode: "freq", value: m.value, display: m.display, reading: m.reading });
        } else if (m.mode === "pitch") {
          batch.push({ expression: m.expression, source: opts.source, mode: "pitch", reading: m.reading, positions: m.positions });
        } else {
          batch.push({ expression: m.expression, source: opts.source, mode: "jlpt", jlpt: m.jlpt, reading: m.reading });
        }
        if (batch.length >= CHUNK) await flush();
      }
      await flush();
    }

    opts.onProgress?.(i + 1, total);
    await yieldUi();
  }

  await reader.close().catch(() => {});

  await db.dictInfo.put({ key: `title:${opts.source}`, value: title });
  await db.dictInfo.put({ key: `revision:${opts.source}`, value: revision });
  // Penanda format glossary mentah (raw-v1). DB lama berformat flatten
  // dianggap belum siap sehingga user onboarding ulang.
  if (opts.kind === "main") {
    await db.dictInfo.put({ key: "format:glossary", value: "raw-v1" });
  }

  // styles.css kamus (untuk render sesuai gaya kamus) — hanya di kamus utama.
  if (opts.kind === "main") {
    const cssEntry = byName.get("styles.css") as FileEntry | undefined;
    if (cssEntry) {
      const css = await cssEntry.getData(new TextWriter());
      await db.dictInfo.put({ key: `css:${opts.source}`, value: css });
    }
  }

  return { terms, meta, title, revision };
}

/** Clear all dictionary data (keeps user bookmarks/history). */
export async function clearDictData(db: DictDB): Promise<void> {
  await db.transaction("rw", [db.terms, db.termMeta, db.dictInfo], async () => {
    await db.terms.clear();
    await db.termMeta.clear();
    await db.dictInfo.clear();
  });
}
