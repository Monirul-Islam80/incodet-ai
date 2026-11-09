import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/ui-ux-product-design")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("ui-ux-product-design")),
  component: () => <ServicePage service={getService("ui-ux-product-design")} />,
});
