import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { activeSocials, industryLinks, pageLinks, site } from "@/config/site";
import { services } from "@/content/services";
import { PillLink } from "./Button";
import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";
import { TeamFlag } from "./TeamFlag";

const linkCls = "rounded-sm text-body transition-colors hover:text-ink";
const iconBtn =
  "flex size-10 items-center justify-center rounded-full border border-border bg-background text-ink transition-colors hover:bg-bg-soft";

/** Direct contact card for the CEO, placed above the offices row. Values come from site config. */
function CeoCard() {
  const { ceo } = site;
  return (
    <section
      aria-labelledby="ceo-name"
      className="mt-16 flex flex-col gap-5 rounded-card border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between md:max-w-[560px]"
    >
      <div className="flex items-center gap-4">
        {/* Photo placeholder until a real photo exists (docs/temp-images.md). */}
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink text-[18px] font-medium text-primary-foreground"
        >
          {ceo.initials}
        </span>
        <div className="min-w-0">
          <h2 id="ceo-name" className="text-[16px] font-medium text-ink">
            {ceo.name}
          </h2>
          <p className="type-small text-muted-foreground">
            {ceo.title}, {ceo.location}
          </p>
          <a href={site.phoneHref} className={`${linkCls} mt-1 inline-block type-small`}>
            {site.phoneDisplay}
          </a>
        </div>
      </div>
      <ul className="flex gap-2">
        <li>
          <a
            href={ceo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ceo.name} on LinkedIn (opens in a new tab)`}
            className={iconBtn}
          >
            <SocialIcon name="linkedin" />
          </a>
        </li>
        <li>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Message ${ceo.name} on WhatsApp (opens in a new tab)`}
            className={iconBtn}
          >
            <MessageCircle aria-hidden className="size-4" />
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className={iconBtn}>
            <Mail aria-hidden className="size-4" />
          </a>
        </li>
      </ul>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-background pt-20 pb-32 md:pt-28" data-theme="light">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-8 max-w-md text-[34px] leading-[1.15] font-medium tracking-tight text-ink md:text-[44px]">
              Pay for what you use. Nothing more.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="type-small text-muted-foreground">Drop us a line</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="text-ink hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="type-small text-muted-foreground">Call us</dt>
                <dd className="mt-1">
                  <a href={site.phoneHref} className="text-ink hover:underline">
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="type-small text-muted-foreground">Message us</dt>
                <dd className="mt-1">
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:underline"
                  >
                    WhatsApp
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-10 grid w-full gap-3 sm:w-fit">
              <PillLink to="/book" className="w-full">
                Book a Free Call
              </PillLink>
              <PillLink to="/deck" variant="secondary" className="w-full border-ink">
                Company Deck
              </PillLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            <FooterCol title="Company">
              <li>
                <Link to="/deck" className={linkCls}>
                  Company Deck
                </Link>
              </li>
              {pageLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </FooterCol>
            <FooterCol title="Services">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={s.to} className={linkCls}>
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className={`${linkCls} font-medium text-ink`}>
                  All services
                </Link>
              </li>
            </FooterCol>
            <FooterCol title="Industries">
              {industryLinks.slice(0, 6).map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/industries" className={`${linkCls} font-medium text-ink`}>
                  All industries
                </Link>
              </li>
            </FooterCol>
            {activeSocials.length > 0 && (
              <FooterCol title="Follow Us">
                {activeSocials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkCls} inline-flex items-center gap-2`}
                    >
                      <SocialIcon name={s.key} /> {s.label}
                    </a>
                  </li>
                ))}
              </FooterCol>
            )}
          </div>
        </div>

        <CeoCard />

        <section aria-labelledby="teams-title" className="mt-10 border-t border-border pt-8">
          <h2 id="teams-title" className="type-small font-medium text-muted-foreground">
            Our teams
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-6">
            {site.locations.map((location) => (
              <li key={location.city} className="min-w-0">
                <TeamFlag code={location.code} />
                <p className="mt-3 text-[15px] text-ink">{location.city}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{location.country}</p>
                {"label" in location && (
                  <>
                    <p className="mt-2 text-[12px] font-medium text-ink">{location.label}</p>
                    <a
                      href={site.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-[13px] text-muted-foreground hover:text-ink hover:underline"
                    >
                      {site.address}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-20 flex flex-col gap-4 border-t border-border pt-8 type-small text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="type-small font-medium text-muted-foreground">{title}</h2>
      <ul className="mt-4 flex flex-col gap-3 text-[16px]">{children}</ul>
    </div>
  );
}
