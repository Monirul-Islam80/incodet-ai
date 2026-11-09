import { Reveal } from "./primitives";

/** Temporary page body for routes whose content arrives in a later phase. */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="bg-background pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="container-site text-center">
        <Reveal>
          <h1 className="type-h1">{title}</h1>
        </Reveal>
      </div>
    </section>
  );
}

export function pageHead(title: string, description: string) {
  const t = `${title} | Incodet`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
