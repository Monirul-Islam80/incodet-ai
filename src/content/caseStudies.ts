import { visible } from "./visible";

export type CaseStudyType = "Website" | "Platform" | "Tool" | "Concept" | "Demo";
export type CaseStudyGroup = "western-cars" | "other";

export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  title?: string;
  type: CaseStudyType;
  group: CaseStudyGroup;
  /** Month range shown as text, e.g. "Feb to Mar 2026". */
  period: string;
  year: string;
  /** Last month of delivery (YYYY-MM), used to sort newest first. */
  end: string;
  /** Homepage "Our work" position (1 = first). */
  featured?: number;
  description: string;
  challenge: string;
  solution: string;
  highlights: string[];
  tags?: string[];
  /** Omit for internal tools that must never be linked. */
  liveUrl?: string;
  /** Overrides the live button text (default: "View Live Demo" for demos, else "Visit Live Site"). */
  liveLabel?: "View Live Demo" | "Visit Live Site";
  image: { src: string; alt: string; ready: boolean };
  /** Device mockup built by scripts/mockups (full 1600x1000; a -sm 800x500 sits beside it). */
  mockup?: string;
  laptopOnly?: boolean;
  /** Pastel background class for the work carousel (tokens in styles.css). */
  tint: string;
  todo?: boolean;
};

const img = (slug: string) => `/images/case-studies/${slug}.webp`;
const mock = (slug: string) => `/images/mockups/${slug}.webp`;
export const mockupSm = (src: string) => src.replace(/\.webp$/, "-sm.webp");

type Input = Omit<CaseStudy, "image" | "mockup" | "description" | "year" | "tint" | "category"> & {
  description?: string;
  category?: string;
  tint?: string;
  noMockup?: boolean;
  imageAlt?: string;
};

const categoryFor: Record<CaseStudyType, string> = {
  Website: "Website",
  Platform: "Platform",
  Tool: "Internal tool",
  Concept: "Concept",
  Demo: "Demo project",
};

/* Tint classes used via make() (listed so Tailwind generates them):
   bg-tint-western-cars-haywards-heath bg-tint-western-cars-pulborough bg-tint-western-cars-content-hub bg-tint-brighton-taxi bg-tint-western-cars-crawley bg-tint-western-cars-east-grinstead bg-tint-western-cars-horley bg-tint-western-cars-horsham bg-tint-western-cars-redesign-concept bg-tint-western-cars-staff-registration bg-tint-humandata-labs bg-tint-bloom-studio bg-tint-barkers-executive bg-tint-brhex-studio bg-tint-gm-taxis-lewes bg-tint-a1-airport-cars bg-tint-incblog bg-tint-incodere bg-tint-vyra-shops */
const make = (c: Input): CaseStudy => ({
  ...c,
  category: c.category ?? categoryFor[c.type],
  year: c.end.slice(0, 4),
  description: c.description ?? c.solution,
  tint: c.tint ?? `bg-tint-${c.slug}`,
  image: { src: img(c.slug), alt: c.imageAlt ?? `Homepage of the ${c.name} website`, ready: true },
  ...(c.noMockup ? {} : { mockup: mock(c.slug) }),
});

