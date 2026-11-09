import { faqLd } from "@/lib/seo";
import { faqFor } from "@/content/faq";
import { industryFaq } from "@/content/industries";
import { createFileRoute } from "@tanstack/react-router";
import { IndustryPage } from "@/components/site/IndustryPage";
import { seoHead } from "@/components/site/PageHero";
import { getIndustry } from "@/content/industries";

const { page } = getIndustry("medical-clinics");

export const Route = createFileRoute("/industries/medical-clinics")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(page.title, page.description, "/industries/medical-clinics", {
      scripts: [faqLd(faqFor(industryFaq))],
    }),
  component: () => <IndustryPage slug="medical-clinics" />,
});
