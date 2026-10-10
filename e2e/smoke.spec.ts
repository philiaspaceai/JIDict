import { test, expect } from "@playwright/test";

test("smoke: home renders search", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("search")).toBeVisible();
  await expect(page.getByLabel("Cari kata")).toBeVisible();
});

test("smoke: tabs reachable", async ({ page }) => {
  for (const url of ["/bookmark", "/history", "/settings"]) {
    await page.goto(url);
    await expect(page).toHaveURL(url);
  }
});

test("smoke: offline page exists", async ({ page }) => {
  await page.goto("/offline");
  await expect(page.getByText("Offline")).toBeVisible();
});
