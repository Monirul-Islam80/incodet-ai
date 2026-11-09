import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { PillLink } from "./Button";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Save-Data makes the hero show the poster only. */
function saveData() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(c?.saveData);
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const extras = useRef<HTMLDivElement[]>([]);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Poster first; the video loads after the page has loaded. 720p under 768px.
  useEffect(() => {
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData()) {
      setVideoSrc(null);
      return;
    }
    const go = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData()) return;
      setVideoSrc(
        window.matchMedia("(min-width: 768px)").matches
          ? site.heroVideo.src
          : site.heroVideo.src720,
      );
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, [reduced]);

  useEffect(() => {
    const apply = (p: number) => {
      if (media.current) media.current.style.transform = reduced ? "" : `scale(${1 + 0.1 * p})`;
      if (fade.current) fade.current.style.opacity = String(Math.min(1, p * 1.15));
      if (title.current) {
        // Bottom stop moves from white to grey.
        const g = Math.round(255 - (255 - 140) * p);
        title.current.style.setProperty("--hero-bottom", `rgb(${g},${g},${g})`);
      }
      extras.current.forEach((el) => {
        if (!el) return;
        el.style.opacity = String(1 - Math.min(1, p * 1.6));
        el.style.transform = reduced ? "" : `translateY(${-24 * ease(p)}px)`;
      });
    };
    if (reduced) {
      apply(0);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = outer.current;
      if (!o) return;
      const r = o.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      apply(span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0);
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
    };
  }, [reduced]);

  const addExtra = (el: HTMLDivElement | null) => {
    if (el && !extras.current.includes(el)) extras.current.push(el);
  };

  return (
    <div ref={outer} className={reduced ? "relative bg-dark" : "relative h-[200svh] bg-dark"}>
      <section
        data-theme="dark"
        aria-labelledby="hero-title"
        className="sticky top-0 flex h-svh min-h-[640px] items-center justify-center overflow-hidden bg-dark"
      >
        <div
          ref={media}
          aria-hidden
          className="absolute inset-0 origin-center will-change-transform"
        >
          <img
            src={site.heroVideo.poster}
            alt=""
            className="absolute inset-0 size-full object-cover"
            fetchPriority="high"
          />
          {videoSrc && (
            <video
              key={videoSrc}
              className="absolute inset-0 size-full object-cover"
              src={videoSrc}
              poster={site.heroVideo.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          )}
        </div>
        {/* Black wash keeps the white text AA readable over bright lightning frames. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--dark)_80%,transparent)_0%,color-mix(in_oklab,var(--dark)_62%,transparent)_45%,color-mix(in_oklab,var(--dark)_70%,transparent)_75%,var(--dark)_100%)]"
        />
        <div ref={fade} aria-hidden style={{ opacity: 0 }} className="absolute inset-0 bg-dark" />

        <div className="container-site relative z-10 flex flex-col items-center pt-16 text-center">
          <div ref={addExtra}>
            <span className="inline-flex items-center gap-2 rounded-full border border-on-dark/25 bg-on-dark/10 px-4 py-2 type-small font-medium text-on-dark backdrop-blur-sm">
              <Globe aria-hidden className="size-4 shrink-0" />
              {site.teamsLabel}
            </span>
          </div>
          <h1
            id="hero-title"
            ref={title}
            style={{ ["--hero-bottom" as string]: "var(--on-dark)" }}
            className="type-h1 mt-6 max-w-[920px] bg-[linear-gradient(180deg,var(--on-dark)_20%,var(--hero-bottom)_100%)] bg-clip-text text-transparent"
          >
            Websites, AI Agents &amp; Software That Grow With Your Business
          </h1>
          <div ref={addExtra} className="mt-6 max-w-[640px]">
            <p className="type-body text-on-dark/80">
              AI that answers calls, books appointments and replies to customers while you work, so
              your business never stops. Built for businesses of every size.
            </p>
          </div>
          <div ref={addExtra} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PillLink to="/book" variant="primary-inverted" size="lg">
              Book a Free Call
            </PillLink>
            <PillLink
              to="/pricing"
              variant="secondary-inverted"
              size="lg"
              className="border-on-dark"
            >
              See Plans
            </PillLink>
          </div>
        </div>
      </section>
    </div>
  );
}
