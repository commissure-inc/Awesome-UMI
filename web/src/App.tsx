import { useCallback, useEffect, useMemo, useState } from "react";
import catalogUrl from "../../umi_devices_data.json?url";
import {
  axisLabel,
  axisValueLabel,
  catalogScopeProducts,
  defaultYearRange,
  facetOptionsForAxis,
  filterProducts,
  loadCatalog,
  sortProducts,
  type AxisOption,
  type ProductSortField,
  type SortDirection,
} from "./catalog";
import { ContributePanel, type ContributeKind, type ContributeMode } from "./ContributePanel";
import { UI } from "./i18n";
import { productDetailEntries } from "./productFields";
import { COMMISSURE_URL, REPO_URL } from "./repoLinks";
import type { CatalogData, FilterAxes, Product } from "./types";
import "./App.css";

const FILTER_AXES = [
  "form_category",
  "tactile_integration",
  "force_torque_integration",
  "pose_tracking",
  "bimanual",
  "license",
  "country",
  "commercialization_stage",
] as const;

type ProductSortKey =
  | "catalog"
  | `${Exclude<ProductSortField, "catalog">}:${SortDirection}`;

const PRODUCT_SORT_OPTIONS: ProductSortKey[] = [
  "catalog",
  "year_first:desc",
  "year_first:asc",
  "name:asc",
  "name:desc",
];

function parseProductSortKey(key: ProductSortKey): {
  field: ProductSortField;
  direction: SortDirection;
} {
  if (key === "catalog") return { field: "catalog", direction: "asc" };
  const [field, direction] = key.split(":") as [
    Exclude<ProductSortField, "catalog">,
    SortDirection,
  ];
  return { field, direction };
}

