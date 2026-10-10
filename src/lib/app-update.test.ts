import { describe, expect, it } from "vitest";
import { checkAppUpdate } from "@/lib/app-update";

function store(seen: string | null) {
  const m = new Map<string, string>();
  if (seen) m.set("jidict:appSha", seen);
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

const fetchSha = (sha: string) =>
  (async () => new Response(JSON.stringify({ sha }), { status: 200 })) as typeof fetch;

describe("checkAppUpdate", () => {
  it("stores silently on first run", async () => {
    const s = store(null);
    const r = await checkAppUpdate(fetchSha("abc"), s);
    expect(r.available).toBe(false);
    expect(s.getItem("jidict:appSha")).toBe("abc");
  });
  it("flags when sha differs", async () => {
    const r = await checkAppUpdate(fetchSha("def"), store("abc"));
    expect(r.available).toBe(true);
  });
  it("quiet when same", async () => {
    const r = await checkAppUpdate(fetchSha("abc"), store("abc"));
    expect(r.available).toBe(false);
  });
  it("quiet when offline", async () => {
    const r = await checkAppUpdate(async () => {
      throw new Error("offline");
    }, store("abc"));
    expect(r.available).toBe(false);
  });
});
