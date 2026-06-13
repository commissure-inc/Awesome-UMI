import {
  AXIS_LABELS,
  COMMERCIALIZATION_LABELS,
  FORM_CATEGORY_LABELS,
  POSE_TRACKING_LABELS,
  TACTILE_INTEGRATION_LABELS,
  type Locale,
} from "./i18n";
import type { CatalogData, FilterAxes, Product } from "./types";

/** form_category values shown in the catalog UI (see docs/SCOPE.md). */
export const CATALOG_FORM_CATEGORIES = [
  "handheld_gripper",
  "wearable_hand",
  "wearable_arm",
] as const;

export function isInCatalogScope(p: Product): boolean {
  const fc = p.form_category;
  if (fc == null) return false;
  return (CATALOG_FORM_CATEGORIES as readonly string[]).includes(fc);
}

export function catalogScopeProducts(products: Product[]): Product[] {
  return products.filter(isInCatalogScope);
}

function visibleAxisValues(fa: FilterAxes, axis: string): string[] {
  const values = axisValues(fa, axis) ?? [];
  if (axis !== "form_category") return values;
  return values.filter((v) => (CATALOG_FORM_CATEGORIES as readonly string[]).includes(v));
}

export function axisLabel(fa: FilterAxes, key: string, locale: Locale = "en"): string {
  const fromI18n = AXIS_LABELS[locale][key];
  if (fromI18n) return fromI18n;
  const v = fa[key];
  if (v && typeof v === "object" && v !== null && "label" in v) {
    return String((v as { label: string }).label);
  }
  return key;
}

/** Human-readable label for a filter axis value (e.g. form_category). */
export function axisValueLabel(
  _fa: FilterAxes,
  axisKey: string,
  value: string,
  locale: Locale = "en",
): string {
  if (axisKey === "form_category") {
    const label = FORM_CATEGORY_LABELS[locale][value];
    if (label) return label;
  }
  if (axisKey === "commercialization_stage") {
    const label = COMMERCIALIZATION_LABELS[locale][value];
    if (label) return label;
  }
  if (axisKey === "pose_tracking") {
    const label = POSE_TRACKING_LABELS[locale][value];
    if (label) return label;
  }
  if (axisKey === "tactile_integration") {
    const label = TACTILE_INTEGRATION_LABELS[locale][value];
    if (label) return label;
  }
  if (value === UNSET_AXIS_VALUE) {
    return "Not specified";
  }
  return value;
}

export function axisValues(fa: FilterAxes, key: string): string[] | null {
  const v = fa[key];
  if (Array.isArray(v)) return v as string[];
  if (v && typeof v === "object" && v !== null && "values" in v) {
    const vals = (v as { values: unknown }).values;
    if (Array.isArray(vals)) return vals as string[];
  }
  return null;
}

export function defaultYearRange(fa: FilterAxes): [number, number] {
  const yr = fa.year_range;
  if (Array.isArray(yr) && yr.length >= 2) {
    return [Number(yr[0]), Number(yr[1])];
  }
  return [2018, 2030];
}

export type FilterSets = Record<string, Set<string>>;

export type AxisOption = { value: string; count: number };

/** Products with null/undefined on an optional axis are grouped here so facet counts sum to the pool size. */
export const UNSET_AXIS_VALUE = "__unset__";

export function productAxisValue(p: Product, axis: string): string {
  const val = p[axis as keyof Product];
  if (val === undefined || val === null) return UNSET_AXIS_VALUE;
  return String(val);
}

export function isUnsetAxisValue(value: string): boolean {
  return value === UNSET_AXIS_VALUE;
}

function countByAxis(products: Product[], axis: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of products) {
    const key = productAxisValue(p, axis);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Options that appear in at least one product, ordered by filter_axes definition. */
export function axisOptionsFromProducts(
  products: Product[],
  fa: FilterAxes,
  axis: string,
): AxisOption[] {
  const counts = countByAxis(products, axis);
  const defined = visibleAxisValues(fa, axis);
  const options: AxisOption[] = [];
  const seen = new Set<string>();

  for (const value of defined) {
    const count = counts.get(value) ?? 0;
    if (count > 0) {
      options.push({ value, count });
      seen.add(value);
    }
  }
  for (const [value, count] of counts) {
    if (!seen.has(value) && count > 0 && defined.includes(value)) {
      options.push({ value, count });
    }
  }
  const unsetCount = counts.get(UNSET_AXIS_VALUE) ?? 0;
  if (unsetCount > 0) {
    options.push({ value: UNSET_AXIS_VALUE, count: unsetCount });
  }
  return options;
}

/**
 * Faceted counts for one axis: apply all other active filters, then count values on this axis.
 * Keeps currently selected values visible even when count drops to 0.
 */
export function facetOptionsForAxis(
  products: Product[],
  fa: FilterAxes,
  axis: string,
  sets: FilterSets,
  yearMin: number,
  yearMax: number,
): AxisOption[] {
  const partialSets: FilterSets = { ...sets, [axis]: new Set() };
  const pool = filterProducts(products, fa, partialSets, yearMin, yearMax);
  const counts = countByAxis(pool, axis);
  const defined = visibleAxisValues(fa, axis);
  const selected = sets[axis] ?? new Set<string>();
  const options: AxisOption[] = [];
  const seen = new Set<string>();

  const include = (value: string) => {
    const count = counts.get(value) ?? 0;
    if (count > 0 || selected.has(value)) {
      options.push({ value, count });
      seen.add(value);
    }
  };

  for (const value of defined) include(value);
  for (const value of counts.keys()) {
    if (!seen.has(value) && value !== UNSET_AXIS_VALUE) include(value);
  }
  include(UNSET_AXIS_VALUE);
  for (const value of selected) {
    if (!seen.has(value)) options.push({ value, count: counts.get(value) ?? 0 });
  }
  return options;
}

export function filterProducts(
  products: Product[],
  _fa: FilterAxes,
  sets: FilterSets,
  yearMin: number,
  yearMax: number,
): Product[] {
  return products.filter((p) => {
    for (const [axis, set] of Object.entries(sets)) {
      if (set.size === 0) continue;
      if (!set.has(productAxisValue(p, axis))) return false;
    }
    const yf = p.year_first;
    if (yf != null && (yf < yearMin || yf > yearMax)) return false;
    return true;
  });
}

export async function loadCatalog(url: string): Promise<CatalogData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load catalog: ${res.status}`);
  return (await res.json()) as CatalogData;
}
