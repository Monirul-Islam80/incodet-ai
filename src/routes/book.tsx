import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageCircle, Phone } from "lucide-react";
import { site } from "@/config/site";
import { pillButton } from "@/components/site/Button";
import { BookingWidget } from "@/components/site/BookingWidget";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero, seoHead } from "@/components/site/PageHero";
import { Reveal, Section, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/book")({
  staticData: { sitemap: true },
  validateSearch: (input: Record<string, unknown>): { plan?: string; service?: string } => ({
    ...(typeof input["plan"] === "string" ? { plan: input["plan"] } : {}),
    ...(typeof input["service"] === "string" ? { service: input["service"] } : {}),
  }),
  head: () =>
    seoHead(
      "Book a Free Call | Incodet",
      "Book a free discovery call with Incodet. We learn your business, your customers and what you need. Free, no commitment.",
      "/book",
    ),
  component: BookPage,
});

const expect = [
  "We learn how your business takes calls and bookings today",
  "We show you how the AI agent and booking website would work for you",
  "You get a clear plan and price, with no obligation",
];

function BookPage() {
  const { plan, service } = Route.useSearch();
  return (
    <>
      <PageHero badge="Free discovery call" title="Book a free call" className="pb-12 md:pb-16">
        We learn your business, your customers and what you need. Free, no commitment.
      </PageHero>

      <section className="bg-bg-soft pb-[72px] md:pb-[120px]">
        <div className="container-site grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal>
            <div className="h-full rounded-card border border-border bg-background p-8 md:p-10">
              <h2 className="type-h3">What to expect</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {expect.map((t) => (
                  <li key={t} className="flex items-start gap-3 type-body text-ink">
                    <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink">
                      <Check aria-hidden className="size-3.5 text-primary-foreground" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-10 border-t border-border pt-8">
                <p className="font-medium text-ink">Prefer to talk now?</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pillButton()}
                  >
                    <MessageCircle aria-hidden className="size-4" /> WhatsApp
                  </a>
                  <a href={site.phoneHref} className={pillButton({ variant: "secondary" })}>
                    <Phone aria-hidden className="size-4" /> {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <BookingWidget plan={plan ?? ""} service={service ?? ""} />
          </Reveal>
        </div>
      </section>

      <Section>
        <SectionHeading title="Prefer to write?" />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <ContactForm sourcePage="book" />
        </Reveal>
      </Section>
    </>
  );
}
