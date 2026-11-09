import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/social-media-growth")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("social-media-growth")),
  component: () => <ServicePage service={getService("social-media-growth")} />,
});
