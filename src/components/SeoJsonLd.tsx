import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Faq } from "@/app/kamus-jepang-indonesia/faq";

/** Structured data: Organization, WebSite(+SearchAction), SoftwareApplication, FAQPage. */
export function SeoJsonLd({ faq }: { faq?: Faq[] }) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Philia Space Community",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/community-logo.png`,
      },
      sameAs: [
        "https://github.com/philiaspaceai/JIDict",
        "https://github.com/philiaspaceai/JIDict-yomitan",
        "https://github.com/yomidevs/yomitan",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: `${SITE_NAME} — Kamus Jepang-Indonesia`,
      url: SITE_URL,
      inLanguage: "id",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      operatingSystem: ["Android", "iOS", "Windows", "macOS", "Linux"],
      applicationCategory: "EducationalApplication",
      description:
        "Kamus Jepang–Indonesia offline: 300.000+ entri, pitch accent, frekuensi JPDB & Youtube, JLPT N5–N1.",
      url: SITE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ];
  if (faq && faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
