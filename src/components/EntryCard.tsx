"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Bookmark } from "lucide-react";
import { renderGlossary, glossaryPreview, renderPronunciation } from "@/lib/dict/render";
import { getDictDB } from "@/lib/dict/client";
import type { DictEntry, DictPronunciation } from "@/lib/search";

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

/** Satu pola pitch-accent — dirender via PronunciationGenerator Yomitan. */
export function PronunciationBlock({ reading, pitch }: { reading: string; pitch: DictPronunciation }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.replaceChildren();
    const { node } = renderPronunciation(reading, pitch);
    el.appendChild(node);
    return () => {
      el.replaceChildren();
    };
  }, [reading, pitch]);

  return <div ref={ref} className="jidict-pronunciation font-jp" />;
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
    <motion.article
      layout
      whileHover={onOpen ? { y: -2 } : undefined}
      whileTap={onOpen ? { scale: 0.99 } : undefined}
      onClick={(e) => {
        // Abaikan klik dari tombol di dalam card (markah) — anti salah tembak.
        if ((e.target as HTMLElement).closest("button")) return;
        onOpen?.();
      }}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      tabIndex={onOpen ? 0 : undefined}
      role={onOpen ? "button" : undefined}
      aria-label={onOpen ? `Lihat detail ${entry.expression}` : undefined}
      className="cursor-pointer rounded-card border bg-[var(--card)] p-4 transition-colors hover:border-[var(--primary)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-left">
          <motion.div layoutId={`hw-${entry.id}`} className="font-jp text-lg font-bold leading-tight">
            {entry.expression}
          </motion.div>
          <div className="font-jp text-sm text-[var(--muted-foreground)]">{entry.reading}</div>
        </div>
        {onToggleBookmark && (
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            aria-label={bookmarked ? "Hapus markah" : "Tambah markah"}
            aria-pressed={!!bookmarked}
            onClick={(e) => {
              e.stopPropagation();
              try {
                navigator.vibrate?.(10);
              } catch {
                // abaikan
              }
              onToggleBookmark();
            }}
            className={`shrink-0 rounded-full p-2 transition-colors ${bookmarked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} aria-hidden />
          </motion.button>
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
    </motion.article>
  );
}
