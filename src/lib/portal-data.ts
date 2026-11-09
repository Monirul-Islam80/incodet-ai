import { supabase } from "@/integrations/supabase/client";
import type { PortalData } from "./portal-types";

export type PortalAccess =
  | { kind: "client"; data: PortalData; isAdmin: boolean }
  | { kind: "none"; isAdmin: boolean; email: string };

/** Loads the signed-in client's own data. RLS limits every query to their client record. */
export async function loadPortal(): Promise<PortalAccess> {
  await supabase.rpc("claim_portal_access");
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id ?? "";
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
  const isAdmin = !!roles?.some((r) => r.role === "admin");

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, business_name")
    .eq("user_id", uid)
    .maybeSingle();
  if (!client) return { kind: "none", isAdmin, email: auth.user?.email ?? "" };

  const [projects, invoices, payments] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, name, status, progress, target_date, summary, milestones(id, title, status, due_date, sort_order), deliverables(id, title, file_path, external_url, created_at)",
      )
      .eq("client_id", client.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select(
        "id, number, project_id, issue_date, due_date, status, notes, invoice_items(description, quantity, unit_price)",
      )
      .eq("client_id", client.id)
      .order("issue_date", { ascending: false }),
    supabase
      .from("payments")
      .select("id, invoice_id, method, reference, reported_at, confirmed_at")
      .order("reported_at", { ascending: false }),
  ]);
  if (projects.error || invoices.error || payments.error)
    throw new Error("Could not load your portal.");

  return {
    kind: "client",
    isAdmin,
    data: {
      client: { name: client.name, business_name: client.business_name },
      projects: (projects.data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        progress: p.progress,
        target_date: p.target_date,
        summary: p.summary,
        milestones: [...(p.milestones ?? [])].sort((a, b) => a.sort_order - b.sort_order),
        deliverables: p.deliverables ?? [],
      })),
      invoices: (invoices.data ?? []).map((i) => ({
        id: i.id,
        number: i.number ?? "",
        project_id: i.project_id,
        issue_date: i.issue_date,
        due_date: i.due_date,
        status: i.status,
        notes: i.notes,
        items: (i.invoice_items ?? []).map((it) => ({
          ...it,
          quantity: Number(it.quantity),
          unit_price: Number(it.unit_price),
        })),
      })),
      // Admins can read every payment; keep only this client's.
      payments: (payments.data ?? []).filter((p) =>
        (invoices.data ?? []).some((i) => i.id === p.invoice_id),
      ),
    },
  };
}
