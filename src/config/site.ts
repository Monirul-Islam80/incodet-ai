import { industries } from "@/content/industries";
// Single source of truth for brand and contact details. Never hardcode these elsewhere.
export const site = {
  name: "Incodet",
  siteUrl: "https://incodet.com",
  logoUrl: "",
  email: "hello@incodet.com",
  phoneDisplay: "+61 451 526 342",
  phoneHref: "tel:+61451526342",
  whatsapp:
    "https://wa.me/61451526342?text=Hi%20Incodet%2C%20I%27d%20like%20to%20discuss%20a%20project.",
  address: "Camberwarra Drive, Craigie WA 6025, Australia",
  locationLabel: "Perth, Western Australia",
  teamsLabel: "Teams in Australia, UK, Canada & Bangladesh",
  teamsCitiesLabel: "Teams in Perth, Dhaka, Sylhet, Montreal, Leeds and Birmingham",
  availabilityLabel: "Available 24/7 across our teams in Australia, UK, Canada and Bangladesh",
  locations: [
    { city: "Perth", country: "Australia", code: "AU", label: "Head office" },
    { city: "Dhaka", country: "Bangladesh", code: "BD" },
    { city: "Sylhet", country: "Bangladesh", code: "BD" },
    { city: "Montreal", country: "Canada", code: "CA" },
    { city: "Leeds", country: "United Kingdom", code: "GB" },
    { city: "Birmingham", country: "United Kingdom", code: "GB" },
  ],
  // Footer contact card. Phone, WhatsApp and email reuse the values above.
  // Photo: initials placeholder until a real photo exists (docs/temp-images.md).
  ceo: {
    name: "Asif Khan",
    title: "CEO",
    initials: "AK",
    location: "Perth, Australia",
    linkedin: "https://www.linkedin.com/in/asif-khan-0b4a00312",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Camberwarra+Drive+Craigie+WA+6025+Australia",
  socials: {
    linkedin: "https://www.linkedin.com/company/incodet/",
    facebook: "",
    instagram: "",
    tiktok: "",
    threads: "",
  },
  // Analytics: provider "plausible" (id = your domain) or "ga4" (id = G-XXXX). Empty = no banner, no scripts.
  analytics: { provider: "" as "" | "plausible" | "ga4", id: "" },
  // Pexels clip 10651140 by Kostas Exarhos (free license), cropped, slowed and self-hosted.
  // src720 plays on screens under 768px.
  heroVideo: {
    src: "/videos/bg-hero-v2.mp4",
    src720: "/videos/bg-hero-v2.mp4",
    poster: "/videos/bg-hero-v2.mp4",
  },
} as const;

export type SocialKey = keyof typeof site.socials;

export const socialLabels: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  threads: "Threads",
};

/** Only socials with a non-empty URL. Unset socials are never shown. */
export const activeSocials = (Object.keys(site.socials) as SocialKey[])
  .filter((k) => site.socials[k])
  .map((k) => ({ key: k, label: socialLabels[k], href: site.socials[k] }));

export const pageLinks = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/custom-software", label: "Custom Software" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/book", label: "Book a Call" },
  { to: "/portal", label: "Client Portal" },
] as const;

export const industryLinks = industries.map((i) => ({ to: i.to, label: i.name, icon: i.icon }));
