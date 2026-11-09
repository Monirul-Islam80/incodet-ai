import { describe, expect, it } from "vitest";
import { deckWork, deckPrimaryWork, deckMoreWork, deckStarter } from "@/content/deck";
import { plans } from "@/content/plans";
import { deckIndexFromHash, stackedDeckIndex, DECK_STACKED_QUERY } from "@/lib/deck-navigation";

describe("company deck navigation", () => {
  it("opens slide 1 without a hash", () => expect(deckIndexFromHash("", 23)).toBe(0));
  it("opens the requested shared slide", () => {
    expect(deckIndexFromHash("#5", 23)).toBe(4);
    expect(deckIndexFromHash("#10", 23)).toBe(9);
  });
  it("limits stacked observation to portrait screens below 768px", () => {
    expect(DECK_STACKED_QUERY).toBe("screen and (max-width: 767px) and (orientation: portrait)");
  });
  it("selects the slide at the reading line rather than the last visible entry", () => {
    expect(
      stackedDeckIndex(
        [
          { top: -540, bottom: 0 },
          { top: 0, bottom: 600 },
          { top: 600, bottom: 1200 },
        ],
        160,
      ),
    ).toBe(1);
    expect(stackedDeckIndex([{ top: 600, bottom: 1200 }], 160)).toBeUndefined();
  });
});

describe("company deck content rules", () => {
  it("excludes all unlinked and incomplete projects", () => {
    expect(deckWork.length).toBeGreaterThan(0);
    expect(
      deckWork.every((project) => Boolean(project.liveUrl) && !project.todo && project.image.ready),
    ).toBe(true);
  });
  it("never includes the staff registration tool", () => {
    expect(deckWork.some((project) => project.slug === "western-cars-staff-registration")).toBe(
      false,
    );
  });
  it("keeps Bloom explicitly a Demo", () => {
    expect(deckPrimaryWork.find((project) => project.slug === "bloom-studio")?.type).toBe("Demo");
  });
  it("keeps additional featured work in the more-work group", () => {
    expect(deckMoreWork.map((project) => project.slug)).toEqual([
      "gm-taxis-lewes",
      "western-cars-content-hub",
    ]);
  });
  it("reads Starter pricing and timeline from the original plan", () => {
    expect(deckStarter).toBe(plans.find((plan) => plan.id === "starter"));
    expect(deckStarter?.timeline).toBe("Live in 1 to 2 weeks");
  });
});
