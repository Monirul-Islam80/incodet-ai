import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { site } from "@/config/site";
import { paymentMethodLabels } from "@/config/payments";

const input = z.object({
  invoiceId: z.string().uuid(),
  method: z.enum(["payoneer", "wise", "paypal", "bank_transfer"]),
  reference: z.string().trim().max(200).optional().default(""),
});

/** Client reports a payment for their own invoice. Ownership is checked through RLS as the caller. */
export const reportPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean; error?: string }> => {
    const { data: inv } = await context.supabase
      .from("invoices")
      .select("id, number, status, client_id, clients(name, business_name)")
      .eq("id", data.invoiceId)
      .maybeSingle();
    if (!inv) return { ok: false, error: "Invoice not found." };
    if (inv.status === "paid" || inv.status === "draft")
      return { ok: false, error: "This invoice cannot be updated." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: payErr } = await supabaseAdmin.from("payments").insert({
      invoice_id: inv.id,
      method: data.method,
      reference: data.reference || null,
      reported_at: new Date().toISOString(),
    });
    if (payErr) {
      console.error("payment insert failed", payErr);
      return { ok: false, error: "Could not record your payment." };
    }
    await supabaseAdmin
      .from("invoices")
      .update({ status: "pending_confirmation" })
      .eq("id", inv.id);

    const key = process.env["RESEND_API_KEY"];
    if (!key) {
      console.log("email skipped: no RESEND_API_KEY");
      return { ok: true };
    }
    const c = inv.clients as { name: string; business_name: string | null } | null;
    const text = [
      `Invoice: ${inv.number}`,
      `Client: ${c?.name ?? ""}${c?.business_name ? ` (${c.business_name})` : ""}`,
      `Method: ${paymentMethodLabels[data.method]}`,
      `Reference: ${data.reference || "Not given"}`,
    ].join("\n");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Incodet Website <noreply@incodet.com>",
        to: [site.email],
        subject: `Payment reported: ${inv.number}`,
        text,
      }),
    });
    if (!res.ok) console.error(`email failed [${res.status}]: ${await res.text()}`);
    return { ok: true };
  });
