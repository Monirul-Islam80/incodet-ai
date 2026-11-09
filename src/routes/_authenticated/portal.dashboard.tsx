import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/config/site";
import { loadPortal } from "@/lib/portal-data";
import { reportPayment } from "@/lib/portal.functions";
import { PortalDashboard } from "@/components/portal/PortalDashboard";
import { PillButton, pillButton } from "@/components/site/Button";

export const Route = createFileRoute("/_authenticated/portal/dashboard")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Dashboard | Incodet Client Portal" },
      { name: "description", content: "Your Incodet project, files and invoices." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const report = useServerFn(reportPayment);
  const q = useQuery({ queryKey: ["portal"], queryFn: loadPortal });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/portal", replace: true });
  }

  let content;
  if (q.isPending) {
    content = (
      <div className="flex justify-center py-32" role="status">
        <Loader2 aria-hidden className="size-6 animate-spin text-ink" />
        <span className="sr-only">Loading your portal</span>
      </div>
    );
  } else if (q.isError) {
    content = (
      <p className="container-site py-24 type-body">
        We could not load your portal. Please refresh the page.
      </p>
    );
  } else if (q.data.kind === "none") {
    content = (
      <div className="container-site py-16">
        <div className="mx-auto max-w-xl rounded-card border border-border bg-background p-8 text-center md:p-12">
          <h1 className="type-h3">We could not find a project for this email.</h1>
          <p className="mt-4 type-body">
            You are signed in as {q.data.email}. If you think this is a mistake, email us at{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-ink underline underline-offset-4"
            >
              {site.email}
            </a>{" "}
            or message us on{" "}
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline underline-offset-4"
            >
              WhatsApp
            </a>
            .
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {q.data.isAdmin && (
              <Link to="/admin" className={pillButton()}>
                Open admin
              </Link>
            )}
            <PillButton type="button" variant="secondary" onClick={signOut}>
              Sign out
            </PillButton>
          </div>
        </div>
      </div>
    );
  } else {
    const data = q.data.data;
    content = (
      <PortalDashboard
        data={data}
        mode="live"
        onSignOut={signOut}
        onDownloadDeliverable={async (d) => {
          if (!d.file_path) return;
          const { data: signed, error } = await supabase.storage
            .from("deliverables")
            .createSignedUrl(d.file_path, 60);
          if (error || !signed)
            return void toast.error("Could not open this file. Please try again.");
          window.open(signed.signedUrl, "_blank", "noopener");
        }}
        onDownloadInvoice={async (inv) => {
          const { downloadInvoicePdf } = await import("@/components/portal/invoicePdf");
          await downloadInvoicePdf(inv, data.client);
        }}
        onReportPaid={async (inv, method, reference) => {
          try {
            const res = await report({ data: { invoiceId: inv.id, method, reference } });
            if (!res.ok) {
              toast.error(res.error ?? "Could not record your payment.");
              return false;
            }
            toast.success("Thanks. We will confirm your payment soon.");
            await qc.invalidateQueries({ queryKey: ["portal"] });
            return true;
          } catch {
            toast.error("Could not record your payment.");
            return false;
          }
        }}
      />
    );
  }

  return <div className="min-h-screen bg-bg-soft pt-28 md:pt-32">{content}</div>;
}
