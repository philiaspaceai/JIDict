"use client";

import { useEffect, useRef } from "react";
import { renderGlossary, glossaryPreview } from "@/lib/dict/render";
import { getDictDB } from "@/lib/dict/client";
import type { DictEntry } from "@/lib/search";

/** Satu item definisi penuh — glossary dirender via StructuredContentGenerator Yomitan. */
export function GlossaryBlock({
  entry,
  onNavigate,
}: {
  entry: DictEntry;
  onNavigate?: (query: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.replaceChildren();
    const { node } = renderGlossary(entry.glossary, {
      onNavigate: (q) => navRef.current?.(q),
    });
    el.appendChild(node);
    // Inject styles.css kamus (disimpan saat impor) agar tampil sesuai gaya kamus.
    let styleEl: HTMLStyleElement | null = null;
    getDictDB()
      .dictInfo.get("css:jidict")
      .then((row) => {
        if (row && el.isConnected) {
          styleEl = document.createElement("style");
          styleEl.dataset.jidict = "dict-css";
          styleEl.textContent = row.value;
          el.appendChild(styleEl);
        }
      })
      .catch(() => {});
    return () => {
      styleEl?.remove();
      el.replaceChildren();
    };
  }, [entry]);

  return <div ref={ref} className="jidict-entry" />;
}

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
  const preview = glossaryPreview(entry.glossary);
  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      tabIndex={onOpen ? 0 : undefined}
      role={onOpen ? "button" : undefined}
      className="cursor-pointer rounded-xl border bg-[var(--card)] p-4 transition-colors hover:border-[var(--primary)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-left">
          <div className="font-jp text-lg font-bold leading-tight">{entry.expression}</div>
          <div className="font-jp text-sm text-[var(--muted-foreground)]">{entry.reading}</div>
        </div>
        {onToggleBookmark && (
          <button
            aria-label={bookmarked ? "Hapus markah" : "Tambah markah"}
            aria-pressed={!!bookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`shrink-0 rounded-full p-2 ${bookmarked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
          </button>
        )}
      </div>
      {preview && <p className="mt-2 line-clamp-2 text-sm leading-snug">{preview}</p>}
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
