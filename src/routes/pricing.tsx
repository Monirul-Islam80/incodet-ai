import { faqLd } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { BookingCta } from "@/components/home/HomeSections";
import { PillLink } from "@/components/site/Button";
import { Accordion } from "@/components/site/Interactive";
import { PageHero, seoHead } from "@/components/site/PageHero";
import { PlanCards } from "@/components/site/PlanCards";
import { Card, Reveal, Section, SectionHeading } from "@/components/site/primitives";
import { faqFor } from "@/content/faq";
import { plans } from "@/content/plans";
import { cn } from "@/lib/utils";

const pricingFaq = [
  "What does each plan include?",
  "What does pay for what you use mean?",
  "How long does it take?",
  "Is there a contract?",
  "How can I pay?",
];

export const Route = createFileRoute("/pricing")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(
      "Pricing | Incodet",
      "Three simple plans for booking websites, AI chatbots and 24/7 AI calling agents. One-time setup, a simple monthly fee and no lock-in contracts.",
      "/pricing",
      { scripts: [faqLd(faqFor(pricingFaq))] },
    ),
  component: PricingPage,
});

type Cell = boolean | string;
const planById = (id: string) => plans.find((p) => p.id === id);
const val = (id: string, k: "setup" | "monthly" | "timeline") => planById(id)?.[k] ?? "";

// Columns: Starter, Growth, Scale
const rows: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: "Website", cells: [true, true, true] },
  { label: "Online booking", cells: [true, true, true] },
  { label: "Booking emails", cells: [true, true, true] },
  { label: "AI website chatbot", cells: [false, true, true] },
  { label: "24/7 AI calling agent", cells: [false, true, true] },
  { label: "Owner alerts by email and WhatsApp", cells: [false, true, true] },
  { label: "AI call minutes included", cells: ["Not included", "300 per month", "Custom"] },
  { label: "Multi-page or SaaS-level platform", cells: [false, false, true] },
  { label: "AI automation", cells: [false, false, true] },
  { label: "Client dashboards", cells: [false, false, true] },
  { label: "Custom integrations", cells: [false, false, true] },
  {
    label: "Setup",
    cells: [val("starter", "setup"), val("growth", "setup"), val("scale", "setup")],
  },
  {
    label: "Monthly",
    cells: [val("starter", "monthly"), val("growth", "monthly"), val("scale", "monthly")],
  },
  {
    label: "Timeline",
    cells: [val("starter", "timeline"), val("growth", "timeline"), val("scale", "timeline")],
  },
];
const cols = ["Starter", "Growth", "Scale"];

function CellValue({ v }: { v: Cell }) {
  if (typeof v === "string") return <span className="type-small text-ink">{v}</span>;
  return v ? (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-mint">
      <Check aria-hidden className="size-3.5 text-mint-ink" />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="inline-flex size-6 items-center justify-center">
      <Minus aria-hidden className="size-4 text-muted-foreground" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

const single = ["AI website chatbot", "24/7 AI calling agent", "Booking website"];

function PricingPage() {
  return (
    <>
      <PageHero badge="Pricing" title="Pay for what you use. Nothing more.">
        Three plans with a one-time setup fee and a simple monthly fee. All prices in USD. No
        lock-in contracts.
      </PageHero>

      <Section>
        <PlanCards />
      </Section>

      <Section theme="soft">
        <SectionHeading title="Compare plans" />
        <Reveal className="mt-12">
          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-card border border-border bg-background md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Plan comparison</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="p-5 type-small font-medium text-muted-foreground">
                    Feature
                  </th>
                  {cols.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className={cn(
                        "p-5 text-center text-[18px] font-medium text-ink",
                        c === "Growth" && "bg-bg-soft",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-border last:border-0">
                    <th scope="row" className="p-5 text-[16px] font-normal text-ink">
                      {r.label}
                    </th>
                    {r.cells.map((v, i) => (
                      <td key={i} className={cn("p-5 text-center", i === 1 && "bg-bg-soft")}>
                        <CellValue v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile stacked cards */}
          <div className="flex flex-col gap-5 md:hidden">
            {cols.map((c, ci) => (
              <div key={c} className="rounded-card border border-border bg-background p-6">
                <h3 className="type-h3">{c}</h3>
                <dl className="mt-4 divide-y divide-border">
                  {rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-[15px] text-ink">{r.label}</dt>
                      <dd className="max-w-[55%] text-right">
                        <CellValue v={r.cells[ci] ?? false} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading title="Need just one feature?">
          Every feature is also available on its own.
        </SectionHeading>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {single.map((s, i) => (
            <Reveal as="li" key={s} delay={i * 80}>
              <Card size="sm" className="flex h-full flex-col items-start justify-between gap-6">
                <h3 className="type-h3">{s}</h3>
                <PillLink to="/book" variant="secondary" size="sm">
                  Ask for a quote
                </PillLink>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section theme="soft">
        <SectionHeading title="Extra call minutes">
          Growth includes 300 AI call minutes a month. Extra minutes cost $0.20 each, billed only if
          you use them.
        </SectionHeading>
      </Section>

      <Section>
        <SectionHeading title="Questions, answered" />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <Accordion items={faqFor(pricingFaq)} />
        </Reveal>
      </Section>

      <BookingCta />
    </>
  );
}
