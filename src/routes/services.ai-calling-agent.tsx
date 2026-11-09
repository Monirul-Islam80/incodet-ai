import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/ai-calling-agent")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("ai-calling-agent")),
  component: () => <ServicePage service={getService("ai-calling-agent")} />,
});
