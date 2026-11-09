import { createServerFn } from "@tanstack/react-start";
import { site } from "@/config/site";
import { contactPayload, MIN_FILL_MS, planLabels } from "./contact-schema";

type Result = { ok: true } | { ok: false; error: string };

/** Public contact form endpoint ("submit-contact"). Validates, filters spam, stores, optionally emails. */
export const submitContact = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const parsed = contactPayload.safeParse(input);
    return parsed.success ? { ok: true as const, data: parsed.data } : { ok: false as const };
  })
  .handler(async ({ data: input }): Promise<Result> => {
    if (!input.ok) return { ok: false, error: "Please check the form and try again." };
    const d = input.data;

    // Honeypot or too-fast submit: pretend success, store nothing.
    if (d.website) return { ok: true };
    if (Date.now() - d.rendered_at < MIN_FILL_MS) return { ok: true };

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { consumeFormAllowance } = await import("./form-spam.server");
      if (!(await consumeFormAllowance())) {
        return {
          ok: false,
          error: "Too many messages from this connection. Please try again later.",
        };
      }

      const { data: row, error } = await supabaseAdmin
        .from("contact_messages")
        .insert({
          name: d.name,
          email: d.email,
          business_name: d.business_name || null,
          plan: d.plan,
          message: d.message,
          source_page: d.source_page,
        })
        .select("id")
        .single();
      if (error || !row) {
        console.error("[contact] insert failed:", error?.code, error?.message);
        return { ok: false, error: "Could not send your message." };
      }

      const key = process.env["RESEND_API_KEY"];
      if (!key) {
        console.log("email skipped: no RESEND_API_KEY");
        return { ok: true };
      }
      const text = [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Business: ${d.business_name || "Not given"}`,
        `Plan: ${planLabels[d.plan]}`,
        `Page: ${d.source_page}`,
        "",
        "Message:",
        d.message,
      ].join("\n");
      // The message is already saved: an email failure must never turn this into an error.
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Incodet <noreply@incodet.com>",
            to: [site.email],
            reply_to: d.email,
            subject: `New enquiry from ${d.name}`,
            text,
          }),
        });
        if (res.ok) {
          await supabaseAdmin
            .from("contact_messages")
            .update({ email_sent: true })
            .eq("id", row.id);
        } else {
          console.error(`[contact] email failed [${res.status}]`);
        }
      } catch {
        console.error("[contact] email could not be sent.");
      }
      return { ok: true };
    } catch (e) {
      console.error("[contact] submit failed:", e instanceof Error ? e.message : e);
      return { ok: false, error: "Could not send your message." };
    }
  });
