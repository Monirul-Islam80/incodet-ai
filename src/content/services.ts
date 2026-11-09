import type { FaqItem } from "./faq";
import { faqFor } from "./faq";
import type { TempImageId } from "./tempImages";

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  color: string;
  to: string;
  heroTitle: string;
  tags: string[];
  features: { title: string; body: string }[];
  faq: FaqItem[];
  images: string[];
  ui?: "call" | "chat";
  related: string[];
  comparison?: boolean;
  /**
   * Temporary images (docs/temp-images.md) for slots that have no real work yet:
   * strip fills the empty homepage tiles in order, hero the page and /services image,
   * before/after the comparison slider. Remove once real images exist.
   */
  temp?: { strip?: TempImageId[]; hero?: TempImageId; before?: TempImageId; after?: TempImageId };
};
const features = (rows: [string, string][]) => rows.map(([title, body]) => ({ title, body }));
const questions = (rows: [string, string][]): FaqItem[] =>
  rows.map(([question, answer]) => ({ question, answer }));
export const services: Service[] = [
  {
    id: "web-development",
    temp: { before: "webdev-bloom-before", after: "webdev-bloom-after" },
    title: "Websites & Web Development",
    short: "Fast websites that win customers",
    description:
      "We design and build modern, mobile-first websites with online booking, clear service pages and search basics, so more visitors turn into customers.",
    color: "bg-service-web",
    to: "/services/web-development",
    heroTitle: "Websites & Web Development for Local Businesses",
    tags: [
      "Website design",
      "Online booking",
      "Mobile-first",
      "Local SEO",
      "Speed",
      "Hosting & care",
    ],
    features: features([
      ["Custom design", "A site that looks like your brand, not a template."],
      ["Online booking", "Customers book online without calling."],
      ["Service and area pages", "Clear pages for every service and town you cover."],
      ["Search basics", "Titles, structured data and speed set up from day one."],
      ["Easy updates", "Change text and photos without a developer."],
      ["Care plan", "Hosting, updates and fixes for $19 a month."],
    ]),
    faq: questions([
      ["How long does a website take?", "Starter websites launch in 1 to 2 weeks."],
      [
        "Can I update the site myself?",
        "Yes. You can change text and photos yourself, or we do it for you on the care plan.",
      ],
      [
        "Can you redesign my current site?",
        "Yes. We keep what works, fix what does not and move your content across.",
      ],
    ]),
    images: [
      "western-cars-brighton",
      "gm-taxis-lewes",
      "barkers-executive",
      "humandata-labs",
      "a1-airport-cars",
    ],
    related: ["western-cars-brighton", "gm-taxis-lewes", "barkers-executive"],
    comparison: true,
  },
  {
    id: "ai-calling-agent",
    temp: { strip: ["calling-phone-desk"] },
    title: "24/7 AI Calling Agent",
    short: "Never miss a call again",
    description:
      "An AI receptionist that answers every call, books appointments, answers common questions and sends you the details, day and night.",
    color: "bg-service-calling",
    to: "/services/ai-calling-agent",
    heroTitle: "24/7 AI Calling Agent for Your Business",
    tags: [
      "24/7 answering",
      "Appointment booking",
      "Owner alerts",
      "Custom voice",
      "Call summaries",
      "Calendar sync",
    ],
    features: features([
      ["Answers every call", "Day, night and weekends, with no hold music."],
      ["Books appointments", "Straight into your calendar, with the caller's details."],
      ["Answers common questions", "Prices, hours, areas and services, in your words."],
      ["Sends you the details", "A summary by email or WhatsApp after every call."],
      ["Flags urgent calls", "Urgent messages reach you straight away."],
      ["Pay for what you use", "300 minutes a month on Growth, extra minutes $0.20 only if used."],
    ]),
    faq: questions([
      [
        "Will callers know it is an AI?",
        "Yes. The agent introduces itself as a virtual assistant for your business.",
      ],
      [
        "What happens with an urgent call?",
        "The agent takes a message marked urgent and alerts you straight away.",
      ],
      [
        "How long does setup take?",
        "The Growth plan, with the calling agent, goes live in 2 to 3 weeks.",
      ],
    ]),
    images: ["bloom-studio"],
    ui: "call",
    related: ["bloom-studio"],
  },
  {
    id: "ai-chatbot",
    temp: { strip: ["chatbot-bloom-assistant"] },
    title: "AI Website Chatbot",
    short: "Answers on your site, around the clock",
    description:
      "A chatbot trained on your services, prices and hours that replies instantly, captures leads and books customers straight from your website.",
    color: "bg-service-chat",
    to: "/services/ai-chatbot",
    heroTitle: "AI Website Chatbot for Your Business",
    tags: [
      "Website chat",
      "Lead capture",
      "Bookings",
      "Trained on your business",
      "Owner alerts",
      "Multi-page",
    ],
    features: features([
      ["Instant answers", "Replies in seconds to questions about your services."],
      ["Captures leads", "Collects names, numbers and what the customer needs."],
      ["Books customers", "Sends visitors straight to an open booking slot."],
      ["Trained on your business", "Uses your prices, hours and policies, nothing generic."],
      ["Owner alerts", "You get every new lead by email or WhatsApp."],
      ["Works on every page", "One small widget on your whole site."],
    ]),
    faq: questions([
      [
        "Can it handle questions it does not know?",
        "It says it is not sure and takes the customer's details so you can reply.",
      ],
      ["Can I buy the chatbot on its own?", "Yes. Every feature is also available on its own."],
      ["Which websites does it work with?", "Any website. It is one small code snippet."],
    ]),
    images: ["bloom-studio"],
    ui: "chat",
    related: ["bloom-studio"],
  },
  {
    id: "app-development",
    temp: {
      strip: ["app-wireframe-paper", "app-wireframe-blue"],
      hero: "app-wireframe-paper-wide",
      before: "appdev-humandata-mobile-before",
      after: "appdev-humandata-mobile-after",
    },
    title: "Mobile App Development",
    short: "iOS and Android apps, built to last",
    description:
      "We plan, design and build mobile apps for bookings, loyalty, ordering and internal teams, with a clean admin panel behind them.",
    color: "bg-service-app",
    to: "/services/app-development",
    heroTitle: "Mobile App Development for iOS and Android",
    tags: [
      "iOS",
      "Android",
      "Cross-platform",
      "Admin panel",
      "Push notifications",
      "App store launch",
    ],
    features: features([
      ["Plan the right app", "We agree features and screens before building."],
      ["Design", "Simple, polished screens for iPhone and Android."],
      ["Build", "One codebase for both platforms where it fits."],
      ["Admin panel", "Manage users, bookings and content from the web."],
      ["Notifications", "Reminders and updates that bring users back."],
      ["Store launch", "We handle App Store and Google Play submission."],
    ]),
    faq: questions([
      ["How long does an app take?", "Most apps take 4 to 8 weeks, on our Scale plan."],
      ["iPhone, Android or both?", "Usually both from one codebase, so you pay for one build."],
      ["Do you maintain the app after launch?", "Yes, through a monthly care plan."],
    ]),
    images: [],
    related: [],
    comparison: true,
  },
  {
    id: "ui-ux-product-design",
    temp: {
      strip: ["uiux-humandata-mobile"],
      before: "uiux-bloom-mobile-before",
      after: "uiux-bloom-mobile-after",
    },
    title: "UI/UX & Product Design",
    short: "Design that makes products easy to use",
    description:
      "Research, user flows, wireframes and polished screens for websites, apps and dashboards, ready for development.",
    color: "bg-service-design",
    to: "/services/ui-ux-product-design",
    heroTitle: "UI/UX & Product Design for Websites and Apps",
    tags: ["UX research", "User flows", "Wireframes", "UI design", "Prototypes", "Design systems"],
    features: features([
      ["Research", "We learn who your users are and what they need."],
      ["User flows", "The shortest path to every important action."],
      ["Wireframes", "Layouts agreed before any colour or detail."],
      ["UI design", "Polished screens that match your brand."],
      ["Prototypes", "Clickable designs you can test before building."],
      ["Design systems", "Reusable components so every new screen stays consistent."],
    ]),
    faq: questions([
      [
        "Can you only design, without building?",
        "Yes. You get ready-to-build design files and a handover.",
      ],
      ["Which tools do you design in?", "Figma, with files shared with your team."],
      [
        "Can you improve an existing product?",
        "Yes. We review it, find what slows users down and redesign those parts first.",
      ],
    ]),
    images: ["western-cars-redesign-concept", "bloom-studio", "brighton-taxi"],
    related: ["western-cars-redesign-concept", "bloom-studio", "brighton-taxi"],
    comparison: true,
  },
  {
    id: "software",
    temp: { strip: ["software-portal-demo", "software-brhex-floorplan"] },
    title: "SaaS & Custom Software",
    short: "Platforms built around how you work",
    description:
      "CRMs, dashboards, booking systems, client portals and full SaaS platforms, planned with you and built to scale.",
    color: "bg-service-software",
    to: "/custom-software",
    heroTitle: "SaaS & Custom Software Built Around Your Business",
    tags: [
      "CRMs",
      "Dashboards",
      "Booking systems",
      "Client portals",
      "SaaS platforms",
      "Integrations",
    ],
    features: features([
      ["CRMs", "Keep every customer, job and conversation in one place."],
      ["Dashboards", "See bookings, calls and sales at a glance."],
      ["Booking systems", "Online booking that fits your services, staff and hours."],
      ["Client portals", "Give clients one place for progress, files and invoices."],
      ["Education platforms", "Courses, students and progress tracking in one system."],
      [
        "Medical and clinic platforms",
        "Appointments, patient records and reminders built for clinics.",
      ],
    ]),
    faq: faqFor([
      "What does each plan include?",
      "How long does it take?",
      "What happens after launch?",
    ]),
    images: ["brhex-studio", "western-cars-content-hub"],
    related: ["brhex-studio", "western-cars-content-hub"],
  },
  {
    id: "business-automation",
    title: "Business Automation",
    short: "Busywork that runs on its own",
    description:
      "Reminders, follow-ups, notifications and data syncing between your tools, so your team spends time on customers, not admin.",
    color: "bg-service-automation",
    to: "/services/business-automation",
    heroTitle: "Business Automation for Your Everyday Work",
    tags: ["Reminders", "Follow-ups", "Notifications", "Tool syncing", "Reports", "Workflows"],
    features: features([
      ["Booking reminders", "Fewer no-shows with automatic texts and emails."],
      ["Follow-ups", "Quote and review requests sent at the right time."],
      ["Owner notifications", "Know about every booking, lead and payment."],
      ["Tool syncing", "Your calendar, CRM and sheets stay in sync."],
      ["Simple reports", "A weekly summary of what came in."],
      ["Custom workflows", "Repetitive steps turned into one click or none."],
    ]),
    faq: questions([
      [
        "Which tools can you connect?",
        "Most tools with an API or Zapier-style connection. We check yours on the discovery call.",
      ],
      ["Do I need new software?", "Usually not. We automate the tools you already use."],
      [
        "How is it priced?",
        "As a one-time setup plus a small monthly fee, quoted after the discovery call.",
      ],
    ]),
    images: ["western-cars-content-hub"],
    related: ["western-cars-content-hub"],
  },
  {
    id: "social-media-growth",
    temp: {
      strip: ["social-studio-lights", "social-planning-flatlay"],
      hero: "social-studio-lights-wide",
    },
    title: "Social Media Growth",
    short: "More reach, more enquiries",
    description:
      "Content planning, design and paid campaigns on Facebook, Instagram and TikTok that send local customers to your website and booking page.",
    color: "bg-service-social",
    to: "/services/social-media-growth",
    heroTitle: "Social Media Growth for Local Businesses",
    tags: [
      "Content planning",
      "Post design",
      "Short videos",
      "Paid ads",
      "Facebook & Instagram",
      "TikTok",
    ],
    features: features([
      ["Content plan", "A monthly plan built around your services and seasons."],
      ["Post design", "On-brand posts and stories, ready to publish."],
      ["Short videos", "Simple reels and TikToks that show your work."],
      ["Paid campaigns", "Local ads that send people to your booking page."],
      ["Profile setup", "Bios, links and highlights that turn visits into enquiries."],
      ["Monthly review", "What worked, what did not and what we change next."],
    ]),
    faq: questions([
      ["Do you post for us?", "Yes, we can schedule and post, or hand you ready-made content."],
      [
        "Is ad spend included?",
        "No. Ad spend is paid directly to the platform; our fee covers planning, design and management.",
      ],
      ["Which platforms?", "Facebook, Instagram and TikTok."],
    ]),
    images: [],
    related: [],
  },
];
export function getService(id: string) {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error("Unknown service");
  return service;
}
