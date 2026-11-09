import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookingCta } from "@/components/home/HomeSections";
import { CaseStudyGridCard } from "@/components/site/CaseStudyCard";
import { PageHero, seoHead } from "@/components/site/PageHero";
import { Reveal, Section } from "@/components/site/primitives";
import {
  caseStudies,
  caseStudyFilters,
  filterCaseStudies,
  westernCarsInDevelopment,
  westernCarsIntro,
  type CaseStudyFilter,
} from "@/content/caseStudies";
import { cn } from "@/lib/utils";
import { FeaturedStudies } from "@/components/site/FeaturedStudies";

export const Route = createFileRoute("/case-studies/")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(
      "Our Work | Incodet",
      "Websites, AI tools and platforms we have built for taxi companies, local businesses and technology teams.",
      "/case-studies",
    ),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const [filter, setFilter] = useState<CaseStudyFilter>("all");
  const list = filterCaseStudies(caseStudies, filter);
  return (
    <>
      <PageHero title="Our work">Real projects with live links you can open.</PageHero>
      <FeaturedStudies />
      <Section>
        <div role="group" aria-label="Filter case studies" className="flex flex-wrap gap-2">
          {caseStudyFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full border px-5 type-small font-medium transition-colors",
                filter === f.key
                  ? "border-ink bg-ink text-primary-foreground"
                  : "border-border bg-background text-ink hover:bg-bg-soft",
              )}
            >
              {f.label}
              {f.key === "all" && (
                <span className="tabular-nums opacity-70">{caseStudies.length}</span>
              )}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="sr-only">
          Showing {list.length} case studies
        </p>

        {filter === "western-cars" && (
          <div className="mt-8 rounded-card border border-border bg-bg-soft p-6 md:p-8">
            <p className="max-w-3xl type-body text-ink">{westernCarsIntro}</p>
            <p className="mt-3 type-small text-muted-foreground">{westernCarsInDevelopment}</p>
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {list.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 2) * 80}>
              <CaseStudyGridCard c={c} />
            </Reveal>
          ))}
        </div>
      </Section>
      <BookingCta />
    </>
  );
}
