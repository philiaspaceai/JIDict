"use client";

import { AppShell } from "@/components/AppShell";
import { MascotEmpty } from "@/components/MascotEmpty";

export default function BookmarkPage() {
  return (
    <AppShell>
      <h1 className="text-lg font-bold">Markah</h1>
      <MascotEmpty kind="happy" title="Belum ada markah" />
    </AppShell>
  );
}
