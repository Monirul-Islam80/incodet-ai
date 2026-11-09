import { visible } from "./visible";

export type Plan = {
  id: string;
  name: string;
  audience: string;
  setup: string;
  monthly: string;
  includes: string[];
  timeline: string;
  featured?: boolean;
  todo?: boolean;
};

const all: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    audience: "For small businesses",
    setup: "from $499",
    monthly: "Optional $19/month care (hosting, updates)",
    includes: ["Website", "Online booking", "Booking emails"],
    timeline: "Live in 1 to 2 weeks",
  },
  {
    id: "growth",
    name: "Growth",
    audience: "For growing businesses",
    setup: "from $999",
    monthly: "from $149/month, includes 300 AI call minutes",
    includes: [
      "Everything in Starter",
      "AI website chatbot",
      "24/7 AI calling agent",
      "Owner alerts by email and WhatsApp",
    ],
    timeline: "Live in 2 to 3 weeks",
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    audience: "For established businesses",
    setup: "from $3,499",
    monthly: "from $299/month",
    includes: [
      "Multi-page or SaaS-level platform",
      "AI automation",
      "Client dashboards",
      "Custom integrations",
    ],
    timeline: "Live in 4 to 8 weeks",
  },
];

export const plans = visible(all, ["name", "audience", "setup", "monthly", "includes", "timeline"]);
export const plansNote =
  "Extra call minutes $0.20/min, billed only if used. Every feature is also available on its own.";
