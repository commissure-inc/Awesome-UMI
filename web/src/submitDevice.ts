export type DeviceSubmissionInput = {
  name: string;
  id: string;
  commercializationStage: string;
  projectUrl: string;
  githubUrl: string;
  paperUrl: string;
  rationale: string;
  formCategory: string;
  keyInnovation: string;
  country: string;
  yearFirst: string;
  fullName: string;
  organization: string;
  formFactor: string;
  tactileIntegration: string;
  forceTorqueIntegration: string;
  poseTracking: string;
  bimanual: string;
  license: string;
  notes: string;
  imageUrl: string;
  author: string;
};

export type CandidateBatch = {
  schema_version: "1.0";
  created_at: string;
  author?: string;
  notes?: string;
  candidates: Array<{
    operation: "add_product";
    rationale: string;
    sources: Array<{
      type: string;
      url: string;
      retrieved_at: string;
    }>;
    new_product: Record<string, unknown>;
  }>;
};

const URL_RE = /^https:\/\/[^\s]+$/;

export function suggestId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48);
}

function classifyUrl(url: string): string {
  if (/arxiv\.org|doi\.org|openreview\.net|ieeexplore\.ieee\.org|dl\.acm\.org/i.test(url)) {
    return "paper";
  }
  if (/github\.com|gitlab\.com|huggingface\.co/i.test(url)) {
    return "github";
  }
  return "project_page";
}

export function uniqueSources(urls: string[]): CandidateBatch["candidates"][0]["sources"] {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const out: CandidateBatch["candidates"][0]["sources"] = [];
  for (const raw of urls) {
    const url = raw.trim();
    if (!url || !URL_RE.test(url) || seen.has(url)) continue;
    seen.add(url);
    out.push({ type: classifyUrl(url), url, retrieved_at: today });
  }
  return out;
}

function setIf(value: string, key: string, target: Record<string, unknown>): void {
  const trimmed = value.trim();
  if (trimmed) target[key] = trimmed;
}

export function buildCandidateBatch(input: DeviceSubmissionInput): CandidateBatch {
  const sources = uniqueSources([input.projectUrl, input.githubUrl, input.paperUrl]);
  const newProduct: Record<string, unknown> = {
    id: input.id.trim(),
    name: input.name.trim(),
    commercialization_stage: input.commercializationStage,
  };

  if (input.formCategory) newProduct.form_category = input.formCategory;
  setIf(input.keyInnovation, "key_innovation", newProduct);
  if (input.country) newProduct.country = input.country;
  if (input.yearFirst.trim()) {
    const y = Number(input.yearFirst);
    if (!Number.isNaN(y)) newProduct.year_first = y;
  }
  setIf(input.fullName, "full_name", newProduct);
  const orgs = input.organization
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (orgs.length > 0) newProduct.organization = orgs;
  if (input.formFactor) newProduct.form_factor = input.formFactor;
  if (input.tactileIntegration) newProduct.tactile_integration = input.tactileIntegration;
  if (input.forceTorqueIntegration) {
    newProduct.force_torque_integration = input.forceTorqueIntegration;
  }
  if (input.poseTracking) newProduct.pose_tracking = input.poseTracking;
  if (input.bimanual) newProduct.bimanual = input.bimanual;
  if (input.license) newProduct.license = input.license;
  setIf(input.notes, "notes", newProduct);
  setIf(input.imageUrl, "image_url", newProduct);

  return {
    schema_version: "1.0",
    created_at: new Date().toISOString().slice(0, 10),
    author: input.author.trim() || undefined,
    notes: "Generated from web Contribute tab (project); pending maintainer review.",
    candidates: [
      {
        operation: "add_product",
        rationale: input.rationale.trim(),
        sources,
        new_product: newProduct,
      },
    ],
  };
}

export type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateSubmission(input: DeviceSubmissionInput): ValidationResult {
  if (!input.name.trim()) return { ok: false, message: "name_required" };
  if (!input.id.trim() || !/^[a-z0-9_]+$/.test(input.id.trim())) {
    return { ok: false, message: "id_invalid" };
  }
  if (!input.commercializationStage) return { ok: false, message: "stage_required" };
  if (!input.rationale.trim()) return { ok: false, message: "rationale_required" };
  const urlFields = [input.projectUrl, input.githubUrl, input.paperUrl];
  const trimmedUrls = urlFields.map((u) => u.trim()).filter(Boolean);
  for (const url of trimmedUrls) {
    if (!URL_RE.test(url)) return { ok: false, message: "url_invalid" };
  }
  const sources = uniqueSources(urlFields);
  if (sources.length === 0) return { ok: false, message: "url_required" };
  if (input.imageUrl.trim() && !URL_RE.test(input.imageUrl.trim())) {
    return { ok: false, message: "image_url_invalid" };
  }
  return { ok: true };
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
