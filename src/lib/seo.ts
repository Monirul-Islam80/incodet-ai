import { site } from "@/config/site";
import type { FaqItem } from "@/content/faq";

// PNG is the share image: page head tags keep one og:image, and some platforms skip WebP previews.
export const ogImage = {
  webp: `${site.siteUrl}/og/incodet-og.webp`,
  png: `${site.siteUrl}/og/incodet-og.png`,
  alt: "Incodet: Websites, AI Agents & Software That Grow With Your Business",
};

type Script = { type: string; children: string };

export const jsonLd = (data: unknown): Script => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

/** Per-page head: title, description, canonical, Open Graph and Twitter tags. */
export function seoHead(
  title: string,
  description: string,
  path: string,
  opts: { type?: string; scripts?: Script[] } = {},
) {
  const url = `${site.siteUrl}${path === "/" ? "" : path}` || site.siteUrl;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: site.name },
      { property: "og:image", content: ogImage.png },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: ogImage.alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage.png },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: opts.scripts ?? [],
  };
}

export const faqLd = (items: FaqItem[]) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });

export const breadcrumbLd = (items: { name: string; path: string }[]) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.siteUrl}${it.path}`,
    })),
  });

export function organizationLd() {
  const sameAs = Object.values(site.socials).filter(Boolean);
  const address = {
    "@type": "PostalAddress",
    streetAddress: "Camberwarra Drive",
    addressLocality: "Craigie",
    addressRegion: "WA",
    postalCode: "6025",
    addressCountry: "AU",
  };
  const areaServed = [
    "Australia",
    "United Kingdom",
    "Canada",
    "United States",
    "Europe",
    "Bangladesh",
  ].map((name) => ({ "@type": "Place", name }));
  const base = {
    name: site.name,
    url: site.siteUrl,
    email: site.email,
    telephone: "+61451526342",
    address,
    areaServed,
    ...(sameAs.length ? { sameAs } : {}),
  };
  return [
    jsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${site.siteUrl}/#organization`,
      logo: `${site.siteUrl}/apple-touch-icon.png`,
      ...base,
    }),
    jsonLd({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${site.siteUrl}/#localbusiness`,
      image: ogImage.png,
      ...base,
    }),
  ];
}
