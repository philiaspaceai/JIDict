"use client";

import Image from "next/image";

const MASCOTS: Record<string, string> = {
  welcome: "/mascots/1.png",
  confused: "/mascots/2.png",
  thinking: "/mascots/5.png",
  happy: "/mascots/4.png",
  explain: "/mascots/7.png",
};

export function MascotEmpty({
  kind = "confused",
  title,
  action,
}: {
  kind?: keyof typeof MASCOTS;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Image src={MASCOTS[kind]} alt="" width={120} height={120} />
      <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
      {action}
    </div>
  );
}
