import type { FrequencySource } from "./constants";

/** Minimal dictionary entry (rendered from Yomitan term banks). */
export interface DictEntry {
  id: string;
  expression: string;
  reading: string;
  glossary: string[];
  score: number;
  pitch?: string[];
  freqJpdb?: number;
  freqYoutube?: number;
  jlpt?: string;
}

/** Sort entries by selected frequency source. Pure function (TDD seam). */
export function sortByFrequency(
  entries: DictEntry[],
  source: FrequencySource,
): DictEntry[] {
  const pick = (e: DictEntry) =>
    source === "jpdb" ? (e.freqJpdb ?? -1) : (e.freqYoutube ?? -1);
  return [...entries].sort((a, b) => {
    const fa = pick(a);
    const fb = pick(b);
    // Higher frequency value = more common? Yomitan freq banks use lower = more common
    // for occurrence counts. We treat lower positive number as more common.
    if (fa < 0 && fb < 0) return b.score - a.score;
    if (fa < 0) return 1;
    if (fb < 0) return -1;
    if (fa !== fb) return fa - fb;
    return b.score - a.score;
  });
}

/** Normalize query: trim, kana-insensitive handled by caller via wanakana. */
export function normalizeQuery(q: string): string {
  return q.trim().normalize("NFC").slice(0, 100);
}

export function isRomajiQuery(q: string): boolean {
  return /^[A-Za-z\s'-]+$/.test(q.trim()) && q.trim().length > 0;
}
