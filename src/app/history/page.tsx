"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MascotEmpty } from "@/components/MascotEmpty";
import { clearHistory, listHistory } from "@/lib/user";

export default function HistoryPage() {
  const [items, setItems] = useState<{ id: string; query: string }[]>([]);

  useEffect(() => {
    listHistory().then(setItems).catch(() => {});
  }, []);

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Riwayat</h1>
        {items.length > 0 && (
          <button
            onClick={async () => {
              await clearHistory();
              setItems([]);
            }}
            className="text-sm text-[var(--muted-foreground)]"
          >
            Hapus
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <MascotEmpty kind="thinking" title="Belum ada riwayat" />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((i) => (
            <Link
              key={i.id}
              href={`/?q=${encodeURIComponent(i.query)}`}
              className="rounded-full bg-[var(--muted)] px-4 py-1.5 font-jp text-sm"
            >
              {i.query}
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
