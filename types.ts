export interface DictionaryEntry {
  id?: number;
  word: string;
  reading: string;
  meaning: string;
}

export interface SearchState {
  query: string;
  results: DictionaryEntry[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}
