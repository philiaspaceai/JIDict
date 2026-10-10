export interface TermRecord {
  expression: string;
  reading: string;
  score: number;
  /** Glossary mentah verbatim format Yomitan (JANGAN di-flatten — dirender apa adanya). */
  glossary: unknown;
  sequence: number;
  tags: string;
}

export type TermMeta =
  | { expression: string; mode: "freq"; source: string; value: number; display?: string; reading?: string }
  | { expression: string; mode: "pitch"; source: string; reading: string; positions: number[] }
  | { expression: string; mode: "jlpt"; source: string; jlpt: string; reading?: string };

/** Parse one Yomitan term_bank v3 row. Null when malformed. */
export function parseTermEntry(row: unknown): TermRecord | null {
  if (!Array.isArray(row) || row.length < 8) return null;
  const [expression, reading, , , score, glossary, sequence, termTags] = row as [
    unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown,
  ];
  if (typeof expression !== "string" || typeof reading !== "string") return null;
  if (!expression) return null;
  // Simpan glossary mentah verbatim — flattening menghilangkan structured-content.
  return {
    expression,
    reading,
    score: typeof score === "number" ? score : 0,
    glossary: glossary ?? [],
    sequence: typeof sequence === "number" ? sequence : 0,
    tags: typeof termTags === "string" ? termTags : "",
  };
}

/** Parse one Yomitan term_meta_bank v3 row. Null when malformed/unknown. */
export function parseTermMeta(row: unknown, source: string): TermMeta | null {
  if (!Array.isArray(row) || row.length < 3) return null;
  const [expression, mode, data] = row as [unknown, unknown, unknown];
  if (typeof expression !== "string" || !expression) return null;
  if (typeof mode !== "string" || !data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (mode === "pitch") {
    const reading = typeof d.reading === "string" ? d.reading : "";
    const pitches = Array.isArray(d.pitches) ? d.pitches : [];
    const positions = pitches
      .map((p) => (p && typeof p === "object" ? (p as { position?: unknown }).position : undefined))
      .filter((p): p is number => typeof p === "number");
    return { expression, mode: "pitch", source, reading, positions };
  }

  if (mode === "freq") {
    const reading = typeof d.reading === "string" ? d.reading : undefined;
    // Shape A (jpdb/youtube): {value, displayValue}
    // Shape B (jlpt-style): {frequency: {value, displayValue}}
    const inner = (d.frequency && typeof d.frequency === "object"
      ? (d.frequency as Record<string, unknown>)
      : d) as Record<string, unknown>;
    const value = typeof inner.value === "number" ? inner.value : -1;
    const display =
      typeof inner.displayValue === "string"
        ? inner.displayValue
        : typeof d.displayValue === "string"
          ? (d.displayValue as string)
          : undefined;
    if (display && /N[1-5]/.test(display)) {
      const m = display.match(/N[1-5]/);
      return { expression, mode: "jlpt", source, jlpt: m ? m[0] : display, reading };
    }
    return { expression, mode: "freq", source, value, display, reading };
  }

  return null;
}
