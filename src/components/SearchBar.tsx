"use client";

import { useState } from "react";
import { normalizeQuery } from "@/lib/search";

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = normalizeQuery(value);
        if (q) onSearch(q);
      }}
      className="flex gap-2"
    >
      <div className="flex flex-1 items-center gap-2 rounded-full border bg-[var(--card)] px-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--muted-foreground)]">
          <path d="M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="漢字・かな・romaji"
          lang="ja"
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Cari kata"
          className="h-11 w-full bg-transparent font-jp text-base outline-none placeholder:text-[var(--muted-foreground)]"
        />
        {value && (
          <button type="button" aria-label="Hapus" onClick={() => setValue("")} className="text-[var(--muted-foreground)]">
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-white"
      >
        Cari
      </button>
    </form>
  );
}
