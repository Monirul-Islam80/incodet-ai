import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PillButton } from "@/components/site/Button";
import { PillBadge, Reveal } from "@/components/site/primitives";

export const Route = createFileRoute("/portal/")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Client Portal | Incodet" },
      {
        name: "description",
        content: "Track your project, download files and pay invoices in one place.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Client Portal | Incodet" },
      {
        property: "og:description",
        content: "Track your project, download files and pay invoices in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortalLogin,
});

function PortalLogin() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/portal/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (v.toUpperCase() === "DEMO") {
      navigate({ to: "/portal/demo" });
      return;
    }
    const parsed = z.string().email().max(255).safeParse(v);
    if (!parsed.success) {
      setError("Please enter a valid email address, or type DEMO.");
      return;
    }
    setError("");
    setState("sending");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: parsed.data.toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    if (err) {
      setState("idle");
      setError("We could not send the sign-in link. Please try again in a minute.");
      return;
    }
    setState("sent");
  }

  return (
    <section className="flex min-h-[90vh] items-center bg-bg-soft pt-32 pb-[72px] md:pt-40">
      <div className="container-site">
        <Reveal className="mx-auto max-w-xl text-center">
          <PillBadge>Client portal</PillBadge>
          <h1 className="mt-6 type-h1">Client portal</h1>
          <p className="mx-auto mt-6 max-w-md type-body">
            Track your project, download files and pay invoices in one place.
          </p>
        </Reveal>
        <Reveal delay={80} className="mx-auto mt-10 max-w-md">
          {state === "sent" ? (
            <div
              role="status"
              className="rounded-card border border-border bg-background p-8 text-center"
            >
              <MailCheck aria-hidden className="mx-auto size-8 text-ink" strokeWidth={1.5} />
              <p className="mt-4 type-h3">Check your email for a sign-in link.</p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="mt-5 type-small font-medium text-ink underline underline-offset-4"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={onSubmit}
              className="rounded-card border border-border bg-background p-6 md:p-8"
            >
              <label htmlFor="portal-email" className="mb-2 block type-small font-medium text-ink">
                Email or DEMO
              </label>
              <input
                id="portal-email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="email"
                placeholder='Type "DEMO" to explore a sample project'
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "portal-email-err" : undefined}
                className="w-full rounded-2xl border border-[#CFCFCF] bg-background px-4 py-3 text-[16px] text-ink outline-none placeholder:text-muted-foreground focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              />
              {error && (
                <p id="portal-email-err" className="mt-2 type-small text-destructive">
                  {error}
                </p>
              )}
              <PillButton type="submit" disabled={state === "sending"} className="mt-6 w-full">
                {state === "sending" && <Loader2 aria-hidden className="size-4 animate-spin" />}
                Continue
              </PillButton>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
