import type { Product } from "./types";

/** Top-level product keys in schema order (required → optional). See docs/PRODUCT_SCHEMA.md */
export const PRODUCT_FIELD_ORDER = [
  "id",
  "name",
  "commercialization_stage",
  "last_verified_at",
  "confidence",
  "status",
  "full_name",
  "organization",
  "country",
  "year_first",
  "form_category",
  "form_factor",
  "tactile_integration",
  "force_torque_integration",
  "pose_tracking",
  "bimanual",
  "license",
  "key_innovation",
  "notes",
] as const satisfies readonly (keyof Product)[];

/**
 * Fields shown in the catalog detail drawer (v1).
 * Aligned with sidebar filter axes plus minimal context (organization, key_innovation).
 * Specs and internal metadata are omitted for accuracy.
 */
export const PRODUCT_DETAIL_FIELD_ORDER = [
  "organization",
  "year_first",
  "form_category",
  "form_factor",
  "tactile_integration",
  "force_torque_integration",
  "pose_tracking",
  "bimanual",
  "license",
  "country",
  "commercialization_stage",
  "key_innovation",
] as const satisfies readonly (keyof Product)[];

/** Key-value rows for the product detail panel (excludes image_url, sources, specs). */
export function productDetailEntries(p: Product): Array<[string, unknown]> {
  const entries: Array<[string, unknown]> = [];

  for (const k of PRODUCT_DETAIL_FIELD_ORDER) {
    if (k in p && p[k] !== undefined && p[k] !== null) {
      entries.push([k, p[k]]);
    }
  }

  return entries;
}
