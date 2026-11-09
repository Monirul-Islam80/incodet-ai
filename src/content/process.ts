export const processSteps = [
  {
    title: "Discovery Call",
    body: "We learn your business, your customers and what you need. Free, no commitment.",
    icon: "phone",
    chips: ["Free 30 min call", "Goals and pain points", "Rough scope"],
    images: ["project-goals", "customer-questions", "call-notes"],
  },
  {
    title: "Plan & Design",
    body: "We map the features, design the screens and agree on scope before building.",
    icon: "layers",
    chips: ["Feature list", "Screen designs", "Fixed quote"],
    images: ["feature-map", "screen-design", "scope-ready"],
  },
  {
    title: "Build & Integrate",
    body: "We build, connect your tools and show you progress every week.",
    icon: "hammer",
    chips: ["Weekly demos", "Booking and AI setup", "Tool connections"],
    images: ["booking-setup", "ai-agent-script", "integrations"],
  },
  {
    title: "Launch & Support",
    body: "We go live, test everything and stay on to support and improve it.",
    icon: "rocket",
    chips: ["Testing", "Go live", "Ongoing support"],
    images: ["launch-checklist", "go-live", "monthly-report"],
  },
] as const;
