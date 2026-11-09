import type { PaymentMethod } from "@/config/payments";

export type ProjectStatus = "planning" | "in_progress" | "review" | "live" | "on_hold";
export type MilestoneStatus = "todo" | "in_progress" | "done";
export type InvoiceStatus = "draft" | "sent" | "pending_confirmation" | "paid" | "overdue";

export type PortalMilestone = {
  id: string;
  title: string;
  status: MilestoneStatus;
  due_date: string | null;
};
export type PortalDeliverable = {
  id: string;
  title: string;
  file_path: string | null;
  external_url: string | null;
};
export type PortalProject = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  target_date: string | null;
  summary: string | null;
  milestones: PortalMilestone[];
  deliverables: PortalDeliverable[];
};
export type PortalInvoiceItem = { description: string; quantity: number; unit_price: number };
export type PortalInvoice = {
  id: string;
  number: string;
  project_id: string | null;
  issue_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  notes: string | null;
  items: PortalInvoiceItem[];
};
export type PortalPayment = {
  id: string;
  invoice_id: string;
  method: PaymentMethod;
  reference: string | null;
  reported_at: string | null;
  confirmed_at: string | null;
};
export type PortalData = {
  client: { name: string; business_name: string | null };
  projects: PortalProject[];
  invoices: PortalInvoice[];
  payments: PortalPayment[];
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In progress",
  review: "In review",
  live: "Live",
  on_hold: "On hold",
};
export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  pending_confirmation: "Pending confirmation",
  paid: "Paid",
  overdue: "Overdue",
};
export const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const invoiceTotal = (inv: { items: PortalInvoiceItem[] }) =>
  inv.items.reduce((s, it) => s + Number(it.quantity) * Number(it.unit_price), 0);

export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function fmtDate(d: string | null | undefined) {
  if (!d) return "Not set";
  const date = new Date(d.length === 10 ? `${d}T00:00:00Z` : d);
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
