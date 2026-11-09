import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = {
  tone?: "ink" | "white";
  /** "mark" shows only the monogram (used in the floating nav). */
  variant?: "full" | "mark";
  className?: string;
};

export function Logo({ tone = "ink", variant = "full", className }: Props) {
  const color = tone === "white" ? "text-on-dark" : "text-ink";
  if (site.logoUrl) {
    return (
      <img
        src={site.logoUrl}
        alt={site.name}
        className={cn(variant === "mark" ? "h-6 w-auto" : "h-7 w-auto", className)}
      />
    );
  }
  if (variant === "mark") {
    return (
      <span
        role="img"
        aria-label={site.name}
        className={cn(
          "wordmark flex size-6 items-center justify-center rounded-[6px] text-[15px] leading-none font-bold",
          tone === "white" ? "bg-background text-ink" : "bg-ink text-primary-foreground",
          className,
        )}
      >
        {site.name.charAt(0)}
      </span>
    );
  }
  return (
    <span className={cn("wordmark text-2xl leading-none", color, className)}>{site.name}</span>
  );
}
