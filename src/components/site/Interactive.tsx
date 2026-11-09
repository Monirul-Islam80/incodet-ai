import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: ReactNode }[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn("flex flex-col gap-3", className)}
    >
      {items.map((it, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`item-${i}`}
          className="rounded-card-sm border border-border bg-background"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 rounded-card-sm px-6 py-5 text-left text-[18px] font-medium text-ink">
              {it.question}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-soft">
                <Plus
                  aria-hidden
                  className="size-4 transition-transform duration-500 ease-[var(--ease)] group-data-[state=open]:rotate-45"
                />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-6 pb-6 type-body">{it.answer}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

export function SegmentedTabs({
  tabs,
  className,
}: {
  tabs: { label: string; content: ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    let n = active;
    if (e.key === "ArrowRight") n = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(n);
    btns.current[n]?.focus();
  };
  return (
    <div className={className}>
      <div className="flex justify-center">
        <div
          role="tablist"
          onKeyDown={onKey}
          className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-bg-soft p-1.5"
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                btns.current[i] = el;
              }}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-controls={`${id}-panel-${i}`}
              aria-selected={active === i}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full px-5 py-2.5 type-small font-medium whitespace-nowrap transition-all duration-300",
                active === i ? "bg-background text-ink shadow-soft" : "text-body hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className="mt-8"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
