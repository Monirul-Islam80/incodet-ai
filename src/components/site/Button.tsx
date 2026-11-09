import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const pillButton = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[transform,background-color,box-shadow,color] duration-300 ease-[var(--ease)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-primary-foreground shadow-pill hover:bg-dark-card",
        secondary: "bg-background text-ink border border-border hover:bg-bg-soft",
        "primary-inverted": "bg-background text-ink shadow-pill hover:bg-bg-soft",
        "secondary-inverted":
          "bg-transparent text-on-dark border border-on-dark/30 hover:bg-on-dark/10",
      },
      size: {
        md: "h-12 px-6 text-[16px]",
        sm: "h-10 px-5 type-small",
        lg: "h-14 px-8 text-[17px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type V = VariantProps<typeof pillButton>;

export function PillButton({ className, variant, size, ...props }: ComponentProps<"button"> & V) {
  return <button className={cn(pillButton({ variant, size }), className)} {...props} />;
}

/** Internal route link styled as a pill. */
export function PillLink({
  to,
  children,
  className,
  variant,
  size,
  onClick,
  search,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  search?: Record<string, string>;
} & V) {
  return (
    <Link
      to={to}
      search={search as never}
      onClick={onClick}
      className={cn(pillButton({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}
