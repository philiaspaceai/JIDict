import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hero3D } from './components/Hero3D';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { searchDictionary } from './services/supabase';
import { DictionaryEntry } from './types';
import { toKana, toKatakana } from './utils/romaji';

export default function App() {
  const [query, setQuery] = useState('');
  const [executedQuery, setExecutedQuery] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0); // Forces effect on re-search

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Main Data Fetching Logic
  const fetchData = async () => {
    if (!executedQuery.trim()) return;

    setLoading(true);
    setError(null);
    
    // Generate Helper Queries (Romaji -> Kana/Katakana)
    const kanaQuery = toKana(executedQuery);
    const katakanaQuery = toKatakana(executedQuery);
    
    // Call API
    const { data, error } = await searchDictionary(executedQuery, kanaQuery, katakanaQuery, page);
    
    if (error) {
      setError(error);
    } else {
      // CLIENT SIDE SORTING: Prioritize Exact Matches
      const sortedData = [...data].sort((a, b) => {
          const q = executedQuery.toLowerCase();
          const k = kanaQuery;
          const kk = katakanaQuery;
          
          const aWord = (a.word || '').toLowerCase();
          const aReading = (a.reading || '');
          const bWord = (b.word || '').toLowerCase();
          const bReading = (b.reading || '');
          
          // 1. Exact Matches (Word or Reading equals Query, Kana, or Katakana)
          const isAExact = [q, k, kk].some(target => aWord === target || aReading === target);
          const isBExact = [q, k, kk].some(target => bWord === target || bReading === target);

          if (isAExact && !isBExact) return -1;
          if (!isAExact && isBExact) return 1;

          // 2. Starts With (Prefix Matches)
          const isAStart = [q, k, kk].some(target => aWord.startsWith(target) || aReading.startsWith(target));
          const isBStart = [q, k, kk].some(target => bWord.startsWith(target) || bReading.startsWith(target));

          if (isAStart && !isBStart) return -1;
          if (!isAStart && isBStart) return 1;
          
          // 3. Length (Shorter words usually more relevant)
          return aWord.length - bWord.length;
      });

      // Deduplicate and Append
      setResults(prev => {
          // Create a Set of existing IDs (Word+Reading)
          const existingIds = new Set(prev.map(p => (p.word || '') + (p.reading || '')));
          
          // Filter out duplicates from new data
          const uniqueNewData = sortedData.filter(d => 
            !existingIds.has((d.word || '') + (d.reading || ''))
          );
          
          return [...prev, ...uniqueNewData];
      });
      
      setHasMore(data.length > 0);
    }
    setLoading(false);
  };

  // Trigger Search (Manual)
  const handleSearch = () => {
    const term = query.trim();
    if (!term) {
        setExecutedQuery('');
        setResults([]);
        setHasSearched(false);
        return;
    }
    
    setExecutedQuery(term);
    setResults([]);
    setPage(0);
    setHasMore(true);
    setHasSearched(true);
    setSearchTrigger(prev => prev + 1); // Force effect to run even if query is same
    setError(null);
  };

  useEffect(() => {
    if (hasSearched) {
        fetchData();
    }
  }, [page, searchTrigger]); // Removed executedQuery to avoid duplicate calls, handled by searchTrigger

  return (
    <div className="min-h-screen pb-20 selection:bg-brandRed selection:text-white font-sans">
      
      {/* Container with dynamic padding based on state */}
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out ${hasSearched ? 'pt-8' : 'pt-[20vh]'}`}>
        
        <Hero3D />

        <div className="sticky top-4 z-40">
            <SearchBar 
                value={query} 
                onChange={setQuery} 
                onSearch={handleSearch}
                isLoading={loading && page === 0} 
            />
        </div>

        {/* Error Message */}
        {error && (
            <div className="max-w-md mx-auto mb-8 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg text-center flex flex-col items-center shadow-sm">
                <span className="mb-2 font-bold">Connection Error</span>
                <span className="text-sm mb-3">{error}</span>
                <button 
                  onClick={() => handleSearch()}
                  className="px-4 py-1.5 bg-white border border-red-200 hover:bg-red-50 hover:text-red-700 rounded-md text-sm transition-colors text-red-600 font-medium"
                >
                  Try Again
                </button>
            </div>
        )}

        {/* Results Grid */}
        {hasSearched && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {results.map((entry, index) => (
                      <div 
                          key={`${entry.word}-${entry.reading}-${index}`} 
                          ref={index === results.length - 1 ? lastElementRef : null}
                      >
                          <ResultCard entry={entry} index={index} />
                      </div>
                  ))}
                </div>

                {/* Loading Indicator (Pagination) */}
                {loading && page > 0 && (
                    <div className="w-full flex justify-center py-8">
                        <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 bg-brandRed rounded-full animate-bounce"></div>
                            <div className="w-2.5 h-2.5 bg-brandRed rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2.5 h-2.5 bg-brandRed rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && results.length === 0 && !error && (
                    <div className="text-center py-20 opacity-60">
                        <div className="text-6xl mb-4 grayscale">🤔</div>
                        <p className="text-xl font-bold text-gray-800 mb-2">No results found</p>
                        <p className="text-gray-500">
                          We couldn't find matches for <span className="font-semibold text-brandRed">"{executedQuery}"</span>
                        </p>
                    </div>
                )}
                
                {/* End of List */}
                {!hasMore && results.length > 0 && (
                    <div className="text-center py-12 flex justify-center">
                        <div className="h-1.5 w-1.5 bg-gray-300 rounded-full mx-1"></div>
                        <div className="h-1.5 w-1.5 bg-gray-300 rounded-full mx-1"></div>
                        <div className="h-1.5 w-1.5 bg-gray-300 rounded-full mx-1"></div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}