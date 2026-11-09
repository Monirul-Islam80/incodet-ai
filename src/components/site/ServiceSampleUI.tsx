import {
  Bell,
  CalendarCheck,
  CalendarSync,
  Check,
  Image,
  Heart,
  MessageCircle,
} from "lucide-react";

export function ServiceSampleUI({ kind }: { kind: string }) {
  const phone = kind === "phone" || kind === "social";
  const Icon = kind === "notification" ? Bell : kind === "reminder" ? CalendarCheck : CalendarSync;
  return (
    <div className="flex h-full items-center justify-center bg-bg-soft p-5 text-ink">
      {phone ? (
        <div className="h-full w-[145px] overflow-hidden rounded-[20px] border-[5px] border-ink bg-background p-3">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink" />
          <p className="text-[12px] font-medium">
            {kind === "social" ? "Your feed" : "Welcome back"}
          </p>
          <div className="my-3 flex h-14 items-center justify-center rounded-md bg-accent">
            <Image aria-hidden className="size-6" />
          </div>
          <p className="text-[10px]">
            {kind === "social" ? "A moment worth sharing" : "Your next appointment"}
          </p>
          <div className="mt-3 flex gap-2">
            {kind === "social" ? (
              <>
                <Heart aria-hidden className="size-4" />
                <MessageCircle aria-hidden className="size-4" />
              </>
            ) : (
              <>
                <CalendarCheck aria-hidden className="size-4" />
                <Check aria-hidden className="size-4" />
              </>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 rounded bg-border" />
            <div className="h-2 w-3/4 rounded bg-border" />
          </div>
        </div>
      ) : (
        <div className="w-full rounded-md border border-border bg-background p-5">
          <Icon aria-hidden className="size-7" />
          <h4 className="mt-4 text-[17px] font-medium">
            {kind === "notification"
              ? "Owner notification"
              : kind === "reminder"
                ? "Appointment reminder"
                : "Calendar sync"}
          </h4>
          <p className="mt-2 type-small">
            {kind === "notification"
              ? "A new enquiry is ready to review."
              : kind === "reminder"
                ? "Your appointment reminder is ready."
                : "Appointments stay in sync."}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 type-small">
            <Check aria-hidden className="size-4" />
            {kind === "notification"
              ? "Delivered"
              : kind === "reminder"
                ? "Scheduled"
                : "Connected"}
          </span>
        </div>
      )}
    </div>
  );
}
