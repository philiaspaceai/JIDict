import { describe, expect, it } from "vitest";
import { decideSplashAction, downloadFraction, formatMB } from "@/lib/splash";

describe("decideSplashAction", () => {
  it("reload-app menang atas segalanya saat app berubah", () => {
    expect(
      decideSplashAction({ appChanged: true, dictReady: false, dictChanged: true, online: true }),
    ).toBe("reload-app");
  });
  it("needs-network saat DB kosong dan offline", () => {
    expect(
      decideSplashAction({ appChanged: false, dictReady: false, dictChanged: false, online: false }),
    ).toBe("needs-network");
  });
  it("download-dict saat DB kosong dan online", () => {
    expect(
      decideSplashAction({ appChanged: false, dictReady: false, dictChanged: false, online: true }),
    ).toBe("download-dict");
  });
  it("download-dict saat revisi berubah", () => {
    expect(
      decideSplashAction({ appChanged: false, dictReady: true, dictChanged: true, online: true }),
    ).toBe("download-dict");
  });
  it("enter saat siap dan tidak ada perubahan", () => {
    expect(
      decideSplashAction({ appChanged: false, dictReady: true, dictChanged: false, online: true }),
    ).toBe("enter");
  });
  it("enter saat offline tapi DB siap", () => {
    expect(
      decideSplashAction({ appChanged: false, dictReady: true, dictChanged: false, online: false }),
    ).toBe("enter");
  });
});

describe("downloadFraction", () => {
  it("0 saat total tidak diketahui", () => {
    expect(downloadFraction(100, 0)).toBe(0);
  });
  it("proporsional dan dijepit 0..1", () => {
    expect(downloadFraction(50, 100)).toBe(0.5);
    expect(downloadFraction(200, 100)).toBe(1);
    expect(downloadFraction(-5, 100)).toBe(0);
  });
});

describe("formatMB", () => {
  it("format Indonesia", () => {
    expect(formatMB(0)).toBe("0 MB");
    expect(formatMB(43_638_923)).toBe("41,6 MB");
  });
});
