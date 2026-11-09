import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Phone, Bot, CalendarCheck, Mail } from "lucide-react";
import { site, activeSocials } from "@/config/site";
import { booking } from "@/config/booking";
import { services } from "@/content/services";
import { plans, plansNote } from "@/content/plans";
import { faq } from "@/content/faq";
import { industries } from "@/content/industries";
import { processSteps } from "@/content/process";
import { deckPrimaryWork, deckMoreWork, deckProblems, deckStarter } from "@/content/deck";
import { CallCardUI, ChatUI } from "@/components/home/MiniUI";
import { industryIcon } from "@/components/site/industryIcons";
import { TeamFlag } from "@/components/site/TeamFlag";
import { Button } from "@/components/ui/button";

export type DeckSlide = { id: string; title: string; dark: boolean; content: ReactNode };
const domain = new URL(site.siteUrl).hostname;
function Tag({ children }: { children: ReactNode }) {
  return <span className="deck-chip">{children}</span>;
}
function Title({ children, huge = false }: { children: ReactNode; huge?: boolean }) {
  return <h2 className={huge ? "deck-title-xl" : "deck-title"}>{children}</h2>;
}
function Image({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      width="1600"
      height="1000"
      loading={eager ? "eager" : "lazy"}
      className="deck-work-image"
    />
  );
}
function PortalPreview() {
  return (
    <div className="deck-portal" aria-label="Illustrative client portal preview">
      <div className="deck-portal-header">
        <span>{site.name}</span>
        <Tag>Client portal preview</Tag>
      </div>
      <h3>Your project</h3>
      <div className="deck-progress">
        <span />
      </div>
      <div className="deck-grid deck-grid-2">
        <div>
          <h3>Milestones</h3>
          {processSteps.map((step, i) => (
            <p key={step.title}>
              <Check aria-hidden />
              {step.title}
              <span>{i < 2 ? "Complete" : "Upcoming"}</span>
            </p>
          ))}
        </div>
        <div>
          <h3>Invoices</h3>
          <p>
            Setup<span>Paid</span>
          </p>
          <p>
            Monthly care<span>Upcoming</span>
          </p>
          <h3>Deliverables</h3>
          <p>Design files</p>
          <p>Launch checklist</p>
        </div>
      </div>
    </div>
  );
}

