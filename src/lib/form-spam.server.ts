import { getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Atomic, shared rolling-hour allowance for contact and booking submissions. */
export async function consumeFormAllowance() {
  const ip =
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`incodet:${ip}`));
  const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  const { data, error } = await supabaseAdmin.rpc("consume_contact_rate_limit", { hash });
  if (error) throw new Error("Could not check submission allowance.");
  return data === true;
}
