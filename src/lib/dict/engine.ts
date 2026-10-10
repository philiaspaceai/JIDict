import type { FrequencySource } from "@/lib/constants";
import { normalizeQuery, sortByFrequency, type DictEntry } from "@/lib/search";
import { toHiragana } from "@/lib/dict/kana";
import { deinflect } from "@/lib/dict/deinflect";
import type { DictDB } from "@/lib/dict/store";

export interface SearchOptions {
  source: FrequencySource;
  limit?: number;
}

const PER_VARIANT_LIMIT = 20;

function uniqueCapped(items: string[], cap = 12): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of items) {
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= cap) break;
  }
  return out;
}

/** Build lookup variants: raw + kana + deinflected forms. */
export function buildVariants(query: string): string[] {
  const hira = toHiragana(query);
  const all = [query, hira, ...deinflect(query), ...deinflect(hira)];
  return uniqueCapped(all);
}

function pitchLabel(reading: string, positions: number[]): string[] {
  return positions.map((p) => `${reading} ${p}`);
}

/** Full offline search over the Dexie dictionary store. */
export async function searchDict(
  db: DictDB,
  rawQuery: string,
  opts: SearchOptions,
): Promise<DictEntry[]> {
  const q = normalizeQuery(rawQuery);
  if (!q) return [];
  const limit = opts.limit ?? 50;
  const variants = buildVariants(q);

  const seen = new Map<string, { expression: string; reading: string; score: number; glossary: unknown }>();

  for (const v of variants) {
    const exactExp = await db.terms.where("expression").equals(v).limit(PER_VARIANT_LIMIT).toArray();
    const exactRead = await db.terms.where("reading").equals(v).limit(PER_VARIANT_LIMIT).toArray();
    let prefixedExp: typeof exactExp = [];
    let prefixedRead: typeof exactRead = [];
    try {
      prefixedExp = await db.terms.where("expression").startsWith(v).limit(PER_VARIANT_LIMIT).toArray();
      prefixedRead = await db.terms.where("reading").startsWith(v).limit(PER_VARIANT_LIMIT).toArray();
    } catch {
      // startsWith unsupported → exact only
    }
    for (const t of [...exactExp, ...exactRead, ...prefixedExp, ...prefixedRead]) {
      const key = `${t.expression}${t.reading}`;
      if (!seen.has(key)) {
        const exact = t.expression === q || t.reading === q || t.expression === v || t.reading === v;
        seen.set(key, {
          expression: t.expression,
          reading: t.reading,
          score: t.score + (exact ? 10000 : 0),
          glossary: t.glossary,
        });
      }
      if (seen.size >= 200) break;
    }
    if (seen.size >= 200) break;
  }

  if (seen.size === 0) return [];

  const exprs = [...new Set([...seen.values()].map((s) => s.expression))];
  const metaRows = await db.termMeta.where("expression").anyOf(exprs).toArray();
  const metaByExpr = new Map<string, typeof metaRows>();
  for (const m of metaRows) {
    const arr = metaByExpr.get(m.expression) ?? [];
    arr.push(m);
    metaByExpr.set(m.expression, arr);
  }

  const entries: DictEntry[] = [...seen.values()].map((s) => {
    const metas = metaByExpr.get(s.expression) ?? [];
    let freqJpdb: number | undefined;
    let freqYoutube: number | undefined;
    let jlpt: string | undefined;
    const pitch: string[] = [];
    for (const m of metas) {
      if (m.mode === "freq" && m.source === "jpdb" && typeof m.value === "number" && m.value >= 0) {
        freqJpdb = freqJpdb === undefined ? m.value : Math.min(freqJpdb, m.value);
      } else if (m.mode === "freq" && m.source === "youtube" && typeof m.value === "number" && m.value >= 0) {
        freqYoutube = freqYoutube === undefined ? m.value : Math.min(freqYoutube, m.value);
      } else if (m.mode === "jlpt" && m.jlpt && !jlpt) {
        jlpt = m.jlpt;
      } else if (m.mode === "pitch" && m.positions && m.reading === s.reading) {
        pitch.push(...pitchLabel(m.reading, m.positions));
      }
    }
    return {
      id: `${s.expression}${s.reading}`,
      expression: s.expression,
      reading: s.reading,
      glossary: s.glossary,
      score: s.score,
      freqJpdb,
      freqYoutube,
      pitch: pitch.length ? [...new Set(pitch)].slice(0, 4) : undefined,
      jlpt,
    };
  });

  return sortByFrequency(entries, opts.source).slice(0, limit);
}
