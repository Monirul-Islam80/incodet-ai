import { z } from "zod";

export const contactPlans = ["starter", "growth", "scale", "not_sure"] as const;
export type ContactPlan = (typeof contactPlans)[number];

export const planLabels: Record<ContactPlan, string> = {
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
  not_sure: "Not sure yet",
};

export const contactFields = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(100, "Please keep this under 100 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  business_name: z
    .string()
    .trim()
    .max(120, "Please keep this under 120 characters.")
    .optional()
    .default(""),
  plan: z.enum(contactPlans),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(3000, "Please keep this under 3000 characters."),
});

export const contactPayload = contactFields.extend({
  source_page: z.string().trim().max(60).default("unknown"),
  website: z.string().max(500).optional().default(""), // honeypot
  rendered_at: z.number(),
});

export type ContactPayload = z.input<typeof contactPayload>;

export const MIN_FILL_MS = 3000;
export const RATE_LIMIT_PER_HOUR = 5;

export function isPlan(v: unknown): v is ContactPlan {
  return typeof v === "string" && (contactPlans as readonly string[]).includes(v);
}