const all: CaseStudy[] = [
  /* Western Cars group */
  make({
    slug: "western-cars-brighton",
    name: "Western Cars Brighton",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Feb to Mar 2026",
    end: "2026-03",
    featured: 1,
    liveUrl: "https://westerncarsbrighton.co.uk/",
    challenge:
      "Brighton & Hove is Western Cars' busiest market. Airport transfers, events and local journeys all competed for space, and booking was not obvious on a phone.",
    solution:
      "A fast, modern site with a booking button on every screen, dedicated pages for airport transfers, corporate travel, events and accessible travel, and local pages for search.",
    highlights: [
      "Online booking on every page",
      "Airport, corporate and event hire pages",
      "Wheelchair accessible vehicles shown up front",
    ],
    tint: "bg-tint-western",
  }),
  make({
    slug: "western-cars-littlehampton",
    name: "Western Cars Littlehampton",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Mar to Apr 2026",
    end: "2026-04",
    liveUrl: "https://www.westerncarslittlehampton.co.uk/",
    challenge:
      "Littlehampton customers book many airport runs and often need accessible cars or minibuses, but those options were hard to find.",
    solution:
      "A clean local site with fixed-fare airport transfers, corporate travel, wheelchair accessible cars and minibuses up front, plus WhatsApp and online booking.",
    highlights: [
      "Fixed-fare airport transfers",
      "Minibus and accessible vehicle pages",
      "WhatsApp and online booking",
    ],
    tint: "bg-tint-littlehampton",
  }),
  make({
    slug: "western-cars-haywards-heath",
    name: "Western Cars Haywards Heath",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Apr 2026",
    end: "2026-04",
    liveUrl: "https://www.westerncars-haywardsheath.co.uk/",
    challenge:
      "Haywards Heath runs 24 hours a day with many station and airport runs, so pre-booking had to be quick at any hour.",
    solution:
      "A clear site with opening hours, set airport rates, business accounts and FAQs, and booking online, in the app or by phone.",
    highlights: [
      "24 hour booking options",
      "Set rates to major airports",
      "Business accounts page",
    ],
  }),
  make({
    slug: "western-cars-pulborough",
    name: "Western Cars Pulborough",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "May 2026",
    end: "2026-05",
    liveUrl: "https://www.westerncarspulborough.co.uk/",
    challenge:
      "Pulborough serves villages across West Sussex, so customers needed to see quickly that their area is covered.",
    solution:
      "A local site with service areas, fleet details, airport transfers and one-tap calling and WhatsApp.",
    highlights: ["Service area pages", "Fleet information", "One-tap call and WhatsApp"],
  }),
  make({
    slug: "western-cars-content-hub",
    name: "Western Cars Content Hub",
    type: "Platform",
    group: "western-cars",
    category: "AI content platform",
    period: "Nov to Dec 2025",
    end: "2025-12",
    featured: 5,
    liveUrl: "https://content.westerncars.com/",
    challenge:
      "Every location site needed fresh local articles for search, but writing for each town by hand was not realistic.",
    solution:
      "A central AI blog platform that prepares one quality-checked article a day and serves it to every location site through a read-only content API.",
    highlights: [
      "One article a day across all locations",
      "Read-only content API for each site",
      "RSS feed per location",
    ],
    imageAlt: "Homepage of the Western Cars Content Hub platform",
  }),
  make({
    slug: "brighton-taxi",
    name: "Brighton Taxi by Western Cars",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Oct to Nov 2025",
    end: "2025-11",
    liveUrl: "https://brightontaxi.westerncarsbrighton.co.uk/",
    challenge:
      "Western Cars wanted a second Brighton site with a bold, premium look to reach people searching for taxis and airport transfers.",
    solution:
      "A dark, premium site with fleet, airport transfer, blog and booking pages built for local search.",
    highlights: ["Premium dark design", "Fleet and airport pages", "Built for local search"],
  }),
  make({
    slug: "western-cars-crawley",
    name: "Western Cars Crawley",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Jul to Aug 2025",
    end: "2025-08",
    liveUrl: "https://www.westerncars.co.uk/",
    challenge:
      "Crawley is Western Cars' main office near Gatwick, and its site also had to link customers to every other branch.",
    solution:
      "The main Western Cars website with links to each branch, services, app downloads and online booking.",
    highlights: ["Links to every branch", "App download section", "Online booking"],
  }),
  make({
    slug: "western-cars-east-grinstead",
    name: "Western Cars East Grinstead",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Aug 2025",
    end: "2025-08",
    liveUrl: "https://www.westerncars-eastgrinstead.co.uk/",
    challenge: "East Grinstead customers needed a local site for transfers and private hire.",
    solution:
      "A local site with airport transfer pages, app links and a chat option for quick questions.",
    highlights: ["Airport transfer pages", "App store links", "Chat for quick questions"],
  }),
  make({
    slug: "western-cars-horley",
    name: "Western Cars Horley",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Aug to Sep 2025",
    end: "2025-09",
    liveUrl: "https://westerncars-horley.co.uk/",
    challenge: "Horley sits next to Gatwick, so most customers are looking for airport transfers.",
    solution:
      "A site focused on Gatwick transfers, group taxis and chauffeur services for Horley and Surrey.",
    highlights: ["Gatwick transfer focus", "Group taxi hire", "Chauffeur services"],
  }),
  make({
    slug: "western-cars-horsham",
    name: "Western Cars Horsham",
    type: "Website",
    group: "western-cars",
    category: "Taxi & private hire website",
    period: "Sep 2025",
    end: "2025-09",
    liveUrl: "https://www.westerncars-horsham.co.uk/",
    challenge:
      "Horsham customers wanted 24/7 taxis and clear fares across a wide area of West Sussex.",
    solution: "A Horsham site with 24/7 taxis, fixed fares and service area pages.",
    highlights: ["24/7 taxi service", "Fixed fares", "Service area pages"],
  }),
  make({
    slug: "western-cars-redesign-concept",
    name: "Western Cars Redesign Concept",
    type: "Concept",
    group: "western-cars",
    category: "Website concept",
    period: "Aug 2026",
    end: "2026-08",
    liveUrl: "https://western-cars-website-prototype.vercel.app/",
    challenge: "Western Cars wanted to explore a more premium brand look for the future.",
    solution:
      "A luxury concept with a cinematic hero, light and dark modes and a simpler booking path.",
    highlights: ["Light and dark modes", "Cinematic hero", "Simpler booking path"],
  }),
  // Internal tool: no liveUrl, never linked anywhere.
  make({
    slug: "western-cars-staff-registration",
    name: "Western Cars Staff Registration",
    type: "Tool",
    group: "western-cars",
    category: "Internal tool",
    period: "Sep 2026",
    end: "2026-09",
    laptopOnly: true,
    challenge:
      "Hiring new drivers meant collecting the same personal and employment details on paper.",
    solution:
      "A step-by-step online registration form for new starters covering personal, employment, family and consent details, ready to save or print.",
    highlights: [
      "Five clear steps",
      "Save draft and continue later",
      "Printable registration document",
    ],
    imageAlt: "Registration form in the Western Cars staff registration tool",
  }),

  /* Other clients */
  make({
    slug: "humandata-labs",
    name: "HumanData Labs",
    type: "Website",
    group: "other",
    category: "AI data company website",
    period: "Oct 2026",
    end: "2026-10",
    featured: 4,
    liveUrl: "https://humandatalabs.tech/",
    challenge:
      "HumanData Labs serves two audiences at once: AI and robotics teams who buy data, and vendors who supply it.",
    solution:
      "A clear site with separate paths for AI teams and vendor partners, dataset licensing and quality pages, and request and application flows.",
    highlights: [
      "Separate paths for buyers and vendors",
      "Dataset request flow",
      "Vendor partner application",
    ],
  }),
  make({
    slug: "bloom-studio",
    name: "Bloom Studio",
    type: "Demo",
    group: "other",
    category: "Salon website",
    period: "Aug 2026",
    end: "2026-08",
    description:
      "A sample salon website showing how AI concierge features handle bookings and questions for UK salons.",
    liveUrl: "https://bloom.incodet.com",
    challenge: "UK salons lose bookings when the phone rings during appointments.",
    solution:
      "A sample salon website showing how an AI concierge answers questions and handles bookings.",
    highlights: ["AI concierge demo", "Online booking flow", "Salon service pages"],
  }),
  make({
    slug: "barkers-executive",
    name: "Barkers Executive Cars",
    type: "Website",
    group: "other",
    category: "Executive car service website",
    period: "Jul 2026",
    end: "2026-07",
    featured: 2,
    liveUrl: "https://barkersexecutive.vercel.app/",
    challenge:
      "Barkers needed to look as premium online as its executive cars to win corporate and Gatwick transfer clients.",
    solution:
      "A dark, premium site with a rolling information bar, corporate travel pages, areas covered and quick booking.",
    highlights: ["Premium dark design", "Corporate travel pages", "Quick booking"],
  }),
  make({
    slug: "brhex-studio",
    name: "BRHEX Studio",
    type: "Platform",
    group: "other",
    category: "Real estate platform",
    title: "A Combined 360° Tour & Auto-Floorplan Platform",
    period: "Jun to Jul 2026",
    end: "2026-07",
    featured: 6,
    laptopOnly: true,
    description:
      "Proof of concept for a white-label real estate media platform: a 360° WebGL tour viewer and an SVG floor plan engine in one, with lead capture and custom branding.",
    tags: ["Next.js", "WebGL", "SVG", "Responsive"],
    challenge:
      "Real estate agents often use one vendor for 360° tours and another for floor plans, each with its own branding. We call it the double vendor trap.",
    solution:
      "One white-label platform with a 360° WebGL tour viewer with hotspots, an SVG floor plan engine with a one-click toggle between the two, lead capture and custom branding.",
    highlights: [
      "360° WebGL tour viewer with hotspots",
      "SVG floor plan engine with a one-click toggle",
      "Lead capture and custom branding",
    ],
    liveUrl: "https://virtual-tour-poc.vercel.app/tour/50ad98c9",
    liveLabel: "View Live Demo",
    imageAlt: "360° tour viewer in the BRHEX Studio platform",
  }),
  make({
    slug: "gm-taxis-lewes",
    name: "GM Taxis Lewes",
    type: "Website",
    group: "other",
    category: "Taxi company website",
    period: "Jun 2026",
    end: "2026-06",
    featured: 3,
    liveUrl: "https://gmtaxislewes.co.uk/",
    challenge:
      "GM Taxis is a long-standing Lewes firm opposite the station, but its website did not match its local reputation.",
    solution:
      "A friendly, modern site covering airport runs, school runs, executive travel and nights out, with click-to-call and online booking.",
    highlights: [
      "Click-to-call everywhere",
      "Service pages for every journey type",
      "Online booking",
    ],
  }),
  make({
    slug: "a1-airport-cars",
    name: "A1 Airport Cars Worthing",
    type: "Website",
    group: "other",
    category: "Airport taxi website",
    period: "Sep to Oct 2025",
    end: "2025-10",
    liveUrl: "https://a1airportcarsworthing.vercel.app/",
    challenge:
      "Customers had to call A1 just to learn the basics about airport runs from Worthing.",
    solution:
      "A bold site that puts the phone number, flight tracking, 24 hour bookings and vehicles from 1 to 7 seats front and center.",
    highlights: ["Flight tracking explained", "24 hour bookings", "Vehicles from 1 to 7 seats"],
  }),
  {
    ...make({
      slug: "incblog",
      name: "IncBlog",
      type: "Platform",
      group: "other",
      period: "",
      end: "",
      challenge: "",
      solution: "",
      highlights: [],
    }),
    todo: true,
  },
  {
    ...make({
      slug: "incodere",
      name: "Incodere",
      type: "Platform",
      group: "other",
      period: "",
      end: "",
      challenge: "",
      solution: "",
      highlights: [],
    }),
    todo: true,
  },
  {
    ...make({
      slug: "vyra-shops",
      name: "Vyra Shops",
      type: "Website",
      group: "other",
      period: "",
      end: "",
      challenge: "",
      solution: "",
      highlights: [],
      liveUrl: "https://vyrashops.com/",
    }),
    todo: true,
  },
];

