import { z } from "zod";
import { booking, budgets, deliveryTimes, projectTypes } from "@/config/booking";

export function validTimezone(zone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone }).format();
    return true;
  } catch {
    return false;
  }
}
export const bookingFields = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name.").max(100),
  company_name: z.string().trim().min(2, "Please enter your company name.").max(120),
  company_email: z.string().trim().email("Please enter a valid company email.").max(255),
  phone: z.string().trim().max(40).default(""),
  project_type: z.enum(projectTypes),
  budget: z.enum(budgets),
  delivery_time: z.enum(deliveryTimes),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(3000),
});
export const bookingPayload = bookingFields.extend({
  slot_start: z.string().datetime(),
  visitor_timezone: z.string().max(100).refine(validTimezone),
  website: z.string().max(500).default(""),
  rendered_at: z.number().finite(),
});
export type BookingFields = z.infer<typeof bookingFields>;
export function horizon(now: number) {
  return now + booking.maxDaysAhead * 86400_000;
}
export function validSlot(start: number, now: number) {
  if (
    !Number.isFinite(start) ||
    start < now + booking.minNoticeHours * 3600_000 ||
    start > horizon(now)
  )
    return false;
  // Perth stays UTC+08:00 year-round; midnight and half hours align with the UTC slot grid.
  const business = new Date(start + 8 * 3600_000);
  return (
    booking.workingDays.some((d) => d === business.getUTCDay()) &&
    start % (booking.slotMinutes * 60_000) === 0
  );
}
export function generateSlots(now: number, taken: string[] = []) {
  const blocked = new Set(taken.map((s) => new Date(s).getTime()));
  const step = booking.slotMinutes * 60_000;
  const slots: string[] = [];
  for (
    let time = Math.ceil((now + booking.minNoticeHours * 3600_000) / step) * step;
    time <= horizon(now);
    time += step
  ) {
    if (validSlot(time, now) && !blocked.has(time)) slots.push(new Date(time).toISOString());
  }
  return slots;
}
export function dateKey(date: Date, zone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return ["year", "month", "day"].map((k) => parts.find((p) => p.type === k)?.value).join("-");
}
/** Older zone names some browsers still report, mapped to the names in the booking list. */
const zoneAliases: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Dacca": "Asia/Dhaka",
  Singapore: "Asia/Singapore",
  Japan: "Asia/Tokyo",
  GB: "Europe/London",
  "Europe/Belfast": "Europe/London",
  Eire: "Europe/Dublin",
  "Australia/West": "Australia/Perth",
  "Australia/ACT": "Australia/Sydney",
  "Australia/Canberra": "Australia/Sydney",
  "Australia/NSW": "Australia/Sydney",
  "Australia/Victoria": "Australia/Melbourne",
  "Australia/Queensland": "Australia/Brisbane",
  NZ: "Pacific/Auckland",
  "Canada/Eastern": "America/Toronto",
  "Canada/Pacific": "America/Vancouver",
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  "US/Pacific": "America/Los_Angeles",
};
/** The detected zone, renamed to its current name when the browser reports an old alias. */
export function canonicalZone(zone: string) {
  return zoneAliases[zone] ?? zone;
}
/** City part of an IANA zone, e.g. "America/Los_Angeles" becomes "Los Angeles". */
export function zoneCity(zone: string) {
  return (zone.split("/").pop() ?? zone).replace(/_/g, " ");
}
/** Current UTC offset of a zone at a given moment, e.g. "GMT+5:30" or "GMT+0". */
export function zoneOffset(zone: string, at: Date) {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  return name === "GMT" ? "GMT+0" : name;
}
/** Dropdown label, e.g. "London (GMT+0)". */
export function zoneLabel(zone: string, at: Date) {
  return `${zoneCity(zone)} (${zoneOffset(zone, at)})`;
}
export const timeGroups = ["Morning", "Afternoon", "Evening", "Night"] as const;
export function timeGroup(start: string, zone: string): (typeof timeGroups)[number] {
  const hour = Number(
    new Intl.DateTimeFormat("en", { timeZone: zone, hour: "numeric", hourCycle: "h23" }).format(
      new Date(start),
    ),
  );
  return hour >= 6 && hour < 12
    ? "Morning"
    : hour >= 12 && hour < 18
      ? "Afternoon"
      : hour >= 18
        ? "Evening"
        : "Night";
}
export function bookingPreselection(
  plan = "",
  service = "",
): Pick<BookingFields, "project_type" | "budget"> {
  const types: Record<string, BookingFields["project_type"]> = {
    "web-development": "Booking website",
    "ai-chatbot": "AI website chatbot",
    "ai-calling-agent": "24/7 AI calling agent",
    "app-development": "Mobile app",
    "ui-ux-product-design": "UI/UX design",
    software: "Custom software or SaaS",
    "custom-software": "Custom software or SaaS",
    "business-automation": "Business automation",
    "social-media-growth": "Social media growth",
  };
  const project_type =
    types[service] ??
    (plan === "starter"
      ? "Booking website"
      : plan === "growth"
        ? "Website + AI agent"
        : plan === "scale"
          ? "Custom software or SaaS"
          : "Not sure yet");
  return {
    project_type,
    budget:
      plan === "starter"
        ? "$500 to $1,000"
        : plan === "growth"
          ? "$1,000 to $3,500"
          : plan === "scale"
            ? "$3,500 to $10,000"
            : "Under $500",
  };
}
function calendarDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(".000", "");
}
export function googleCalendarLink(start: string) {
  const end = new Date(new Date(start).getTime() + booking.slotMinutes * 60_000).toISOString();
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `Incodet ${booking.meetingLabel}`, dates: `${calendarDate(start)}/${calendarDate(end)}`, details: "We will email you a meeting link before the call." })}`;
}
export function bookingIcs(start: string, id: string, now: number) {
  const end = new Date(new Date(start).getTime() + booking.slotMinutes * 60_000).toISOString();
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Incodet//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${id}@incodet.com`,
    `DTSTAMP:${calendarDate(new Date(now).toISOString())}`,
    `DTSTART:${calendarDate(start)}`,
    `DTEND:${calendarDate(end)}`,
    `SUMMARY:Incodet ${booking.meetingLabel}`,
    "DESCRIPTION:We will email you a meeting link before the call.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
