"use client";

import { useEffect } from "react";
import { GlossaryBlock } from "@/components/EntryCard";
import type { DictEntry } from "@/lib/search";

/** Lembar detail entri: headword + glossary penuh ala Yomitan. */
export function EntryDetail({
  entry,
  bookmarked,
  onToggleBookmark,
  onClose,
  onNavigate,
}: {
  entry: DictEntry;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  onClose: () => void;
  onNavigate?: (query: string) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.expression} ${entry.reading}`}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="splash-enter max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-[var(--background)] p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-jp text-2xl font-bold leading-tight">{entry.expression}</div>
            <div className="font-jp text-base text-[var(--muted-foreground)]">{entry.reading}</div>
          </div>
          <div className="flex shrink-0 gap-1">
            {onToggleBookmark && (
              <button
                aria-label={bookmarked ? "Hapus markah" : "Tambah markah"}
                aria-pressed={!!bookmarked}
                onClick={onToggleBookmark}
                className={`rounded-full p-2 ${bookmarked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M6 3h12v18l-6-4-6 4z" />
                </svg>
              </button>
            )}
            <button aria-label="Tutup" onClick={onClose} className="rounded-full p-2 text-[var(--muted-foreground)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        {(entry.pitch?.length || entry.jlpt || entry.freqJpdb !== undefined || entry.freqYoutube !== undefined) && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {entry.jlpt && <span className="rounded-full bg-[var(--muted)] px-2.5 py-1">{entry.jlpt}</span>}
            {entry.pitch?.map((p, i) => (
              <span key={i} className="rounded-full bg-[var(--muted)] px-2.5 py-1 font-jp">{p}</span>
            ))}
            {entry.freqJpdb !== undefined && (
              <span className="rounded-full bg-[var(--muted)] px-2.5 py-1">JPDB {entry.freqJpdb}</span>
            )}
            {entry.freqYoutube !== undefined && (
              <span className="rounded-full bg-[var(--muted)] px-2.5 py-1">YT {entry.freqYoutube}</span>
            )}
          </div>
        )}
        <div className="mt-3 border-t pt-3">
          <GlossaryBlock entry={entry} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
