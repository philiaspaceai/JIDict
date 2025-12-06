/**
 * Simple Romaji to Hiragana converter for smart search.
 * This ensures "taberu" matches "たべる".
 * Now supports Kunrei-shiki (si, tu, ti) for faster typing.
 */

const ROMAJI_MAP: Record<string, string> = {
  // Vowels
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  // K
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  // S
  sa: 'さ', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  si: 'し', // Lazy support
  // T
  ta: 'た', chi: 'ち', tsu: 'つ', te: 'て', to: 'と',
  ti: 'ち', tu: 'つ', // Lazy support
  // N
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  // H
  ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
  hu: 'ふ', // Lazy support
  // M
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  // Y
  ya: 'や', yu: 'ゆ', yo: 'よ',
  // R
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  // W
  wa: 'わ', wo: 'を',
  // N singular
  n: 'ん',
  // G
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  // Z
  za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  zi: 'じ', // Lazy support
  // D
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  // B
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  // P
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  // Special Compounds
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ',
  sya: 'しゃ', syu: 'しゅ', syo: 'しょ', // Lazy
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  cya: 'ちゃ', cyu: 'ちゅ', cyo: 'ちょ', // Lazy
  tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', // Lazy
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ',
  jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ', // Lazy
  zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ', // Lazy
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
};

export const toKana = (input: string): string => {
  let str = input.toLowerCase();
  let result = '';
  let i = 0;

  while (i < str.length) {
    // Check for double consonants (tt, kk, pp, ss) -> small tsu
    if (i + 1 < str.length && str[i] === str[i + 1] && !['a','i','u','e','o','n'].includes(str[i])) {
      result += 'っ';
      i++;
      continue;
    }

    // Try 3 chars (e.g., shi, chi, tsu, sho)
    if (i + 3 <= str.length) {
      const sub = str.substring(i, i + 3);
      if (ROMAJI_MAP[sub]) {
        result += ROMAJI_MAP[sub];
        i += 3;
        continue;
      }
    }

    // Try 2 chars (e.g., ka, sa, tu, si)
    if (i + 2 <= str.length) {
      const sub = str.substring(i, i + 2);
      if (ROMAJI_MAP[sub]) {
        result += ROMAJI_MAP[sub];
        i += 2;
        continue;
      }
    }

    // Try 1 char (vowels or single n)
    const char = str[i];
    if (ROMAJI_MAP[char]) {
      result += ROMAJI_MAP[char];
    } else {
      // Keep original if no match (e.g. symbols or untranslatable)
      result += char;
    }
    i++;
  }
  return result;
};

/**
 * Converts Hiragana to Katakana.
 * Used for searching loanwords (e.g. "kamera" -> "かめら" -> "カメラ")
 */
export const hiraganaToKatakana = (text: string): string => {
  return text.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
};

export const toKatakana = (input: string): string => {
  const hiragana = toKana(input);
  return hiraganaToKatakana(hiragana);
};

export const isJapanese = (text: string): boolean => {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
}