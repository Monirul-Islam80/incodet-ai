import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { getDemoPortal } from "@/content/demoPortal";
import { PortalDashboard } from "@/components/portal/PortalDashboard";

export const Route = createFileRoute("/portal/demo")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Portal Demo | Incodet" },
      {
        name: "description",
        content: "Explore a sample project in the Incodet client portal. Example data only.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Portal Demo | Incodet" },
      {
        property: "og:description",
        content: "Explore a sample project in the Incodet client portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortalDemo,
});

function PortalDemo() {
  const [data] = useState(getDemoPortal);
  return (
    <div className="bg-bg-soft pt-24 md:pt-28">
      <div role="note" className="border-y border-border bg-demo-note text-ink">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-3 type-small">
          <p className="inline-flex items-center gap-2 font-medium">
            <Info aria-hidden className="size-4 shrink-0" /> Sample project. This is example data,
            not a real client.
          </p>
          <Link to="/portal" className="font-medium underline underline-offset-4">
            Exit demo
          </Link>
        </div>
      </div>
      <div className="pt-10">
        <PortalDashboard
          data={data}
          mode="demo"
          onDownloadDeliverable={async (d) => {
            const { downloadSamplePdf } = await import("@/components/portal/invoicePdf");
            await downloadSamplePdf(d.title.replace(" (PDF)", ""));
          }}
          onDownloadInvoice={async (inv) => {
            const { downloadInvoicePdf } = await import("@/components/portal/invoicePdf");
            await downloadInvoicePdf(inv, data.client, { sample: true });
          }}
          onReportPaid={async () => {
            toast("This is a demo. No payment was recorded.");
            return true;
          }}
        />
      </div>
    </div>
  );
}
