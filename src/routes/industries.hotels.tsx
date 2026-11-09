import { faqLd } from "@/lib/seo";
import { faqFor } from "@/content/faq";
import { industryFaq } from "@/content/industries";
import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/site/IndustryPage";
import { seoHead } from "@/components/site/PageHero";
import { getIndustry } from "@/content/industries";

const { page } = getIndustry("hotels");

export const Route = createFileRoute("/industries/hotels")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(page.title, page.description, "/industries/hotels", {
      scripts: [faqLd(faqFor(industryFaq))],
    }),
  component: () => <IndustryPage slug="hotels" />,
});