/** Visible case studies: Western Cars group first, then other clients, each newest first. */
export const caseStudies = visible(all, [
  "name",
  "category",
  "description",
  "period",
  "challenge",
  "solution",
  "highlights",
]);

export const featuredCaseStudies = caseStudies
  .filter((c) => c.featured)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

export const westernCarsIntro =
  "Western Cars runs taxi and private hire offices across Sussex. We built their location websites, a central AI content hub and internal tools. An operations platform is in development.";
export const westernCarsInDevelopment = "Operations platform (in development)";

export type CaseStudyFilter = "all" | "western-cars" | "other" | "platforms" | "concepts";
export const caseStudyFilters: { key: CaseStudyFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "western-cars", label: "Western Cars" },
  { key: "other", label: "Other clients" },
  { key: "platforms", label: "Platforms & tools" },
  { key: "concepts", label: "Concepts & demos" },
];
export function filterCaseStudies(list: CaseStudy[], f: CaseStudyFilter) {
  switch (f) {
    case "western-cars":
      return list.filter((c) => c.group === "western-cars");
    case "other":
      return list.filter((c) => c.group === "other");
    case "platforms":
      return list.filter((c) => c.type === "Platform" || c.type === "Tool");
    case "concepts":
      return list.filter((c) => c.type === "Concept" || c.type === "Demo");
    default:
      return list;
  }
}

