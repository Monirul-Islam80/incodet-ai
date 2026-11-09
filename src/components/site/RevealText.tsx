import { Fragment, useRef } from "react";
import { useScrollProgress } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

/**
 * Paragraph whose words fill from light grey to ink (or the accent gradient) on scroll.
 * Words stay as real text separated by real spaces, so it reads normally for assistive tech.
 */
export function RevealText({
  text,
  accent = false,
  size = "h3",
  className,
}: {
  text: string;
  accent?: boolean;
  size?: "h2" | "h3" | "statement";
  className?: string;
}) {
  const words = text.split(" ");
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const ref = useScrollProgress<HTMLParagraphElement>((p) => {
    const lit = p * words.length;
    spans.current.forEach((s, i) => {
      if (s) s.style.opacity = String(Math.min(1, Math.max(0.2, lit - i + 0.2)));
    });
  }, "through");

  return (
    <p
      ref={ref}
      className={cn(
        size === "h2"
          ? "type-h2"
          : size === "statement"
            ? "text-[24px] leading-[1.3] font-medium tracking-tight md:text-[30px] lg:text-[40px]"
            : "type-h3 md:text-[40px] md:leading-[1.25]",
        className,
      )}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span
            ref={(el) => {
              spans.current[i] = el;
            }}
            className={cn(
              "transition-opacity duration-200 motion-reduce:!opacity-100",
              accent ? "text-gradient-accent" : "text-ink",
            )}
            style={{ opacity: 0.2 }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
