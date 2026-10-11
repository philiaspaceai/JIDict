"use client";

import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { normalizeQuery } from "@/lib/search";
import { getDictDB } from "@/lib/dict/client";
import { suggestTerms } from "@/lib/dict/engine";

export interface Suggestion {
  expression: string;
  reading: string;
}

function Highlight({ text, prefix }: { text: string; prefix: string }) {
  if (prefix && text.startsWith(prefix)) {
    return (
      <>
        <strong className="font-semibold">{text.slice(0, prefix.length)}</strong>
        {text.slice(prefix.length)}
      </>
    );
  }
  return <>{text}</>;
}

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = normalizeQuery(value);
    if (!q) {
      setSuggestions([]);
      setOpen(false);
      setActive(-1);
      return;
    }
    const my = ++seq.current;
    timer.current = setTimeout(async () => {
      try {
        const r = await suggestTerms(getDictDB(), q, 7);
        // Abaikan hasil basi (user sudah submit / mengetik lanjut).
        if (seq.current !== my) return;
        setSuggestions(r);
        setActive(-1);
        setOpen(r.length > 0 && document.activeElement === inputRef.current);
      } catch {
        // DB belum siap (splash gate) — diam
      }
    }, 150);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function submit(q: string) {
    const query = normalizeQuery(q);
    if (!query) return;
    seq.current++;
    setOpen(false);
    onSearch(query);
  }

  const matchPrefix = normalizeQuery(value);

  return (
    <div ref={boxRef} className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && suggestions[active]) submit(suggestions[active].expression);
          else submit(value);
        }}
        className="flex gap-2"
      >
        <div className="flex h-14 flex-1 items-center gap-2.5 rounded-card border border-transparent bg-[var(--card)] px-4 shadow-[0_2px_16px_rgb(0_0_0/0.06)] transition-colors focus-within:border-[var(--primary)] dark:shadow-[0_2px_20px_rgb(0_0_0/0.4)]">
          <SearchIcon size={20} className="shrink-0 text-[var(--muted-foreground)]" aria-hidden />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onKeyDown={(e) => {
              if (!open) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, suggestions.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, -1));
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="漢字・かな・romaji"
            lang="ja"
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Cari kata"
            role="combobox"
            aria-expanded={open}
            aria-controls="search-suggest"
            aria-activedescendant={active >= 0 ? `suggest-${active}` : undefined}
            className="h-full w-full bg-transparent font-jp text-lg outline-none placeholder:text-[var(--muted-foreground)]"
          />
          {value && (
            <button
              type="button"
              aria-label="Hapus"
              onClick={() => {
                setValue("");
                setSuggestions([]);
                setOpen(false);
              }}
              className="rounded-full p-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <X size={18} aria-hidden />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-14 shrink-0 rounded-card bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          Cari
        </button>
      </form>
      {open && suggestions.length > 0 && (
        <ul
          id="search-suggest"
          role="listbox"
          aria-label="Saran"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-card border bg-[var(--card)] py-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.14)]"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.expression} ${s.reading}`} id={`suggest-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setValue(s.expression);
                  submit(s.expression);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-baseline gap-2 px-4 py-2 text-left ${i === active ? "bg-[var(--muted)]" : ""}`}
              >
                <span className="font-jp text-[15px]">
                  <Highlight text={s.expression} prefix={matchPrefix} />
                </span>
                <span className="truncate font-jp text-xs text-[var(--muted-foreground)]">{s.reading}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