export function createDeckSlides(): DeckSlide[] {
  const calling = services.find((service) => service.id === "ai-calling-agent");
  const chatbot = services.find((service) => service.id === "ai-chatbot");
  const contract = faq.find((item) => item.question === "Is there a contract?");
  const slides: DeckSlide[] = [
    {
      id: "cover",
      title: "Company Deck",
      dark: true,
      content: (
        <>
          <img
            className="deck-cover-image"
            src={site.heroVideo.poster}
            alt=""
            width="1920"
            height="1080"
            loading="eager"
          />
          <div className="deck-cover-copy">
            <Tag>Company Deck</Tag>
            <h1 className="deck-title-xl">
              Websites, AI Agents &amp; Software That{" "}
              <span className="deck-wave">Grow With Your Business</span>
            </h1>
            <p className="deck-domain">{domain}</p>
          </div>
        </>
      ),
    },
    {
      id: "contents",
      title: "What's inside",
      dark: false,
      content: (
        <>
          <Title>What’s inside.</Title>
          <div className="deck-chapters">
            {["Intro", "Services", "Work", "Who we are", "Plans", "Next step"].map((title, i) => (
              <div key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {title}
                <ArrowUpRight aria-hidden />
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "statement",
      title: "Never miss a customer",
      dark: true,
      content: (
        <div className="deck-centered">
          <Title huge>
            Your business should <span className="deck-wave">never miss a customer</span> because
            nobody picked up.
          </Title>
        </div>
      ),
    },
    {
      id: "problems",
      title: "The problems we solve",
      dark: false,
      content: (
        <>
          <Title>
            The problems
            <br />
            we solve.
          </Title>
          <div className="deck-grid deck-grid-4 deck-problems">
            {deckProblems.map(([title, body], i) => (
              <article key={title} className={`deck-card ${services[i]?.color} text-on-dark`}>
                <span className="deck-card-index">/0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "calling",
      title: "How the AI calling agent works",
      dark: true,
      content: (
        <>
          <Tag>{calling?.title}</Tag>
          <Title>
            Every call.
            <br />
            <span className="deck-wave">Taken care of.</span>
          </Title>
          <div className="deck-flow">
            {[
              [Phone, "Customer calls"],
              [Bot, "AI answers 24/7"],
              [CalendarCheck, "Books or takes a message"],
              [Mail, "You get the details by email or WhatsApp"],
            ].map(([Icon, label], i) => {
              const FlowIcon = Icon as typeof Phone;
              return (
                <div key={String(label)}>
                  <FlowIcon aria-hidden />
                  <span>/0{i + 1}</span>
                  <h3>{String(label)}</h3>
                </div>
              );
            })}
          </div>
          <div className="deck-call-ui">
            <CallCardUI tone="dark" />
          </div>
        </>
      ),
    },
    {
      id: "chat",
      title: "AI website chatbot",
      dark: false,
      content: (
        <div className="deck-split">
          <div>
            <Tag>{chatbot?.short}</Tag>
            <Title>
              AI Website
              <br />
              <span className="deck-wave">Chatbot.</span>
            </Title>
            <p className="deck-body-lg">{chatbot?.description}</p>
          </div>
          <div className="deck-chat-ui">
            <Tag>Illustrative conversation</Tag>
            <ChatUI />
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "Our services",
      dark: true,
      content: (
        <>
          <Title>
            One team.
            <br />
            <span className="deck-wave">Everything you need.</span>
          </Title>
          <div className="deck-grid deck-grid-4 deck-services">
            {services.map((service) => (
              <article key={service.id} className={`deck-card ${service.color} text-on-dark`}>
                <h3>{service.title}</h3>
                <p>{service.short}</p>
              </article>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "process",
      title: "Our process",
      dark: false,
      content: (
        <>
          <Title>
            From first call
            <br />
            to launch.
          </Title>
          <div className="deck-grid deck-grid-4 deck-process">
            {processSteps.map((step, i) => (
              <article key={step.title}>
                <img
                  src={`/images/process/${step.images[0]}.webp`}
                  width="640"
                  height="480"
                  loading="lazy"
                  alt={`${step.title} planning illustration`}
                />
                <span className="deck-eyebrow">/0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "work-divider",
      title: "Selected work",
      dark: true,
      content: (
        <div className="deck-centered">
          <Tag>Websites · Platforms · Design</Tag>
          <Title huge>
            Selected
            <br />
            <span className="deck-wave">work.</span>
          </Title>
        </div>
      ),
    },
  ];
  deckPrimaryWork.forEach((project, i) =>
    slides.push({
      id: project.slug,
      title: project.name,
      dark: i % 2 === 1,
      content: (
        <>
          <div className="deck-work-heading">
            <div>
              <Tag>
                {project.category}
                {project.type === "Demo" ? " · Demo" : ""}
              </Tag>
              <Title>{project.name}</Title>
            </div>
            <span className="deck-eyebrow">{project.period}</span>
          </div>
          <div className="deck-work-layout">
            <Image
              src={project.mockup ?? project.image.src}
              alt={`${project.name} shown on ${project.laptopOnly ? "a laptop" : "a laptop and phone"}`}
            />
            <div>
              <p className="deck-story">{project.description}</p>
              <ul className="deck-list">
                {project.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight}>
                    <Check aria-hidden />
                    {highlight}
                  </li>
                ))}
              </ul>
              <p className="deck-url">{project.liveUrl}</p>
            </div>
          </div>
        </>
      ),
    }),
  );
  if (deckMoreWork.length)
    slides.push({
      id: "more-work",
      title: "More work",
      dark: true,
      content: (
        <>
          <Title>More work.</Title>
          <div className="deck-grid deck-grid-2 deck-more-work">
            {deckMoreWork.map((project) => (
              <article key={project.slug}>
                <Image src={project.mockup ?? project.image.src} alt={project.name} />
                <h3>{project.name}</h3>
                <p>
                  {project.category} · {project.period}
                </p>
              </article>
            ))}
          </div>
        </>
      ),
    });
  slides.push(
    {
      id: "industries",
      title: "Industries",
      dark: false,
      content: (
        <>
          <Tag>Built around your business</Tag>
          <Title>
            Local businesses.
            <br />
            <span className="deck-wave">Real-world needs.</span>
          </Title>
          <div className="deck-industries">
            {industries.map((industry) => {
              const Icon = industryIcon[industry.icon];
              return (
                <Tag key={industry.slug}>
                  <Icon aria-hidden />
                  {industry.name}
                </Tag>
              );
            })}
          </div>
        </>
      ),
    },
    {
      id: "teams",
      title: "Our teams",
      dark: true,
      content: (
        <>
          <Title>
            One team.
            <br />
            <span className="deck-wave">Across time zones.</span>
          </Title>
          <WorldMap />
          <div className="deck-team-list">
            {site.locations.map((location) => (
              <div key={location.city}>
                <TeamFlag code={location.code} />
                <h3>{location.city}</h3>
                <p>{location.country}</p>
                {"label" in location && <Tag>{location.label}</Tag>}
              </div>
            ))}
          </div>
          <p className="deck-availability">{site.availabilityLabel}</p>
        </>
      ),
    },
    {
      id: "plans",
      title: "Plans",
      dark: false,
      content: (
        <>
          <div className="deck-work-heading">
            <Title>
              Built to grow
              <br />
              with you.
            </Title>
            <Tag>All prices in USD</Tag>
          </div>
          <div className="deck-grid deck-grid-3 deck-plans">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`deck-card ${plan.featured ? "deck-plan-featured" : ""}`}
              >
                <Tag>{plan.featured ? "Featured" : "Plan"}</Tag>
                <h3>{plan.name}</h3>
                <p>{plan.audience}</p>
                <p className="deck-price">
                  {plan.setup}
                  <span> USD setup</span>
                </p>
                <p>{plan.monthly} · USD</p>
                <ul className="deck-list">
                  {plan.includes.map((item) => (
                    <li key={item}>
                      <Check aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Tag>{plan.timeline}</Tag>
              </article>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "usage",
      title: "Add-ons and usage",
      dark: true,
      content: (
        <>
          <Tag>Add-ons &amp; usage</Tag>
          <Title huge>
            Pay for what you use.
            <br />
            <span className="deck-wave">Nothing more.</span>
          </Title>
          <div className="deck-usage">
            <p>{plansNote}</p>
            <p>{contract?.answer}</p>
          </div>
        </>
      ),
    },
    {
      id: "portal",
      title: "Client portal",
      dark: false,
      content: (
        <div className="deck-split">
          <div>
            <Tag>Client portal</Tag>
            <Title>
              Every step.
              <br />
              <span className="deck-wave">In one place.</span>
            </Title>
            <ul className="deck-list deck-body-lg">
              {[
                "Project progress",
                "Milestones and delivery dates",
                "Invoices and payments",
                "Files and deliverables",
              ].map((item) => (
                <li key={item}>
                  <Check aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/portal/demo" className="deck-text-link">
              View the demo <ArrowUpRight aria-hidden />
            </Link>
          </div>
          <PortalPreview />
        </div>
      ),
    },
    {
      id: "difference",
      title: "What sets us apart",
      dark: true,
      content: (
        <>
          <Title>
            What sets
            <br />
            <span className="deck-wave">us apart.</span>
          </Title>
          <div className="deck-grid deck-grid-2 deck-difference">
            {[
              ["Built for local businesses", "Bookings, calls and enquiries are what we focus on."],
              ["Pay for what you use", contract?.answer ?? ""],
              ["One team, start to finish", "Design, build, AI and support in one place."],
              ["Teams across countries", site.teamsLabel],
            ].map(([title, body]) => (
              <article key={title} className="deck-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "next",
      title: "Next steps",
      dark: false,
      content: (
        <>
          <Tag>{booking.meetingLabel}</Tag>
          <Title huge>
            Let’s start with
            <br />
            <span className="deck-wave">a conversation.</span>
          </Title>
          <div className="deck-next">
            {[
              "Book a free call",
              "Get a clear plan and price",
              `${deckStarter?.timeline ?? ""} (${deckStarter?.name ?? ""})`,
            ].map((item, i) => (
              <p key={item}>
                <span>/0{i + 1}</span>
                {item}
              </p>
            ))}
          </div>
          <Button asChild className="deck-cta">
            <Link to="/book">
              Book a Free Call <ArrowUpRight aria-hidden />
            </Link>
          </Button>
        </>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      dark: true,
      content: (
        <>
          <Title huge>
            Let’s <span className="deck-wave">build.</span>
          </Title>
          <div className="deck-contact">
            <div>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
              <a href={site.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp <ArrowUpRight aria-hidden />
              </a>
            </div>
            <div>
              <Tag>
                {site.locations.find((location) => "label" in location)?.city} · Head office
              </Tag>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer">
                {site.address}
              </a>
              <div className="deck-socials">
                {activeSocials.map((social) => (
                  <a key={social.key} href={social.href} target="_blank" rel="noreferrer">
                    {social.label}
                    <ArrowUpRight aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p className="deck-domain">{domain}</p>
        </>
      ),
    },
  );
  return slides;
}

function WorldMap() {
  // Decorative, deliberately schematic dot continents, not geographic claims.
  const land = [
    [0.2, 0.3, 0.14, 0.19],
    [0.3, 0.66, 0.07, 0.25],
    [0.52, 0.28, 0.07, 0.1],
    [0.53, 0.55, 0.09, 0.22],
    [0.72, 0.35, 0.2, 0.2],
    [0.84, 0.79, 0.09, 0.09],
  ];
  const dots = [];
  for (let y = 1; y < 22; y++)
    for (let x = 1; x < 70; x++)
      if (
        land.some(
          ([cx, cy, rx, ry]) =>
            cx !== undefined &&
            cy !== undefined &&
            rx !== undefined &&
            ry !== undefined &&
            ((x / 70 - cx) / rx) ** 2 + ((y / 23 - cy) / ry) ** 2 < 1,
        )
      )
        dots.push(<circle key={`${x}-${y}`} cx={x * 20} cy={y * 20} r="3" />);
  const markers: Record<string, [number, number]> = {
    AU: [1140, 365],
    BD: [965, 205],
    CA: [340, 115],
    GB: [720, 105],
  };
  return (
    <svg
      className="deck-map"
      viewBox="0 0 1420 460"
      role="img"
      aria-label={`Our teams: ${site.locations.map((location) => `${location.city}, ${location.country}`).join("; ")}`}
    >
      <g className="deck-map-dots">{dots}</g>
      <g className="deck-map-markers">
        {site.locations.map((location, i) => {
          const point = markers[location.code];
          return point ? (
            <circle
              key={location.city}
              cx={point[0] + (i % 2) * 13}
              cy={point[1] + (i % 2) * 13}
              r="8"
            />
          ) : null;
        })}
      </g>
    </svg>
  );
}
