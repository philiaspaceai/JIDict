"use client";

import { AppShell } from "@/components/AppShell";
import { MascotEmpty } from "@/components/MascotEmpty";

export default function HistoryPage() {
  return (
    <AppShell>
      <h1 className="text-lg font-bold">Riwayat</h1>
      <MascotEmpty kind="thinking" title="Belum ada riwayat" />
    </AppShell>
  );
}
