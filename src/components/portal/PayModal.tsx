import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillButton, pillButton } from "@/components/site/Button";
import { site } from "@/config/site";
import {
  bankDetails,
  methodLink,
  paymentMethodLabels,
  type PaymentMethod,
} from "@/config/payments";
import { invoiceTotal, usd, type PortalInvoice } from "@/lib/portal-types";

const methods: PaymentMethod[] = ["payoneer", "wise", "paypal", "bank_transfer"];
const field =
  "w-full rounded-2xl border border-[#CFCFCF] bg-background px-4 py-3 text-[16px] text-ink outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink";

function NotSet() {
  return (
    <p className="type-body">
      We will email you these payment details. Questions? Email{" "}
      <a
        href={`mailto:${site.email}`}
        className="font-medium text-ink underline underline-offset-4"
      >
        {site.email}
      </a>
      .
    </p>
  );
}

export function PayModal({
  invoice,
  onClose,
  onReport,
}: {
  invoice: PortalInvoice | null;
  onClose: () => void;
  onReport: (invoice: PortalInvoice, method: PaymentMethod, reference: string) => Promise<boolean>;
}) {
  const [step, setStep] = useState<"details" | "report">("details");
  const [method, setMethod] = useState<PaymentMethod>("payoneer");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = () => {
    setStep("details");
    setReference("");
    onClose();
  };

  async function copy() {
    if (!invoice) return;
    try {
      await navigator.clipboard.writeText(invoice.number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy the invoice number by hand.");
    }
  }

  return (
    <Dialog open={!!invoice} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-card sm:max-w-lg">
        {invoice && (
          <>
            <DialogHeader>
              <DialogTitle className="text-[24px] font-medium">Pay {invoice.number}</DialogTitle>
              <DialogDescription>Amount due: {usd(invoiceTotal(invoice))} USD</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-bg-soft p-4">
              <p className="type-small text-ink">
                Use <strong>{invoice.number}</strong> as your payment reference
              </p>
              <button
                type="button"
                onClick={copy}
                className={pillButton({ size: "sm", variant: "secondary" })}
              >
                {copied ? (
                  <Check aria-hidden className="size-4" />
                ) : (
                  <Copy aria-hidden className="size-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {step === "details" ? (
              <>
                <Tabs defaultValue="payoneer" onValueChange={(v) => setMethod(v as PaymentMethod)}>
                  <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-bg-soft p-1 sm:grid-cols-4">
                    {methods.map((m) => (
                      <TabsTrigger key={m} value={m} className="rounded-full py-2">
                        {paymentMethodLabels[m]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {methods.map((m) => {
                    const link = methodLink(m);
                    const bank = m === "bank_transfer" ? bankDetails() : [];
                    return (
                      <TabsContent key={m} value={m} className="pt-4">
                        {m === "bank_transfer" ? (
                          bank.length ? (
                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 type-small">
                              {bank.map((b) => (
                                <div key={b.label} className="contents">
                                  <dt className="text-muted-foreground">{b.label}</dt>
                                  <dd className="font-medium text-ink">{b.value}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <NotSet />
                          )
                        ) : link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={pillButton()}
                          >
                            Pay with {paymentMethodLabels[m]}{" "}
                            <ExternalLink aria-hidden className="size-4" />
                          </a>
                        ) : (
                          <NotSet />
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
                <PillButton
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setStep("report")}
                >
                  I've paid
                </PillButton>
              </>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  const ok = await onReport(invoice, method, reference);
                  setBusy(false);
                  if (ok) close();
                }}
              >
                <div>
                  <label
                    htmlFor="pay-method"
                    className="mb-2 block type-small font-medium text-ink"
                  >
                    How did you pay?
                  </label>
                  <select
                    id="pay-method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className={field}
                  >
                    {methods.map((m) => (
                      <option key={m} value={m}>
                        {paymentMethodLabels[m]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="pay-ref" className="mb-2 block type-small font-medium text-ink">
                    Transaction reference{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="pay-ref"
                    value={reference}
                    maxLength={200}
                    onChange={(e) => setReference(e.target.value)}
                    className={field}
                  />
                </div>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <PillButton type="button" variant="secondary" onClick={() => setStep("details")}>
                    Back
                  </PillButton>
                  <PillButton type="submit" disabled={busy}>
                    {busy && <Loader2 aria-hidden className="size-4 animate-spin" />} Confirm
                    payment
                  </PillButton>
                </div>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
