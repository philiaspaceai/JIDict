"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Cari", icon: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" },
  { href: "/bookmark", label: "Markah", icon: "M6 3h12v18l-6-4-6 4z" },
  { href: "/history", label: "Riwayat", icon: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 3" },
  { href: "/settings", label: "Setelan", icon: "M4 8h10M18 8h2M4 16h2M10 16h10" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-4">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs ${
                active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
