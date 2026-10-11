import type { Page } from "@playwright/test";
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from "@zip.js/zip.js";

async function zip(files: Record<string, string>): Promise<Uint8Array> {
  const w = new ZipWriter(new Uint8ArrayWriter());
  for (const [name, text] of Object.entries(files)) {
    await w.add(name, new Uint8ArrayReader(new TextEncoder().encode(text)));
  }
  return w.close();
}

const MAIN_ENTRY = ["食べる", "たべる", "", "v5", 10, [{ type: "structured-content", content: [{ tag: "span", content: "makan" }] }], 1, ""];
const MAIN_ENTRY_2 = ["食べ物", "たべもの", "", "n", 5, ["makanan"], 2, ""];

/**
 * Mock seluruh endpoint kamus dengan data mini agar E2E cepat +
 * deterministik (tanpa unduh 43MB). Splash tetap menjalani alur asli:
 * cek versi → unduh → impor → masuk.
 */
export async function mockDictRoutes(page: Page): Promise<void> {
  // E2E deterministik: cegah SW mendaftar agar fetch kamus selalu langsung
  // (fetch dari dalam SW lolos dari page.route → balapan). Perilaku SW
  // diverifikasi terpisah via header + manifest, bukan di sini.
  await page.addInitScript(() => {
    Object.defineProperty(window, "caches", { value: undefined, configurable: true });
  });
  const main = await zip({
    "index.json": JSON.stringify({ title: "JIDict", format: 3, revision: "999" }),
    "term_bank_1.json": JSON.stringify([MAIN_ENTRY, MAIN_ENTRY_2]),
  });
  const meta = async (rows: unknown[]) =>
    zip({
      "index.json": JSON.stringify({ title: "t", format: 3, revision: "1" }),
      "term_meta_bank_1.json": JSON.stringify(rows),
    });
  const metas: Record<string, Uint8Array> = {
    pitch_accent: await meta([["食べる", "pitch", { reading: "たべる", pitches: [{ position: 2, nasal: [], devoice: [] }] }]]),
    jpdb_freq: await meta([["食べる", "freq", { value: 5, displayValue: "5" }]]),
    youtube_freq: await meta([["食べる", "freq", { value: 9, displayValue: "9" }]]),
    jlpt_freq: await meta([["食べる", "freq", { reading: "たべる", frequency: { value: -1, displayValue: "N5" } }]]),
  };

  await page.route("https://philiaspaceai.github.io/JIDict-yomitan/JIDict.json", (r) =>
    r.fulfill({ json: { title: "JIDict", format: 3, revision: "999" } }),
  );
  await page.route("https://philiaspaceai.github.io/JIDict-yomitan/JIDict-yomitan.zip", (r) =>
    r.fulfill({ body: Buffer.from(main), contentType: "application/zip" }),
  );
  for (const [name, bytes] of Object.entries(metas)) {
    await page.route(`**/dictionaries/${name}.zip`, (r) =>
      r.fulfill({ body: Buffer.from(bytes), contentType: "application/zip" }),
    );
  }
}
