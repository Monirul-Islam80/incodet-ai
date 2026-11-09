import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Review } from "@/content/reviews";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

const arrowClass =
  "flex size-12 items-center justify-center rounded-full border border-border bg-background text-ink transition-colors hover:bg-bg-soft disabled:pointer-events-none disabled:opacity-40";

/** Scroll-snap carousel: arrows move one card, swipe works natively, arrow keys work on the track. */
export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setAtStart(t.scrollLeft <= 1);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    update();
    t.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      t.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const move = (dir: -1 | 1) => {
    const t = track.current;
    const card = t?.querySelector("li");
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    t.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduced ? "auto" : "smooth" });
  };

  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    }
  };

  return (
    <div className="mt-12">
      <ul
        ref={track}
        role="list"
        aria-label="Client reviews"
        tabIndex={0}
        onKeyDown={onKey}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:mx-0 md:scroll-px-0 md:px-0"
      >
        {reviews.map((r, i) => (
          <li
            key={`${r.name}-${r.business}-${i}`}
            className="flex w-[85%] shrink-0 snap-start flex-col rounded-card bg-background p-6 shadow-soft sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] md:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <span role="img" aria-label={`${r.rating} out of 5 stars`} className="flex gap-1">
                {Array.from({ length: 5 }, (_, s) => (
                  <Star
                    key={s}
                    aria-hidden
                    className={cn(
                      "size-4",
                      s < r.rating ? "fill-ink text-ink" : "text-muted-foreground",
                    )}
                  />
                ))}
              </span>
              {r.sample && (
                <span className="rounded-full bg-muted px-3 py-1 type-small font-medium text-ink">
                  Sample review
                </span>
              )}
            </div>
            <blockquote className="mt-5 flex-1 type-body text-ink">{r.quote}</blockquote>
            <p className="mt-6 font-medium text-ink">{r.name}</p>
            <p className="type-small text-muted-foreground">
              {r.business}, {r.city}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={atStart}
          aria-label="Previous review"
          className={arrowClass}
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={atEnd}
          aria-label="Next review"
          className={arrowClass}
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
