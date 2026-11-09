import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminTitle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { booking } from "@/config/booking";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Bookings | Incodet Admin" },
      { name: "description", content: "Manage scheduled Incodet discovery calls." },
      { property: "og:title", content: "Bookings | Incodet Admin" },
      { property: "og:description", content: "Manage scheduled Incodet discovery calls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBookings,
});

function AdminBookings() {
  const [tab, setTab] = useState("Upcoming");
  const [expanded, setExpanded] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-bookings", tab],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select("*")
        .order("slot_start", { ascending: tab === "Upcoming" });
      query =
        tab === "Upcoming"
          ? query.gte("slot_end", new Date().toISOString())
          : query.lt("slot_end", new Date().toISOString());
      const result = await query;
      if (result.error) throw result.error;
      return result.data;
    },
  });
  async function update(id: string, status: "confirmed" | "cancelled") {
    setBusy(id);
    setError("");
    const result = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select("id")
      .single();
    if (result.error) setError("Could not update this booking. Please try again.");
    else {
      await qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      await qc.invalidateQueries({ queryKey: ["admin-overview"] });
    }
    setBusy("");
  }
  return (
    <>
      <AdminTitle title="Bookings" />
      <div role="tablist" aria-label="Booking period" className="mb-6 flex gap-2">
        {["Upcoming", "Past"].map((t) => (
          <Button
            key={t}
            role="tab"
            aria-selected={tab === t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      {q.isPending && <p role="status">Loading bookings…</p>}
      {(q.error || error) && (
        <p role="alert" className="text-destructive">
          {error || "Could not load bookings."}
        </p>
      )}
      {!q.isPending && !q.error && q.data?.length === 0 && (
        <p className="text-muted-foreground">No {tab.toLowerCase()} bookings.</p>
      )}
      <div className="space-y-4">
        {q.data?.map((row) => (
          <article key={row.id} className="rounded-md border border-border bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-medium text-ink">{row.full_name}</h2>
                <p className="mt-2 type-small">
                  {new Intl.DateTimeFormat("en", {
                    timeZone: booking.timezone,
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(new Date(row.slot_start))}{" "}
                  ({booking.timezone})
                </p>
                <p className="mt-1 type-small">
                  {row.company_name} · {row.status}
                </p>
              </div>
              <Button
                variant="outline"
                aria-expanded={expanded === row.id}
                onClick={() => setExpanded(expanded === row.id ? "" : row.id)}
              >
                Details
              </Button>
            </div>
            {expanded === row.id && (
              <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                {[
                  ["Company email", row.company_email],
                  ["Phone", row.phone || "Not provided"],
                  ["Project type", row.project_type],
                  ["Budget", row.budget],
                  ["Preferred delivery", row.delivery_time],
                  ["Visitor timezone", row.visitor_timezone],
                  ["Message", row.message],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="type-small text-muted-foreground">{label}</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {row.status !== "cancelled" && (
              <div className="mt-5 flex gap-3">
                {row.status === "pending" && (
                  <Button
                    disabled={busy === row.id}
                    onClick={() => void update(row.id, "confirmed")}
                  >
                    Confirm
                  </Button>
                )}
                <Button
                  variant="outline"
                  disabled={busy === row.id}
                  onClick={() => void update(row.id, "cancelled")}
                >
                  Cancel booking
                </Button>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
