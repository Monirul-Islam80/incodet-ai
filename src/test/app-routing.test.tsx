import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { services } from "@/content/services";
import { sitemapStaticPaths } from "@/lib/sitemap";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches all service pages and includes them in the sitemap inventory", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const sitemap = sitemapStaticPaths(router).map((path) => path.replace(/\/$/, ""));
    for (const path of ["/services", ...services.map((s) => s.to)]) {
      const match = router.matchRoutes(path).at(-1);
      expect(match?.routeId).not.toBe(rootRouteId);
      expect(match).toBeDefined();
      expect(sitemap).toContain(path);
    }
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
