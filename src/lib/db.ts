import Dexie, { type Table } from "dexie";
import { DB_NAME, DB_VERSION } from "./constants";
import type { DictEntry } from "./search";

export interface BookmarkRow {
  id: string;
  entry: DictEntry;
  createdAt: number;
}

export interface HistoryRow {
  id: string;
  query: string;
  createdAt: number;
}

export interface MetaRow {
  key: string;
  value: string;
}

export interface SettingsRow {
  key: "settings";
  frequencySource: "jpdb" | "youtube";
  theme: "system" | "light" | "dark";
}

export class JIDictDB extends Dexie {
  bookmarks!: Table<BookmarkRow, string>;
  history!: Table<HistoryRow, string>;
  meta!: Table<MetaRow, string>;

  constructor(name = DB_NAME) {
    super(name);
    this.version(DB_VERSION).stores({
      bookmarks: "id, createdAt",
      history: "id, createdAt",
      meta: "key",
    });
  }
}

let singleton: JIDictDB | null = null;

export function getDB(): JIDictDB {
  if (!singleton) singleton = new JIDictDB();
  return singleton;
}
