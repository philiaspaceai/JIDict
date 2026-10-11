"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { EntryCard } from "@/components/EntryCard";
import { EntryDetail } from "@/components/EntryDetail";
import { MascotEmpty } from "@/components/MascotEmpty";
import { SearchSkeleton } from "@/components/SearchSkeleton";
import { getDictDB } from "@/lib/dict/client";
import { searchDict } from "@/lib/dict/engine";
import { addHistory, getFrequencySource, isBookmarked, listHistory, toggleBookmark } from "@/lib/user";
import type { DictEntry } from "@/lib/search";

function SearchInner() {
  const params = useSearchParams();
  const [results, setResults] = useState<DictEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [failed, setFailed] = useState(false);
  const [marks, setMarks] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<DictEntry | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  const refreshRecents = useCallback(async () => {
    try {
      const h = await listHistory(8);
      setRecents([...new Set(h.map((x) => x.query))].slice(0, 8));
    } catch {
      // abaikan
    }
  }, []);

  const run = useCallback(async (q: string) => {
    setQuery(q);
    setBusy(true);
    setFailed(false);
    try {
      await addHistory(q).catch(() => {});
      const r = await searchDict(getDictDB(), q, { source: getFrequencySource() });
      setResults(r);
      await refreshRecents();
    } catch {
      setFailed(true);
      setResults([]);
    } finally {
      setBusy(false);
    }
  }, [refreshRecents]);

  // Skeleton hanya untuk operasi lambat (anti kedip).
  useEffect(() => {
    if (!busy) {
      setShowSkeleton(false);
      return;
    }
    const t = setTimeout(() => setShowSkeleton(true), 200);
    return () => clearTimeout(t);
  }, [busy]);

  useEffect(() => {
    refreshRecents();
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
      {results === null && recents.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Terakhir dicari">
          {recents.map((r) => (
            <button
              key={r}
              onClick={() => run(r)}
              className="rounded-full bg-[var(--muted)] px-4 py-1.5 font-jp text-sm transition-transform active:scale-95"
            >
              {r}
            </button>
          ))}
        </div>
      )}
      {showSkeleton && (
        <div aria-busy="true" aria-label="Memuat hasil">
          <SearchSkeleton />
        </div>
      )}
      {!busy && results === null && (
        <MascotEmpty kind="welcome" title="Cari kosakata Jepang–Indonesia" />
      )}
      {!busy && results !== null && results.length === 0 && (
        <MascotEmpty kind="confused" title={failed ? "Pencarian gagal" : query ? `Tidak ketemu: ${query}` : "Tidak ketemu"} />
      )}
      {!busy && results !== null && results.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2"
        >
          {results.map((e) => (
            <motion.div
              key={e.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
              }}
            >
              <EntryCard entry={e} bookmarked={marks.has(e.id)} onToggleBookmark={() => onToggle(e)} onOpen={() => setSelected(e)} />
            </motion.div>
          ))}
        </motion.div>
      )}
      {selected && (
        <EntryDetail
          entry={selected}
          bookmarked={marks.has(selected.id)}
          onToggleBookmark={() => onToggle(selected)}
          onClose={() => setSelected(null)}
          onNavigate={(q) => {
            setSelected(null);
            run(q);
          }}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
