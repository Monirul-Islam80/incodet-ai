import { describe, expect, it } from "vitest";
import { getService, services } from "@/content/services";
import { getCaseStudy } from "@/content/caseStudies";
import { serviceStripEntries } from "@/lib/service-strip";

describe("service rules", () => {
  it("limits each service strip to two missing-image positions", () => {
    for (const service of services)
      expect(serviceStripEntries(service).filter((e) => e === null).length).toBeLessThanOrEqual(2);
  });
  it("fills automation with notification, reminder and calendar sync", () => {
    expect(serviceStripEntries(getService("business-automation"))).toEqual([
      "western-cars-content-hub",
      "notification",
      "reminder",
      "sync",
    ]);
  });
  it("fills extra app positions with phone screens", () => {
    expect(serviceStripEntries(getService("app-development"))).toEqual([
      null,
      null,
      "sample-phone",
      "sample-phone",
    ]);
  });
  it("fills extra social positions with generic feed screens", () => {
    expect(serviceStripEntries(getService("social-media-growth"))).toEqual([
      null,
      null,
      "sample-social",
      "sample-social",
    ]);
  });
  it("keeps all eight services in the requested order", () => {
    expect(services.map((s) => s.id)).toEqual([
      "web-development",
      "ai-calling-agent",
      "ai-chatbot",
      "app-development",
      "ui-ux-product-design",
      "software",
      "business-automation",
      "social-media-growth",
    ]);
  });
  it("retains SaaS at the existing custom software address", () => {
    expect(getService("software").to).toBe("/custom-software");
  });
  it("uses placeholders only for apps and social growth", () => {
    for (const id of ["app-development", "social-media-growth"]) {
      expect(getService(id).images).toEqual([]);
      expect(getService(id).related).toEqual([]);
      expect(getService(id).ui).toBeUndefined();
    }
  });
  it("only references existing projects", () => {
    for (const s of services)
      for (const slug of [...s.images, ...s.related]) expect(getCaseStudy(slug)).toBeDefined();
  });
  it("restricts comparisons to web, apps and product design", () => {
    expect(services.filter((s) => s.comparison).map((s) => s.id)).toEqual([
      "web-development",
      "app-development",
      "ui-ux-product-design",
    ]);
  });
  it("keeps website care at $19 a month", () => {
    expect(
      getService("web-development").features.find((f) => f.title === "Care plan")?.body,
    ).toContain("$19 a month");
  });
  it("keeps Starter delivery at 1 to 2 weeks", () => {
    expect(
      getService("web-development").faq.find((f) => f.question === "How long does a website take?")
        ?.answer,
    ).toContain("1 to 2 weeks");
  });
  it("keeps Growth at 300 included minutes and $0.20 extras only if used", () => {
    const body = getService("ai-calling-agent").features.find(
      (f) => f.title === "Pay for what you use",
    )?.body;
    expect(body).toContain("300 minutes a month on Growth");
    expect(body).toContain("$0.20 only if used");
  });
  it("keeps Growth setup at 2 to 3 weeks", () => {
    expect(
      getService("ai-calling-agent").faq.find((f) => f.question === "How long does setup take?")
        ?.answer,
    ).toContain("2 to 3 weeks");
  });
  it("keeps Scale app delivery at 4 to 8 weeks", () => {
    expect(
      getService("app-development").faq.find((f) => f.question === "How long does an app take?")
        ?.answer,
    ).toContain("4 to 8 weeks, on our Scale plan");
  });
  it("excludes social ad spend from the service fee", () => {
    const answer = getService("social-media-growth").faq.find(
      (f) => f.question === "Is ad spend included?",
    )?.answer;
    expect(answer?.startsWith("No.")).toBe(true);
    expect(answer).toContain("paid directly to the platform");
  });
});
