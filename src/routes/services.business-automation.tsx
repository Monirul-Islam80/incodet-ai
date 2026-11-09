import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/business-automation")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("business-automation")),
  component: () => <ServicePage service={getService("business-automation")} />,
});
