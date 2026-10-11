"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { filterDemo } from "./demo-data";

/** Demo coba-cari instan (100+ kata, tanpa unduh kamus). */
export function DemoSearch() {
  const [value, setValue] = useState("");
  const [tried, setTried] = useState(false);
  const results = tried ? filterDemo(value) : [];

  return (
    <div>
      <form
        role="search"
        aria-label="Demo coba cari"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
        }}
        className="flex gap-2"
      >
        <div className="flex h-14 flex-1 items-center gap-2.5 rounded-card border border-transparent bg-[var(--card)] px-4 shadow-[0_2px_16px_rgb(0_0_0/0.06)] transition-colors focus-within:border-[var(--primary)] dark:shadow-[0_2px_20px_rgb(0_0_0/0.4)]">
          <SearchIcon size={20} className="shrink-0 text-[var(--muted-foreground)]" aria-hidden />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTried(true);
            }}
            placeholder="Coba: makan, ねこ, taberu…"
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Coba cari kata"
            className="h-full w-full bg-transparent font-jp text-lg outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>
        <button
          type="submit"
          className="h-14 shrink-0 rounded-card bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          Coba
        </button>
      </form>
      {tried && value.trim() && (
        <ul className="mt-2 space-y-2" aria-label="Hasil demo">
          {results.map((r) => (
            <li key={r.expression} className="rounded-card border bg-[var(--card)] px-4 py-2.5">
              <span className="font-jp text-base font-bold">{r.expression}</span>{" "}
              <span className="font-jp text-sm text-[var(--muted-foreground)]">{r.reading}</span>
              <span className="text-sm"> — {r.gloss}</span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="text-sm text-[var(--muted-foreground)]">
              Tidak ada di demo mini —{" "}
              <Link href="/" className="text-[var(--primary)]">
                cari di kamus lengkap (300.000+ entri)
              </Link>
            </li>
          )}
        </ul>
      )}
      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
        Demo 100+ kata. Kamus lengkap dibuka di aplikasi.
      </p>
    </div>
  );
}
