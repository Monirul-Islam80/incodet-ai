import { describe, expect, it } from "vitest";
import { caseStudies, featuredCaseStudies, showcase, showcaseBadge } from "@/content/caseStudies";
import { industries } from "@/content/industries";
import { faq } from "@/content/faq";
import { reviews, reviewsToShow, sampleReviews } from "@/content/reviews";
import { plans } from "@/content/plans";

describe("content visibility", () => {
  it("classifies Demo projects separately, including Bloom Studio", () => {
    expect(showcaseBadge("Demo")).toBe("Demo");
    expect(showcase.find((c) => c.key === "bloom-studio")?.badge).toBe("Demo");
  });
  it("labels Concept projects as Concept", () => {
    expect(showcaseBadge("Concept")).toBe("Concept");
  });
  it.each(["Website", "Platform", "Tool"] as const)("labels %s projects Live Now", (type) => {
    expect(showcaseBadge(type)).toBe("Live Now");
  });
  it("hides todo case studies", () => {
    expect(caseStudies.map((c) => c.name)).not.toContain("Vyra Shops");
    expect(caseStudies.map((c) => c.name)).not.toContain("IncBlog");
  });
  it("features case studies in order", () => {
    expect(featuredCaseStudies.map((c) => c.name)).toEqual([
      "Western Cars Brighton",
      "Barkers Executive Cars",
      "GM Taxis Lewes",
      "HumanData Labs",
      "Western Cars Content Hub",
      "BRHEX Studio",
    ]);
  });
  it("never links the staff registration tool", () => {
    const staff = caseStudies.find((c) => c.slug === "western-cars-staff-registration");
    expect(staff).toBeDefined();
    expect(staff?.liveUrl).toBeUndefined();
    expect(showcase.map((s) => s.key)).not.toContain("western-cars-staff-registration");
  });
  it("has 18 case studies and 11 industries", () => {
    expect(caseStudies).toHaveLength(18);
    expect(industries).toHaveLength(11);
  });
  it("hides todo FAQ items", () => {
    expect(faq).toHaveLength(9);
    expect(faq.some((f) => f.question === "Who owns the website?")).toBe(true);
    expect(faq.some((f) => f.question === "Which languages does the AI agent speak?")).toBe(false);
  });
  it("has no reviews", () => {
    expect(reviews).toHaveLength(0);
  });
  it("never shows sample reviews in production", () => {
    expect(reviewsToShow(false)).toHaveLength(0);
    expect(reviewsToShow(true)).toHaveLength(6);
    expect(sampleReviews.every((r) => r.sample)).toBe(true);
    expect(reviews.some((r) => r.sample)).toBe(false);
  });
  it("features Growth", () => {
    expect(plans.find((p) => p.featured)?.name).toBe("Growth");
  });
});
