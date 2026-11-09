import { describe, expect, it } from "vitest";
import {
  booking,
  budgets,
  deliveryTimes,
  listedZones,
  projectTypes,
  zoneGroups,
} from "@/config/booking";
import {
  bookingPreselection,
  canonicalZone,
  dateKey,
  generateSlots,
  googleCalendarLink,
  bookingIcs,
  timeGroup,
  validSlot,
  zoneLabel,
} from "@/lib/booking";
import { MIN_FILL_MS, RATE_LIMIT_PER_HOUR } from "@/lib/contact-schema";
import { site } from "@/config/site";

const now = Date.parse("2026-11-07T03:00:00Z");
describe("booking rules", () => {
  it("uses Perth as the business timezone", () => expect(booking.timezone).toBe("Australia/Perth"));
  it("opens all seven weekdays", () => expect(booking.workingDays).toEqual([0, 1, 2, 3, 4, 5, 6]));
  it("uses 30 minute slots", () =>
    expect(
      new Date(generateSlots(now)[1] ?? "").getTime() -
        new Date(generateSlots(now)[0] ?? "").getTime(),
    ).toBe(30 * 60_000));
  it("blocks times inside 12 hours notice", () => {
    expect(validSlot(now + 11 * 3600_000, now)).toBe(false);
    expect(validSlot(now + 12 * 3600_000, now)).toBe(true);
  });
  it("blocks times more than 30 days ahead", () => {
    expect(validSlot(now + 30 * 86400_000, now)).toBe(true);
    expect(validSlot(now + 30 * 86400_000 + 1800_000, now)).toBe(false);
  });
  it("excludes taken slots", () => {
    const start = "2026-11-07T15:00:00Z";
    expect(generateSlots(now, [start])).not.toContain(start);
  });
  it("has overnight availability", () =>
    expect(generateSlots(now)).toContain("2026-11-08T16:00:00.000Z"));
  it("uses visitor timezone for calendar date", () =>
    expect(dateKey(new Date("2026-11-07T23:00:00Z"), "Asia/Dhaka")).toBe("2026-11-08"));
  it("groups visitor morning hours", () =>
    expect(timeGroup("2026-11-07T03:00:00Z", "Asia/Dhaka")).toBe("Morning"));
  it("groups visitor afternoon hours", () =>
    expect(timeGroup("2026-11-07T08:00:00Z", "Asia/Dhaka")).toBe("Afternoon"));
  it("groups visitor evening hours", () =>
    expect(timeGroup("2026-11-07T14:00:00Z", "Asia/Dhaka")).toBe("Evening"));
  it("groups visitor night hours", () =>
    expect(timeGroup("2026-11-07T20:00:00Z", "Asia/Dhaka")).toBe("Night"));
  it("keeps a three second minimum fill time", () => expect(MIN_FILL_MS).toBe(3000));
  it("limits submissions to five per hour", () => expect(RATE_LIMIT_PER_HOUR).toBe(5));
  it("uses all supplied project types", () =>
    expect(projectTypes).toEqual([
      "Booking website",
      "AI website chatbot",
      "24/7 AI calling agent",
      "Website + AI agent",
      "Mobile app",
      "UI/UX design",
      "Custom software or SaaS",
      "Business automation",
      "Social media growth",
      "Not sure yet",
    ]));
  it("uses supplied budgets", () =>
    expect(budgets).toEqual([
      "Under $500",
      "$500 to $1,000",
      "$1,000 to $3,500",
      "$3,500 to $10,000",
      "$10,000+",
    ]));
  it("uses supplied delivery options", () =>
    expect(deliveryTimes).toEqual([
      "1 to 2 weeks",
      "2 to 4 weeks",
      "1 to 2 months",
      "2 months or more",
      "Flexible",
    ]));
  it("preselects Starter website and budget", () =>
    expect(bookingPreselection("starter")).toEqual({
      project_type: "Booking website",
      budget: "$500 to $1,000",
    }));
  it("preselects Growth combined project and budget", () =>
    expect(bookingPreselection("growth")).toEqual({
      project_type: "Website + AI agent",
      budget: "$1,000 to $3,500",
    }));
  it("preselects Scale software and budget", () =>
    expect(bookingPreselection("scale")).toEqual({
      project_type: "Custom software or SaaS",
      budget: "$3,500 to $10,000",
    }));
  it("preselects requested service over plan", () =>
    expect(bookingPreselection("growth", "ai-chatbot").project_type).toBe("AI website chatbot"));
  it("exports the exact 30 minute call to Google Calendar", () =>
    expect(new URL(googleCalendarLink("2026-11-08T16:00:00Z")).searchParams.get("dates")).toBe(
      "20261108T160000Z/20261108T163000Z",
    ));
  it("exports a UTC calendar event", () =>
    expect(bookingIcs("2026-11-08T16:00:00Z", "test", now)).toContain("DTEND:20261108T163000Z"));
  it("keeps the six supplied teams", () =>
    expect(site.locations.map((l) => l.city)).toEqual([
      "Perth",
      "Dhaka",
      "Sylhet",
      "Montreal",
      "Leeds",
      "Birmingham",
    ]));
});

describe("booking time zones", () => {
  it("offers the 21 requested zones in four regions", () => {
    expect(zoneGroups.map((g) => g.label)).toEqual(["Asia", "Europe", "Oceania", "North America"]);
    expect(listedZones).toHaveLength(21);
    expect(listedZones).toContain("Pacific/Auckland");
  });
  it("labels zones by city with the current offset", () => {
    const winter = new Date("2026-01-15T12:00:00Z");
    const summer = new Date("2026-07-15T12:00:00Z");
    expect(zoneLabel("Europe/London", winter)).toBe("London (GMT+0)");
    expect(zoneLabel("Europe/London", summer)).toBe("London (GMT+1)");
    expect(zoneLabel("Asia/Kolkata", winter)).toBe("Kolkata (GMT+5:30)");
    expect(zoneLabel("America/Los_Angeles", winter)).toBe("Los Angeles (GMT-8)");
    expect(zoneLabel("Australia/Perth", winter)).toBe("Perth (GMT+8)");
  });
  it("keeps the same UTC slot when the shown zone changes", () => {
    const slot = "2026-01-20T02:00:00.000Z";
    expect(dateKey(new Date(slot), "Australia/Sydney")).toBe("2026-01-20");
    expect(dateKey(new Date(slot), "America/New_York")).toBe("2026-01-19");
    expect(googleCalendarLink(slot)).toContain("20260120T020000Z");
  });
});

describe("detected time zone aliases", () => {
  it("maps old browser zone names to the listed zones", () => {
    expect(canonicalZone("Asia/Calcutta")).toBe("Asia/Kolkata");
    expect(canonicalZone("US/Pacific")).toBe("America/Los_Angeles");
    expect(canonicalZone("Africa/Lagos")).toBe("Africa/Lagos");
  });
});
