"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Bookmark, History, Search, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "Cari", Icon: Search },
  { href: "/bookmark", label: "Markah", Icon: Bookmark },
  { href: "/history", label: "Riwayat", Icon: History },
  { href: "/settings", label: "Setelan", Icon: Settings },
];

function TabItem({ href, label, Icon, active, vertical }: { href: string; label: string; Icon: typeof Search; active: boolean; vertical?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-medium transition-colors ${
        vertical ? "flex-col px-0" : "flex-col px-2"
      } ${active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
    >
      {active && (
        <motion.span
          layoutId={vertical ? "nav-pill-rail" : "nav-pill"}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute inset-0 rounded-full bg-[var(--primary)]/10"
        />
      )}
      <Icon size={22} strokeWidth={active ? 2.4 : 2} aria-hidden className="relative" />
      <span className="relative">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <>
      {/* Rail desktop */}
      <nav aria-label="Navigasi utama" className="fixed inset-y-0 left-0 z-20 hidden w-[76px] flex-col items-center gap-1 border-r bg-[var(--glass)] px-2 py-4 backdrop-blur-xl lg:flex">
        {TABS.map((t) => (
          <TabItem key={t.href} {...t} vertical active={pathname === t.href} />
        ))}
      </nav>
      {/* Bar mobile */}
      <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-20 border-t bg-[var(--glass)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
          {TABS.map((t) => (
            <TabItem key={t.href} {...t} active={pathname === t.href} />
          ))}
        </div>
      </nav>
    </>
  );
}
