import { useEffect, useRef, useState } from "react";
import { Hammer, Layers, Phone, Rocket } from "lucide-react";
import { processSteps } from "@/content/process";
import { PillButton, PillLink } from "@/components/site/Button";
import { SectionHeading } from "@/components/site/primitives";
import { loadScrollMotion } from "@/lib/scroll-motion";
import { cn } from "@/lib/utils";

const icons = { hammer: Hammer, layers: Layers, phone: Phone, rocket: Rocket };
function ProcessCard({
  index,
  active,
  mobile = false,
}: {
  index: number;
  active: boolean;
  mobile?: boolean;
}) {
  const step = processSteps[index];
  if (!step) return null;
  const Icon = icons[step.icon];
  return (
    <article
      role={mobile ? undefined : "tabpanel"}
      id={mobile ? undefined : `process-panel-${index}`}
      aria-labelledby={mobile ? undefined : `process-tab-${index}`}
      aria-hidden={!active || undefined}
      inert={!active}
      data-process-card={index}
      className={cn(
        "process-card grid gap-6 rounded-card bg-background p-6 md:grid-cols-2 md:items-center md:p-8",
        !mobile && "col-start-1 row-start-1",
        !active && "invisible",
      )}
    >
      <div data-process-copy>
        <span className="flex size-12 items-center justify-center rounded-full bg-bg-soft">
          <Icon aria-hidden className="size-6 text-ink" strokeWidth={1.5} />
        </span>
        <h3 className="mt-5 type-h3">{step.title}</h3>
        <p className="mt-3 type-body">{step.body}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {step.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-border bg-bg-soft px-3 py-1.5 type-small text-ink"
            >
              {chip}
            </li>
          ))}
        </ul>
        <PillLink to="/book" className="mt-7">
          Book a Free Call
        </PillLink>
      </div>
      <div className={`process-cluster process-tint-${index}`} aria-hidden="true">
        {step.images.map((image, i) => (
          <div className={`process-image process-image-${i}`} key={image} data-process-image>
            <img
              src={`/images/process/${image}.webp`}
              alt=""
              loading="lazy"
              decoding="async"
              width={512}
              height={809}
              className="h-auto w-full rounded-card-sm"
            />
          </div>
        ))}
      </div>
    </article>
  );
}

export function ScrollProcess() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const scrollToStep = useRef<((i: number) => void) | undefined>(undefined);
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
          if (!desktop || !panel.current) return;
          const el = panel.current;
          const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-process-card]"));
          const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-process-bg]"));
          const select = (i: number) => {
            if (activeRef.current === i) return;
            const prev = cards[activeRef.current];
            const next = cards[i];
            activeRef.current = i;
            setActive(i);
            if (!next) return;
            gsap.killTweensOf([...cards, ...layers]);
            gsap.to(layers, {
              opacity: (j: number) => (j === i ? 1 : 0),
              duration: reduced ? 0 : 0.55,
            });
            if (prev) gsap.to(prev, { opacity: 0, duration: reduced ? 0 : 0.2 });
            gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.4 });
            if (!reduced) {
              gsap.fromTo(
                next.querySelector("[data-process-copy]"),
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4 },
              );
              gsap.fromTo(
                next.querySelectorAll("[data-process-image]"),
                { opacity: 0, y: 24, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.55, ease: "power2.out" },
              );
            }
          };
          gsap.set(cards, { opacity: (i: number) => (i === activeRef.current ? 1 : 0) });
          gsap.set(layers, { opacity: (i: number) => (i === activeRef.current ? 1 : 0) });
          if (reduced) {
            scrollToStep.current = select;
            return;
          }
          const trigger = ScrollTrigger.create({
            id: "process-steps",
            trigger: root.current,
            start: "top top",
            end: () => `+=${(window.innerHeight * 4) / 3}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            refreshPriority: 30,
            onUpdate: (self) => select(Math.min(3, Math.floor(self.progress * 4))),
          });
          scrollToStep.current = (i) => {
            select(i);
            window.scrollTo({
              top: trigger.start + ((trigger.end - trigger.start) * (i + 0.1)) / 4,
              behavior: "instant",
            });
          };
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        },
      );
      revert = () => {
        mm.revert();
        scrollToStep.current = undefined;
      };
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);
  const choose = (i: number, focus = false) => {
    if (scrollToStep.current) scrollToStep.current(i);
    else {
      activeRef.current = i;
      setActive(i);
    }
    if (focus) root.current?.querySelector<HTMLElement>(`#process-tab-${i}`)?.focus();
  };
  return (
    <section
      ref={root}
      className="scroll-process section-y relative bg-background"
      aria-label="How it works"
    >
      <div className="container-site">
        <SectionHeading title="How it works">
          A simple process, from first call to launch.
        </SectionHeading>
        <div
          ref={panel}
          className="process-panel relative mt-12 hidden overflow-hidden rounded-card p-5 md:block md:p-6"
        >
          {processSteps.map((_, i) => (
            <div
              key={i}
              data-process-bg
              className={`process-gradient-${i} pointer-events-none absolute inset-0`}
            />
          ))}
          <div
            role="tablist"
            aria-label="Project steps"
            className="relative z-10 mb-5 flex flex-wrap justify-center gap-2"
          >
            {processSteps.map((step, i) => (
              <PillButton
                key={step.title}
                id={`process-tab-${i}`}
                role="tab"
                aria-selected={active === i}
                aria-controls={`process-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                size="sm"
                variant={active === i ? "primary" : "secondary"}
                onClick={() => choose(i)}
                onKeyDown={(e) => {
                  let next = i;
                  if (e.key === "ArrowRight") next = (i + 1) % 4;
                  else if (e.key === "ArrowLeft") next = (i + 3) % 4;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = 3;
                  else return;
                  e.preventDefault();
                  choose(next, true);
                }}
              >
                {step.title}
              </PillButton>
            ))}
          </div>
          <div className="relative z-10 grid">
            {processSteps.map((step, i) => (
              <ProcessCard key={step.title} index={i} active={active === i} />
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:hidden">
          {processSteps.map((step, i) => (
            <div key={step.title} className={`process-gradient-${i} rounded-card p-3`}>
              <ProcessCard index={i} active mobile />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
