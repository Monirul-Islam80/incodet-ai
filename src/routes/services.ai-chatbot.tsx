import { createFileRoute } from "@tanstack/react-router";
import { getService } from "@/content/services";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";
export const Route = createFileRoute("/services/ai-chatbot")({
  staticData: { sitemap: true },
  head: () => serviceHead(getService("ai-chatbot")),
  component: () => <ServicePage service={getService("ai-chatbot")} />,
});
