import { BUNDLED_DICTS, DICT_DOWNLOAD_URL, DICT_INDEX_URL } from "./constants";

export interface DictVersionInfo {
  version: string;
  updatedAt: string;
}

export interface UpdateCheck {
  dictUpdateAvailable: boolean;
  remoteVersion: string | null;
  localVersion: string | null;
  appUpdateAvailable: boolean;
}

/**
 * Fetch remote JIDict.json index (contains version + download url).
 * Returns null when offline so splash can fall back to cached data.
 */
export async function fetchRemoteDictIndex(
  fetchFn: typeof fetch = fetch,
): Promise<DictVersionInfo | null> {
  try {
    const res = await fetchFn(DICT_INDEX_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      revision?: string | number;
      version?: string | number;
      updatedAt?: string;
    };
    const rev = json.revision ?? json.version ?? "unknown";
    return {
      version: String(rev),
      updatedAt: json.updatedAt ?? "",
    };
  } catch {
    return null;
  }
}

export function isNewerVersion(
  remote: string | null,
  local: string | null,
): boolean {
  if (!remote) return false;
  if (!local) return true;
  return remote !== local;
}

/** Decide whether splash should offer an update. Pure function (TDD seam). */
export function decideUpdate(check: {
  remoteVersion: string | null;
  localVersion: string | null;
}): Pick<UpdateCheck, "dictUpdateAvailable" | "remoteVersion" | "localVersion"> {
  return {
    remoteVersion: check.remoteVersion,
    localVersion: check.localVersion,
    dictUpdateAvailable: isNewerVersion(
      check.remoteVersion,
      check.localVersion,
    ),
  };
}

export const UPDATE_URLS = {
  index: DICT_INDEX_URL,
  download: DICT_DOWNLOAD_URL,
  bundled: BUNDLED_DICTS.map((d) => d.file),
};
