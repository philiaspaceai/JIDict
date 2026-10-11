import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Slot dicadangkan untuk /kata/[expression] (mesin 300rb halaman, fase berikut). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/kamus-jepang-indonesia`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/pasang`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
