import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminTitle } from "@/components/admin/ui";
import { dateKey } from "@/lib/booking";
import { booking } from "@/config/booking";

export const Route = createFileRoute("/_authenticated/admin/")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Overview | Incodet Admin" },
      { name: "description", content: "Incodet administration overview." },
      { property: "og:title", content: "Overview | Incodet Admin" },
      { property: "og:description", content: "Incodet administration overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Overview,
});

async function count(
  table: "contact_messages" | "projects" | "invoices",
  col: string,
  values: string[],
) {
  const { count: c } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .in(col, values as never[]);
  return c ?? 0;
}

function Overview() {
  const q = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [messages, projects, unpaid, pending] = await Promise.all([
        count("contact_messages", "status", ["new"]),
        count("projects", "status", ["planning", "in_progress", "review"]),
        count("invoices", "status", ["sent", "overdue"]),
        count("invoices", "status", ["pending_confirmation"]),
      ]);
      const day = dateKey(new Date(), booking.timezone);
      const start = new Date(`${day}T00:00:00+08:00`);
      const { count: bookings, error } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("slot_start", start.toISOString())
        .lt("slot_start", new Date(start.getTime() + 86400_000).toISOString())
        .neq("status", "cancelled");
      if (error) throw error;
      return { messages, projects, unpaid, pending, bookings };
    },
  });
  const cards = [
    { label: "Today's bookings", value: q.data?.bookings, to: "/admin/bookings" },
    { label: "New messages", value: q.data?.messages, to: "/admin/messages" },
    { label: "Active projects", value: q.data?.projects, to: "/admin/projects" },
    { label: "Unpaid invoices", value: q.data?.unpaid, to: "/admin/invoices" },
    { label: "Pending confirmation", value: q.data?.pending, to: "/admin/invoices" },
  ] as const;
  return (
    <>
      <AdminTitle title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border bg-background p-6 hover:border-ink"
          >
            <p className="text-[44px] leading-none font-medium text-ink">{c.value ?? "…"}</p>
            <p className="mt-3 type-small text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
