"use client";

import { motion } from "motion/react";
import { Bookmark, X } from "lucide-react";
import { Drawer } from "vaul";
import { GlossaryBlock, PronunciationBlock } from "@/components/EntryCard";
import type { DictEntry } from "@/lib/search";

function buzz() {
  try {
    navigator.vibrate?.(10);
  } catch {
    // abaikan (desktop / tak didukung)
  }
}

/** Lembar detail entri: drawer pegas + glossary penuh ala Yomitan. */
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
  return (
    <Drawer.Root open onOpenChange={(o) => { if (!o) onClose(); }}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
        <Drawer.Content
          aria-label={`${entry.expression} ${entry.reading}`}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-sheet bg-[var(--background)] outline-none"
        >
          <div className="shrink-0 pt-2.5">
            <Drawer.Handle className="mx-auto block h-1 w-10 rounded-full bg-[var(--border)]" aria-label="Seret untuk ubah ukuran" />
          </div>
          <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-2">
            <div>
              <Drawer.Title asChild>
                <motion.h2 layoutId={`hw-${entry.id}`} className="font-jp text-2xl font-bold leading-tight">
                  {entry.expression}
                </motion.h2>
              </Drawer.Title>
              <Drawer.Description className="font-jp text-base text-[var(--muted-foreground)]">
                {entry.reading}
              </Drawer.Description>
            </div>
            <div className="flex shrink-0 gap-1">
              {onToggleBookmark && (
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  aria-label={bookmarked ? "Hapus markah" : "Tambah markah"}
                  aria-pressed={!!bookmarked}
                  onClick={() => {
                    buzz();
                    onToggleBookmark();
                  }}
                  className={`rounded-full p-2 transition-colors ${bookmarked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                >
                  <Bookmark size={22} fill={bookmarked ? "currentColor" : "none"} aria-hidden />
                </motion.button>
              )}
              <Drawer.Close
                aria-label="Tutup"
                className="rounded-full p-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                <X size={22} aria-hidden />
              </Drawer.Close>
            </div>
          </div>
          <div className="overflow-y-auto px-5 pb-8">
            {(entry.jlpt || entry.freqJpdb !== undefined || entry.freqYoutube !== undefined) && (
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {entry.jlpt && <span className="rounded-full bg-[var(--muted)] px-2.5 py-1">{entry.jlpt}</span>}
                {entry.freqJpdb !== undefined && (
                  <span className="rounded-full bg-[var(--muted)] px-2.5 py-1">JPDB {entry.freqJpdb}</span>
                )}
                {entry.freqYoutube !== undefined && (
                  <span className="rounded-full bg-[var(--muted)] px-2.5 py-1">YT {entry.freqYoutube}</span>
                )}
              </div>
            )}
            {(!entry.pronunciations || entry.pronunciations.length === 0) && entry.pitch?.map((p, i) => (
              <span key={i} className="mt-2 mr-1.5 inline-block rounded-full bg-[var(--muted)] px-2.5 py-1 font-jp text-xs">
                {p}
              </span>
            ))}
            {entry.pronunciations && entry.pronunciations.length > 0 && (
              <ol className="pronunciation-list mt-3 space-y-2 border-t pt-3">
                {entry.pronunciations.map((p, i) => (
                  <li key={`${p.reading} ${p.position} ${i}`}>
                    {new Set(entry.pronunciations!.map((x) => x.reading)).size > 1 && (
                      <div className="mb-1 font-jp text-xs text-[var(--muted-foreground)]">{p.reading}</div>
                    )}
                    <PronunciationBlock reading={p.reading} pitch={p} />
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-3 border-t pt-3">
              <GlossaryBlock entry={entry} onNavigate={onNavigate} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
