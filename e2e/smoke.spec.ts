import { test, expect } from "@playwright/test";

test("smoke: home renders search or onboarding", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("search");
  const onboarding = page.getByRole("button", { name: "Unduh data" });
  await expect(search.or(onboarding)).toBeVisible();
});

test("smoke: tabs reachable", async ({ page }) => {
  for (const url of ["/bookmark", "/history", "/settings"]) {
    await page.goto(url);
    await expect(page).toHaveURL(url);
  }
});

test("smoke: settings shows frequency options", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("JPDB")).toBeVisible();
  await expect(page.getByText("Youtube")).toBeVisible();
});

test("smoke: offline page exists", async ({ page }) => {
  await page.goto("/offline");
  await expect(page.getByText("Offline")).toBeVisible();
});
