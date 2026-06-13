export type Source = {
  type: string;
  url: string;
  title?: string;
  retrieved_at?: string;
};

export type ProductSpecs = Record<string, unknown>;

export type Product = {
  id: string;
  name: string;
  commercialization_stage: string;
  sources: Source[];
  last_verified_at: string;
  confidence: string;
  status: string;
  full_name?: string;
  organization?: string[];
  country?: string | null;
  year_first?: number | null;
  form_category?: string | null;
  form_factor?: string | null;
  tactile_integration?: string | null;
  force_torque_integration?: string | null;
  pose_tracking?: string | null;
  bimanual?: string | null;
  license?: string | null;
  key_innovation?: string;
  image_url?: string;
  notes?: string;
  specs?: ProductSpecs;
};

export type CuratedItem = {
  id: string;
  kind: string;
  title: string;
  canonical_url: string;
  publisher?: string;
  published_at?: string;
  summary?: string;
  language?: string;
  tags?: string[];
  related_product_ids?: string[];
  companion_links?: Array<{ role: string; url: string; title?: string }>;
  sources: Source[];
  last_verified_at: string;
  confidence: string;
  status: string;
};

export type FilterAxes = Record<string, unknown>;

export type CatalogData = {
  metadata: {
    title: string;
    version: string;
    last_updated: string;
    data_sources?: string;
    scope?: string;
  };
  filter_axes: FilterAxes;
  products: Product[];
  datasets: Array<Record<string, unknown>>;
  policy_standards: Array<Record<string, unknown>>;
  curated_content: CuratedItem[];
};
