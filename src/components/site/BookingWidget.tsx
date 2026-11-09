import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, ArrowLeft, CalendarPlus, Download, Check } from "lucide-react";
import {
  booking,
  budgets,
  deliveryTimes,
  listedZones,
  projectTypes,
  zoneGroups,
} from "@/config/booking";
import {
  bookingFields,
  bookingIcs,
  bookingPreselection,
  canonicalZone,
  dateKey,
  generateSlots,
  googleCalendarLink,
  horizon,
  timeGroup,
  timeGroups,
  zoneCity,
  zoneLabel,
  type BookingFields,
} from "@/lib/booking";
import { submitBooking, takenBookingSlots } from "@/lib/booking.functions";
import { PillButton, pillButton } from "./Button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full min-w-0 rounded-md border border-ink/40 bg-background px-3 py-3 text-[16px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const defaultFields: BookingFields = {
  full_name: "",
  company_name: "",
  company_email: "",
  phone: "",
  project_type: "Not sure yet",
  budget: "Under $500",
  delivery_time: "Flexible",
  message: "",
};

export function BookingWidget({ plan = "", service = "" }: { plan?: string; service?: string }) {
  const [now, setNow] = useState<number | null>(null);
  const [zone, setZone] = useState("UTC");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [group, setGroup] = useState<(typeof timeGroups)[number]>("Morning");
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<BookingFields>({
    ...defaultFields,
    ...bookingPreselection(plan, service),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taken, setTaken] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const renderedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const submit = useServerFn(submitBooking);
  const availability = useServerFn(takenBookingSlots);

  useEffect(() => {
    const instant = Date.now();
    const detected = canonicalZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    setNow(instant);
    setZone(detected);
    setMonth(dateKey(new Date(instant), detected).slice(0, 7));
    renderedAt.current = instant;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    setFields((f) => ({ ...f, ...bookingPreselection(plan, service) }));
  }, [plan, service]);
  // availability comes from useServerFn, which returns a stable callback, so refresh is stable too.
  const refresh = useCallback(
    async (instant: number) => {
      setLoaded(false);
      try {
        setTaken(
          await availability({
            data: {
              start: new Date(instant).toISOString(),
              end: new Date(horizon(instant) + 86400_000).toISOString(),
            },
          }),
        );
        setLoaded(true);
      } catch {
        setError("Could not load available times. Please try again.");
      }
    },
    [availability],
  );

  useEffect(() => {
    if (now !== null) void refresh(now);
  }, [now, refresh]);
  const slots = useMemo(() => (now === null ? [] : generateSlots(now, taken)), [now, taken]);
  const byDay = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const start of slots) {
      const key = dateKey(new Date(start), zone);
      (result[key] ??= []).push(start);
    }
    return result;
  }, [slots, zone]);
  const daySlots = byDay[day] ?? [];
  const activeGroups = timeGroups.filter((g) => daySlots.some((s) => timeGroup(s, zone) === g));
  const currentGroup = activeGroups.includes(group) ? group : activeGroups[0];
  const visibleSlots = daySlots.filter((s) => timeGroup(s, zone) === currentGroup);
  const today = now === null ? "" : dateKey(new Date(now), zone);
  const lastDay = now === null ? "" : dateKey(new Date(horizon(now)), zone);
  const [year = 1970, monthNumber = 1] = month.split("-").map(Number);
  const daysInMonth =
    year && monthNumber ? new Date(Date.UTC(year, monthNumber, 0)).getUTCDate() : 0;
  const offset =
    year && monthNumber ? (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7 : 0;
  // Offsets use the moment the visitor is booking, so daylight saving is current. They are only
  // added after mount (when now is set): the server and the first client render show city names
  // only, so hydration never depends on the clock or on the time zone data of either side.
  const nameZone = (z: string) => (now === null ? zoneCity(z) : zoneLabel(z, new Date(now)));
  const zoneName = nameZone(zone);
  const dateLabel = slot
    ? new Intl.DateTimeFormat("en", {
        timeZone: zone,
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(slot))
    : "";
  function changeMonth(delta: number) {
    setMonth(dateKey(new Date(Date.UTC(year, monthNumber - 1 + delta, 15, 12)), "UTC").slice(0, 7));
  }
  function chooseDay(key: string) {
    setDay(key);
    setSlot("");
    setGroup(
      timeGroups.find((g) => (byDay[key] ?? []).some((s) => timeGroup(s, zone) === g)) ?? "Morning",
    );
  }
  function goStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function confirm(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = bookingFields.safeParse(fields);
    if (!parsed.success) {
      const messages: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        messages[String(i.path[0])] ??= i.message;
      });
      setErrors(messages);
      requestAnimationFrame(() =>
        document.getElementById(`booking-${Object.keys(messages)[0]}`)?.focus(),
      );
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const result = await submit({
        data: {
          ...parsed.data,
          slot_start: slot,
          visitor_timezone: zone,
          rendered_at: renderedAt.current,
          website: honeypot.current?.value ?? "",
        },
      });
      if (result.ok) {
        setConfirmationId(result.id);
        goStep(3);
      } else {
        setError(result.error);
        if (result.conflict) {
          setSlot("");
          goStep(1);
          await refresh(Date.now());
        }
      }
    } catch {
      setError("Could not save your booking. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const blob = new Blob([bookingIcs(slot, confirmationId, Date.now())], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "incodet-call.ics";
    link.click();
    URL.revokeObjectURL(url);
  }
  function field(name: keyof BookingFields, label: string, type = "text") {
    return (
      <label className="block min-w-0 type-small font-medium text-ink">
        {label}
        <input
          id={`booking-${name}`}
          type={type}
          autoComplete={
            name === "full_name"
              ? "name"
              : name === "company_email"
                ? "email"
                : name === "company_name"
                  ? "organization"
                  : "tel"
          }
          value={fields[name]}
          onChange={(e) => setFields((f) => ({ ...f, [name]: e.target.value }))}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          className={cn(inputClass, "mt-2")}
        />
        {errors[name] && (
          <span id={`error-${name}`} className="mt-1 block type-small text-destructive">
            {errors[name]}
          </span>
        )}
      </label>
    );
  }
  return (
    <div
      data-booking-widget
      className="min-w-0 rounded-card border border-border bg-background p-5 text-ink shadow-soft md:p-8"
    >
      <h2
        ref={heading}
        tabIndex={-1}
        className="text-[24px] leading-tight font-medium outline-none md:text-[28px]"
      >
        {step === 1
          ? "Pick a date and time"
          : step === 2
            ? "Tell us about your project"
            : "You're booked in"}
      </h2>
      <p className="mt-2 type-small text-muted-foreground">{booking.meetingLabel}</p>
      {error && (
        <p role="alert" className="my-4 type-small text-destructive">
          {error}
        </p>
      )}
      {step === 1 && (
        <>
          <label className="mt-5 block type-small font-medium">
            Timezone
            <select
              aria-label="Timezone"
              value={zone}
              onChange={(e) => {
                const z = e.target.value;
                setZone(z);
                if (slot) {
                  // Keep the chosen time (stored in UTC) and show its day in the new zone.
                  const key = dateKey(new Date(slot), z);
                  setDay(key);
                  setMonth(key.slice(0, 7));
                  setGroup(timeGroup(slot, z));
                } else {
                  setDay("");
                  if (now !== null) setMonth(dateKey(new Date(now), z).slice(0, 7));
                }
              }}
              className={cn(inputClass, "mt-2")}
            >
              {!listedZones.includes(zone) && (
                <optgroup label="Your time zone">
                  <option value={zone}>{nameZone(zone)}</option>
                </optgroup>
              )}
              {zoneGroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.zones.map((z) => (
                    <option key={z} value={z}>
                      {nameZone(z)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          {now === null ? (
            <p role="status" className="py-12">
              Loading calendar…
            </p>
          ) : (
            <>
              <div className="mt-5 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous month"
                  title="Previous month"
                  disabled={month <= today.slice(0, 7)}
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft />
                </Button>
                <h3 className="font-medium">
                  {new Intl.DateTimeFormat("en", {
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(Date.UTC(year, monthNumber - 1, 15)))}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next month"
                  title="Next month"
                  disabled={month >= lastDay.slice(0, 7)}
                  onClick={() => changeMonth(1)}
                >
                  <ChevronRight />
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="py-2 text-[12px] text-muted-foreground">
                    {d}
                  </span>
                ))}
                {Array.from({ length: offset }, (_, i) => (
                  <span key={`blank-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const key = `${month}-${String(i + 1).padStart(2, "0")}`;
                  return (
                    <Button
                      key={key}
                      aria-label={new Intl.DateTimeFormat("en", {
                        dateStyle: "full",
                        timeZone: "UTC",
                      }).format(new Date(`${key}T12:00:00Z`))}
                      aria-current={key === today ? "date" : undefined}
                      aria-pressed={key === day}
                      disabled={!loaded || key < today || key > lastDay || !byDay[key]?.length}
                      variant={key === day ? "default" : "ghost"}
                      className={cn("h-10 w-full px-0", key === today && "ring-1 ring-ink")}
                      onClick={() => chooseDay(key)}
                    >
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
              {!loaded && (
                <div className="mt-4 flex items-center gap-3">
                  <p role="status" className="type-small">
                    Loading available times…
                  </p>
                  {error && (
                    <Button variant="outline" onClick={() => void refresh(Date.now())}>
                      Retry
                    </Button>
                  )}
                </div>
              )}
              {day && (
                <div className="mt-5">
                  <div role="tablist" aria-label="Time of day" className="grid grid-cols-4 gap-1">
                    {timeGroups.map((g, i) => (
                      <Button
                        key={g}
                        id={`time-tab-${g}`}
                        role="tab"
                        aria-selected={currentGroup === g}
                        aria-controls="booking-times"
                        disabled={!activeGroups.includes(g)}
                        tabIndex={currentGroup === g ? 0 : -1}
                        variant={currentGroup === g ? "default" : "ghost"}
                        className="px-1 text-[12px] md:text-[14px]"
                        onClick={() => setGroup(g)}
                        onKeyDown={(e) => {
                          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
                          e.preventDefault();
                          const n = activeGroups.indexOf(g);
                          const target =
                            e.key === "Home"
                              ? activeGroups[0]
                              : e.key === "End"
                                ? activeGroups[activeGroups.length - 1]
                                : activeGroups[
                                    (n + (e.key === "ArrowRight" ? 1 : -1) + activeGroups.length) %
                                      activeGroups.length
                                  ];
                          if (target) {
                            setGroup(target);
                            document.getElementById(`time-tab-${target}`)?.focus();
                          }
                        }}
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                  <div
                    id="booking-times"
                    role="tabpanel"
                    aria-labelledby={`time-tab-${currentGroup}`}
                    className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4"
                  >
                    {visibleSlots.map((s) => (
                      <PillButton
                        key={s}
                        size="sm"
                        variant={slot === s ? "primary" : "secondary"}
                        aria-pressed={slot === s}
                        onClick={() => setSlot(s)}
                        className="h-10 px-1 text-[13px]"
                      >
                        {new Intl.DateTimeFormat("en", {
                          timeZone: zone,
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(s))}
                      </PillButton>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-4 break-words type-small text-muted-foreground">
                Times shown in {zoneName}
              </p>
              {slot && <p className="mt-4 type-small font-medium">{dateLabel}</p>}
              <PillButton
                className="mt-5 w-full"
                disabled={!slot || !slots.includes(slot)}
                onClick={() => {
                  renderedAt.current = Date.now();
                  goStep(2);
                }}
              >
                Continue <ChevronRight aria-hidden className="size-4" />
              </PillButton>
            </>
          )}
        </>
      )}
      {step === 2 && (
        <>
          <Button variant="link" className="mt-4 px-0" onClick={() => goStep(1)}>
            <ArrowLeft /> Back
          </Button>
          <p className="mt-3 type-small font-medium">
            {dateLabel} ({zoneName})
          </p>
          <form onSubmit={confirm} noValidate className="mt-6 space-y-5">
            {field("full_name", "Full name")}
            {field("company_name", "Company name")}
            {field("company_email", "Company email", "email")}
            {field("phone", "Phone (optional)", "tel")}
            <label className="block type-small font-medium">
              Project type
              <select
                id="booking-project_type"
                value={fields.project_type}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    project_type: e.target.value as BookingFields["project_type"],
                  }))
                }
                className={cn(inputClass, "mt-2")}
              >
                {projectTypes.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="block type-small font-medium">
              Approximate budget
              <select
                id="booking-budget"
                value={fields.budget}
                onChange={(e) =>
                  setFields((f) => ({ ...f, budget: e.target.value as BookingFields["budget"] }))
                }
                className={cn(inputClass, "mt-2")}
              >
                {budgets.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend className="type-small font-medium">Preferred delivery time</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {deliveryTimes.map((v) => (
                  <PillButton
                    key={v}
                    type="button"
                    size="sm"
                    variant={fields.delivery_time === v ? "primary" : "secondary"}
                    aria-pressed={fields.delivery_time === v}
                    onClick={() => setFields((f) => ({ ...f, delivery_time: v }))}
                  >
                    {v}
                  </PillButton>
                ))}
              </div>
            </fieldset>
            <label className="block type-small font-medium">
              Message
              <textarea
                id="booking-message"
                rows={4}
                placeholder="Tell us what you need"
                value={fields.message}
                onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
                aria-invalid={Boolean(errors["message"])}
                aria-describedby={errors["message"] ? "error-message" : undefined}
                className={cn(inputClass, "mt-2")}
              />
              {errors["message"] && (
                <span id="error-message" className="mt-1 block text-destructive">
                  {errors["message"]}
                </span>
              )}
            </label>
            <div aria-hidden className="hidden">
              <label>
                Website
                <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <PillButton type="submit" className="w-full" disabled={busy}>
              {busy ? "Confirming…" : "Confirm booking"}
              <Check aria-hidden className="size-4" />
            </PillButton>
          </form>
        </>
      )}
      {step === 3 && (
        <div className="mt-6">
          <p className="font-medium">{dateLabel}</p>
          <p className="mt-2 type-small text-muted-foreground">Times shown in {zoneName}</p>
          <p className="mt-5 type-body">We will email you a meeting link before the call.</p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={googleCalendarLink(slot)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(pillButton({ variant: "secondary" }), "whitespace-normal text-center")}
            >
              <CalendarPlus aria-hidden className="size-4" />
              Add to Google Calendar
            </a>
            <PillButton variant="secondary" onClick={download}>
              <Download aria-hidden className="size-4" />
              Download .ics
            </PillButton>
            <PillButton
              onClick={() => {
                setSlot("");
                setDay("");
                setError("");
                setFields({ ...defaultFields, ...bookingPreselection(plan, service) });
                goStep(1);
                void refresh(Date.now());
              }}
            >
              Book another time
            </PillButton>
          </div>
        </div>
      )}
    </div>
  );
}
