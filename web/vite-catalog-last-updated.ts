import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const CATALOG_FILE = "umi_devices_data.json";
export const CATALOG_DATA_MODULE = "virtual:catalog-data";
const RESOLVED_CATALOG_DATA_MODULE = "\0virtual:catalog-data";

function gitDate(repoRoot: string, args: string): string | null {
  try {
    const out = execSync(`git ${args}`, { encoding: "utf8", cwd: repoRoot }).trim();
    return out || null;
  } catch {
    return null;
  }
}

/** Latest commit date (YYYY-MM-DD) that touched the catalog file, else repo HEAD. */
export function resolveCatalogLastUpdated(repoRoot: string): string {
  const rel = path.relative(repoRoot, path.join(repoRoot, CATALOG_FILE));
  return (
    gitDate(repoRoot, `log -1 --format=%cs -- "${rel}"`) ??
    gitDate(repoRoot, "log -1 --format=%cs") ??
    new Date().toISOString().slice(0, 10)
  );
}

export function catalogLastUpdatedPlugin(): Plugin {
  const repoRoot = path.resolve(import.meta.dirname, "..");
  const catalogPath = path.join(repoRoot, CATALOG_FILE);

  return {
    name: "catalog-last-updated",
    resolveId(id) {
      if (id === CATALOG_DATA_MODULE) return RESOLVED_CATALOG_DATA_MODULE;
    },
    load(id) {
      if (id !== RESOLVED_CATALOG_DATA_MODULE) return null;

      const raw = fs.readFileSync(catalogPath, "utf8");
      const data = JSON.parse(raw) as { metadata?: { last_updated?: string } };
      if (data.metadata) {
        data.metadata.last_updated = resolveCatalogLastUpdated(repoRoot);
      }

      return {
        code: `export default ${JSON.stringify(data)}`,
        map: null,
      };
    },
  };
}
