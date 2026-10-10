"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SearchBar } from "@/components/SearchBar";
import { EntryCard } from "@/components/EntryCard";
import { MascotEmpty } from "@/components/MascotEmpty";
import { getDictDB } from "@/lib/dict/client";
import { searchDict } from "@/lib/dict/engine";
import { addHistory, getFrequencySource, isBookmarked, toggleBookmark } from "@/lib/user";
import type { DictEntry } from "@/lib/search";

function SearchInner() {
  const params = useSearchParams();
  const [results, setResults] = useState<DictEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [marks, setMarks] = useState<Set<string>>(new Set());

  const run = useCallback(async (q: string) => {
    setQuery(q);
    setBusy(true);
    setFailed(false);
    try {
      await addHistory(q).catch(() => {});
      const r = await searchDict(getDictDB(), q, { source: getFrequencySource() });
      setResults(r);
    } catch {
      setFailed(true);
      setResults([]);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const q = params.get("q");
    if (q) run(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onToggle(e: DictEntry) {
    await toggleBookmark(e);
    const on = await isBookmarked(e.id);
    setMarks((prev) => {
      const next = new Set(prev);
      if (on) next.add(e.id);
      else next.delete(e.id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <SearchBar onSearch={run} />
      {busy && <p className="text-center text-sm text-[var(--muted-foreground)]">Mencari…</p>}
      {!busy && results === null && (
        <MascotEmpty kind="welcome" title="Cari kosakata Jepang–Indonesia" />
      )}
      {!busy && results !== null && results.length === 0 && (
        <MascotEmpty kind="confused" title={failed ? "Pencarian gagal" : query ? `Tidak ketemu: ${query}` : "Tidak ketemu"} />
      )}
      {!busy && results !== null && results.length > 0 && (
        <div className="space-y-2">
          {results.map((e) => (
            <EntryCard key={e.id} entry={e} bookmarked={marks.has(e.id)} onToggleBookmark={() => onToggle(e)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AppShell>
      <Suspense>
        <SearchInner />
      </Suspense>
    </AppShell>
  );
}
