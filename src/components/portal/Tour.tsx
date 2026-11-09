import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PillButton } from "@/components/site/Button";

export type TourStep = { target: string; text: string };

export const portalTourSteps: TourStep[] = [
  { target: "progress", text: "Your project progress, updated by our team" },
  { target: "invoices", text: "All your invoices in one place" },
  { target: "pay", text: "Pay with Payoneer, Wise, PayPal or bank transfer" },
  { target: "download", text: "Download a PDF copy any time" },
];

function findTarget(t: string): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${t}"]`));
  return els.find((e) => e.getClientRects().length > 0) ?? null;
}

function store(key: string, v?: string) {
  try {
    if (v === undefined) return window.localStorage.getItem(key);
    window.localStorage.setItem(key, v);
  } catch {
    /* storage unavailable */
  }
  return null;
}

/** Guided tour of elements marked data-tour="<target>". Shows once per storageKey; replay via the returned start(). */
export function useTour(storageKey: string, ready: boolean) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (ready && !store(storageKey)) {
      const t = window.setTimeout(() => setOpen(true), 400);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [ready, storageKey]);
  const close = useCallback(() => {
    store(storageKey, "done");
    setOpen(false);
  }, [storageKey]);
  return { open, start: () => setOpen(true), close };
}

export function Tour({
  steps,
  open,
  onClose,
}: {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const available = open ? steps.filter((s) => findTarget(s.target)) : [];
  const step = available[i];

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  const measure = useCallback(() => {
    if (!step) return;
    const el = findTarget(step.target);
    if (el) setRect(el.getBoundingClientRect());
  }, [step]);

  useLayoutEffect(() => {
    if (!open || !step) return;
    const el = findTarget(step.target);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    measure();
    const t = window.setTimeout(measure, reduce ? 0 : 450);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [open, step, measure]);

  const hasRect = !!rect;
  useEffect(() => {
    if (open && hasRect) nextRef.current?.focus({ preventScroll: true });
  }, [open, i, hasRect]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, available.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, available.length]);

  if (!open || !step || !rect) return null;
  const last = i === available.length - 1;
  const vw = window.innerWidth;
  const cardW = Math.min(320, vw - 32);
  const below = rect.bottom + 200 < window.innerHeight;
  const top = below ? rect.bottom + 12 : Math.max(16, rect.top - 12 - 170);
  const left = Math.min(Math.max(16, rect.left + rect.width / 2 - cardW / 2), vw - cardW - 16);
  const pad = 6;

  return (
    <div className="fixed inset-0 z-[70]" aria-live="polite">
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-2xl ring-2 ring-ink transition-all duration-300"
        style={{
          top: rect.top - pad,
          left: rect.left - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-text"
        className="fixed rounded-2xl bg-background p-5 shadow-pill"
        style={{ top, left, width: cardW }}
      >
        <p className="type-small text-muted-foreground">
          Step {i + 1} of {available.length}
        </p>
        <p id="tour-text" className="mt-2 text-[17px] font-medium text-ink">
          {step.text}
        </p>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="type-small font-medium text-ink underline underline-offset-4"
          >
            Skip
          </button>
          <div className="flex gap-2">
            {i > 0 && (
              <PillButton type="button" size="sm" variant="secondary" onClick={() => setI(i - 1)}>
                Back
              </PillButton>
            )}
            <PillButton
              ref={nextRef}
              type="button"
              size="sm"
              onClick={() => (last ? onClose() : setI(i + 1))}
            >
              {last ? "Done" : "Next"}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
