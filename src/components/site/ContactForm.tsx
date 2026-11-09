import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { site } from "@/config/site";
import {
  contactFields,
  contactPlans,
  isPlan,
  planLabels,
  type ContactPlan,
} from "@/lib/contact-schema";
import { submitContact } from "@/lib/contact.functions";
import { PillButton } from "./Button";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "business_name" | "plan" | "message", string>>;

const inputCls =
  "w-full rounded-2xl border border-[#CFCFCF] bg-background px-4 py-3 text-[16px] text-ink outline-none transition-shadow focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";

export function ContactForm({ sourcePage, className }: { sourcePage: string; className?: string }) {
  const id = useId();
  const submit = useServerFn(submitContact);
  const renderedAt = useRef(Date.now());
  const [plan, setPlan] = useState<ContactPlan>("not_sure");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (isPlan(p) && p !== "not_sure") setPlan(p);
    renderedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      business_name: String(fd.get("business_name") ?? ""),
      plan,
      message: String(fd.get("message") ?? ""),
    };
    const parsed = contactFields.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        next[k] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setState("submitting");
    try {
      const res = await submit({
        data: {
          ...values,
          source_page: sourcePage,
          website: String(fd.get("website") ?? ""),
          rendered_at: renderedAt.current,
        },
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className={cn(
          "rounded-card border border-border bg-background p-8 text-center md:p-12",
          className,
        )}
      >
        <p className="type-h3">Thanks, we have your message. We will reply by email soon.</p>
        <button
          type="button"
          onClick={() => {
            renderedAt.current = Date.now();
            setState("idle");
          }}
          className="mt-6 type-small font-medium text-ink underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });
  const err = (name: keyof Errors) =>
    errors[name] && (
      <p id={`${id}-${name}-err`} className="mt-2 type-small text-destructive">
        {errors[name]}
      </p>
    );
  const label = "mb-2 block type-small font-medium text-ink";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn("rounded-card border border-border bg-background p-6 md:p-10", className)}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            Name
          </label>
          <input {...field("name")} autoComplete="name" className={inputCls} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            Email
          </label>
          <input {...field("email")} type="email" autoComplete="email" className={inputCls} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={`${id}-business_name`} className={label}>
            Business name <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input {...field("business_name")} autoComplete="organization" className={inputCls} />
          {err("business_name")}
        </div>
        <div>
          <label htmlFor={`${id}-plan`} className={label}>
            Plan you are interested in
          </label>
          <select
            {...field("plan")}
            value={plan}
            onChange={(e) => setPlan(e.target.value as ContactPlan)}
            className={inputCls}
          >
            {contactPlans.map((p) => (
              <option key={p} value={p}>
                {planLabels[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor={`${id}-message`} className={label}>
            Message
          </label>
          <textarea {...field("message")} rows={6} className={cn(inputCls, "resize-y")} />
          {err("message")}
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state === "error" && (
        <p role="alert" className="mt-6 rounded-2xl bg-bg-soft p-4 type-small text-ink">
          Something went wrong. Please email us at{" "}
          <a href={`mailto:${site.email}`} className="font-medium underline underline-offset-4">
            {site.email}
          </a>{" "}
          or message us on{" "}
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      )}

      <PillButton type="submit" disabled={state === "submitting"} className="mt-8 w-full sm:w-auto">
        {state === "submitting" && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {state === "submitting" ? "Sending..." : "Send message"}
      </PillButton>
    </form>
  );
}
