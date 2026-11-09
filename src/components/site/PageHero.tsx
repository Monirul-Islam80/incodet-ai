import type { ReactNode } from "react";
import { PillBadge, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

/** Centered inner-page hero on a soft background. */
export function PageHero({
  badge,
  title,
  children,
  actions,
  className,
}: {
  badge?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-theme="light"
      className={cn("bg-hero-sky pt-36 pb-[72px] md:pt-44 md:pb-[120px]", className)}
    >
      <div className="container-site">
        <Reveal className="mx-auto max-w-4xl text-center">
          {badge && <PillBadge>{badge}</PillBadge>}
          <h1 className={cn("type-h1", badge && "mt-6")}>{title}</h1>
          {children && <p className="mx-auto mt-6 max-w-2xl type-body">{children}</p>}
          {actions && (
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">{actions}</div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export { seoHead } from "@/lib/seo";
