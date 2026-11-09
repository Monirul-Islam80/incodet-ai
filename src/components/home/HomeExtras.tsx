import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  CircleDot,
  Phone,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { loadScrollMotion } from "@/lib/scroll-motion";
import { showcase } from "@/content/caseStudies";
import { PillLink } from "@/components/site/Button";
import { PillBadge, Reveal } from "@/components/site/primitives";
import { SocialRow } from "@/components/site/SocialIcon";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";
import { CalendarUI, CallCardUI, ChatUI, NotificationUI } from "./MiniUI";

/* ------------------------------------------------------------------ */
/* Floating projects                                                   */
/* ------------------------------------------------------------------ */

type Tile = {
  src: string;
  w: number;
  h: number;
  left: string;
  top: string;
  speed: number;
  framed?: boolean;
};
// Resized copies in public/images/burst at 1x and 2x of each tile width ("<base>-<width>.webp").
const shot = (s: string) => `/images/burst/case-studies-${s}`;
const phone = (s: string) => `/images/burst/mobile-${s}`;
const mock = (s: string) => `/images/burst/mockups-${s}`;

// Desktop layout: a loose cloud left and right of the centered text.
const tiles: Tile[] = [
  {
    src: shot("western-cars-brighton"),
    w: 280,
    h: 175,
    left: "2%",
    top: "8%",
    speed: 1.15,
    framed: true,
  },
  { src: phone("bloom-studio"), w: 140, h: 303, left: "20%", top: "0%", speed: 0.9 },
  { src: mock("humandata-labs"), w: 250, h: 156, left: "0%", top: "40%", speed: 1.25 },
  {
    src: phone("gm-taxis-lewes"),
    w: 150,
    h: 325,
    left: "15%",
    top: "58%",
    speed: 0.85,
    framed: true,
  },
  { src: shot("brhex-studio"), w: 220, h: 138, left: "30%", top: "88%", speed: 1.05 },
  {
    src: shot("barkers-executive"),
    w: 180,
    h: 113,
    left: "1%",
    top: "84%",
    speed: 1.2,
    framed: true,
  },
  { src: phone("western-cars-littlehampton"), w: 140, h: 303, left: "68%", top: "0%", speed: 1.2 },
  {
    src: mock("a1-airport-cars"),
    w: 270,
    h: 169,
    left: "77%",
    top: "9%",
    speed: 0.9,
    framed: true,
  },
  { src: shot("gm-taxis-lewes"), w: 250, h: 156, left: "79%", top: "42%", speed: 1.1 },
  {
    src: phone("barkers-executive"),
    w: 150,
    h: 325,
    left: "75%",
    top: "62%",
    speed: 0.85,
    framed: true,
  },
  { src: mock("bloom-studio"), w: 180, h: 113, left: "86%", top: "86%", speed: 1.25 },
  { src: phone("a1-airport-cars"), w: 150, h: 325, left: "60%", top: "88%", speed: 1 },
];
// Static 4-column grid (phones and reduced motion): each tile is about a quarter of the width.
const staticSizes = "(min-width: 1280px) 290px, 23vw";
const mobileTiles = [
  tiles[1],
  tiles[0],
  tiles[6],
  tiles[7],
  tiles[3],
  tiles[8],
  tiles[9],
  tiles[10],
];

function TileImg({
  t,
  className,
  style,
  sizes = `${t.w}px`,
}: {
  t: Tile;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] shadow-soft",
        t.framed ? "bg-background p-1.5" : "bg-bg-soft",
        className,
      )}
      style={style}
    >
      <img
        src={`${t.src}-${t.w}.webp`}
        srcSet={`${t.src}-${t.w}.webp ${t.w}w, ${t.src}-${t.w * 2}.webp ${t.w * 2}w`}
        sizes={sizes}
        alt=""
        loading="lazy"
        decoding="async"
        width={t.w}
        height={t.h}
        className={cn("size-full object-cover object-top", t.framed ? "rounded-[9px]" : "")}
      />
    </div>
  );
}

