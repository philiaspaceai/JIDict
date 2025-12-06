import { DictionaryEntry } from '../types';

const PROJECT_URL = "https://xxnsvylzzkgcnubaegyv.supabase.co";
// Using the provided Anon Token (JWT)
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bnN2eWx6emtnY251YmFlZ3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDE0MjcsImV4cCI6MjA3OTk3NzQyN30.x0wz0v_qqvg6riMipKMr3IM30YnGaGs1b9uMvJRGG5M"; 

const TABLE_NAME = "words"; 
const PAGE_SIZE = 30;

export const searchDictionary = async (
  query: string,
  kanaQuery: string,
  katakanaQuery: string,
  page: number = 0
): Promise<{ data: DictionaryEntry[]; error: string | null }> => {
  try {
    const offset = page * PAGE_SIZE;
    
    // Base URL selects only necessary columns
    let url = `${PROJECT_URL}/rest/v1/${TABLE_NAME}?select=word,reading,meaning&limit=${PAGE_SIZE}&offset=${offset}`;

    if (query.trim()) {
      // Build search terms array to avoid duplicates
      const searchTerms = new Set<string>();
      
      // OPTIMIZATION: Use Prefix Match (Starts With) instead of Wildcard (Contains)
      // This prevents Error 500 (Server Busy) by significantly reducing database load.
      
      // 1. Add original query (e.g., "gakkou" or "学校") -> "学校%"
      searchTerms.add(encodeURIComponent(`${query}%`));
      
      // 2. Add Hiragana (e.g., "がっこう") -> "がっこう%"
      if (kanaQuery && kanaQuery !== query) {
        searchTerms.add(encodeURIComponent(`${kanaQuery}%`));
      }
      
      // 3. Add Katakana (e.g., "ガッコウ") -> "ガッコウ%"
      if (katakanaQuery && katakanaQuery !== query && katakanaQuery !== kanaQuery) {
        searchTerms.add(encodeURIComponent(`${katakanaQuery}%`));
      }

      // Construct Supabase OR filter
      // This checks 'word' OR 'reading' against ALL unique search terms
      const orConditions: string[] = [];
      searchTerms.forEach(term => {
        orConditions.push(`word.ilike.${term}`);
        orConditions.push(`reading.ilike.${term}`);
      });

      if (orConditions.length > 0) {
        url += `&or=(${orConditions.join(',')})`;
      }
    }
    
    // Default Sort: Alphabetical by word
    url += `&order=word.asc`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      },
    });

    // Handle 416 Range Not Satisfiable (End of Pagination)
    if (response.status === 416) {
      return { data: [], error: null };
    }

    if (!response.ok) {
      // 404: Table not found (Dev configuration error)
      if (response.status === 404) {
        console.error("Supabase Table Not Found: Check TABLE_NAME");
        throw new Error("Database configuration error (Table not found)");
      }
      // 500: Server Error (Query too complex)
      if (response.status === 500) {
        throw new Error("Server is busy. The database is too large for 'Contains' search. Please try searching for the beginning of the word.");
      }
      // Other API errors
      throw new Error(`Connection error (${response.status})`);
    }

    const data: DictionaryEntry[] = await response.json();
    return { data, error: null };

  } catch (err: any) {
    console.error("Dictionary API Error:", err);
    return { data: [], error: err.message || "Unknown error occurred" };
  }
};