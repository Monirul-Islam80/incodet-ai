import { useEffect, useRef } from "react";
import { AppWindow, Diamond, Globe, Layers } from "lucide-react";
import { featuredCaseStudies, mockupSm } from "@/content/caseStudies";
import { PillLink } from "./Button";
import { loadScrollMotion } from "@/lib/scroll-motion";

export function FeaturedStudies() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    void loadScrollMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-featured-card]"));
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.fromTo(
            card,
            { scale: 1, filter: "brightness(1)" },
            {
              scale: 0.95,
              filter: "brightness(0.9)",
              ease: "none",
              scrollTrigger: {
                id: `featured-${i}`,
                trigger: next,
                start: "top 65%",
                end: "top 96px",
                scrub: true,
                refreshPriority: 20,
                invalidateOnRefresh: true,
              },
            },
          );
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);
  return (
    <section ref={root} className="section-y bg-bg-soft" aria-labelledby="featured-title">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="featured-title" className="type-h2">
            Featured case studies
          </h2>
          <p className="mt-5 type-body">
            Selected projects where clear planning, careful design and fast delivery helped local
            businesses look and work better online.
          </p>
          <PillLink to="/case-studies" variant="secondary" className="mt-7 shadow-soft">
            <Diamond aria-hidden className="size-4" />
            View all projects
          </PillLink>
        </div>
        <div className="featured-deck mx-auto mt-12 flex max-w-[1100px] flex-col gap-8">
          {featuredCaseStudies.map((c) => {
            const Icon = c.type === "Website" ? Globe : c.type === "Platform" ? Layers : AppWindow;
            const image = c.mockup ?? c.image.src;
            return (
              <article
                data-featured-card
                key={c.slug}
                className="featured-card relative grid gap-7 rounded-card bg-background p-5 shadow-soft md:grid-cols-2 md:items-center md:p-7"
              >
                <div className="flex h-full min-h-[220px] items-center overflow-hidden rounded-card-sm bg-demo-note md:min-h-[370px]">
                  <img
                    src={image}
                    srcSet={c.mockup ? `${mockupSm(c.mockup)} 800w, ${c.mockup} 1600w` : undefined}
                    sizes="(min-width: 768px) 520px, calc(100vw - 72px)"
                    alt={`${c.name} website shown on ${c.laptopOnly ? "a laptop" : "a laptop and phone"}`}
                    loading="lazy"
                    decoding="async"
                    width={1600}
                    height={1000}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <div className="md:py-2">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full text-ink ${c.tint}`}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <h3 className="mt-3 text-[26px] leading-tight font-medium text-ink">{c.name}</h3>
                  <p className="mt-1 type-small text-muted-foreground">{c.category}</p>
                  <p className="mt-3 line-clamp-3 type-body">{c.description}</p>
                  <p className="mt-5 text-[32px] leading-tight font-medium text-ink">{c.period}</p>
                  <p className="mt-1 type-small text-muted-foreground">Delivered</p>
                  <PillLink to={`/case-studies/${c.slug}`} className="mt-5" size="sm">
                    Read Case Study
                  </PillLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
