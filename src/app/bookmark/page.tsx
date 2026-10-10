"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EntryCard } from "@/components/EntryCard";
import { MascotEmpty } from "@/components/MascotEmpty";
import { listBookmarks, toggleBookmark } from "@/lib/user";
import type { DictEntry } from "@/lib/search";

export default function BookmarkPage() {
  const [items, setItems] = useState<{ id: string; entry: DictEntry }[]>([]);

  useEffect(() => {
    listBookmarks().then(setItems).catch(() => {});
  }, []);

  async function remove(e: DictEntry) {
    await toggleBookmark(e);
    setItems((prev) => prev.filter((i) => i.id !== e.id));
  }

  return (
    <AppShell>
      <h1 className="text-lg font-bold">Markah</h1>
      {items.length === 0 ? (
        <MascotEmpty
          kind="happy"
          title="Belum ada markah"
          action={
            <Link href="/" className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">
              Cari kata
            </Link>
          }
        />
      ) : (
        <div className="mt-3 space-y-2">
          {items.map((i) => (
            <EntryCard key={i.id} entry={i.entry} bookmarked onToggleBookmark={() => remove(i.entry)} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
