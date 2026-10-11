"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Splash } from "@/components/Splash";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Halaman offline darurat SW tidak boleh di-gate splash.
  const bare = pathname === "/offline";

  if (!splashDone && !bare) {
    return <Splash onDone={() => setSplashDone(true)} />;
  }

  return (
    <div className="min-h-dvh flex flex-col lg:pl-[76px]">
      <header className="sticky top-0 z-20 border-b bg-[var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 pt-[env(safe-area-inset-top)]">
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
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
