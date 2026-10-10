export const APP_NAME = "JIDict";
export const APP_TAGLINE = "Kamus Jepang-Indonesia";

export const COLORS = {
  primary: "#ED090E",
  ink: "#262626",
  white: "#ffffff",
} as const;

/** Remote dictionary source (JIDict-yomitan via GitHub Pages mirror — CORS-enabled). */
export const DICT_INDEX_URL =
  "https://philiaspaceai.github.io/JIDict-yomitan/JIDict.json";
export const DICT_DOWNLOAD_URL =
  "https://philiaspaceai.github.io/JIDict-yomitan/JIDict-yomitan.zip";

/** Bundled meta dictionaries served from this repo (public/dictionaries). */
export const BUNDLED_DICTS = [
  { name: "pitch_accent", file: "/dictionaries/pitch_accent.zip" },
  { name: "jpdb_freq", file: "/dictionaries/jpdb_freq.zip" },
  { name: "youtube_freq", file: "/dictionaries/youtube_freq.zip" },
  { name: "jlpt_freq", file: "/dictionaries/jlpt_freq.zip" },
] as const;

export type FrequencySource = "jpdb" | "youtube";

export const DB_NAME = "jidict";
export const DB_VERSION = 1;

export const STORE = {
  meta: "meta",
  bookmarks: "bookmarks",
  history: "history",
  settings: "settings",
} as const;