/** Shared "How we delivered it" wording, chosen by project type. */
export function deliverySteps(c: CaseStudy) {
  const platform = c.type === "Platform" || c.type === "Tool";
  return platform
    ? [
        { title: "Plan", body: "We agreed the workflow, users and data with the client." },
        { title: "Design", body: "We designed simple screens around that workflow." },
        { title: "Build", body: "We built the platform, its data and its connections." },
        { title: "Launch", body: "We tested with real use, launched and supported the team." },
      ]
    : [
        {
          title: "Plan",
          body: "We mapped the services, pages and the questions customers ask most.",
        },
        { title: "Design", body: "We designed mobile-first screens with booking always in reach." },
        {
          title: "Build",
          body: "We built the site, connected booking and contact options and set up search basics.",
        },
        {
          title: "Launch",
          body: "We tested on phones and desktop, went live and kept improving after launch.",
        },
      ];
}

export type ShowcaseItem = {
  key: string;
  name: string;
  description: string;
  url: string;
  badge: "Demo" | "Concept" | "Live Now";
  tint: string;
  /** Wide device mockup or desktop screenshot. */
  image: string;
};

export function showcaseBadge(type: CaseStudyType): ShowcaseItem["badge"] {
  return type === "Demo" ? "Demo" : type === "Concept" ? "Concept" : "Live Now";
}

/** Work carousel: every visible project with a live URL, newest first. Unlinked tools are never included. */
export const showcase: ShowcaseItem[] = caseStudies
  .filter((c): c is CaseStudy & { liveUrl: string } => Boolean(c.liveUrl))
  .sort((a, b) => b.end.localeCompare(a.end))
  .map((c) => ({
    key: c.slug,
    name: c.name,
    description: c.description,
    url: c.liveUrl,
    badge: showcaseBadge(c.type),
    tint: c.tint,
    image: c.mockup ? mockupSm(c.mockup) : c.image.src,
  }));
