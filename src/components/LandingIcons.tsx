// Ikon landing (Lucide tidak punya padanan OfflineCloud/MicVocal yang pas,
// jadi SVG inline satu keluarga stroke agar konsisten).
function Base({ size = 22, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function OfflineCloud({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 6.5 6.5 0 0 0-12.7 1.61A4 4 0 0 0 6 19h11.5z" />
      <path d="m9.5 14.5 1.8 1.8 3.2-3.8" />
    </Base>
  );
}

export function MicVocal({ size }: { size?: number }) {
  return (
    <Base size={size}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v4" />
    </Base>
  );
}

export { BookOpen, Download } from "lucide-react";
