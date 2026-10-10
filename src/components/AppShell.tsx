"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Splash } from "@/components/Splash";
import { BottomNav } from "@/components/BottomNav";
import { Onboarding } from "@/components/Onboarding";
import { getDB } from "@/lib/db";
import { fetchRemoteDictIndex, isNewerVersion } from "@/lib/update-check";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = getDB();
        const local = await db.meta.get("dictVersion");
        const count = await db.meta.get("dictReady");
        if (!cancelled && !count) setNeedsOnboarding(true);
        // Splash check: remote version vs local (offline-safe).
        const remote = await fetchRemoteDictIndex();
        if (!cancelled && remote && isNewerVersion(remote.version, local?.value ?? null)) {
          setUpdateAvailable(true);
        }
      } catch {
        // Offline / fresh install — stay usable.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!splashDone) {
    return <Splash onDone={() => setSplashDone(true)} updateAvailable={updateAvailable} />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 border-b bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          {mounted && (
            <Image
              src={resolvedTheme === "dark" ? "/logo/app-logo-dark.png" : "/logo/app-logo.png"}
              alt="JIDict"
              width={96}
              height={28}
              priority
            />
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4">
        {needsOnboarding ? <Onboarding onDone={() => setNeedsOnboarding(false)} /> : children}
      </main>
      <BottomNav />
    </div>
  );
}
