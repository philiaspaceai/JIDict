export type SplashFlowState =
  | "checking-app"
  | "updating-app"
  | "checking-dict"
  | "downloading"
  | "importing"
  | "ready"
  | "needs-network";

export interface SplashSnapshot {
  appChanged: boolean;
  dictReady: boolean;
  dictChanged: boolean;
  online: boolean;
}

export type SplashAction = "reload-app" | "download-dict" | "enter" | "needs-network";

/**
 * Pure: aksi splash berikutnya. Update app menang (harus reload dulu
 * sebelum cek kamus versi baru). Tanpa jaringan + DB kosong = buntu.
 */
export function decideSplashAction(s: SplashSnapshot): SplashAction {
  if (s.appChanged) return "reload-app";
  if (!s.dictReady && !s.online) return "needs-network";
  if (!s.dictReady || s.dictChanged) return "download-dict";
  return "enter";
}

/** Fraksi unduhan 0..1, aman untuk total tak diketahui. */
export function downloadFraction(done: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(1, Math.max(0, done / total));
}

/** "41,6 MB" (format Indonesia). */
export function formatMB(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 MB";
  return `${(bytes / 1048576).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`;
}
