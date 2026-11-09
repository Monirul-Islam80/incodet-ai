import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { PillLink } from "./Button";

/** Non-sticky top bar, transparent so it sits over the hero. White over the dark homepage hero. */
export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onDark = pathname === "/";
  return (
    <header data-theme={onDark ? "dark" : undefined} className="absolute inset-x-0 top-0 z-30">
      <div className="container-site flex h-20 items-center justify-between md:h-24">
        <Link to="/" aria-label="Incodet home" className="rounded-md">
          <Logo tone={onDark ? "white" : "ink"} />
        </Link>
        <PillLink to="/book" size="sm" variant={onDark ? "primary-inverted" : "primary"}>
          Book a Free Call
        </PillLink>
      </div>
    </header>
  );
}
