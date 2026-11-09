import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/web-development")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("web-development")),
  component: () => <ServicePage service={getService("web-development")} />,
});
