import { getDB } from "@/lib/db";
import type { DictEntry } from "@/lib/search";
import type { FrequencySource } from "@/lib/constants";

const FREQ_KEY = "jidict:freq";
const HISTORY_LIMIT = 100;

export function getFrequencySource(): FrequencySource {
  try {
    const v = localStorage.getItem(FREQ_KEY);
    return v === "youtube" ? "youtube" : "jpdb";
  } catch {
    return "jpdb";
  }
}

export function setFrequencySource(s: FrequencySource): void {
  try {
    localStorage.setItem(FREQ_KEY, s);
  } catch {
    // ignore (private mode)
  }
}

export async function addHistory(query: string): Promise<void> {
  const q = query.trim().slice(0, 100);
  if (!q) return;
  const db = getDB();
  await db.history.put({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, query: q, createdAt: Date.now() });
  const count = await db.history.count();
  if (count > HISTORY_LIMIT) {
    const oldest = await db.history.orderBy("createdAt").limit(count - HISTORY_LIMIT).primaryKeys();
    await db.history.bulkDelete(oldest);
  }
}

export async function listHistory(limit = 50) {
  const db = getDB();
  return db.history.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function clearHistory(): Promise<void> {
  await getDB().history.clear();
}

export async function toggleBookmark(entry: DictEntry): Promise<boolean> {
  const db = getDB();
  const existing = await db.bookmarks.get(entry.id);
  if (existing) {
    await db.bookmarks.delete(entry.id);
    return false;
  }
  await db.bookmarks.put({ id: entry.id, entry, createdAt: Date.now() });
  return true;
}

export async function listBookmarks() {
  const db = getDB();
  return db.bookmarks.orderBy("createdAt").reverse().toArray();
}

export async function isBookmarked(id: string): Promise<boolean> {
  return (await getDB().bookmarks.get(id)) !== undefined;
}