export function FloatingProjects() {
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px)");
  const ref = useRef<HTMLElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animated = desktop && !reduced;
  useEffect(() => {
    if (!animated) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void loadScrollMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = ref.current;
        if (!el) return;
        const tileEls = tileRefs.current.filter((t): t is HTMLDivElement => Boolean(t));
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "floating-burst",
            trigger: el,
            start: "top top",
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            // Pinned and scrubbed triggers refresh in page order (higher first).
            refreshPriority: 50,
            // Promote tiles to their own layers only while the section animates.
            onToggle: (self) =>
              gsap.set(tileEls, { willChange: self.isActive ? "transform" : "auto" }),
          },
        });
        // Only transform and opacity animate. Scale stays near 1 so layers stay sharp.
        tileRefs.current.forEach((tile, i) => {
          if (!tile) return;
          const angle = (i / tiles.length) * Math.PI * 2 - Math.PI / 2;
          const dx = () => Math.cos(angle) * window.innerWidth * (0.38 + (i % 3) * 0.08);
          const dy = () => Math.sin(angle) * window.innerHeight * (0.4 + (i % 2) * 0.1);
          const at = i * 0.012;
          tl.fromTo(
            tile,
            { x: 0, y: 0, scale: 0.6, opacity: 0 },
            { x: dx, y: dy, scale: 1, opacity: 1, duration: 0.38, ease: "none" },
            at,
          ).to(
            tile,
            {
              x: () => dx() * 2.5,
              y: () => dy() * 2.5,
              scale: 1.25,
              opacity: 0,
              duration: 0.4,
              ease: "none",
            },
            0.5 + at,
          );
        });
        tl.to({}, { duration: 0.12 });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [animated]);
  const text = (
    <div className="burst-text relative z-10 mx-auto flex max-w-[620px] flex-col items-center text-center">
      <h2 id="team-title" className="type-h2">
        Get a full web and AI team for less than hiring in-house
      </h2>
      <p className="mt-5 type-body">
        Local businesses lose calls, bookings and hours juggling freelancers, apps and missed
        messages. We design, build and run your website and AI agents, so you can focus on the work.
      </p>
      <PillLink to="/pricing" className="mt-8">
        See plans &amp; pricing
      </PillLink>
      <p className="mt-10 type-small text-muted-foreground">We are available on socials</p>
      <SocialRow className="mt-3 justify-center" />
    </div>
  );
  return (
    <section
      ref={ref}
      aria-labelledby="team-title"
      className={cn(
        "burst-section relative overflow-hidden bg-bg-soft",
        animated && "burst-animated",
      )}
    >
      {animated && (
        <div aria-hidden className="absolute inset-0 z-0">
          {tiles.map((t, i) => (
            <div
              key={t.src}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className="burst-tile absolute left-1/2 top-1/2"
              style={{ width: t.w, height: t.h, marginLeft: -t.w / 2, marginTop: -t.h / 2 }}
            >
              <TileImg t={t} className="size-full" />
            </div>
          ))}
        </div>
      )}
      <div className="container-site relative py-[72px] md:py-[100px]">
        {!animated && (
          <div aria-hidden className="burst-static grid grid-cols-4 items-start gap-2 md:gap-4">
            {mobileTiles
              .slice(0, 4)
              .map(
                (t, i) =>
                  t && (
                    <TileImg
                      key={t.src}
                      t={t}
                      sizes={staticSizes}
                      className={cn("aspect-[3/5]", i % 2 && "mt-6")}
                    />
                  ),
              )}
          </div>
        )}
        <div className={cn(!animated && "py-12")}>{text}</div>
        {!animated && (
          <div aria-hidden className="burst-static grid grid-cols-4 items-start gap-2 md:gap-4">
            {mobileTiles
              .slice(4)
              .map(
                (t, i) =>
                  t && (
                    <TileImg
                      key={t.src}
                      t={t}
                      sizes={staticSizes}
                      className={cn("aspect-[3/5]", i % 2 === 0 && "mt-6")}
                    />
                  ),
              )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Arc carousel                                                        */
/* ------------------------------------------------------------------ */

const STEP_DEG = 12;

export function WorkCarousel() {
  const items = showcase;
  const reduced = usePrefersReducedMotion();
  const mobile = !useMediaQuery("(min-width: 768px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const cardW = mobile ? 300 : 420;
  const cardH = mobile ? 420 : 560;
  const gap = mobile ? 16 : 28;
  const radius = (cardW + gap) / ((STEP_DEG * Math.PI) / 180);

  const n = items.length;
  // Opens on the third card so the wheel always shows cards on both sides.
  const [pos, setPos] = useState(2);
  const posRef = useRef(2);
  const anim = useRef(0);
  const drag = useRef<{
    x: number;
    start: number;
    lastX: number;
    lastT: number;
    v: number;
    moved: boolean;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const wheelTimer = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const [cursorOn, setCursorOn] = useState(false);
  const [overButton, setOverButton] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const checkPointer = () => {
      const r = el.getBoundingClientRect();
      const { x, y } = cursorTarget.current;
      const inside =
        r.bottom > 0 &&
        r.top < window.innerHeight &&
        x >= r.left &&
        x <= r.right &&
        y >= r.top &&
        y <= r.bottom;
      const hit = inside ? document.elementFromPoint(x, y) : null;
      setCursorOn(inside && Boolean(hit && el.contains(hit)));
      setOverButton(Boolean(hit?.closest("a,button")));
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) setCursorOn(false);
      else checkPointer();
    });
    observer.observe(el);
    window.addEventListener("scroll", checkPointer, { passive: true });
    window.addEventListener("incodet:lenis-scroll", checkPointer);
    window.addEventListener("resize", checkPointer);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkPointer);
      window.removeEventListener("incodet:lenis-scroll", checkPointer);
      window.removeEventListener("resize", checkPointer);
    };
  }, []);
  /** Shortest signed distance from the wheel position to card i, so the wheel loops both ways. */
  const offset = (i: number, p: number) => {
    const d = (((i - p) % n) + n) % n;
    return d > n / 2 ? d - n : d;
  };

  const set = (v: number) => {
    posRef.current = v;
    setPos(v);
  };

  const animateTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(anim.current);
      const t = Math.round(target);
      if (reduced) {
        set(t);
        return;
      }
      const from = posRef.current;
      const start = performance.now();
      const dur = 520;
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        set(from + (t - from) * e);
        if (k < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [reduced],
  );

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    cancelAnimationFrame(anim.current);
    drag.current = {
      x: e.clientX,
      start: posRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    cursorTarget.current = { x: e.clientX, y: e.clientY };
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = now;
    set(d.start - dx / (cardW + gap));
  };
  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (!d.moved) {
      // A click on a side card centers it.
      const card = (document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]).find(
        (el) => el.dataset["index"],
      );
      if (card) animateTo(posRef.current + offset(Number(card.dataset["index"]), posRef.current));
      return;
    }
    const momentum = reduced ? 0 : (-d.v * 260) / (cardW + gap);
    animateTo(posRef.current + momentum);
  };

  // Trackpad horizontal scroll rotates the wheel, then snaps.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      cancelAnimationFrame(anim.current);
      set(posRef.current + e.deltaX / (cardW + gap));
      window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(() => animateTo(posRef.current), 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  // DRAG cursor follows the pointer smoothly.
  useEffect(() => {
    if (!cursorOn) return;
    let raf = 0;
    const loop = () => {
      const c = cursorPos.current;
      const t = cursorTarget.current;
      const k = reduced ? 1 : 0.22;
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      if (cursor.current)
        cursor.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [cursorOn, reduced]);

  const active = ((Math.round(pos) % n) + n) % n;
  const go = (d: number) => animateTo(Math.round(posRef.current) + d);
  const showCursor = finePointer && cursorOn && !overButton;

  return (
    <section
      aria-labelledby="work-title"
      className="overflow-hidden bg-background pt-[72px] pb-[72px] md:pt-[120px] md:pb-[100px]"
    >
      <div className="container-site">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="work-title" className="type-h2">
            Explore our latest work across industries
          </h2>
          <p className="mt-5 type-body">
            From local service websites to AI tools and custom platforms, see how we turn ideas into
            fast, easy to use products that win customers.
          </p>
        </Reveal>
      </div>

      <div
        ref={stage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Our latest work"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={(e) => {
          cursorTarget.current = cursorPos.current = { x: e.clientX, y: e.clientY };
          setCursorOn(true);
        }}
        onPointerLeave={() => setCursorOn(false)}
        className={cn(
          "relative isolate mt-10 touch-pan-y select-none md:mt-14",
          finePointer && !overButton && "cursor-none",
        )}
        style={{ height: cardH + (mobile ? 90 : 150) }}
      >
        {/* Faint dashed arc behind the cards */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 rounded-full border border-dashed border-ink/15"
          style={{
            width: (radius - cardH / 2) * 2,
            height: (radius - cardH / 2) * 2,
            top: cardH / 2,
            transform: "translateX(-50%)",
          }}
        />
        <ul className="absolute inset-x-0 top-0">
          {items.map((it, i) => {
            const d = offset(i, pos);
            const hidden = Math.abs(d) > 4;
            const isActive = i === active;
            return (
              <li
                key={it.key}
                data-index={i}
                aria-hidden={hidden || undefined}
                aria-label={`${i + 1} of ${items.length}: ${it.name}`}
                className={cn(
                  "absolute top-0 left-1/2 flex flex-col overflow-hidden rounded-[28px] p-6 md:p-8",
                  it.tint,
                  hidden && "invisible",
                )}
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  transformOrigin: `50% ${radius}px`,
                  transform: `rotate(${d * STEP_DEG}deg)`,
                  zIndex: 100 - Math.round(Math.abs(d) * 10),
                }}
              >
                <div className="pointer-events-none flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex size-7 items-center justify-center rounded-full bg-live"
                  >
                    <span className="size-2.5 rounded-full bg-on-dark" />
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 type-small font-medium text-ink",
                      it.badge === "Live Now" ? "bg-background" : "bg-muted",
                    )}
                  >
                    {it.badge}
                  </span>
                </div>
                <h3 className="pointer-events-none mt-5 text-[24px] leading-tight font-medium text-ink md:text-[28px]">
                  {it.name}
                </h3>
                <p className="pointer-events-none mt-2 line-clamp-2 type-small text-body">
                  {it.description}
                </p>
                <div className="carousel-shot pointer-events-none relative -mx-6 mt-5 flex-1 overflow-hidden md:-mx-8">
                  <img
                    src={it.image}
                    alt={`${it.name} website`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={500}
                    draggable={false}
                    className="absolute top-0 left-1/2 w-[135%] max-w-none -translate-x-1/2"
                  />
                </div>
                <a
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isActive ? 0 : -1}
                  onPointerEnter={() => setOverButton(true)}
                  onPointerLeave={() => setOverButton(false)}
                  className="absolute bottom-5 left-1/2 inline-flex h-11 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-background px-5 type-small font-medium whitespace-nowrap text-ink shadow-soft transition-transform hover:-translate-y-0.5 md:bottom-7"
                >
                  View Project <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            );
          })}
        </ul>

        {finePointer &&
          cursorOn &&
          createPortal(
            <div
              ref={cursor}
              aria-hidden
              data-carousel-cursor
              className={cn(
                "pointer-events-none fixed top-0 left-0 z-[9000] size-16 transition-opacity duration-200",
                showCursor ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="relative">
                <span
                  className="absolute top-1/2 left-1/2 size-1.5 -translate-y-1/2 rounded-full bg-ink transition-transform duration-300"
                  style={{ transform: `translate(${dragging ? -58 : -44}px, -50%)` }}
                />
                <span className="flex size-16 items-center justify-center rounded-full bg-ink text-[13px] font-semibold tracking-wide text-primary-foreground">
                  DRAG
                </span>
                <span
                  className="absolute top-1/2 left-1/2 size-1.5 rounded-full bg-ink transition-transform duration-300"
                  style={{ transform: `translate(${dragging ? 52 : 38}px, -50%)` }}
                />
              </div>
            </div>,
            document.body,
          )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="flex size-12 items-center justify-center rounded-full border border-border bg-background text-ink transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <p
          aria-live="polite"
          className="min-w-[64px] text-center type-small text-muted-foreground tabular-nums"
        >
          {active + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="flex size-12 items-center justify-center rounded-full border border-border bg-background text-ink transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* AI calling agent: pinned statement with cards sliding over it        */
/* ------------------------------------------------------------------ */

function UsageUI({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={cn("rounded-2xl p-5", dark ? "bg-ink text-on-dark" : "bg-bg-soft text-ink")}>
      <p className={cn("type-small", dark ? "text-on-dark-muted" : "text-muted-foreground")}>
        AI call minutes this month
      </p>
      <p className="mt-2 text-[28px] leading-none font-medium">300 included</p>
      <div
        className={cn(
          "mt-4 h-2 overflow-hidden rounded-full",
          dark ? "bg-on-dark/20" : "bg-border",
        )}
      >
        <div className={cn("h-full w-[62%] rounded-full", dark ? "bg-on-dark" : "bg-ink")} />
      </div>
      <p className={cn("mt-3 type-small", dark ? "text-on-dark-muted" : "text-body")}>
        Extra minutes $0.20, only if used
      </p>
    </div>
  );
}

const callCards = [
  {
    title: "A customer calls",
    body: "Day, night or weekend, including after hours.",
    ui: CallCardUI,
  },
  {
    title: "The AI agent answers",
    body: "It greets the caller, answers questions and gives your business information.",
    ui: ChatUI,
  },
  {
    title: "It books the appointment",
    body: "The booking goes straight into your calendar.",
    ui: CalendarUI,
  },
  {
    title: "You get the details",
    body: "Owner alerts by email or WhatsApp, with the caller's name and request.",
    ui: NotificationUI,
  },
  {
    title: "You pay for what you use",
    body: "Growth includes 300 AI call minutes a month. Extra minutes are $0.20, only if used.",
    ui: UsageUI,
  },
];

function CallCard({
  c,
  i,
  className,
}: {
  c: (typeof callCards)[number];
  i: number;
  className?: string;
}) {
  const light = i % 2 === 0;
  const UI = c.ui;
  return (
    <article
      className={cn(
        "flex shrink-0 flex-col rounded-card p-6 text-center md:p-8",
        light ? "bg-background text-ink" : "border border-hairline-dark bg-dark text-on-dark",
        className,
      )}
    >
      <h3
        className={cn(
          "text-[26px] leading-tight font-medium md:text-[32px]",
          light ? "text-ink" : "text-on-dark",
        )}
      >
        {c.title}
      </h3>
      <p className={cn("mt-3 type-body", light ? "text-body" : "text-on-dark-muted")}>{c.body}</p>
      <div className="mt-auto pt-6 text-left">
        <UI tone={light ? "dark" : "light"} />
      </div>
    </article>
  );
}

export function CallingAgent() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  const pinned = desktop && !reduced;
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // Reserve the final scroll distance on first render (cards are w-[360px] with gap-6, plus
  // 48px end space) so this section never grows after the pins below have measured. The
  // measurement in the effect still corrects it if card sizes ever change.
  const [dist, setDist] = useState(callCards.length * 360 + (callCards.length - 1) * 24 + 48);

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const t = track.current;
      if (!t) return;
      setDist(t.scrollWidth + 48);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned]);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = outer.current;
      const t = track.current;
      if (!o || !t) return;
      const r = o.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      // Starts just off the right edge, ends with the last card fully in view.
      t.style.transform = `translate3d(${window.innerWidth - p * dist}px, 0, 0)`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, dist]);

  const statement = (
    <div className="container-site text-center">
      <PillBadge tone="mint" icon={<Phone aria-hidden className="size-4" />}>
        24/7 AI Calling Agent
      </PillBadge>
      <h2
        id="calling-title"
        className="mx-auto mt-6 max-w-5xl type-h2 text-on-dark lg:text-[64px] lg:leading-[1.1]"
      >
        Picks up every call, books appointments and sends you the details.
      </h2>
    </div>
  );

  return (
    <section data-theme="dark" aria-labelledby="calling-title" className="bg-dark">
      {pinned ? (
        <div ref={outer} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <div className="relative z-0 w-full">{statement}</div>
            <div
              ref={track}
              className="absolute top-[10vh] left-0 z-10 flex gap-6 will-change-transform"
              style={{ transform: "translate3d(100vw,0,0)" }}
            >
              {callCards.map((c, i) => (
                <CallCard key={c.title} c={c} i={i} className="h-[80vh] w-[360px]" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-[72px] md:py-[120px]">
          <Reveal>{statement}</Reveal>
          <div
            role="region"
            aria-label="How the AI calling agent works"
            tabIndex={0}
            className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:px-8 [scrollbar-width:none]"
          >
            {callCards.map((c, i) => (
              <CallCard
                key={c.title}
                c={c}
                i={i}
                className="h-[460px] w-[300px] snap-center md:w-[360px]"
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center pb-[72px] md:pb-[120px]">
        <PillLink to="/book" variant="primary-inverted" size="lg">
          Book a Free Call
        </PillLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Client portal preview                                               */
/* ------------------------------------------------------------------ */

const miniMilestones = [
  { t: "Discovery call", s: "done" },
  { t: "Plan & design", s: "done" },
  { t: "Build & integrate", s: "in_progress" },
  { t: "Launch & support", s: "todo" },
] as const;

export function ClientPortalPreview() {
  return (
    <section aria-labelledby="portal-title" className="section-y bg-bg-soft">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <PillBadge>Client portal</PillBadge>
          <h2 id="portal-title" className="mt-6 type-h2">
            Your project, always in view
          </h2>
          <p className="mt-5 max-w-xl type-body">
            Every client gets a private portal to track progress, download files and pay invoices.
            Try it now with sample data.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {[
              "Live project progress",
              "All your files in one place",
              "Simple invoices and payments",
            ].map((x) => (
              <li key={x} className="flex items-center gap-3 text-ink">
                <span className="flex size-6 items-center justify-center rounded-full bg-ink text-primary-foreground">
                  <Check aria-hidden className="size-3.5" />
                </span>
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <PillLink to="/portal/demo">Try the demo</PillLink>
            <PillLink to="/portal" variant="secondary">
              Client login
            </PillLink>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            aria-hidden
            className="animate-[portal-float_6s_ease-in-out_infinite] motion-reduce:animate-none"
          >
            <div className="overflow-hidden rounded-[20px] border border-border bg-background shadow-soft">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="ml-3 h-6 flex-1 rounded-full bg-bg-soft" />
              </div>
              <div className="grid gap-3 bg-bg-soft p-3 sm:grid-cols-2 md:p-5">
                <div className="rounded-2xl bg-dark p-5 text-on-dark sm:col-span-2">
                  <p className="type-small text-on-dark-muted">Project progress</p>
                  <p className="mt-3 text-[44px] leading-none font-medium">65%</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-on-dark/20">
                    <div className="h-full w-[65%] rounded-full bg-on-dark" />
                  </div>
                </div>
                <div className="rounded-2xl bg-background p-4 sm:col-span-2">
                  <p className="type-small font-medium text-ink">Milestones</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {miniMilestones.map((m) => {
                      const Icon =
                        m.s === "done" ? CheckCircle2 : m.s === "in_progress" ? CircleDot : Circle;
                      return (
                        <li key={m.t} className="flex items-center gap-2 type-small text-ink">
                          <Icon
                            className={cn(
                              "size-4 shrink-0",
                              m.s === "todo" && "text-muted-foreground",
                            )}
                          />
                          {m.t}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-background p-4 sm:col-span-2">
                  <div>
                    <p className="type-small font-medium text-ink">INC-2026-002</p>
                    <p className="type-small text-muted-foreground">Growth plan monthly fee</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="type-small font-medium text-ink">$149</span>
                    <span className="rounded-full bg-ink px-4 py-1.5 type-small font-medium text-primary-foreground">
                      Pay
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
