import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { pillButton } from "@/components/site/Button";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Admin | Incodet" },
      { name: "description", content: "Incodet admin panel." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/invoices", label: "Invoices", icon: FileText },
] as const;

function AdminLayout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const q = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      await supabase.rpc("claim_portal_access");
      const { data, error } = await supabase.rpc("is_admin");
      if (error) throw error;
      return !!data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/portal", replace: true });
  }

  if (q.isPending)
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <Loader2 aria-hidden className="size-6 animate-spin" />
        <span className="sr-only">Loading</span>
      </div>
    );
  if (!q.data)
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="type-h3">You do not have access to this page.</h1>
          <Link to="/portal" className={pillButton({ className: "mt-6" })}>
            Go to the client portal
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-bg-soft md:flex">
      <aside className="border-b border-border bg-background md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center justify-between p-4 md:p-6">
          <Logo />
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="rounded-full p-2 text-ink hover:bg-bg-soft md:hidden"
          >
            <LogOut aria-hidden className="size-5" />
          </button>
        </div>
        <nav
          aria-label="Admin"
          className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-4"
        >
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: "exact" in n }}
              className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2 type-small font-medium text-ink hover:bg-bg-soft data-[status=active]:bg-ink data-[status=active]:text-primary-foreground"
            >
              <n.icon aria-hidden className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden p-4 md:absolute md:bottom-0 md:block">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 type-small font-medium text-ink hover:underline"
          >
            <LogOut aria-hidden className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 p-4 md:p-10">
        <Outlet />
      </div>
    </div>
  );
}
