import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { booking } from "@/config/booking";
import { site } from "@/config/site";
import { bookingPayload, validSlot } from "./booking";
import { MIN_FILL_MS } from "./contact-schema";
import type { Database } from "@/integrations/supabase/types";

export const takenBookingSlots = createServerFn({ method: "GET" })
  .validator(
    z
      .object({ start: z.string().datetime(), end: z.string().datetime() })
      .refine(
        (d) =>
          new Date(d.end).getTime() > new Date(d.start).getTime() &&
          new Date(d.end).getTime() - new Date(d.start).getTime() <= 33 * 86400_000,
      ),
  )
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    const url = process.env["SUPABASE_URL"];
    if (!key || !url) throw new Error("Booking availability is temporarily unavailable.");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
            headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const result = await client.rpc("taken_booking_slots", {
      range_start: data.start,
      range_end: data.end,
    });
    if (result.error) throw new Error("Booking availability is temporarily unavailable.");
    return (result.data ?? []).map((row) => row.slot_start);
  });

type BookingResult =
  { ok: true; id: string; slot_start: string } | { ok: false; error: string; conflict?: boolean };
export const submitBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const result = bookingPayload.safeParse(input);
    return result.success
      ? { valid: true as const, value: result.data }
      : { valid: false as const };
  })
  .handler(async ({ data }): Promise<BookingResult> => {
    if (!data.valid) return { ok: false, error: "Please check the form and try again." };
    const { website, rendered_at, ...fields } = data.value;
    const now = Date.now();
    if (website || now - rendered_at < MIN_FILL_MS || rendered_at > now)
      return { ok: false, error: "Please take a moment, then try again." };
    const time = new Date(fields.slot_start).getTime();
    if (!validSlot(time, now))
      return {
        ok: false,
        conflict: true,
        error: "Please pick an available time at least 12 hours from now.",
      };
    try {
      const { consumeFormAllowance } = await import("./form-spam.server");
      if (!(await consumeFormAllowance()))
        return {
          ok: false,
          error: "Too many requests from this connection. Please try again later.",
        };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const slot_end = new Date(time + booking.slotMinutes * 60_000).toISOString();
      const { data: row, error } = await supabaseAdmin
        .from("bookings")
        .insert({ ...fields, slot_end, phone: fields.phone || null })
        .select("id,slot_start")
        .single();
      if (error?.code === "23505")
        return {
          ok: false,
          conflict: true,
          error: "That time was just booked. Please pick another.",
        };
      if (error || !row) {
        console.error("[booking] insert failed:", error?.code, error?.message);
        return { ok: false, error: "Could not save your booking. Please try again." };
      }
      const key = process.env["RESEND_API_KEY"];
      if (key) {
        const when = new Intl.DateTimeFormat("en", {
          timeZone: fields.visitor_timezone,
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date(time));
        const text = Object.entries(fields)
          .map(([label, value]) => `${label.replace(/_/g, " ")}: ${value}`)
          .join("\n");
        const emails = [
          {
            to: site.email,
            subject: `New call booking: ${fields.full_name}`,
            text,
            reply_to: fields.company_email,
          },
          {
            to: fields.company_email,
            subject: "You're booked in with Incodet",
            text: `You're booked in\n${when} (${fields.visitor_timezone})\n${booking.meetingLabel}\nWe will email you a meeting link before the call.`,
            reply_to: site.email,
          },
        ];
        const sent = await Promise.all(
          emails.map(async (email) => {
            try {
              const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({ from: "Incodet <noreply@incodet.com>", ...email }),
              });
              if (!response.ok) console.error(`Booking email failed [${response.status}]`);
              return response.ok;
            } catch {
              console.error("Booking email could not be sent.");
              return false;
            }
          }),
        );
        if (sent.every(Boolean))
          await supabaseAdmin.from("bookings").update({ email_sent: true }).eq("id", row.id);
      }
      return { ok: true, id: row.id, slot_start: row.slot_start };
    } catch (e) {
      // Log the real cause (never keys) so failures are visible in the server logs.
      console.error("[booking] submit failed:", e instanceof Error ? e.message : e);
      return { ok: false, error: "Could not save your booking. Please try again." };
    }
  });
