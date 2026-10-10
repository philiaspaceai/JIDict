"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SearchBar } from "@/components/SearchBar";
import { EntryCard } from "@/components/EntryCard";
import { MascotEmpty } from "@/components/MascotEmpty";
import type { DictEntry } from "@/lib/search";

export default function SearchPage() {
  const [results, setResults] = useState<DictEntry[] | null>(null);
  const [query, setQuery] = useState("");

  async function handleSearch(q: string) {
    setQuery(q);
    // Slice 1: IndexedDB lookup menyusul di worker. Untuk scaffold, kosong = empty state.
    // Engine Yomitan (Translator + deinflect) diintegrasikan di slice berikutnya.
    setResults([]);
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} />
        {results === null && (
          <MascotEmpty kind="welcome" title="Cari kosakata Jepang–Indonesia" />
        )}
        {results !== null && results.length === 0 && (
          <MascotEmpty
            kind="confused"
            title={query ? `Tidak ketemu: ${query}` : "Tidak ketemu"}
          />
        )}
        {results !== null && results.length > 0 && (
          <div className="space-y-2">
            {results.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
