import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminTitle, Box, ConfirmButton, Field, inputCls } from "@/components/admin/ui";
import { PillButton } from "@/components/site/Button";
import { Chip } from "@/components/portal/PortalDashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { paymentMethodLabels } from "@/config/payments";
import {
  fmtDate,
  invoiceStatusLabels,
  invoiceTotal,
  usd,
  type InvoiceStatus,
} from "@/lib/portal-types";

export const Route = createFileRoute("/_authenticated/admin/invoices")({
  staticData: { sitemap: false },
  component: Invoices,
});

const statuses = Object.keys(invoiceStatusLabels) as InvoiceStatus[];
type Item = { description: string; quantity: number; unit_price: number };

function Invoices() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const q = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(
          "*, clients(name, business_name), invoice_items(description, quantity, unit_price), payments(*)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-invoices"] });

  async function setStatus(id: string, status: InvoiceStatus) {
    const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
    if (error) return void toast.error("Could not update the status.");
    toast.success("Status updated");
    refresh();
  }

  async function markPaid(inv: NonNullable<typeof q.data>[number]) {
    const { data: auth } = await supabase.auth.getUser();
    const now = new Date().toISOString();
    const latest = [...inv.payments].sort((a, b) =>
      (b.reported_at ?? "").localeCompare(a.reported_at ?? ""),
    )[0];
    const { error: pErr } = latest
      ? await supabase
          .from("payments")
          .update({ confirmed_at: now, confirmed_by: auth.user?.id ?? null })
          .eq("id", latest.id)
      : await supabase.from("payments").insert({
          invoice_id: inv.id,
          method: "bank_transfer",
          reference: inv.number,
          reported_at: now,
          confirmed_at: now,
          confirmed_by: auth.user?.id ?? null,
        });
    if (pErr) return void toast.error("Could not record the payment.");
    await setStatus(inv.id, "paid");
  }

  return (
    <>
      <AdminTitle
        title="Invoices"
        action={
          <PillButton size="sm" onClick={() => setCreating(true)}>
            New invoice
          </PillButton>
        }
      />
      {q.data?.length === 0 && <p className="type-body">No invoices yet.</p>}
      <ul className="flex flex-col gap-3">
        {q.data?.map((inv) => {
          const c = inv.clients as { name: string; business_name: string | null } | null;
          const items = inv.invoice_items.map((i) => ({
            ...i,
            quantity: Number(i.quantity),
            unit_price: Number(i.unit_price),
          }));
          const open = openId === inv.id;
          return (
            <li key={inv.id}>
              <Box>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : inv.id)}
                    className="text-left"
                  >
                    <span className="block font-medium text-ink">
                      {inv.number} · {usd(invoiceTotal({ items }))}
                    </span>
                    <span className="block type-small text-muted-foreground">
                      {c?.business_name || c?.name} · Issued {fmtDate(inv.issue_date)} · Due{" "}
                      {fmtDate(inv.due_date)}
                    </span>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip status={inv.status} label={invoiceStatusLabels[inv.status]} />
                    <select
                      aria-label={`Status for ${inv.number}`}
                      value={inv.status}
                      onChange={(e) => setStatus(inv.id, e.target.value as InvoiceStatus)}
                      className={`${inputCls} w-auto`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {invoiceStatusLabels[s]}
                        </option>
                      ))}
                    </select>
                    {inv.status !== "paid" && (
                      <PillButton size="sm" onClick={() => markPaid(inv)}>
                        Mark as paid
                      </PillButton>
                    )}
                  </div>
                </div>
                {open && (
                  <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium text-ink">Line items</h3>
                      <ul className="mt-2 type-small">
                        {items.map((it, i) => (
                          <li key={i} className="flex justify-between gap-3 py-1">
                            <span>
                              {it.description} × {it.quantity}
                            </span>
                            <span className="text-ink">{usd(it.quantity * it.unit_price)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-ink">Payments</h3>
                      {inv.payments.length === 0 ? (
                        <p className="mt-2 type-small">None yet.</p>
                      ) : (
                        <ul className="mt-2 type-small">
                          {inv.payments.map((p) => (
                            <li key={p.id} className="py-1">
                              {paymentMethodLabels[p.method]} · {p.reference || "No reference"} ·
                              Reported {fmtDate(p.reported_at)}
                              {p.confirmed_at
                                ? ` · Confirmed ${fmtDate(p.confirmed_at)}`
                                : " · Not confirmed"}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <ConfirmButton
                      className="md:col-span-2 w-fit"
                      label="Delete invoice"
                      title={`Delete ${inv.number}?`}
                      description="This also deletes its line items and payments."
                      onConfirm={async () => {
                        const { error } = await supabase.from("invoices").delete().eq("id", inv.id);
                        if (error) return void toast.error("Could not delete the invoice.");
                        toast.success("Invoice deleted");
                        refresh();
                      }}
                    />
                  </div>
                )}
              </Box>
            </li>
          );
        })}
      </ul>
      <CreateInvoice open={creating} onClose={() => setCreating(false)} onCreated={refresh} />
    </>
  );
}

function CreateInvoice({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 1, unit_price: 0 }]);
  const [busy, setBusy] = useState(false);
  const clients = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () =>
      (
        await supabase
          .from("clients")
          .select("id, name, business_name, email, user_id")
          .order("name")
      ).data ?? [],
    enabled: open,
  });
  const projects = useQuery({
    queryKey: ["admin-client-projects", clientId],
    queryFn: async () =>
      (await supabase.from("projects").select("id, name").eq("client_id", clientId)).data ?? [],
    enabled: !!clientId,
  });
  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((arr) => arr.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const valid = items.filter((i) => i.description.trim() && i.quantity > 0);
    if (!clientId || valid.length === 0)
      return void toast.error("Choose a client and add at least one line item.");
    setBusy(true);
    const { data: inv, error } = await supabase
      .from("invoices")
      .insert({
        client_id: clientId,
        project_id: (fd.get("project_id") as string) || null,
        issue_date: (fd.get("issue_date") as string) || new Date().toISOString().slice(0, 10),
        due_date: (fd.get("due_date") as string) || null,
        status: fd.get("status") as InvoiceStatus,
        notes: String(fd.get("notes") ?? "").trim() || null,
      })
      .select("id, number")
      .single();
    if (error || !inv) {
      setBusy(false);
      return void toast.error("Could not create the invoice.");
    }
    const { error: itemErr } = await supabase
      .from("invoice_items")
      .insert(valid.map((i) => ({ ...i, description: i.description.trim(), invoice_id: inv.id })));
    setBusy(false);
    if (itemErr) return void toast.error("Invoice created, but line items failed to save.");
    toast.success(`${inv.number} created`);
    setItems([{ description: "", quantity: 1, unit_price: 0 }]);
    setClientId("");
    onCreated();
    onClose();
  }

  const today = new Date().toISOString().slice(0, 10);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Client">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>
                Choose a client
              </option>
              {clients.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.business_name || c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project (optional)">
            <select name="project_id" className={inputCls} defaultValue="">
              <option value="">None</option>
              {projects.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Issue date">
            <input type="date" name="issue_date" defaultValue={today} className={inputCls} />
          </Field>
          <Field label="Due date">
            <input type="date" name="due_date" className={inputCls} />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue="sent" className={inputCls}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {invoiceStatusLabels[s]}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <p className="type-small font-medium text-ink">Line items (USD)</p>
            <div className="mt-2 flex flex-col gap-2">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_70px_100px_auto] items-center gap-2">
                  <input
                    aria-label="Description"
                    placeholder="Description"
                    value={it.description}
                    onChange={(e) => setItem(i, { description: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    aria-label="Quantity"
                    type="number"
                    min={0}
                    step="0.5"
                    value={it.quantity}
                    onChange={(e) => setItem(i, { quantity: Number(e.target.value) })}
                    className={inputCls}
                  />
                  <input
                    aria-label="Unit price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.unit_price}
                    onChange={(e) => setItem(i, { unit_price: Number(e.target.value) })}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    aria-label="Remove line"
                    onClick={() => setItems((arr) => arr.filter((_, j) => j !== i))}
                    className="rounded-full p-2 hover:bg-bg-soft"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setItems((a) => [...a, { description: "", quantity: 1, unit_price: 0 }])
                }
                className="flex items-center gap-1 type-small font-medium text-ink"
              >
                <Plus aria-hidden className="size-4" /> Add line
              </button>
              <p className="font-medium text-ink">Total: {usd(invoiceTotal({ items }))}</p>
            </div>
          </div>
          <Field label="Notes (shown on the invoice)" className="md:col-span-2">
            <textarea name="notes" rows={2} className={inputCls} />
          </Field>
          <PillButton type="submit" disabled={busy} className="md:col-span-2">
            Create invoice
          </PillButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
