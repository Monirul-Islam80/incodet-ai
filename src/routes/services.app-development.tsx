import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/app-development")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("app-development")),
  component: () => <ServicePage service={getService("app-development")} />,
});