function emptyFilterSets(): Record<string, Set<string>> {
  const o: Record<string, Set<string>> = {};
  for (const k of FILTER_AXES) o[k] = new Set();
  return o;
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (Array.isArray(v)) return v.map(String).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

const DETAIL_AXIS_KEYS = new Set([
  "form_category",
  "form_factor",
  "tactile_integration",
  "force_torque_integration",
  "pose_tracking",
  "bimanual",
  "license",
  "country",
  "commercialization_stage",
]);

function detailFieldLabel(
  fa: FilterAxes,
  key: string,
  ui: (typeof UI)["en"],
): string {
  if (key === "year_first") return ui.yearFirst;
  if (key === "organization") return ui.detailOrganization;
  if (key === "key_innovation") return ui.detailKeyInnovation;
  return axisLabel(fa, key, "en");
}

function detailFieldValue(fa: FilterAxes, key: string, v: unknown): string {
  if (DETAIL_AXIS_KEYS.has(key) && v != null) {
    return axisValueLabel(fa, key, String(v), "en");
  }
  return formatCell(v);
}

function datasetScale(row: Record<string, unknown>): string {
  const parts: string[] = [];
  const s = (k: string) => (row[k] != null ? String(row[k]) : undefined);
  if (s("trajectories")) parts.push(`${s("trajectories")} traj.`);
  if (s("episodes")) parts.push(`${s("episodes")} ep.`);
  if (s("hours")) parts.push(`${s("hours")}h`);
  if (s("transitions")) parts.push(`${s("transitions")} trans.`);
  if (s("tasks")) parts.push(`${s("tasks")} tasks`);
  if (s("stage1_h") || s("stage2_h")) {
    if (s("stage1_h")) parts.push(`S1: ${s("stage1_h")}h`);
    if (s("stage2_h")) parts.push(`S2: ${s("stage2_h")}h`);
  }
  return parts.join(", ") || "—";
}

function ProductImage({
  product,
  className,
  alt,
}: {
  product: Product;
  className?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = product.image_url;

  useEffect(() => {
    setFailed(false);
  }, [product.id, url]);

  const classes = ["product-image", className].filter(Boolean).join(" ");

  if (!url || failed) {
    return <div className={`${classes} product-image--placeholder`} aria-hidden />;
  }

  return (
    <img
      className={classes}
      src={url}
      alt={alt ?? product.name}
      loading="lazy"
      decoding="async"
      referrerPolicy="strict-origin-when-cross-origin"
      onError={() => setFailed(true)}
    />
  );
}

function FilterSection(props: {
  fa: FilterAxes;
  label: string;
  options: AxisOption[];
  selected: Set<string>;
  onToggle: (axis: string, value: string) => void;
  axisKey: string;
}) {
  if (props.options.length === 0) return null;
  return (
    <div className="sidebar-section">
      <h2>{props.label}</h2>
      {props.options.map(({ value, count }) => (
        <label
          key={value}
          className={`filter-option${count === 0 ? " filter-option-empty" : ""}`}
        >
          <input
            type="checkbox"
            checked={props.selected.has(value)}
            onChange={() => props.onToggle(props.axisKey, value)}
          />
          <span className="filter-option-label">
            {axisValueLabel(props.fa, props.axisKey, value, "en")}
            <span className="filter-count">{count}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<CatalogData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"projects" | "datasets" | "contribute">("projects");
  const [filterSets, setFilterSets] = useState(emptyFilterSets);
  const [yearMin, setYearMin] = useState<number | null>(null);
  const [yearMax, setYearMax] = useState<number | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [contributeKind, setContributeKind] = useState<ContributeKind>("project");
  const [contributeMode, setContributeMode] = useState<ContributeMode>("add");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [productSortKey, setProductSortKey] = useState<ProductSortKey>("catalog");

  const openContribute = useCallback((kind: ContributeKind, mode: ContributeMode = "add") => {
    setContributeKind(kind);
    setContributeMode(mode);
    setView("contribute");
  }, []);

  const ui = UI.en;

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  useEffect(() => {
    if (view !== "projects") setFiltersOpen(false);
  }, [view]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await loadCatalog(catalogUrl);
        if (!cancelled) {
          setData(d);
          const [a, b] = defaultYearRange(d.filter_axes);
          setYearMin(a);
          setYearMax(b);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const yearBounds = data ? defaultYearRange(data.filter_axes) : ([2018, 2030] as [number, number]);

  const yearFilter = useMemo((): [number, number] => {
    return [yearMin ?? yearBounds[0], yearMax ?? yearBounds[1]];
  }, [yearMin, yearMax, yearBounds]);

  const scopeProducts = useMemo(
    () => (data ? catalogScopeProducts(data.products) : []),
    [data],
  );

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    return filterProducts(
      scopeProducts,
      data.filter_axes,
      filterSets,
      yearFilter[0],
      yearFilter[1],
    );
  }, [data, scopeProducts, filterSets, yearFilter]);

  const sortedProducts = useMemo(() => {
    const { field, direction } = parseProductSortKey(productSortKey);
    return sortProducts(filteredProducts, field, direction);
  }, [filteredProducts, productSortKey]);

  const facetOptionsByAxis = useMemo(() => {
    if (!data) return {} as Record<string, AxisOption[]>;
    const out: Record<string, AxisOption[]> = {};
    for (const axis of FILTER_AXES) {
      out[axis] = facetOptionsForAxis(
        scopeProducts,
        data.filter_axes,
        axis,
        filterSets,
        yearFilter[0],
        yearFilter[1],
      );
    }
    return out;
  }, [data, scopeProducts, filterSets, yearFilter]);

  const toggleFilter = useCallback((axis: string, value: string) => {
    setFilterSets((prev) => {
      const next = { ...prev };
      const s = new Set(next[axis]);
      if (s.has(value)) s.delete(value);
      else s.add(value);
      next[axis] = s;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilterSets(emptyFilterSets());
    if (data) {
      const [a, b] = defaultYearRange(data.filter_axes);
      setYearMin(a);
      setYearMax(b);
    }
  }, [data]);

  const productSortLabel = useCallback(
    (key: ProductSortKey) => {
      switch (key) {
        case "catalog":
          return ui.sortCatalog;
        case "year_first:asc":
          return ui.sortYearAsc;
        case "year_first:desc":
          return ui.sortYearDesc;
        case "name:asc":
          return ui.sortNameAsc;
        case "name:desc":
          return ui.sortNameDesc;
      }
    },
    [ui],
  );

  const footer = (
    <footer className="app-footer">
      <p>{ui.disclaimer}</p>
    </footer>
  );

  if (loading) {
    return (
      <div className="app-shell">
        <div className="content-scroll" style={{ padding: 24 }}>
          <span className="loading-dot" aria-hidden />
          <span style={{ color: "var(--text2)" }}>{ui.loading}</span>
        </div>
        {footer}
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="app-shell">
        <div className="content-scroll" style={{ padding: 24 }}>
          <p style={{ color: "var(--text2)" }}>{ui.loadFailed}</p>
          <p className="mono" style={{ fontSize: 11 }}>
            {loadError}
          </p>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{ui.siteTitle}</h1>
        <span className="meta">
          v{data.metadata.version}
          <span className="beta-badge">{ui.beta}</span>
          · {ui.updated} {data.metadata.last_updated}
        </span>
        <span className="spacer" />
        <a
          href={COMMISSURE_URL}
          className="maintainer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ui.maintainedBy}
        </a>
        <a
          href={REPO_URL}
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
          title={ui.viewOnGithub}
          aria-label={ui.viewOnGithub}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.32-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A8.013 8.013 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
            />
          </svg>
        </a>
      </header>

      <div className="app-body">
        <aside
          className={`sidebar${view !== "projects" ? " hidden" : ""}${filtersOpen ? " sidebar--open" : ""}`}
        >
          <div className="sidebar-section">
            <h2>{ui.yearFirst}</h2>
            <div className="year-range">
              <label>
                {ui.yearMin}
                <input
                  type="number"
                  value={yearMin ?? ""}
                  onChange={(e) =>
                    setYearMin(e.target.value === "" ? null : Number(e.target.value))
                  }
                />
              </label>
              <span style={{ color: "var(--muted)", paddingTop: 14 }}>—</span>
              <label>
                {ui.yearMax}
                <input
                  type="number"
                  value={yearMax ?? ""}
                  onChange={(e) =>
                    setYearMax(e.target.value === "" ? null : Number(e.target.value))
                  }
                />
              </label>
            </div>
          </div>

          {FILTER_AXES.map((axis) => (
            <FilterSection
              key={axis}
              fa={data.filter_axes}
              axisKey={axis}
              label={axisLabel(data.filter_axes, axis, "en")}
              options={facetOptionsByAxis[axis] ?? []}
              selected={filterSets[axis] ?? new Set()}
              onToggle={toggleFilter}
            />
          ))}

          <div className="sidebar-section">
            <button type="button" className="filter-clear" onClick={clearFilters}>
              {ui.clearFilters}
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="toolbar">
            <div className="segmented" role="tablist">
              <button
                type="button"
                role="tab"
                className={view === "projects" ? "selected" : ""}
                onClick={() => setView("projects")}
              >
                {ui.tabProjects}
              </button>
              <button
                type="button"
                role="tab"
                className={view === "datasets" ? "selected" : ""}
                onClick={() => setView("datasets")}
              >
                {ui.tabDatasets}
              </button>
            </div>
            {view === "projects" && (
              <>
                <button
                  type="button"
                  className="filter-toggle"
                  aria-expanded={filtersOpen}
                  onClick={() => setFiltersOpen((v) => !v)}
                >
                  {filtersOpen ? ui.hideFilters : ui.showFilters}
                </button>
                <label className="toolbar-sort">
                  <span className="toolbar-sort-label">{ui.sortBy}</span>
                  <select
                    value={productSortKey}
                    onChange={(e) => setProductSortKey(e.target.value as ProductSortKey)}
                    aria-label={ui.sortBy}
                  >
                    {PRODUCT_SORT_OPTIONS.map((key) => (
                      <option key={key} value={key}>
                        {productSortLabel(key)}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="toolbar-count">
                  {sortedProducts.length} / {scopeProducts.length}
                </span>
              </>
            )}
            <span className="spacer" />
            <button
              type="button"
              role="tab"
              className={`toolbar-contribute${view === "contribute" ? " selected" : ""}`}
              onClick={() => setView("contribute")}
            >
              {ui.tabContribute}
            </button>
          </div>

          <div className="content-scroll">
            {view === "projects" && (
              <div className="grid">
                {sortedProducts.map((p) => (
                  <article
                    key={p.id}
                    className="product-card"
                    onClick={() => setDetailProduct(p)}
                  >
                    <ProductImage key={p.id} product={p} className="product-card-image" />
                    <div className="product-card-body">
                      <h3 className="name">{p.name}</h3>
                      <p className="row">
                        {p.form_category
                          ? axisValueLabel(
                              data.filter_axes,
                              "form_category",
                              p.form_category,
                              "en",
                            )
                          : "—"}
                      </p>
                      <p className="row mono">
                        {p.commercialization_stage
                          ? axisValueLabel(
                              data.filter_axes,
                              "commercialization_stage",
                              p.commercialization_stage,
                              "en",
                            )
                          : "—"}
                      </p>
                      {p.country != null && <p className="mono">{p.country}</p>}
                    </div>
                  </article>
                ))}
                <button
                  type="button"
                  className="product-card product-card--add"
                  onClick={() => openContribute("project")}
                >
                  <span className="product-card-add-label">{ui.addMissingProject}</span>
                </button>
              </div>
            )}

            {view === "datasets" && (
              <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{ui.tableName}</th>
                      <th>Provider</th>
                      <th>Type</th>
                      <th>Scale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.datasets.map((row, i) => {
                      const name = String(row.name ?? "—");
                      const url =
                        row.url ??
                        (row.arxiv
                          ? `https://arxiv.org/abs/${row.arxiv}`
                          : undefined);
                      return (
                        <tr key={i}>
                          <td>
                            {url ? (
                              <a href={String(url)} target="_blank" rel="noreferrer">
                                {name}
                              </a>
                            ) : (
                              name
                            )}
                          </td>
                          <td>{String(row.provider ?? "—")}</td>
                          <td>{String(row.type ?? "—")}</td>
                          <td>{datasetScale(row)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="dataset-add-cta"
                onClick={() => openContribute("dataset")}
              >
                {ui.addMissingDataset}
              </button>
              </>
            )}

            {view === "contribute" && (
              <ContributePanel
                filterAxes={data.filter_axes}
                products={scopeProducts}
                datasets={data.datasets}
                initialKind={contributeKind}
                initialMode={contributeMode}
              />
            )}
          </div>
        </main>
      </div>

      {detailProduct && (
        <>
          <div
            className="drawer-backdrop"
            role="presentation"
            onClick={() => setDetailProduct(null)}
          />
          <aside className="drawer" role="dialog" aria-modal="true">
            <div className="drawer-header">
              <h2>{detailProduct.name}</h2>
              <button type="button" onClick={() => setDetailProduct(null)}>
                {ui.close}
              </button>
            </div>
            <div className="drawer-body">
              <ProductDetail p={detailProduct} fa={data.filter_axes} />
            </div>
          </aside>
        </>
      )}

      {footer}
    </div>
  );
}

function ProductDetail({
  p,
  fa,
}: {
  p: Product;
  fa: FilterAxes;
}) {
  const ui = UI.en;
  const entries = productDetailEntries(p);
  return (
    <>
      <ProductImage key={p.id} product={p} className="product-detail-image" />
      <table className="kv">
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k}>
              <th>{detailFieldLabel(fa, k, ui)}</th>
              <td>{detailFieldValue(fa, k, v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ fontSize: 12, margin: "16px 0 8px", color: "var(--text2)" }}>{ui.sources}</h3>
      <ul className="links" style={{ margin: 0, paddingLeft: 18 }}>
        {p.sources.map((s, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            <a href={s.url} target="_blank" rel="noreferrer">
              [{s.type}] {s.title ?? s.url}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
