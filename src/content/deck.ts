import { caseStudies, featuredCaseStudies } from "./caseStudies";
import { plans } from "./plans";

/** Only complete, publicly linked projects can enter the company presentation. */
export const deckWork = caseStudies.filter(
  (project) => Boolean(project.liveUrl) && project.image.ready && !project.todo,
);
const primarySlugs = [
  "western-cars-brighton",
  "brhex-studio",
  "bloom-studio",
  "humandata-labs",
  "barkers-executive",
];
export const deckPrimaryWork = primarySlugs.flatMap((slug) => {
  const project = deckWork.find((project) => project.slug === slug);
  return project ? [project] : [];
});
export const deckMoreWork = featuredCaseStudies.filter(
  (project) => deckWork.includes(project) && !deckPrimaryWork.includes(project),
);
export const deckStarter = plans.find((plan) => plan.id === "starter");
export const deckProblems = [
  [
    "Missed calls",
    "Calls after hours and during jobs go to voicemail and the customer calls someone else.",
  ],
  ["No online booking", "Customers want to book at 10pm, not wait until you call back."],
  ["Slow follow-ups", "Quotes, reminders and review requests fall through the cracks."],
  ["Outdated website", "A slow, hard to use site sends visitors away before they enquire."],
] as const;
