import type { Service } from "@/content/services";

/** Blank image positions become generic service UI after the first two. */
export function serviceStripEntries(service: Service): (string | null)[] {
  const entries: (string | null)[] = [...service.images];
  if (service.ui) entries.push("call", "chat");
  if (service.id === "business-automation") entries.push("notification", "reminder", "sync");
  while (entries.length < 4) entries.push(null);
  let blank = 0;
  return entries.map((entry) =>
    !entry && ++blank > 2
      ? service.id === "social-media-growth"
        ? "sample-social"
        : "sample-phone"
      : entry,
  );
}
