"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Splash({
  onDone,
  updateAvailable,
}: {
  onDone: () => void;
  updateAvailable: boolean;
}) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Minimum brand moment, then hand off. Real version check runs in AppShell.
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splash-enter flex min-h-dvh flex-col items-center justify-center gap-6 bg-[var(--background)]">
      <Image
        src={resolvedTheme === "dark" ? "/logo/app-logo-dark.png" : "/logo/app-logo.png"}
        alt="JIDict"
        width={180}
        height={52}
        priority
      />
      <div className="h-0.5 w-40 overflow-hidden rounded bg-[var(--border)]">
        <div
          className="h-full w-1/2 animate-pulse rounded bg-[var(--primary)]"
          style={{ animation: "splash-pulse 1s infinite" }}
        />
      </div>
      {updateAvailable && <p className="text-xs text-[var(--muted-foreground)]">Update tersedia</p>}
    </div>
  );
}
