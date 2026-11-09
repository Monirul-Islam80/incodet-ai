import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { TopBar } from "@/components/site/TopBar";
import { FloatingNav } from "@/components/site/FloatingNav";
import { Footer } from "@/components/site/Footer";
import { PillLink } from "@/components/site/Button";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/site/CookieConsent";
import { supabase } from "@/integrations/supabase/client";
import { SmoothScroll } from "@/components/site/SmoothScroll";

function NotFoundComponent() {
  return (
    <section className="bg-hero-sky flex min-h-[80vh] items-center justify-center px-4 pt-32 pb-[72px]">
      <div className="max-w-xl text-center">
        <p className="type-small font-medium text-muted-foreground">Error 404</p>
        <h1 className="type-h1 mt-3">Page not found</h1>
        <p className="mt-4 type-body">This page does not exist or has moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PillLink to="/">Home</PillLink>
          <PillLink to="/pricing" variant="secondary">
            Pricing
          </PillLink>
          <PillLink to="/book" variant="secondary">
            Book a Call
          </PillLink>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: ({ matches }) => {
    // A 404 matches only the root route (or a match flagged notFound).
    const isNotFound =
      matches.length <= 1 ||
      matches.some(
        (m) => (m as { globalNotFound?: boolean }).globalNotFound || m.status === "notFound",
      );
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0A0A0A" },
        ...(isNotFound
          ? [{ title: "Page not found | Incodet" }, { name: "robots", content: "noindex" }]
          : [{ title: "Incodet | Websites, AI Agents & Custom Software" }]),
        {
          name: "description",
          content:
            "Booking websites, 24/7 AI chatbots and calling agents, and custom software for small, growing and established businesses. Pay only for what you use.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://api.fontshare.com" },
        { rel: "preconnect", href: "https://cdn.fontshare.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const isPortalApp = pathname.startsWith("/portal/");
  const isDeck = pathname === "/deck";

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {!isDeck && <SmoothScroll />}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      {!isAdmin && !isDeck && <TopBar />}
      <main id="main">
        <Outlet />
      </main>
      {!isAdmin && !isDeck && <Footer />}
      {!isAdmin && !isPortalApp && !isDeck && <FloatingNav />}
      <Toaster position="top-center" />
      {!isAdmin && !isDeck && <CookieConsent />}
    </QueryClientProvider>
  );
}
