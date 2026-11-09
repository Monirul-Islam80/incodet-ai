// Payment details shown in the client portal "Pay" window and on invoice PDFs.
// Leave a value empty ("") and the portal shows "We will email you these payment details" instead.
export const payments = {
  payoneerUrl: "",
  wiseUrl: "",
  paypalUrl: "",
  bank: {
    accountName: "",
    bankName: "",
    accountNumber: "",
    bsb: "",
    swift: "",
    iban: "",
  },
};

export type PaymentMethod = "payoneer" | "wise" | "paypal" | "bank_transfer";

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  payoneer: "Payoneer",
  wise: "Wise",
  paypal: "PayPal",
  bank_transfer: "Bank transfer",
};

export const bankFieldLabels: Record<keyof typeof payments.bank, string> = {
  accountName: "Account name",
  bankName: "Bank",
  accountNumber: "Account number",
  bsb: "BSB",
  swift: "SWIFT",
  iban: "IBAN",
};

export function bankDetails() {
  return (Object.keys(payments.bank) as (keyof typeof payments.bank)[])
    .filter((k) => payments.bank[k])
    .map((k) => ({ label: bankFieldLabels[k], value: payments.bank[k] }));
}

export function methodLink(m: PaymentMethod): string {
  return m === "payoneer"
    ? payments.payoneerUrl
    : m === "wise"
      ? payments.wiseUrl
      : m === "paypal"
        ? payments.paypalUrl
        : "";
}
