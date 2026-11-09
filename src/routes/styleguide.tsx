import { createFileRoute, notFound } from "@tanstack/react-router";
import { MapPin, Sparkles } from "lucide-react";
import { PillButton } from "@/components/site/Button";
import { Accordion, SegmentedTabs } from "@/components/site/Interactive";
import { Card, PillBadge, Section, SectionHeading } from "@/components/site/primitives";
import { RevealText } from "@/components/site/RevealText";
import { HorizontalScrollCards, StackedPanels } from "@/components/site/ScrollSections";

export const Route = createFileRoute("/styleguide")({
  staticData: { sitemap: false },
  // Internal reference page: available in dev only, a 404 in production builds.
  loader: () => {
    if (import.meta.env.PROD) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Styleguide | Incodet" },
      { name: "description", content: "Internal component reference for the Incodet website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Styleguide | Incodet" },
      { property: "og:description", content: "Internal component reference." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Styleguide,
});

function Label({ children }: { children: string }) {
  return <p className="mb-4 type-small font-medium text-muted-foreground">{children}</p>;
}

function Styleguide() {
  return (
    <>
      <Section className="pt-40">
        <h1 className="type-h1">Styleguide</h1>
        <p className="mt-4 max-w-2xl">Every reusable component in one place.</p>

        <div className="mt-16 grid gap-12">
          <div>
            <Label>Typography</Label>
            <p className="type-h1 text-ink">Heading one</p>
            <p className="type-h2 mt-4 text-ink">Heading two</p>
            <p className="type-h3 mt-4 text-ink">Heading three</p>
            <p className="mt-4">Body text at 18px with a comfortable line height.</p>
            <p className="type-small mt-2 text-muted-foreground">Small label text</p>
          </div>
          <div>
            <Label>Buttons</Label>
            <div className="flex flex-wrap gap-3">
              <PillButton>Primary</PillButton>
              <PillButton variant="secondary">Secondary</PillButton>
              <PillButton size="sm">Small</PillButton>
              <PillButton size="lg">Large</PillButton>
            </div>
          </div>
          <div>
            <Label>Pill badges</Label>
            <div className="flex flex-wrap gap-3">
              <PillBadge icon={<MapPin aria-hidden className="size-4" />}>
                Perth, Western Australia
              </PillBadge>
              <PillBadge>No icon</PillBadge>
              <PillBadge icon={<Sparkles aria-hidden className="size-4" />}>AI agents</PillBadge>
            </div>
          </div>
          <div>
            <Label>Cards</Label>
            <div className="grid gap-5 md:grid-cols-2">
              <Card>
                <h3 className="type-h3">Large card</h3>
                <p className="mt-3">Radius 28px with a soft shadow.</p>
              </Card>
              <Card size="sm">
                <h3 className="text-[20px] font-medium">Small card</h3>
                <p className="mt-2">Radius 16px.</p>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section theme="soft">
        <SectionHeading title="Section heading">
          A centered H2 with a short supporting paragraph underneath.
        </SectionHeading>
        <div className="mx-auto mt-14 max-w-4xl">
          <RevealText text="We build websites and AI agents that answer calls, book jobs and reply to customers, so you can stay focused on the work in front of you." />
          <div className="mt-10">
            <RevealText accent text="Pay for what you use. Nothing more." />
          </div>
        </div>
      </Section>

      <Section theme="dark">
        <SectionHeading title="Dark section">Buttons inverted for dark backgrounds.</SectionHeading>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PillButton variant="primary-inverted">Primary inverted</PillButton>
          <PillButton variant="secondary-inverted">Secondary inverted</PillButton>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Segmented tabs" />
        <SegmentedTabs
          className="mt-10"
          tabs={[
            {
              label: "Discover",
              content: (
                <Card>
                  <p>We learn how your business runs today.</p>
                </Card>
              ),
            },
            {
              label: "Build",
              content: (
                <Card>
                  <p>We build and test your website or agent.</p>
                </Card>
              ),
            },
            {
              label: "Launch",
              content: (
                <Card>
                  <p>We go live and keep improving it.</p>
                </Card>
              ),
            },
          ]}
        />
      </Section>

      <Section theme="soft">
        <SectionHeading title="Accordion" />
        <Accordion
          className="mx-auto mt-10 max-w-3xl"
          items={[
            {
              question: "Do I need to sign a long contract?",
              answer: "No. There are no lock-in contracts.",
            },
            {
              question: "Can the AI agent book appointments?",
              answer: "Yes. It can book straight into your calendar.",
            },
            {
              question: "Do you build custom software?",
              answer: "Yes. We build custom tools and SaaS products.",
            },
          ]}
        />
      </Section>

      <section className="section-y bg-background">
        <div className="container-site mb-12">
          <SectionHeading title="Stacked panels" />
        </div>
        <StackedPanels
          panels={[
            {
              title: "Booking websites",
              body: "Fast sites that turn visitors into bookings.",
              color: "violet",
            },
            {
              title: "AI website chatbots",
              body: "Answers questions and captures leads around the clock.",
              color: "blue",
            },
            {
              title: "24/7 AI phone agents",
              body: "Picks up every call and books the job.",
              color: "orange",
            },
            { title: "Custom software", body: "Tools built around how you work.", color: "teal" },
            { title: "SaaS products", body: "From idea to launched product.", color: "black" },
          ]}
        />
      </section>

      <section className="section-y bg-bg-soft">
        <div className="container-site mb-10">
          <SectionHeading title="Horizontal scroll cards" />
        </div>
        <HorizontalScrollCards>
          {["Roofing", "Epoxy Flooring", "Salons", "Barber Shops", "Custom Software", "SaaS"].map(
            (t) => (
              <Card key={t} className="h-[320px]">
                <h3 className="type-h3">{t}</h3>
                <p className="mt-3">Example card content.</p>
              </Card>
            ),
          )}
        </HorizontalScrollCards>
      </section>
    </>
  );
}
