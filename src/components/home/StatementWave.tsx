import { Fragment, useEffect, useRef } from "react";
import { loadScrollMotion } from "@/lib/scroll-motion";
import { PillBadge } from "@/components/site/primitives";

const sentence =
  "Incodet builds websites, AI agents and custom software for businesses of every size. Small businesses get online bookings, growing businesses automate calls and enquiries, and established companies get complete platforms. You pay for the features you need and use.";
const tags = [
  { label: "Never miss a call", cls: "wave-tag-call", rotation: -6 },
  { label: "Book online 24/7", cls: "wave-tag-book", rotation: 5 },
  { label: "Live in 1 to 2 weeks", cls: "wave-tag-live", rotation: -3 },
];

export function StatementWave() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    void loadScrollMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          all: "(min-width: 0px)",
          desktop: "(min-width: 768px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduced } = context.conditions ?? {};
          const el = root.current;
          if (!el) return;
          const words = Array.from(el.querySelectorAll<HTMLElement>("[data-wave-word]"));
          const pills = Array.from(el.querySelectorAll<HTMLElement>("[data-wave-pill]"));
          const label = el.querySelector<HTMLElement>("[data-wave-label]");
          if (reduced) return;
          gsap.set(words, { opacity: 0 });
          gsap.set(pills, { opacity: 0, scale: 0.6 });
          // Desktop: the section pins at "top top", but the words start revealing as soon as
          // the label enters the viewport, so the screen is never empty before the pin.
          const pin = desktop
            ? ScrollTrigger.create({
                id: "statement-wave-pin",
                trigger: el,
                start: "top top",
                end: () => `+=${window.innerHeight * 1.5}`,
                pin: true,
                invalidateOnRefresh: true,
                refreshPriority: 40,
              })
            : undefined;
          const tl = gsap.timeline({
            scrollTrigger: {
              id: "statement-wave",
              trigger: desktop && label ? label : el,
              start: "top 85%",
              end: pin ? () => pin.end : "bottom 40%",
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: 39,
            },
          });
          words.forEach((word, i) => {
            tl.to(word, { opacity: 1, color: "var(--wave-cyan)", duration: 1.5 }, i)
              .to(word, { color: "var(--wave-blue)", duration: 1 }, i + 1.5)
              .to(word, { color: "var(--wave-purple)", duration: 1 }, i + 2.5)
              .to(word, { color: "var(--wave-magenta)", duration: 1 }, i + 3.5)
              .to(word, { color: "var(--wave-ink)", duration: 1.5 }, i + 4.5);
          });
          // Pills sit beside or below the paragraph (never on words) and pop in spread
          // across the wave.
          pills.forEach((pill, i) => {
            const at = Math.round((words.length * (i + 1)) / (pills.length + 1));
            tl.to(
              pill,
              {
                opacity: 1,
                scale: 1.05,
                rotation: (tags[i]?.rotation ?? 0) + 3,
                duration: 1.2,
                ease: "back.out(2)",
              },
              at,
            ).to(pill, { scale: 1, rotation: tags[i]?.rotation ?? 0, duration: 1 }, at + 1.2);
          });
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        },
      );
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);
  return (
    <section ref={root} className="statement-wave bg-background" aria-labelledby="who-title">
      <div className="container-site mx-auto text-center">
        <span data-wave-label className="inline-block">
          <PillBadge>Who we are</PillBadge>
        </span>
        <h2 id="who-title" className="sr-only">
          Who we are
        </h2>
        <div className="wave-layout relative mx-auto mt-8">
          <p className="sr-only">{sentence}</p>
          <p data-wave-paragraph aria-hidden="true" className="wave-paragraph">
            {sentence.split(" ").map((word, i) => (
              <Fragment key={i}>
                <span data-wave-word className="inline-block">
                  {word}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <ul role="list" className="wave-pills">
            {tags.map((tag) => (
              <li data-wave-pill key={tag.label} className={`wave-pill ${tag.cls}`}>
                <span>{tag.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
