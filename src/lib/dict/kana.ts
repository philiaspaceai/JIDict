import { convertKatakanaToHiragana } from "@/vendor/yomitan/language/ja/japanese.js";
import { convertToHiragana } from "@/vendor/yomitan/language/ja/japanese-wanakana.js";
import { isRomajiQuery } from "@/lib/search";

/** Normalize any query script to hiragana for lookup. */
export function toHiragana(text: string): string {
  if (!text) return "";
  if (isRomajiQuery(text)) return convertToHiragana(text);
  return convertKatakanaToHiragana(text);
}
