import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { PillButton } from "./Button";

const KEY = "incodet-analytics-consent";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function write(v: "accepted" | "declined") {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage unavailable */
  }
}

function loadAnalytics() {
  const { provider, id } = site.analytics;
  if (!provider || !id || document.getElementById("incodet-analytics")) return;
  const s = document.createElement("script");
  s.id = "incodet-analytics";
  s.async = true;
  if (provider === "plausible") {
    s.src = "https://plausible.io/js/script.js";
    s.dataset["domain"] = id;
  } else {
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", id, { anonymize_ip: true });
  }
  document.head.appendChild(s);
}

/** Renders only when an analytics provider is configured. Scripts load only after Accept. */
export function CookieConsent() {
  const enabled = Boolean(site.analytics.provider && site.analytics.id);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const choice = read();
    if (choice === "accepted") loadAnalytics();
    else if (!choice) setShow(true);
  }, [enabled]);

  if (!enabled || !show) return null;
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-24 left-4 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-background p-5 shadow-pill md:bottom-6 md:left-6"
    >
      <p className="type-small text-ink">
        We use privacy-friendly analytics to see how our website is used, only if you accept.{" "}
        <Link to="/privacy" className="font-medium underline underline-offset-4">
          Privacy Policy
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <PillButton
          size="sm"
          variant="secondary"
          onClick={() => {
            write("declined");
            setShow(false);
          }}
        >
          Decline
        </PillButton>
        <PillButton
          size="sm"
          variant="secondary"
          onClick={() => {
            write("accepted");
            setShow(false);
            loadAnalytics();
          }}
        >
          Accept
        </PillButton>
      </div>
    </div>
  );
}
