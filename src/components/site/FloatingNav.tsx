import { industryIcon } from "./industryIcons";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { industryLinks, site } from "@/config/site";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { PillLink } from "./Button";
import { SocialRow } from "./SocialIcon";

export function FloatingNav() {
  const [pct, setPct] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
      const nav = navRef.current;
      if (!nav) return;
      const r = nav.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-theme="dark"]')).some(
        (el) => {
          if (nav.contains(el)) return false;
          const b = el.getBoundingClientRect();
          return b.top <= y && b.bottom >= y;
        },
      );
      setInverted(dark);
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
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    menuBtn.current?.focus();
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[9100] flex justify-center md:bottom-6">
        <div
          ref={navRef}
          className={cn(
            "pointer-events-auto flex h-14 w-full items-center justify-between rounded-full pr-2 pl-5 shadow-pill transition-colors duration-500 md:w-[360px]",
            inverted ? "bg-background text-ink" : "bg-dark text-on-dark",
          )}
        >
          <Link to="/" aria-label="Incodet home" className="rounded-md">
            <Logo variant="mark" tone={inverted ? "ink" : "white"} />
          </Link>
          <span
            className="type-small font-medium tabular-nums"
            aria-label={`Page scrolled ${pct}%`}
          >
            {pct}%
          </span>
          <div className="flex items-center">
            <span
              aria-hidden
              className={cn("mr-1 h-6 w-px", inverted ? "bg-border" : "bg-on-dark/25")}
            />
            <button
              ref={menuBtn}
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className={cn(
                "flex h-10 items-center gap-2 rounded-full px-4 type-small font-medium transition-colors",
                inverted ? "hover:bg-bg-soft" : "hover:bg-on-dark/10",
              )}
            >
              Menu <Menu aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
      {open && <MenuOverlay onClose={close} />}
    </>
  );
}

const menuLinks = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/custom-software", label: "Custom Software" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/portal", label: "Client Portal" },
  { to: "/book", label: "Book a Call" },
];
const label = "text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase";
const stagger = (i: number) => ({ animationDelay: `${60 + i * 30}ms` });

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    el.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  let n = 0;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[9200] overflow-y-auto bg-background animate-in fade-in duration-300"
    >
      <div className="container-site flex min-h-full flex-col py-5">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" onClick={onClose} aria-label="Incodet home" className="rounded-md">
            <Logo />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            data-autofocus
            className="flex size-12 items-center justify-center rounded-full bg-bg-soft text-ink hover:bg-border"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="mt-8 grid flex-1 gap-10 pb-28 md:mt-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
          <nav aria-label="Menu">
            <ul className="flex flex-col gap-1.5">
              {menuLinks.map((l) => (
                <li key={l.to} className="menu-item" style={stagger(n++)}>
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className="inline-block rounded-md text-[30px] leading-[1.15] font-medium tracking-tight text-ink transition-[transform,color] duration-300 hover:translate-x-2 hover:text-muted-foreground md:text-[40px] motion-reduce:hover:translate-x-0"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className={`${label} menu-item mt-8`} style={stagger(n++)}>
              Services
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.id} className="menu-item" style={stagger(n++)}>
                  <Link
                    to={s.to}
                    onClick={onClose}
                    className="inline-block rounded-md text-[17px] font-medium text-ink hover:text-muted-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  onClick={onClose}
                  className="text-[17px] font-medium text-ink hover:text-muted-foreground"
                >
                  All services
                </Link>
              </li>
            </ul>
            <p className={`${label} menu-item mt-8`} style={stagger(n++)}>
              Industries
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 xl:grid-cols-3">
              {industryLinks.map((l) => {
                const Icon = industryIcon[l.icon];
                return (
                  <li key={l.to} className="menu-item" style={stagger(n++)}>
                    <Link
                      to={l.to}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-md text-[17px] font-medium text-ink transition-colors hover:text-muted-foreground"
                    >
                      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex flex-col gap-5 md:border-l md:border-border md:pl-10">
            <div className="menu-item hidden md:block" style={stagger(n++)}>
              <Logo />
            </div>
            <dl className="flex flex-col gap-4">
              <div className="menu-item" style={stagger(n++)}>
                <dt className={label}>Drop us a line</dt>
                <dd className="mt-1 text-[18px]">
                  <a href={`mailto:${site.email}`} className="text-ink hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="menu-item" style={stagger(n++)}>
                <dt className={label}>WhatsApp</dt>
                <dd className="mt-1 text-[18px]">
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:underline"
                  >
                    Message us on WhatsApp
                  </a>
                </dd>
              </div>
              <div className="menu-item" style={stagger(n++)}>
                <dt className={label}>Call us</dt>
                <dd className="mt-1 text-[18px]">
                  <a href={site.phoneHref} className="text-ink hover:underline">
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="menu-item" style={stagger(n++)}>
              <SocialRow />
            </div>
            <p className="menu-item type-small text-muted-foreground" style={stagger(n++)}>
              {site.teamsCitiesLabel}
            </p>
            <Link to="/deck" onClick={onClose} className="type-small text-ink hover:underline">
              Company Deck
            </Link>
            <div className="menu-item" style={stagger(n++)}>
              <PillLink to="/book" onClick={onClose}>
                Book a Free Call
              </PillLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
