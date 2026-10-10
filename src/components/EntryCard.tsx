"use client";

import type { DictEntry } from "@/lib/search";

export function EntryCard({
  entry,
  bookmarked,
  onToggleBookmark,
  onOpen,
}: {
  entry: DictEntry;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  onOpen?: () => void;
}) {
  return (
    <article className="rounded-xl border bg-[var(--card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onOpen} className="text-left">
          <div className="font-jp text-lg font-bold leading-tight">{entry.expression}</div>
          <div className="font-jp text-sm text-[var(--muted-foreground)]">{entry.reading}</div>
        </button>
        {onToggleBookmark && (
          <button
            aria-label={bookmarked ? "Hapus markah" : "Tambah markah"}
            aria-pressed={!!bookmarked}
            onClick={onToggleBookmark}
            className={`rounded-full p-2 ${bookmarked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
          </button>
        )}
      </div>
      <ul className="mt-2 space-y-1">
        {entry.glossary.slice(0, 3).map((g, i) => (
          <li key={i} className="text-sm leading-snug">
            {g}
          </li>
        ))}
      </ul>
      {(entry.pitch?.length || entry.jlpt) && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          {entry.jlpt && (
            <span className="rounded-full bg-[var(--muted)] px-2 py-0.5">{entry.jlpt}</span>
          )}
          {entry.pitch?.map((p, i) => (
            <span key={i} className="rounded-full bg-[var(--muted)] px-2 py-0.5 font-jp">
              {p}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
