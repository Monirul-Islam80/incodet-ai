import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/custom-software")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("software")),
  component: () => <ServicePage service={getService("software")} />,
});
