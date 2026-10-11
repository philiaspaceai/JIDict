import { test, expect } from "@playwright/test";
import { mockDictRoutes } from "./helpers/mock-dict";

test.describe("logo sadar-tema", () => {
  test.use({ colorScheme: "dark" });

  test("dark mode memakai aset logo dark", async ({ page }) => {
    await mockDictRoutes(page);
    await page.goto("/");
    await expect(page.getByRole("search")).toBeVisible({ timeout: 60_000 });
    const bg = await page.getByRole("img", { name: "JIDict" }).evaluate((el) =>
      getComputedStyle(el).backgroundImage,
    );
    expect(bg).toContain("app-logo-dark.png");
  });
});

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
  await expect(page.getByText("Philia Space Community", { exact: true })).toBeVisible();
  await expect(page.getByText("CC BY-NC 4.0")).toBeVisible();
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
