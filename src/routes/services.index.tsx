import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { seoHead } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/primitives";
import { ServiceImage, ServicePlaceholder } from "@/components/site/ServicePanels";
import { TempImage } from "@/components/site/TempImage";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/services/")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(
      "Services | Incodet",
      "Websites, AI agents, apps, product design, custom software, automation and social media growth for your business.",
      "/services",
    ),
  component: ServicesIndex,
});
function ServicesIndex() {
  return (
    <>
      <PageHero title="Our services">
        Websites, AI agents, apps, product design, custom software, automation and social media
        growth for your business.
      </PageHero>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Link
              key={s.id}
              to={s.to}
              data-theme="dark"
              className={cn("group overflow-hidden rounded-card p-6 text-on-dark md:p-8", s.color)}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[28px] leading-tight text-on-dark">{s.title}</h2>
                <ArrowUpRight aria-hidden className="size-6 shrink-0" />
              </div>
              <p className="mt-4 type-small">{s.description}</p>
              <div className="mt-6 aspect-[8/5] overflow-hidden rounded-[12px]">
                {s.images[0] ? (
                  <ServiceImage slug={s.images[0]} />
                ) : s.temp?.hero ? (
                  <TempImage
                    id={s.temp.hero}
                    sizes="(min-width: 768px) 532px, calc(100vw - 80px)"
                  />
                ) : (
                  <ServicePlaceholder className="size-full" />
                )}
              </div>
              <p className="mt-4 type-small">/0{i + 1}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
