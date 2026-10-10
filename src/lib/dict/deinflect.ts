import { LanguageTransformer } from "@/vendor/yomitan/language/language-transformer.js";
import { japaneseTransforms } from "@/vendor/yomitan/language/ja/japanese-transforms.js";

let transformer: LanguageTransformer | null = null;

function getTransformer(): LanguageTransformer {
  if (!transformer) {
    transformer = new LanguageTransformer();
    transformer.addDescriptor(japaneseTransforms);
  }
  return transformer;
}

/** Deinflect to candidate dictionary forms. Original text is always first. */
export function deinflect(text: string): string[] {
  if (!text) return [text];
  const seen = new Set<string>();
  const out: string[] = [];
  let results: Array<{ text: string }>;
  try {
    results = getTransformer().transform(text) as Array<{ text: string }>;
  } catch {
    return [text];
  }
  for (const r of results) {
    if (!seen.has(r.text)) {
      seen.add(r.text);
      out.push(r.text);
      if (out.length >= 20) break;
    }
  }
  if (!seen.has(text)) out.unshift(text);
  return out;
}
