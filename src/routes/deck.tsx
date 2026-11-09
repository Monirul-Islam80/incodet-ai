import { createFileRoute } from "@tanstack/react-router";
import { CompanyDeck } from "@/components/deck/CompanyDeck";
import { seoHead } from "@/lib/seo";
export const Route = createFileRoute("/deck")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(
      "Company Deck | Incodet",
      "Incodet company deck: AI agents, websites and custom software for small, growing and established businesses.",
      "/deck",
    ),
  component: CompanyDeck,
});
