import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeftRight,
  CalendarDays,
  Layers,
  Hammer,
  Rocket,
  Globe,
  LayoutDashboard,
  Workflow,
  Smartphone,
  MessageCircle,
  Palette,
  Bell,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import type { Service } from "@/content/services";
import { getCaseStudy, type CaseStudy } from "@/content/caseStudies";
import { faqLd, seoHead } from "@/lib/seo";
import { PillButton, PillLink } from "./Button";
import { ServiceImage, ServicePlaceholder } from "./ServicePanels";
import { TempImage } from "./TempImage";
import type { TempImageId } from "@/content/tempImages";
import { Section, SectionHeading, Card } from "./primitives";
import { Accordion } from "./Interactive";
import { CaseStudyGridCard } from "./CaseStudyCard";
import { BookingCta } from "@/components/home/HomeSections";
import { ContactForm } from "./ContactForm";
import { cn } from "@/lib/utils";

const icons: LucideIcon[] = [Globe, CalendarDays, LayoutDashboard, Search, Palette, ShieldCheck];
const tagIcons: LucideIcon[] = [Layers, Smartphone, MessageCircle, Bell, Workflow, Globe];
const process = [
  {
    title: "Discovery Call",
    body: "We learn your business, your customers and what you need. Free, no commitment.",
    icon: CalendarDays,
  },
  {
    title: "Plan & Design",
    body: "We map the features, design the screens and agree on scope before building.",
    icon: Layers,
  },
  {
    title: "Build & Integrate",
    body: "We build, connect your tools and show you progress every week.",
    icon: Hammer,
  },
  {
    title: "Launch & Support",
    body: "We go live, test everything and stay on to support and improve it.",
    icon: Rocket,
  },
];
export const serviceHead = (service: Service) =>
  seoHead(`${service.title} | Incodet`, service.description, service.to, {
    scripts: [faqLd(service.faq)],
  });

const comparisonSizes = "(min-width: 1280px) 1216px, calc(100vw - 32px)";

export function BeforeAfter({
  before,
  after: afterImage,
}: {
  before?: TempImageId | undefined;
  after?: TempImageId | undefined;
}) {
  const [after, setAfter] = useState(false);
  return (
    <div className="service-comparison">
      {before ? (
        <div aria-hidden={after} className="absolute inset-0">
          <TempImage id={before} sizes={comparisonSizes} />
        </div>
      ) : (
        <div
          aria-hidden={after}
          className="absolute inset-0 flex items-end justify-center pb-14 type-body text-ink"
          data-placeholder="true"
        >
          Before image coming soon
        </div>
      )}
      {afterImage ? (
        <div aria-hidden={!after} className={cn("service-comparison-after", after && "is-after")}>
          {/* Eager: this layer is clipped until toggled, so lazy loading would never start it. */}
          <TempImage id={afterImage} sizes={comparisonSizes} eager />
        </div>
      ) : (
        <div
          aria-hidden={!after}
          data-placeholder="true"
          className={cn(
            "service-comparison-after flex items-end justify-center pb-14 type-body text-ink",
            after && "is-after",
          )}
        >
          After image coming soon
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <PillButton
          variant="secondary"
          aria-label="Show after image"
          aria-pressed={after}
          onClick={() => setAfter((v) => !v)}
          className="pointer-events-auto size-20 p-0 shadow-soft"
          title={after ? "Show before image" : "Show after image"}
        >
          <ArrowLeftRight aria-hidden className="size-7" />
        </PillButton>
      </div>
      <p aria-live="polite" className="sr-only">
        {after
          ? afterImage
            ? "Showing after"
            : "After image coming soon"
          : before
            ? "Showing before"
            : "Before image coming soon"}
      </p>
    </div>
  );
}
export function ServicePage({ service: s }: { service: Service }) {
  const related = s.related.map(getCaseStudy).filter((c): c is CaseStudy => Boolean(c));
  return (
    <>
      <section className="bg-hero-sky pt-14 pb-14 md:pt-20 md:pb-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="type-small text-muted-foreground">Services</p>
            <h1 className="mt-5 text-[40px] leading-[1.12] text-ink md:text-[52px]">
              {s.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl type-body">{s.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <PillLink to="/book" search={{ service: s.id }}>
                Book a Call
              </PillLink>
              <Link
                to="/case-studies"
                className="inline-flex items-center gap-2 text-ink underline underline-offset-4"
              >
                View our work <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
          <div className={cn("aspect-[8/5] overflow-hidden rounded-card", s.color)}>
            {s.images[0] ? (
              <ServiceImage slug={s.images[0]} eager />
            ) : s.temp?.hero ? (
              <TempImage
                id={s.temp.hero}
                eager
                sizes="(min-width: 1280px) 580px, (min-width: 1024px) 45vw, calc(100vw - 32px)"
              />
            ) : (
              <ServicePlaceholder className="size-full" />
            )}
          </div>
        </div>
      </section>
      <div className="container-site py-8">
        <ul className="flex flex-wrap gap-3">
          {s.tags.map((tag, i) => {
            const Icon = tagIcons[i % tagIcons.length] ?? Globe;
            return (
              <li
                key={tag}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 type-small text-ink"
              >
                <Icon aria-hidden className="size-4" />
                {tag}
              </li>
            );
          })}
        </ul>
      </div>
      <Section>
        <SectionHeading title={s.id === "software" ? "What we build" : "What we do"} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.features.map((f, i) => {
            const Icon = icons[i % icons.length] ?? Globe;
            return (
              <Card key={f.title}>
                <Icon aria-hidden className="size-7 text-ink" strokeWidth={1.5} />
                <h3 className="mt-6 text-[24px] text-ink">{f.title}</h3>
                <p className="mt-3 type-body">{f.body}</p>
              </Card>
            );
          })}
        </div>
      </Section>
      {s.comparison && (
        <Section theme="soft">
          <SectionHeading title="Before / After" />
          <div className="mt-10">
            <BeforeAfter before={s.temp?.before} after={s.temp?.after} />
          </div>
        </Section>
      )}
      {related.length > 0 && (
        <Section>
          <SectionHeading title="Related work" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CaseStudyGridCard key={c.slug} c={c} headingLevel="h3" />
            ))}
          </div>
        </Section>
      )}
      <Section theme="soft">
        <SectionHeading title="How we work" />
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.title} className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <Icon aria-hidden className="size-6 text-ink" />
                  <span className="type-small text-muted-foreground">/0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-[22px] text-ink">{p.title}</h3>
                <p className="mt-3 type-small">{p.body}</p>
              </li>
            );
          })}
        </ol>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="type-h2">Questions, answered</h2>
          <Accordion items={s.faq} />
        </div>
      </Section>
      {s.id === "software" && (
        <>
          <Section theme="soft">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <p className="max-w-xl text-[20px] font-medium text-ink">
                Custom platforms usually start on our Scale plan: from $3,499 setup, from
                $299/month, live in 4 to 8 weeks.
              </p>
              <PillLink to="/pricing" variant="secondary">
                See pricing <ArrowRight aria-hidden className="size-4" />
              </PillLink>
            </div>
          </Section>
          <Section>
            <SectionHeading title="Tell us what you need" />
            <div className="mx-auto mt-10 max-w-3xl">
              <ContactForm sourcePage="custom-software" />
            </div>
          </Section>
        </>
      )}
      <BookingCta service={s.id} />
    </>
  );
}
