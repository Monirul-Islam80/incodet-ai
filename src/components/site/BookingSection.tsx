import { Check, MessageCircle, Phone } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { pillButton } from "./Button";

const Widget = lazy(() => import("./BookingWidget").then((m) => ({ default: m.BookingWidget })));
export function BookingSection() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={ref}
      aria-labelledby="home-booking-title"
      className="bg-bg-soft py-[72px] md:py-[120px]"
    >
      <div className="container-site grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="home-booking-title" className="type-h2">
            Book a free call
          </h2>
          <p className="mt-5 type-body">
            Pick a time that suits you. We learn your business, your customers and what you need.
            Free, no commitment.
          </p>
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {near && (
            <Suspense fallback={<p role="status">Loading calendar…</p>}>
              <Widget />
            </Suspense>
          )}
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <ul className="space-y-5">
            {[
              "We learn how your business takes calls and bookings today",
              "We show you how the AI agent and booking website would work for you",
              "You get a clear plan and price, with no obligation",
            ].map((text) => (
              <li key={text} className="flex gap-3 type-body">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-ink" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-8 type-small text-ink">{site.availabilityLabel}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={pillButton()}
            >
              <MessageCircle aria-hidden className="size-4" />
              WhatsApp
            </a>
            <a href={site.phoneHref} className={pillButton({ variant: "secondary" })}>
              <Phone aria-hidden className="size-4" />
              Call us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
