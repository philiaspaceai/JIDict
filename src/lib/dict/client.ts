import { DictDB } from "@/lib/dict/store";

let singleton: DictDB | null = null;

/** Browser singleton for the dictionary IndexedDB. */
export function getDictDB(): DictDB {
  if (!singleton) singleton = new DictDB();
  return singleton;
}
