import { services, type Service } from "@/content/services";
import { getCaseStudy, mockupSm } from "@/content/caseStudies";
import { PillLink } from "./Button";
import { CallCardUI, ChatUI } from "@/components/home/MiniUI";
import { cn } from "@/lib/utils";
import { ServiceSampleUI } from "./ServiceSampleUI";
import { serviceStripEntries } from "@/lib/service-strip";
import { TempImage } from "./TempImage";

export function DiamondDots() {
  return (
    <span aria-hidden className="grid size-4 rotate-45 grid-cols-2 gap-0.5">
      <i className="rounded-full bg-current" />
      <i className="rounded-full bg-current" />
      <i className="rounded-full bg-current" />
      <i className="rounded-full bg-current" />
    </span>
  );
}
export function ServicePlaceholder({
  label = "Image coming soon",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      data-placeholder="true"
      className={cn(
        "service-placeholder flex items-center justify-center text-center type-small",
        className,
      )}
    >
      <span>{label}</span>
    </div>
  );
}
export function ServiceImage({ slug, eager = false }: { slug: string; eager?: boolean }) {
  const c = getCaseStudy(slug);
  if (!c) return <ServicePlaceholder className="size-full" />;
  return (
    <img
      src={c.mockup ? mockupSm(c.mockup) : c.image.src}
      srcSet={c.mockup ? `${mockupSm(c.mockup)} 800w, ${c.mockup} 1600w` : undefined}
      sizes="(min-width: 768px) 420px, 300px"
      alt={`${c.name} ${c.type === "Demo" ? "demo" : c.type === "Concept" ? "concept" : "website"} mockup`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width={800}
      height={500}
      className="size-full object-cover"
    />
  );
}
export function ServiceStrip({ service }: { service: Service }) {
  const entries = serviceStripEntries(service);
  // Empty positions take the service's temporary images in order (docs/temp-images.md).
  const temps = [...(service.temp?.strip ?? [])];
  return (
    <div
      role="region"
      aria-label={`${service.title} images`}
      tabIndex={0}
      className="service-image-strip"
    >
      {entries.map((entry, i) => {
        const temp = entry ? undefined : temps.shift();
        return (
          <div key={`${entry}-${i}`} className="service-image-tile">
            {entry === "call" ? (
              <div className="h-full bg-background p-4">
                <CallCardUI />
              </div>
            ) : entry === "chat" ? (
              <div className="h-full bg-background p-4">
                <ChatUI />
              </div>
            ) : entry &&
              ["notification", "reminder", "sync", "sample-phone", "sample-social"].includes(
                entry,
              ) ? (
              <ServiceSampleUI
                kind={
                  entry === "sample-phone" ? "phone" : entry === "sample-social" ? "social" : entry
                }
              />
            ) : entry ? (
              <ServiceImage slug={entry} />
            ) : temp ? (
              <TempImage id={temp} sizes="(min-width: 768px) 258px, 240px" />
            ) : (
              <ServicePlaceholder className="size-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}
export function ServicePanels() {
  return (
    <div className="container-site flex flex-col gap-6 pb-6">
      {services.map((s, i) => (
        <article key={s.id} data-theme="dark" className={cn("service-panel text-on-dark", s.color)}>
          <div className="flex items-start justify-between gap-4">
            <h3 className="service-panel-title">{s.title}</h3>
            <span aria-hidden className="service-panel-number">
              /{String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="service-panel-inner">
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_auto_1.3fr] lg:items-center lg:gap-10">
              <p className="service-panel-copy flex max-w-[230px] items-start gap-3 type-small">
                <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-on-dark" />
                {s.short}
              </p>
              <PillLink to={s.to} variant="primary-inverted" size="sm" className="self-start">
                <DiamondDots />
                Get Started
              </PillLink>
              <p className="service-panel-copy max-w-md type-small">{s.description}</p>
            </div>
            <ServiceStrip service={s} />
          </div>
        </article>
      ))}
    </div>
  );
}
