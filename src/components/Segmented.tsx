"use client";

import { useId } from "react";
import { motion } from "motion/react";

/** Segmented control dengan thumb bergeser (spring). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  labels,
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
  ariaLabel: string;
}) {
  const id = useId();
  return (
    <div role="group" aria-label={ariaLabel} className="flex rounded-full bg-[var(--muted)] p-1">
      {options.map((o) => {
        const selected = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={selected}
            className={`relative flex-1 rounded-full px-4 py-1.5 text-sm transition-colors ${
              selected ? "font-semibold text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-full bg-[var(--primary)]"
              />
            )}
            <span className="relative">{labels[o]}</span>
          </button>
        );
      })}
    </div>
  );
}
