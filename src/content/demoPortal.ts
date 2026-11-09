import type { PortalData } from "@/lib/portal-types";

// Fictional sample data for /portal/demo. Never loaded from or written to the database.
const iso = (offsetDays: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export function getDemoPortal(): PortalData {
  return {
    client: { name: "Sample Client", business_name: "Sample Roofing Co" },
    projects: [
      {
        id: "demo-project",
        name: "Website + 24/7 AI calling agent",
        status: "in_progress",
        progress: 65,
        target_date: iso(21),
        summary: "A booking website and a 24/7 AI calling agent for a sample roofing company.",
        milestones: [
          { id: "m1", title: "Discovery call", status: "done", due_date: iso(-28) },
          { id: "m2", title: "Plan & design", status: "done", due_date: iso(-14) },
          { id: "m3", title: "Build & integrate", status: "in_progress", due_date: iso(7) },
          { id: "m4", title: "Launch & support", status: "todo", due_date: iso(21) },
        ],
        deliverables: [
          { id: "d1", title: "Homepage design (PDF)", file_path: "demo", external_url: null },
          { id: "d2", title: "AI agent call script (PDF)", file_path: "demo", external_url: null },
        ],
      },
    ],
    invoices: [
      {
        id: "i1",
        number: "INC-2026-001",
        project_id: "demo-project",
        issue_date: iso(-30),
        due_date: iso(-23),
        status: "paid",
        notes: null,
        items: [{ description: "Growth plan setup fee", quantity: 1, unit_price: 999 }],
      },
      {
        id: "i2",
        number: "INC-2026-002",
        project_id: "demo-project",
        issue_date: iso(0),
        due_date: iso(7),
        status: "sent",
        notes: null,
        items: [{ description: "Growth plan monthly fee", quantity: 1, unit_price: 149 }],
      },
    ],
    payments: [
      {
        id: "p1",
        invoice_id: "i1",
        method: "wise",
        reference: "INC-2026-001",
        reported_at: iso(-25),
        confirmed_at: iso(-24),
      },
    ],
  };
}
