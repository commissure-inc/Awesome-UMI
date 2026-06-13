import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
  },
});
