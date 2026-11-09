import { useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Circle,
  CircleDot,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PillButton, pillButton } from "@/components/site/Button";
import { paymentMethodLabels, type PaymentMethod } from "@/config/payments";
import {
  fmtDate,
  invoiceStatusLabels,
  invoiceTotal,
  milestoneStatusLabels,
  projectStatusLabels,
  usd,
  type InvoiceStatus,
  type PortalData,
  type PortalDeliverable,
  type PortalInvoice,
} from "@/lib/portal-types";
import { cn } from "@/lib/utils";
import { PayModal } from "./PayModal";
import { portalTourSteps, Tour, useTour } from "./Tour";

const chipCls: Record<string, string> = {
  paid: "bg-mint text-mint-ink",
  live: "bg-mint text-mint-ink",
  pending_confirmation: "bg-[#FEF3C7] text-[#78350F]",
  overdue: "bg-[#FEE2E2] text-[#7F1D1D]",
  on_hold: "bg-[#FEE2E2] text-[#7F1D1D]",
};
export function Chip({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 type-small font-medium",
        chipCls[status] ?? "bg-bg-soft text-ink",
      )}
    >
      {label}
    </span>
  );
}

function Panel({
  title,
  children,
  className,
  tour,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  tour?: string;
}) {
  return (
    <section
      data-tour={tour}
      aria-labelledby={`h-${title}`}
      className={cn("rounded-card border border-border bg-background p-6 md:p-8", className)}
    >
      <h2 id={`h-${title}`} className="type-h3">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PortalDashboard({
  data,
  mode,
  onSignOut,
  onDownloadDeliverable,
  onDownloadInvoice,
  onReportPaid,
}: {
  data: PortalData;
  mode: "live" | "demo";
  onSignOut?: () => void;
  onDownloadDeliverable: (d: PortalDeliverable) => void;
  onDownloadInvoice: (inv: PortalInvoice) => void;
  onReportPaid: (inv: PortalInvoice, method: PaymentMethod, reference: string) => Promise<boolean>;
}) {
  const [projectId, setProjectId] = useState(data.projects[0]?.id ?? "");
  const [paying, setPaying] = useState<PortalInvoice | null>(null);
  const project = data.projects.find((p) => p.id === projectId) ?? data.projects[0];
  const tour = useTour(`incodet-portal-tour-${mode}`, true);
  const invoiceNumbers = useMemo(
    () => new Map(data.invoices.map((i) => [i.id, i.number])),
    [data.invoices],
  );
  const payable = (s: InvoiceStatus) => s === "sent" || s === "overdue";

  return (
    <div className="container-site pb-[72px] md:pb-[120px]">
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-small text-muted-foreground">Client portal</p>
          <h1 className="mt-1 text-[34px] leading-tight font-medium tracking-tight text-ink md:text-[44px]">
            {data.client.business_name || data.client.name}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {data.projects.length > 1 && (
            <label className="flex items-center gap-2 type-small text-ink">
              <span>Project</span>
              <select
                value={project?.id}
                onChange={(e) => setProjectId(e.target.value)}
                className="h-10 rounded-full border border-[#CFCFCF] bg-background px-4 text-ink focus-visible:ring-2 focus-visible:ring-ink"
              >
                {data.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="button"
            onClick={tour.start}
            aria-label="Replay the guided tour"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-ink hover:bg-bg-soft"
          >
            <HelpCircle aria-hidden className="size-5" />
          </button>
          {mode === "live" ? (
            <PillButton type="button" size="sm" variant="secondary" onClick={onSignOut}>
              <LogOut aria-hidden className="size-4" /> Sign out
            </PillButton>
          ) : (
            <Link to="/portal" className={pillButton({ size: "sm", variant: "secondary" })}>
              Exit demo
            </Link>
          )}
        </div>
      </header>

      {!project ? (
        <p className="mt-10 type-body">Your project will appear here once our team sets it up.</p>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <section
            data-tour="progress"
            aria-labelledby="h-progress"
            className="rounded-card bg-dark p-6 text-on-dark md:p-8 lg:col-span-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="h-progress" className="type-h3 text-on-dark">
                {project.name}
              </h2>
              <span className="rounded-full bg-on-dark px-3 py-1 type-small font-medium text-ink">
                {projectStatusLabels[project.status]}
              </span>
            </div>
            {project.summary && (
              <p className="mt-3 type-small text-on-dark-muted">{project.summary}</p>
            )}
            <p className="mt-8 text-[64px] leading-none font-medium tracking-tight">
              {project.progress}%
            </p>
            <div
              role="progressbar"
              aria-label="Project progress"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-5 h-3 overflow-hidden rounded-full bg-on-dark/20"
            >
              <div
                className="h-full rounded-full bg-on-dark"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="mt-4 type-small text-on-dark-muted">
              Target date: {fmtDate(project.target_date)}
            </p>
          </section>

          <Panel title="Milestones">
            {project.milestones.length === 0 ? (
              <p className="type-small">No milestones yet.</p>
            ) : (
              <ol className="flex flex-col gap-4">
                {project.milestones.map((m) => {
                  const Icon =
                    m.status === "done"
                      ? CheckCircle2
                      : m.status === "in_progress"
                        ? CircleDot
                        : Circle;
                  return (
                    <li key={m.id} className="flex items-start gap-3">
                      <Icon
                        aria-hidden
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          m.status === "todo" ? "text-muted-foreground" : "text-ink",
                        )}
                      />
                      <div>
                        <p className="font-medium text-ink">{m.title}</p>
                        <p className="type-small text-muted-foreground">
                          {milestoneStatusLabels[m.status]}
                          {m.due_date ? ` · ${fmtDate(m.due_date)}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Panel>

          <Panel title="Deliverables" className="lg:col-span-3">
            {project.deliverables.length === 0 ? (
              <p className="type-small">Files will appear here as we share them.</p>
            ) : (
              <ul className="divide-y divide-border">
                {project.deliverables.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span className="flex items-center gap-3 text-ink">
                      <FileText aria-hidden className="size-5" /> {d.title}
                    </span>
                    {d.file_path ? (
                      <PillButton
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => onDownloadDeliverable(d)}
                      >
                        <Download aria-hidden className="size-4" /> Download
                      </PillButton>
                    ) : d.external_url ? (
                      <a
                        href={d.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={pillButton({ size: "sm", variant: "secondary" })}
                      >
                        <ExternalLink aria-hidden className="size-4" /> Open
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      <Panel title="Invoices" tour="invoices" className="mt-5">
        {data.invoices.length === 0 ? (
          <p className="type-small">No invoices yet.</p>
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <thead className="type-small text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 font-medium">Number</th>
                  <th className="py-3 font-medium">Issue date</th>
                  <th className="py-3 font-medium">Due date</th>
                  <th className="py-3 font-medium">Amount (USD)</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="w-[260px] py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0">
                    <td className="py-4 font-medium text-ink">{inv.number}</td>
                    <td className="py-4">{fmtDate(inv.issue_date)}</td>
                    <td className="py-4">{fmtDate(inv.due_date)}</td>
                    <td className="py-4 text-ink">{usd(invoiceTotal(inv))}</td>
                    <td className="py-4">
                      <Chip status={inv.status} label={invoiceStatusLabels[inv.status]} />
                    </td>
                    <td className="w-[260px] py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <PillButton
                          type="button"
                          size="sm"
                          variant="secondary"
                          data-tour="download"
                          onClick={() => onDownloadInvoice(inv)}
                        >
                          <Download aria-hidden className="size-4" /> Download invoice
                        </PillButton>
                        {payable(inv.status) ? (
                          <PillButton
                            type="button"
                            size="sm"
                            data-tour="pay"
                            onClick={() => setPaying(inv)}
                            className="w-[72px]"
                          >
                            Pay
                          </PillButton>
                        ) : (
                          <span aria-hidden className="invisible inline-block h-10 w-[72px]" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="flex flex-col gap-4 md:hidden">
              {data.invoices.map((inv) => (
                <li key={inv.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink">{inv.number}</p>
                    <Chip status={inv.status} label={invoiceStatusLabels[inv.status]} />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 type-small">
                    <dt className="text-muted-foreground">Issue date</dt>
                    <dd className="text-ink">{fmtDate(inv.issue_date)}</dd>
                    <dt className="text-muted-foreground">Due date</dt>
                    <dd className="text-ink">{fmtDate(inv.due_date)}</dd>
                    <dt className="text-muted-foreground">Amount (USD)</dt>
                    <dd className="text-ink">{usd(invoiceTotal(inv))}</dd>
                  </dl>
                  <div className="mt-4 flex flex-col gap-2">
                    <PillButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      data-tour="download"
                      onClick={() => onDownloadInvoice(inv)}
                    >
                      <Download aria-hidden className="size-4" /> Download invoice
                    </PillButton>
                    {payable(inv.status) && (
                      <PillButton
                        type="button"
                        size="sm"
                        data-tour="pay"
                        onClick={() => setPaying(inv)}
                      >
                        Pay
                      </PillButton>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <Panel title="Payment history" className="mt-5">
        {data.payments.length === 0 ? (
          <p className="type-small">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-ink">
                    {invoiceNumbers.get(p.invoice_id) ?? "Invoice"} ·{" "}
                    {paymentMethodLabels[p.method]}
                  </p>
                  <p className="type-small text-muted-foreground">
                    {p.confirmed_at
                      ? `Confirmed ${fmtDate(p.confirmed_at)}`
                      : `Reported ${fmtDate(p.reported_at)}`}
                    {p.reference ? ` · Ref ${p.reference}` : ""}
                  </p>
                </div>
                <Chip
                  status={p.confirmed_at ? "paid" : "pending_confirmation"}
                  label={p.confirmed_at ? "Confirmed" : "Reported"}
                />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <PayModal invoice={paying} onClose={() => setPaying(null)} onReport={onReportPaid} />
      <Tour steps={portalTourSteps} open={tour.open} onClose={tour.close} />
    </div>
  );
}
