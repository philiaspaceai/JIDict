import { describe, expect, it } from "vitest";
import { decideUpdate, fetchRemoteDictIndex, isNewerVersion } from "@/lib/update-check";

describe("isNewerVersion", () => {
  it("false when remote missing", () => {
    expect(isNewerVersion(null, "1")).toBe(false);
  });
  it("true when no local version", () => {
    expect(isNewerVersion("2", null)).toBe(true);
  });
  it("false when same version", () => {
    expect(isNewerVersion("1.0.0", "1.0.0")).toBe(false);
  });
  it("true when different version", () => {
    expect(isNewerVersion("1.0.1", "1.0.0")).toBe(true);
  });
});

describe("decideUpdate", () => {
  it("flags update when remote differs", () => {
    const r = decideUpdate({ remoteVersion: "2", localVersion: "1" });
    expect(r.dictUpdateAvailable).toBe(true);
  });
  it("no update when same", () => {
    const r = decideUpdate({ remoteVersion: "1", localVersion: "1" });
    expect(r.dictUpdateAvailable).toBe(false);
  });
});

describe("fetchRemoteDictIndex", () => {
  it("returns null when offline", async () => {
    const r = await fetchRemoteDictIndex(async () => {
      throw new Error("offline");
    });
    expect(r).toBeNull();
  });
  it("parses version", async () => {
    const r = await fetchRemoteDictIndex((async () =>
      new Response(JSON.stringify({ version: "3", updatedAt: "2026-01-01" }), {
        status: 200,
      })) as typeof fetch);
    expect(r?.version).toBe("3");
  });
});
