import {
  Bell,
  Bot,
  CalendarCheck,
  Check,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  PhoneIncoming,
  Rocket,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small code-built UI illustrations. Generic sample text only; decorative for screen readers. */
function Frame({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-card-sm p-4 type-small shadow-soft",
        tone === "light" ? "bg-background text-ink" : "bg-dark-card text-on-dark",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Line({ w = "w-full", tone = "light" }: { w?: string; tone?: "light" | "dark" }) {
  return (
    <div className={cn("h-2 rounded-full", w, tone === "light" ? "bg-border" : "bg-on-dark/20")} />
  );
}

export function CallCardUI({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Frame tone={tone}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-mint text-mint-ink">
          <PhoneIncoming className="size-5" />
        </span>
        <div>
          <p className="font-medium">Incoming call</p>
          <p className="opacity-70">New customer</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="flex-1 rounded-full bg-mint py-2 text-center font-medium text-mint-ink">
          Answered by AI
        </span>
      </div>
    </Frame>
  );
}

export function ChatUI({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <Frame tone={tone} className="flex flex-col gap-2">
      <div
        className={cn(
          "max-w-[85%] self-end rounded-2xl rounded-br-sm px-3 py-2",
          dark ? "bg-on-dark/15" : "bg-bg-soft",
        )}
      >
        Hi, are you open on Saturday?
      </div>
      <div
        className={cn(
          "flex max-w-[90%] items-start gap-2 rounded-2xl rounded-bl-sm px-3 py-2",
          dark ? "bg-background text-ink" : "bg-ink text-primary-foreground",
        )}
      >
        <Bot className="mt-0.5 size-4 shrink-0" />
        Yes, we are open 9am to 4pm. Would you like to book a time?
      </div>
    </Frame>
  );
}

export function CalendarUI({ tone = "light" }: { tone?: "light" | "dark" }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return (
    <Frame tone={tone}>
      <div className="flex items-center gap-2 font-medium">
        <CalendarCheck className="size-4" /> Calendar
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5 text-center">
        {days.map((d) => (
          <span key={d} className="opacity-70">
            {d}
          </span>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-7 rounded-md",
              i === 7 ? "bg-mint" : tone === "light" ? "bg-bg-soft" : "bg-on-dark/10",
            )}
          />
        ))}
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 font-medium text-mint-ink">
        <Check className="size-3.5" /> Appointment booked
      </p>
    </Frame>
  );
}

export function NotificationUI({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Frame tone={tone} className="flex flex-col gap-2">
      {[
        {
          icon: <MessageCircle className="size-4" />,
          t: "WhatsApp",
          d: "New booking: caller name and request",
        },
        { icon: <Mail className="size-4" />, t: "Email", d: "Call summary ready" },
      ].map((n) => (
        <div
          key={n.t}
          className={cn(
            "flex items-start gap-3 rounded-xl p-3",
            tone === "light" ? "bg-bg-soft" : "bg-on-dark/10",
          )}
        >
          <span className="mt-0.5">{n.icon}</span>
          <div>
            <p className="font-medium">{n.t}</p>
            <p className="opacity-75">{n.d}</p>
          </div>
        </div>
      ))}
    </Frame>
  );
}

export function BookingSiteUI() {
  return (
    <Frame className="p-0">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 flex items-center gap-1.5 opacity-70">
          <Globe className="size-3.5" /> yourbusiness.com
        </span>
      </div>
      <div className="p-5">
        <p className="text-[18px] font-medium">Book an appointment</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["9:00", "10:30", "12:00", "1:30", "3:00", "4:30"].map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-full border py-2 text-center",
                i === 2 ? "border-ink bg-ink text-primary-foreground" : "border-border",
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-full bg-ink py-2.5 text-center font-medium text-primary-foreground">
          Confirm booking
        </div>
      </div>
    </Frame>
  );
}

export function AutomationUI() {
  return (
    <Frame className="flex flex-col gap-2">
      <div className="flex items-center gap-2 font-medium">
        <Workflow className="size-4" /> Automations
      </div>
      {["Booking reminder sent", "Follow-up message scheduled", "Owner notified"].map((t) => (
        <div
          key={t}
          className="flex items-center justify-between rounded-xl bg-bg-soft px-3 py-2.5"
        >
          {t}
          <span className="flex size-5 items-center justify-center rounded-full bg-mint text-mint-ink">
            <Check className="size-3" />
          </span>
        </div>
      ))}
    </Frame>
  );
}

export function DashboardUI() {
  return (
    <Frame>
      <div className="flex items-center justify-between font-medium">
        Dashboard <Bell className="size-4" />
      </div>
      <div className="mt-4 flex h-28 items-end gap-2">
        {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
          <span key={i} className="flex-1 rounded-t-md bg-ink/80" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Line w="w-3/4" />
        <Line w="w-1/2" />
      </div>
    </Frame>
  );
}

export function DiscoveryUI() {
  return (
    <Frame className="flex flex-col gap-3">
      <div className="flex items-center gap-2 font-medium">
        <Phone className="size-4" /> Discovery call notes
      </div>
      {["Your services", "Your customers", "What you need"].map((t) => (
        <div key={t} className="flex items-center gap-2">
          <Check className="size-4" /> {t}
        </div>
      ))}
    </Frame>
  );
}

export function PlanUI() {
  return (
    <Frame className="flex flex-col gap-3">
      <p className="font-medium">Scope</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-3 h-10 rounded-lg bg-bg-soft" />
        <div className="h-16 rounded-lg bg-bg-soft" />
        <div className="col-span-2 h-16 rounded-lg bg-bg-soft" />
      </div>
      <Line w="w-2/3" />
    </Frame>
  );
}

export function BuildUI() {
  return (
    <Frame className="flex flex-col gap-2">
      <p className="font-medium">Weekly progress</p>
      {[
        { t: "Website pages", done: true },
        { t: "Booking calendar connected", done: true },
        { t: "AI agent set up", done: false },
      ].map((s) => (
        <div key={s.t} className="flex items-center gap-2 rounded-xl bg-bg-soft px-3 py-2.5">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full",
              s.done ? "bg-mint text-mint-ink" : "border border-border",
            )}
          >
            {s.done && <Check className="size-3" />}
          </span>
          {s.t}
        </div>
      ))}
    </Frame>
  );
}

export function LaunchUI() {
  return (
    <Frame className="flex flex-col items-start gap-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 font-medium text-mint-ink">
        <Rocket className="size-3.5" /> Live
      </span>
      <Line />
      <Line w="w-4/5" />
      <p className="opacity-70">Support and improvements ongoing</p>
    </Frame>
  );
}
