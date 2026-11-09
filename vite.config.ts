import { defineConfig, loadEnv, type UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const isDevBuild = command === "build" && mode === "development";

  // Expose VITE_* variables to client and server code as import.meta.env.*
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), "VITE_"))) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const config: UserConfig = {
    plugins: [
      tailwindcss(),
      tanstackStart({
        // Server-only code must never be bundled into the browser.
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
        // Use src/server.ts (our SSR error wrapper) as the server entry. Nitro builds from it.
        server: { entry: "server" },
      }),
      // Nitro builds the deployable server. Default target is Cloudflare;
      // set NITRO_PRESET (for example NITRO_PRESET=vercel) to build for another host.
      ...(command === "build" ? [nitro({ defaultPreset: "cloudflare-module" })] : []),
      viteReact(),
    ],
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      // Vite resolves tsconfig "paths" natively (replaces the vite-tsconfig-paths plugin).
      tsconfigPaths: true,
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 8080,
      watch: {
        awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
        // Build output is rewritten by `bun run build`; watching it crashes the dev server on Windows.
        ignored: ["**/.output/**", "**/.vercel/**", "**/.wrangler/**", "**/.tanstack/tmp/**"],
      },
    },
  };

  if (isDevBuild) {
    config.environments = {
      client: { define: { "process.env.NODE_ENV": JSON.stringify("development") } },
    };
    config.esbuild = { keepNames: true };
  }

  return config;
});
