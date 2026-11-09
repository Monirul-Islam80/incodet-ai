import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { BookingCta } from "@/components/home/HomeSections";
import { pillButton } from "@/components/site/Button";
import {
  CaseStudyGridCard,
  CaseStudyImage,
  CaseStudyMeta,
  ExternalPill,
  liveLabel,
} from "@/components/site/CaseStudyCard";
import { seoHead } from "@/components/site/PageHero";
import { breadcrumbLd } from "@/lib/seo";
import { Reveal, Section, SectionHeading } from "@/components/site/primitives";
import { caseStudies, deliverySteps, getCaseStudy } from "@/content/caseStudies";

export const Route = createFileRoute("/case-studies/$slug")({
  staticData: { sitemap: true },
  loader: ({ params }) => {
    const c = getCaseStudy(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) =>
    loaderData
      ? seoHead(
          `${loaderData.name} Case Study | Incodet`,
          loaderData.description,
          `/case-studies/${loaderData.slug}`,
          {
            type: "article",
            scripts: [
              breadcrumbLd([
                { name: "Our work", path: "/case-studies" },
                { name: loaderData.name, path: `/case-studies/${loaderData.slug}` },
              ]),
            ],
          },
        )
      : {
          meta: [
            { title: "Case study not found | Incodet" },
            { name: "robots", content: "noindex" },
          ],
        },
  component: CaseStudyPage,
  notFoundComponent: () => (
    <Section className="pt-40">
      <div className="text-center">
        <h1 className="type-h1">Case study not found</h1>
        <Link to="/case-studies" className={pillButton({ variant: "primary" }) + " mt-8"}>
          Back to our work
        </Link>
      </div>
    </Section>
  ),
  errorComponent: () => (
    <Section className="pt-40">
      <div className="text-center">
        <h1 className="type-h1">Something went wrong</h1>
        <Link to="/case-studies" className={pillButton({ variant: "primary" }) + " mt-8"}>
          Back to our work
        </Link>
      </div>
    </Section>
  ),
});

function CaseStudyPage() {
  const c = Route.useLoaderData();
  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const more = [1, 2, 3]
    .map((k) => caseStudies[(idx + k) % caseStudies.length])
    .filter((x): x is NonNullable<typeof x> => Boolean(x) && x!.slug !== c.slug);
  const steps = deliverySteps(c);
  return (
    <>
      <section className="bg-bg-soft pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 type-small text-muted-foreground">
              <li>
                <Link to="/case-studies" className="hover:text-ink">
                  Our work
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="text-ink">
                {c.name}
              </li>
            </ol>
          </nav>
          <Reveal className="mt-8 max-w-4xl">
            <CaseStudyMeta c={c} />
            <h1 className="mt-4 type-h1">{c.name}</h1>
            {c.title && <p className="mt-4 type-h3">{c.title}</p>}
            <p className="mt-6 max-w-2xl type-body">{c.description}</p>
            {c.liveUrl && (
              <ExternalPill href={c.liveUrl} variant="primary" className="mt-8">
                {liveLabel(c)} <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </ExternalPill>
            )}
          </Reveal>
        </div>
      </section>

      <section className="bg-bg-soft pb-[72px] md:pb-[120px]">
        <div className="container-site">
          <Reveal>
            <CaseStudyImage c={c} eager className="rounded-card border border-border" />
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="type-h2">The challenge</h2>
            <p className="mt-5 type-body">{c.challenge}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="type-h2">What we built</h2>
            <p className="mt-5 type-body">{c.solution}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 type-body text-ink">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint">
                    <Check aria-hidden className="size-3.5 text-mint-ink" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
          {c.tags && c.tags.length > 0 && (
            <Reveal className="md:col-span-2">
              <h2 className="type-h3">Tech used</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border px-4 py-1.5 type-small text-ink"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </Section>

      <Section theme="soft">
        <Reveal className="text-center">
          <p className="type-small font-medium text-muted-foreground">Delivered: {c.period}</p>
          <h2 className="mt-3 type-h2">How we delivered it</h2>
        </Reveal>
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 80}
              className="relative rounded-card border border-border bg-background p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-ink type-small font-medium text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-5 type-h3">{s.title}</h3>
              <p className="mt-3 type-body">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {more.length > 0 && (
        <Section>
          <SectionHeading title="More work" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {more.map((m, i) => (
              <Reveal key={m.slug} delay={i * 80}>
                <CaseStudyGridCard c={m} headingLevel="h3" />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <BookingCta />
    </>
  );
}
