import { test, expect } from "@playwright/test";
import { mockDictRoutes } from "./helpers/mock-dict";

test.beforeEach(async ({ page }) => {
  await mockDictRoutes(page);
  await page.goto("/");
  await expect(page.getByRole("search")).toBeVisible({ timeout: 60_000 });
});

test("cari kana → hasil + saran live", async ({ page }) => {
  const box = page.getByLabel("Cari kata");
  await box.fill("tab");
  await expect(page.getByRole("listbox", { name: "Saran" })).toBeVisible();
  await expect(page.getByRole("listbox", { name: "Saran" })).toContainText("食べる");
  await box.fill("たべる");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await expect(page.getByText("makan").first()).toBeVisible();
});

test("klik card → detail + grafik pitch", async ({ page }) => {
  await page.getByLabel("Cari kata").fill("たべる");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await page.getByText("makan").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("svg.pronunciation-graph")).toBeVisible();
  await expect(dialog.locator(".pronunciation-downstep-notation-number")).toHaveText("2");
  await expect(dialog).toContainText("makan");
  await dialog.getByRole("button", { name: "Tutup" }).click();
  await expect(dialog).toHaveCount(0);
});

test("bookmark bertahan di tab Markah", async ({ page }) => {
  await page.getByLabel("Cari kata").fill("たべる");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await page.getByRole("button", { name: "Tambah markah" }).first().click();
  await page.getByRole("link", { name: "Markah" }).click();
  await expect(page).toHaveURL("/bookmark");
  await expect(page.getByText("たべる").first()).toBeVisible();
});

test("riwayat tercatat + chip recent", async ({ page }) => {
  await page.getByLabel("Cari kata").fill("たべる");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await expect(page.getByText("makan").first()).toBeVisible();
  await page.getByRole("link", { name: "Riwayat" }).click();
  await expect(page).toHaveURL("/history");
  await expect(page.getByRole("link", { name: "たべる" })).toBeVisible();
});

test("frekuensi tersimpan", async ({ page }) => {
  await page.getByRole("link", { name: "Setelan" }).click();
  await page.getByRole("button", { name: "Youtube" }).click();
  await page.reload();
  // Reload di /settings: splash gate jalan lagi, lalu settings tampil.
  await expect(page.getByTestId("splash")).toHaveCount(0, { timeout: 60_000 });
  await expect(page.getByRole("heading", { name: "Setelan" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Sumber frekuensi" }).getByRole("button", { name: "Youtube" })).toHaveAttribute("aria-pressed", "true");
});
