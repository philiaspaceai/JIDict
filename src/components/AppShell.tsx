"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Splash } from "@/components/Splash";
import { BottomNav } from "@/components/BottomNav";
import { BrandLogo } from "@/components/BrandLogo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const pathname = usePathname();

  // Halaman offline darurat SW tidak boleh di-gate splash.
  const bare = pathname === "/offline";

  if (!splashDone && !bare) {
    return <Splash onDone={() => setSplashDone(true)} />;
  }

  return (
    <div className="min-h-dvh flex flex-col lg:pl-[76px]">
      <header className="sticky top-0 z-20 border-b bg-[var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 pt-[env(safe-area-inset-top)]">
          <BrandLogo width={96} height={28} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
