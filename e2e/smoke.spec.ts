import { test, expect } from "@playwright/test";
import { mockDictRoutes } from "./helpers/mock-dict";

test.beforeEach(async ({ page }) => {
  await mockDictRoutes(page);
});

test("smoke: home renders search (splash gate terlewati)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("search")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByTestId("splash")).toHaveCount(0);
});

test("smoke: tabs reachable", async ({ page }) => {
  for (const url of ["/bookmark", "/history", "/settings"]) {
    await page.goto(url);
    await expect(page).toHaveURL(url);
  }
});

test("smoke: settings shows frequency options", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("JPDB")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Youtube")).toBeVisible();
});

test("smoke: offline page exists", async ({ page }) => {
  await page.goto("/offline");
  await expect(page.getByText("Offline")).toBeVisible();
});

test("splash hanya saat buka awal, tidak saat pindah tab", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("search")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByTestId("splash")).toHaveCount(0);
  await page.getByRole("link", { name: "Setelan" }).click();
  await expect(page).toHaveURL("/settings");
  await expect(page.getByTestId("splash")).toHaveCount(0);
  await page.getByRole("link", { name: "Cari" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("splash")).toHaveCount(0);
});
