import { test, expect } from "@playwright/test";

test("landing keyword render H1 + FAQ + demo", async ({ page }) => {
  await page.goto("/kamus-jepang-indonesia");
  await expect(
    page.getByRole("heading", { name: /kamus jepang indonesia offline/i }),
  ).toBeVisible();
  await expect(page.getByText("300.000+").first()).toBeVisible();
  for (const q of ["Apakah JIDict gratis?", "Apakah JIDict bisa dipakai offline?"]) {
    await expect(page.getByText(q, { exact: true })).toBeVisible();
  }
  // Demo mini: tanpa unduh kamus.
  await page.getByLabel("Coba cari kata").fill("makan");
  await expect(page.getByRole("list", { name: "Hasil demo" })).toContainText("食べる");
  // CTA ke aplikasi.
  await expect(page.getByRole("link", { name: "Buka JIDict" }).first()).toBeVisible();
});

test("tentang + pasang render", async ({ page }) => {
  await page.goto("/tentang");
  await expect(page.getByText("Philia Space Community", { exact: true })).toBeVisible();
  await expect(page.getByText("CC BY-NC 4.0")).toBeVisible();
  await page.goto("/pasang");
  await expect(page.getByRole("heading", { name: /cara memasang/i })).toBeVisible();
});

test("robots + sitemap + opensearch tersedia", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const p of ["/kamus-jepang-indonesia", "/tentang", "/pasang"]) {
    expect(xml).toContain(p);
  }
  const osd = await request.get("/opensearch.xml");
  expect(osd.ok()).toBe(true);
  expect(await osd.text()).toContain("JIDict");
});
