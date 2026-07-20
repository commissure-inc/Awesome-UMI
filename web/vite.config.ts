import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { catalogLastUpdatedPlugin } from "./vite-catalog-last-updated";

/** GitHub Pages project site base path, e.g. /Awesome-UMI/ */
function resolveBase(): string {
  if (process.env.VITE_BASE_PATH) {
    const raw = process.env.VITE_BASE_PATH.trim();
    if (raw === "/") return "/";
    return raw.endsWith("/") ? raw : `${raw}/`;
  }

  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) {
    const name = repo.split("/")[1];
    if (name) return `/${name}/`;
  }

  return "/Awesome-UMI/";
}

function cloudflareAnalyticsPlugin() {
  return {
    name: "inject-cloudflare-analytics",
    transformIndexHtml(html: string) {
      const token = process.env.VITE_CF_ANALYTICS_TOKEN?.trim();
      if (!token) return html;

      const beacon = JSON.stringify({ token });
      const snippet = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${beacon}'></script>`;
      return html.replace("</body>", `    ${snippet}\n  </body>`);
    },
  };
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react(), catalogLastUpdatedPlugin(), cloudflareAnalyticsPlugin()],
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
  },
});
