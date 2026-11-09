import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminTitle, Box, ConfirmButton } from "@/components/admin/ui";
import { PillButton } from "@/components/site/Button";
import { Chip } from "@/components/portal/PortalDashboard";
import { planLabels } from "@/lib/contact-schema";
import { fmtDate } from "@/lib/portal-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  staticData: { sitemap: false },
  component: Messages,
});

type Filter = "new" | "read" | "archived" | "all";

function Messages() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("new");
  const [openId, setOpenId] = useState<string | null>(null);
  const q = useQuery({
    queryKey: ["admin-messages", filter],
    queryFn: async () => {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("status", filter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-messages"] });
  async function setStatus(id: string, status: "read" | "archived" | "new") {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) return void toast.error("Could not update the message.");
    toast.success(status === "archived" ? "Message archived" : "Message updated");
    refresh();
  }

  return (
    <>
      <AdminTitle title="Messages" />
      <div role="tablist" aria-label="Filter messages" className="mb-5 flex flex-wrap gap-2">
        {(["new", "read", "archived", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 type-small font-medium capitalize",
              filter === f
                ? "border-ink bg-ink text-primary-foreground"
                : "border-border bg-background text-ink",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      {q.data?.length === 0 && <p className="type-body">No messages here.</p>}
      <ul className="flex flex-col gap-3">
        {q.data?.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id}>
              <Box className={cn(m.status === "new" && "border-ink")}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    setOpenId(open ? null : m.id);
                    if (!open && m.status === "new") void setStatus(m.id, "read");
                  }}
                  className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                >
                  <span>
                    <span className="block font-medium text-ink">
                      {m.name} {m.business_name ? `· ${m.business_name}` : ""}
                    </span>
                    <span className="block type-small text-muted-foreground">
                      {m.email} · {fmtDate(m.created_at)} · {planLabels[m.plan]} · {m.source_page}
                    </span>
                  </span>
                  <Chip
                    status={m.status === "new" ? "pending_confirmation" : "sent"}
                    label={m.status}
                  />
                </button>
                {open && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="whitespace-pre-wrap text-ink">{m.message}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href={`mailto:${m.email}`}
                        className="type-small font-medium text-ink underline underline-offset-4"
                      >
                        Reply by email
                      </a>
                      {m.status !== "archived" ? (
                        <PillButton
                          size="sm"
                          variant="secondary"
                          onClick={() => setStatus(m.id, "archived")}
                        >
                          Archive
                        </PillButton>
                      ) : (
                        <PillButton
                          size="sm"
                          variant="secondary"
                          onClick={() => setStatus(m.id, "read")}
                        >
                          Unarchive
                        </PillButton>
                      )}
                      <ConfirmButton
                        label="Delete"
                        title="Delete this message?"
                        description="This permanently removes the message."
                        onConfirm={async () => {
                          const { error } = await supabase
                            .from("contact_messages")
                            .delete()
                            .eq("id", m.id);
                          if (error) return void toast.error("Could not delete the message.");
                          toast.success("Message deleted");
                          refresh();
                        }}
                      />
                    </div>
                  </div>
                )}
              </Box>
            </li>
          );
        })}
      </ul>
    </>
  );
}
