import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { createDeckSlides } from "./DeckSlides";
import { DECK_STACKED_QUERY, deckIndexFromHash, stackedDeckIndex } from "@/lib/deck-navigation";

const slides = createDeckSlides();
export function CompanyDeck() {
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [stacked, setStacked] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const active = useRef(0);
  const printing = useRef(false);
  const go = useCallback((index: number, scroll = true) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    setCurrent(next);
    active.current = next;
    if (window.location.hash !== `#${next + 1}`)
      window.history.replaceState(window.history.state, "", `#${next + 1}`);
    if (scroll && !printing.current && window.matchMedia(DECK_STACKED_QUERY).matches)
      document.getElementById(`deck-slide-${next + 1}`)?.scrollIntoView({ behavior: "instant" });
  }, []);
  useEffect(() => {
    const readHash = () => go(deckIndexFromHash(window.location.hash, slides.length));
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [go]);
  useEffect(() => {
    const resize = () => {
      if (printing.current) return;
      setStacked(window.matchMedia(DECK_STACKED_QUERY).matches);
      const rect = stage.current?.getBoundingClientRect();
      if (rect) setScale(Math.min(rect.width / 1920, rect.height / 1080));
    };
    resize();
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    if (stage.current) observer.observe(stage.current);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;
      if (
        event.key === " " &&
        (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement)
      )
        return;
      let next: number | undefined;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key))
        next = active.current + 1;
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) next = active.current - 1;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = slides.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        go(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  useEffect(() => {
    if (!stacked || !window.matchMedia(DECK_STACKED_QUERY).matches) return;
    const pages = Array.from(stage.current?.querySelectorAll<HTMLElement>(".deck-page") ?? []);
    let frame = 0;
    const sync = () => {
      if (printing.current || !window.matchMedia(DECK_STACKED_QUERY).matches) return;
      const next = stackedDeckIndex(
        pages.map((page) => page.getBoundingClientRect()),
        Math.max(65, window.innerHeight * 0.2),
      );
      if (next !== undefined && next !== active.current) go(next, false);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    // Apply the requested hash after the stacked DOM layout has committed.
    go(active.current);
    const observer = new IntersectionObserver(schedule, { threshold: [0, 0.2, 0.5] });
    pages.forEach((page) => observer.observe(page));
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
    };
  }, [stacked, go]);
  useEffect(() => {
    const before = () => {
      printing.current = true;
    };
    const after = () => {
      printing.current = false;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  const print = async () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".deck-page img"));
    images.forEach((image) => {
      image.loading = "eager";
    });
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
    window.print();
  };
  return (
    <div className="company-deck" data-theme={slides[current]?.dark ? "dark" : "light"}>
      <header className="deck-chrome">
        <Link to="/" className="deck-wordmark" aria-label={`${site.name} home`}>
          {site.name}
        </Link>
        <div>
          <Button variant="ghost" className="deck-print" onClick={print}>
            <Download aria-hidden />
            Download PDF
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Close deck">
            <Link to="/">
              <X aria-hidden />
            </Link>
          </Button>
        </div>
      </header>
      <div
        ref={stage}
        className="deck-stage"
        style={{ "--deck-scale": scale } as React.CSSProperties}
        onTouchStart={(event) => {
          const point = event.touches[0];
          if (point) touch.current = { x: point.clientX, y: point.clientY };
        }}
        onTouchEnd={(event) => {
          const point = event.changedTouches[0];
          const start = touch.current;
          touch.current = null;
          if (!start || !point) return;
          const x = point.clientX - start.x,
            y = point.clientY - start.y;
          if (Math.abs(x) > 60 && Math.abs(x) > Math.abs(y) * 1.5)
            go(active.current + (x < 0 ? 1 : -1));
        }}
      >
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            id={`deck-slide-${index + 1}`}
            data-slide-index={index}
            data-theme={slide.dark ? "dark" : "light"}
            className={`deck-page ${slide.dark ? "deck-dark" : "deck-light"} ${index === current ? "is-current" : ""}`}
            aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            aria-hidden={!stacked && index !== current}
            inert={!stacked && index !== current ? true : undefined}
          >
            <div className="deck-page-content">{slide.content}</div>
            <div className="deck-page-footer">
              <span>{site.name} / Company Deck</span>
              <span>
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </section>
        ))}
      </div>
      <nav className="deck-controls" aria-label="Slide navigation">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous slide"
          disabled={current === 0}
          onClick={() => go(current - 1)}
        >
          <ChevronLeft aria-hidden />
        </Button>
        <div className="deck-dots">
          {slides.map((slide, index) => (
            <Button
              key={slide.id}
              variant="ghost"
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={index === current ? "step" : undefined}
              onClick={() => go(index)}
              className="deck-dot"
            >
              <span />
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next slide"
          disabled={current === slides.length - 1}
          onClick={() => go(current + 1)}
        >
          <ChevronRight aria-hidden />
        </Button>
      </nav>
      <p className="sr-only" aria-live="polite">
        Slide {current + 1} of {slides.length}: {slides[current]?.title}
      </p>
    </div>
  );
}
