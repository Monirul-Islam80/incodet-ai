import { faqLd, organizationLd, seoHead } from "@/lib/seo";
import { faq } from "@/content/faq";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import {
  CaseStudiesPreview,
  FactsRow,
  Faq,
  IndustriesStrip,
  PlansPreview,
  Reviews,
  Services,
  WhoWeAre,
} from "@/components/home/HomeSections";
import {
  CallingAgent,
  ClientPortalPreview,
  FloatingProjects,
  WorkCarousel,
} from "@/components/home/HomeExtras";
import { ScrollProcess } from "@/components/home/ScrollProcess";
import { BookingSection } from "@/components/site/BookingSection";

const title = "Incodet | Websites, AI Agents & Custom Software";
const description =
  "Booking websites, 24/7 AI chatbots and calling agents, and custom software for small, growing and established businesses. Pay only for what you use.";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => seoHead(title, description, "/", { scripts: [...organizationLd(), faqLd(faq)] }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <IndustriesStrip />
      <FloatingProjects />
      <WorkCarousel />
      <WhoWeAre />
      <FactsRow />
      <CallingAgent />
      <Services />
      <ScrollProcess />
      <CaseStudiesPreview />
      <ClientPortalPreview />
      <PlansPreview />
      <Reviews />
      <Faq />
      <BookingSection />
    </>
  );
}
