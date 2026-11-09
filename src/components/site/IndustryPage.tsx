import { Bell, CalendarCheck, Check, Phone, Bot, TriangleAlert, ArrowRight } from "lucide-react";
import { getCaseStudy } from "@/content/caseStudies";
import { faqFor } from "@/content/faq";
import { getIndustry, industryFaq, industryWhatYouGet } from "@/content/industries";
import { BookingCta } from "@/components/home/HomeSections";
import { PillLink } from "./Button";
import { CaseStudyWideCard } from "./CaseStudyCard";
import { Accordion } from "./Interactive";
import { PageHero } from "./PageHero";
import { Card, Reveal, Section, SectionHeading } from "./primitives";

export function TranscriptCard({
  caller,
  ai,
  alert,
}: {
  caller: string;
  ai: string;
  alert: string;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-card border border-border bg-background p-5 shadow-soft md:p-8">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-bg-soft">
          <Phone aria-hidden className="size-4 text-ink" />
        </span>
        <p className="type-small font-medium text-ink">Incoming call</p>
      </div>
      <ol className="mt-6 flex flex-col gap-4" aria-label="Call transcript">
        <li className="max-w-[85%]">
          <p className="type-small text-muted-foreground">Caller</p>
          <p className="mt-1 rounded-card-sm rounded-tl-md bg-bg-soft px-4 py-3 text-[16px] text-ink">
            {caller}
          </p>
        </li>
        <li className="ml-auto max-w-[85%] text-right">
          <p className="inline-flex items-center gap-1 type-small text-muted-foreground">
            <Bot aria-hidden className="size-3.5" /> AI agent
          </p>
          <p className="mt-1 rounded-card-sm rounded-tr-md bg-ink px-4 py-3 text-left text-[16px] text-primary-foreground">
            {ai}
          </p>
        </li>
      </ol>
      <div className="mt-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-1.5 type-small font-medium text-mint-ink">
          <CalendarCheck aria-hidden className="size-4" /> Appointment booked
        </span>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-card-sm border border-border bg-bg-soft p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background">
          <Bell aria-hidden className="size-4 text-ink" />
        </span>
        <div>
          <p className="type-small font-medium text-ink">Owner alert</p>
          <p className="mt-0.5 type-small text-body">{alert}</p>
        </div>
      </div>
    </div>
  );
}

export function IndustryPage({ slug }: { slug: string }) {
  const ind = getIndustry(slug);
  const p = ind.page;
  const related = p.relatedWork ? getCaseStudy(p.relatedWork) : undefined;
  return (
    <>
      <PageHero
        badge={ind.name}
        title={p.h1}
        actions={
          <>
            <PillLink to="/book" size="lg">
              Book a Free Call
            </PillLink>
            <PillLink to="/pricing" variant="secondary" size="lg">
              See Plans
            </PillLink>
          </>
        }
      >
        {p.intro}
      </PageHero>

      <Section>
        <SectionHeading title="Sound familiar?" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {p.pains.map((pain, i) => (
            <Reveal as="li" key={pain.title} delay={i * 80}>
              <Card className="h-full">
                <TriangleAlert aria-hidden className="size-6 text-ink" strokeWidth={1.5} />
                <h3 className="mt-5 type-h3">{pain.title}</h3>
                <p className="mt-3 type-body">{pain.body}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section theme="soft">
        <SectionHeading title="How the AI agent handles it" />
        <Reveal className="mt-12">
          <TranscriptCard {...p.transcript} />
          {p.note && (
            <p className="mx-auto mt-5 max-w-2xl text-center type-small text-muted-foreground">
              {p.note}
            </p>
          )}
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <h2 className="type-h2">What you get</h2>
            <ul className="mt-8 flex flex-col gap-4">
              {industryWhatYouGet.map((it) => (
                <li key={it} className="flex items-start gap-3 type-body text-ink">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint">
                    <Check aria-hidden className="size-3.5 text-mint-ink" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div
              data-theme="dark"
              className="rounded-card bg-dark p-7 text-on-dark-muted shadow-pill md:p-10"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="type-h3 text-on-dark">Growth plan</h3>
                <span className="rounded-full bg-mint px-3 py-1 type-small font-medium text-mint-ink">
                  Recommended
                </span>
              </div>
              <p className="mt-6 type-body text-on-dark">
                from $999 setup, from $149/month, includes 300 AI call minutes
              </p>
              <PillLink to="/pricing" variant="primary-inverted" className="mt-8">
                See all plans <ArrowRight aria-hidden className="size-4" />
              </PillLink>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section theme="soft">
        <SectionHeading title="Questions, answered" />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <Accordion items={faqFor(industryFaq)} />
        </Reveal>
      </Section>

      {related && (
        <Section>
          <SectionHeading title="Related work" />
          <Reveal className="mt-12">
            <CaseStudyWideCard c={related} />
          </Reveal>
        </Section>
      )}

      <BookingCta />
    </>
  );
}
