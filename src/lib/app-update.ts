const APP_SHA_KEY = "jidict:appSha";

/** Compare deployed app SHA with last-seen SHA. Null = unknown/offline. */
export async function checkAppUpdate(
  fetchFn: typeof fetch = fetch,
  store: Pick<Storage, "getItem" | "setItem"> | null = null,
): Promise<{ available: boolean; sha: string | null }> {
  try {
    const res = await fetchFn("/app-version.json", { cache: "no-store" });
    if (!res.ok) return { available: false, sha: null };
    const { sha } = (await res.json()) as { sha?: string };
    if (typeof sha !== "string" || !sha) return { available: false, sha: null };
    const seen = store?.getItem(APP_SHA_KEY) ?? null;
    if (!seen) {
      store?.setItem(APP_SHA_KEY, sha);
      return { available: false, sha };
    }
    return { available: seen !== sha, sha };
  } catch {
    return { available: false, sha: null };
  }
}

export function markAppUpdated(store: Pick<Storage, "setItem">, sha: string): void {
  try {
    store.setItem(APP_SHA_KEY, sha);
  } catch {
    // ignore
  }
}
