import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AdminTitle, Box, ConfirmButton, Field, inputCls } from "@/components/admin/ui";
import { PillButton } from "@/components/site/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  staticData: { sitemap: false },
  component: Clients,
});

type Client = {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  user_id: string | null;
};

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  business_name: z.string().trim().max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(255),
});

function Clients() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Client> | null>(null);
  const q = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, business_name, email, user_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success)
      return void toast.error(parsed.error.issues[0]?.message ?? "Check the form");
    const row = { ...parsed.data, business_name: parsed.data.business_name || null };
    const { error } = editing?.id
      ? await supabase.from("clients").update(row).eq("id", editing.id)
      : await supabase.from("clients").insert(row);
    if (error)
      return void toast.error(
        error.code === "23505"
          ? "A client with this email already exists."
          : "Could not save the client.",
      );
    toast.success("Client saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-clients"] });
  }

  return (
    <>
      <AdminTitle
        title="Clients"
        action={
          <PillButton size="sm" onClick={() => setEditing({})}>
            New client
          </PillButton>
        }
      />
      {q.data?.length === 0 && <p className="type-body">No clients yet.</p>}
      <ul className="grid gap-3 lg:grid-cols-2">
        {q.data?.map((c) => (
          <li key={c.id}>
            <Box className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-ink">{c.business_name || c.name}</p>
                <p className="truncate type-small text-muted-foreground">
                  {c.name} · {c.email} · {c.user_id ? "Signed in before" : "Not signed in yet"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PillButton size="sm" variant="secondary" onClick={() => setEditing(c)}>
                  Edit
                </PillButton>
                <ConfirmButton
                  label="Delete"
                  title="Delete this client?"
                  description="This also deletes their projects, invoices and payments."
                  onConfirm={async () => {
                    const { error } = await supabase.from("clients").delete().eq("id", c.id);
                    if (error) return void toast.error("Could not delete the client.");
                    toast.success("Client deleted");
                    qc.invalidateQueries({ queryKey: ["admin-clients"] });
                  }}
                />
              </div>
            </Box>
          </li>
        ))}
      </ul>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit client" : "New client"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Contact name">
              <input name="name" defaultValue={editing?.name ?? ""} className={inputCls} required />
            </Field>
            <Field label="Business name">
              <input
                name="business_name"
                defaultValue={editing?.business_name ?? ""}
                className={inputCls}
              />
            </Field>
            <Field label="Email (used to sign in)">
              <input
                name="email"
                type="email"
                defaultValue={editing?.email ?? ""}
                className={inputCls}
                required
              />
            </Field>
            <PillButton type="submit">Save client</PillButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
