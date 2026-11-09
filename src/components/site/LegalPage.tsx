import type { ReactNode } from "react";
import { BookingCta } from "@/components/home/HomeSections";

export const legalUpdated = "7 November 2026";

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: ReactNode;
  sections: { h: string; body: ReactNode }[];
}) {
  return (
    <>
      <article className="bg-background pt-36 pb-8 md:pt-44">
        <div className="container-site">
          <div className="mx-auto max-w-[760px]">
            <h1 className="type-h1">{title}</h1>
            <p className="mt-4 type-small text-muted-foreground">Last updated: {legalUpdated}</p>
            <div className="mt-8 type-body">{intro}</div>
            {sections.map((s) => (
              <section key={s.h} className="mt-12">
                <h2 className="text-[24px] leading-tight font-medium tracking-tight text-ink md:text-[28px]">
                  {s.h}
                </h2>
                <div className="mt-4 flex flex-col gap-4 type-body [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
      <BookingCta />
    </>
  );
}
