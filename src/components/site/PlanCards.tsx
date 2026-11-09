import { Check } from "lucide-react";
import { plans } from "@/content/plans";
import { PillLink } from "./Button";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

export function PlanCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((p, i) => {
        const f = p.featured;
        return (
          <Reveal key={p.id} delay={i * 80}>
            <article
              className={cn(
                "flex h-full flex-col rounded-card p-7 md:p-8",
                f ? "bg-dark text-on-dark-muted shadow-pill" : "border border-border bg-bg-soft",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className={cn("type-h3", f && "text-on-dark")}>{p.name}</h3>
                {f && (
                  <span className="rounded-full bg-mint px-3 py-1 type-small font-medium text-mint-ink">
                    Recommended
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "mt-1 type-small",
                  f ? "text-on-dark-muted" : "text-muted-foreground",
                )}
              >
                {p.audience}
              </p>
              <p
                className={cn(
                  "mt-8 text-[40px] leading-none font-medium tracking-tight",
                  f ? "text-on-dark" : "text-ink",
                )}
              >
                {p.setup}
              </p>
              <p
                className={cn(
                  "mt-2 type-small",
                  f ? "text-on-dark-muted" : "text-muted-foreground",
                )}
              >
                setup
              </p>
              <p className={cn("mt-4 type-small font-medium", f ? "text-on-dark" : "text-ink")}>
                {p.monthly}
              </p>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {p.includes.map((it) => (
                  <li
                    key={it}
                    className={cn(
                      "flex items-start gap-3 text-[16px]",
                      f ? "text-on-dark" : "text-ink",
                    )}
                  >
                    <Check aria-hidden className="mt-1 size-4 shrink-0" /> {it}
                  </li>
                ))}
              </ul>
              <p
                className={cn(
                  "mt-8 type-small",
                  f ? "text-on-dark-muted" : "text-muted-foreground",
                )}
              >
                {p.timeline}
              </p>
              <PillLink
                to="/book"
                search={{ plan: p.id }}
                variant={f ? "primary-inverted" : "primary"}
                className="mt-5 w-full"
              >
                Book a Free Call
              </PillLink>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
