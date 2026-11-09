import { activeSocials, type SocialKey } from "@/config/site";

const paths: Record<SocialKey, string> = {
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z",
  facebook:
    "M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.2H8v3.3h2.6v8.4H14v-8.4h2.7l.4-3.3H14Z",
  instagram:
    "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1.1-.1-1.4-.1-4.1s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1 1.1-.1 1.4-.1 4.1-.1Z",
  threads:
    "M16.7 11.2c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.6-4.7-1.6 0-3 .7-3.9 2l1.5 1c.6-.9 1.6-1.1 2.4-1.1 1 0 1.7.3 2.2.8.3.4.6.9.7 1.6-.8-.1-1.7-.2-2.6-.1-2.6.2-4.3 1.7-4.2 3.8.1 1.1.6 2 1.5 2.6.8.5 1.8.8 2.8.7 1.4-.1 2.5-.6 3.2-1.6.6-.7.9-1.7 1-2.9.7.4 1.2 1 1.4 1.6.4 1.1.5 2.9-1 4.4-1.3 1.3-2.9 1.9-5.3 1.9-2.6 0-4.6-.9-5.9-2.5C4.6 17.1 4 15 4 12.5s.6-4.6 1.8-6.1C7.1 4.8 9.1 4 11.7 4c2.7 0 4.7.8 6 2.5.7.8 1.2 1.8 1.5 3l1.8-.5c-.4-1.5-1-2.7-1.9-3.8C17.5 3.1 14.9 2 11.7 2 8.5 2 6 3.1 4.4 5.2 2.8 7.1 2 9.6 2 12.5s.8 5.4 2.4 7.3c1.6 2.1 4.1 3.2 7.3 3.2 2.9 0 4.9-.8 6.6-2.4 2.2-2.2 2.1-4.9 1.4-6.6-.5-1.2-1.6-2.2-3-2.8Zm-5 4.7c-1.1.1-2.2-.4-2.3-1.3 0-.7.5-1.5 2.4-1.6h.6c.7 0 1.3.1 1.9.2-.2 2.3-1.3 2.6-2.6 2.7Z",
  tiktok:
    "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z",
};

export function SocialIcon({
  name,
  className = "size-4",
}: {
  name: SocialKey;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={paths[name]} />
    </svg>
  );
}

/** Row of social icons. Only socials with a URL in site config are shown. */
export function SocialRow({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const ring = tone === "dark" ? "border-on-dark/30 text-on-dark" : "border-border text-ink";
  if (!activeSocials.length) return null;
  return (
    <ul className={["flex flex-wrap gap-2", className].filter(Boolean).join(" ")}>
      {activeSocials.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={`flex size-11 items-center justify-center rounded-full border transition-colors hover:bg-bg-soft ${ring}`}
          >
            <SocialIcon name={s.key} />
          </a>
        </li>
      ))}
    </ul>
  );
}
