import { downloadJson, suggestId, type ValidationResult } from "./submitDevice";

export type DatasetSubmissionInput = {
  name: string;
  datasetUrl: string;
  paperUrl: string;
  arxiv: string;
  rationale: string;
  provider: string;
  type: string;
  trajectories: string;
  episodes: string;
  hours: string;
  tasks: string;
  format: string;
  license: string;
  notes: string;
  author: string;
};

export type DatasetCandidateBatch = {
  schema_version: "1.0";
  created_at: string;
  author?: string;
  notes?: string;
  candidates: Array<{
    operation: "add_dataset";
    rationale: string;
    sources: Array<{
      type: string;
      url: string;
      retrieved_at: string;
    }>;
    new_dataset: Record<string, unknown>;
  }>;
};

const URL_RE = /^https:\/\/[^\s]+$/;
const ARXIV_RE = /^\d{4}\.\d{4,5}$/;

function setIf(value: string, key: string, target: Record<string, unknown>): void {
  const trimmed = value.trim();
  if (trimmed) target[key] = trimmed;
}

function setNumericIf(value: string, key: string, target: Record<string, unknown>): void {
  const trimmed = value.trim();
  if (!trimmed) return;
  const n = Number(trimmed);
  if (!Number.isNaN(n)) target[key] = n;
  else target[key] = trimmed;
}

function classifyUrl(url: string): string {
  if (/arxiv\.org|doi\.org|openreview\.net|ieeexplore\.ieee\.org|dl\.acm\.org/i.test(url)) {
    return "paper";
  }
  if (/github\.com|gitlab\.com|huggingface\.co|modelscope\.cn/i.test(url)) {
    return "github";
  }
  return "dataset";
}

export function datasetSubmissionSources(
  input: Pick<DatasetSubmissionInput, "datasetUrl" | "paperUrl" | "arxiv">,
): DatasetCandidateBatch["candidates"][0]["sources"] {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const out: DatasetCandidateBatch["candidates"][0]["sources"] = [];

  const push = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || !URL_RE.test(trimmed) || seen.has(trimmed)) return;
    seen.add(trimmed);
    out.push({ type: classifyUrl(trimmed), url: trimmed, retrieved_at: today });
  };

  push(input.datasetUrl);
  push(input.paperUrl);
  if (input.arxiv.trim() && ARXIV_RE.test(input.arxiv.trim())) {
    push(`https://arxiv.org/abs/${input.arxiv.trim()}`);
  }

  return out;
}

function buildDatasetDataFields(
  input: Pick<
    DatasetSubmissionInput,
    | "datasetUrl"
    | "arxiv"
    | "provider"
    | "type"
    | "trajectories"
    | "episodes"
    | "hours"
    | "tasks"
    | "format"
    | "license"
    | "notes"
  >,
  options?: { includeName?: string },
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (options?.includeName) out.name = options.includeName;
  if (input.datasetUrl.trim()) out.url = input.datasetUrl.trim();
  if (input.arxiv.trim() && ARXIV_RE.test(input.arxiv.trim())) {
    out.arxiv = input.arxiv.trim();
  }
  setIf(input.provider, "provider", out);
  setIf(input.type, "type", out);
  setIf(input.trajectories, "trajectories", out);
  setNumericIf(input.episodes, "episodes", out);
  setIf(input.hours, "hours", out);
  setNumericIf(input.tasks, "tasks", out);
  setIf(input.format, "format", out);
  setIf(input.license, "license", out);
  setIf(input.notes, "notes", out);
  return out;
}

export function buildDatasetPatchFields(
  input: Pick<
    DatasetSubmissionInput,
    | "datasetUrl"
    | "arxiv"
    | "provider"
    | "type"
    | "trajectories"
    | "episodes"
    | "hours"
    | "tasks"
    | "format"
    | "license"
    | "notes"
  > & { newName?: string },
): Record<string, unknown> {
  return buildDatasetDataFields(input, input.newName?.trim() ? { includeName: input.newName.trim() } : undefined);
}

export function buildDatasetCandidateBatch(input: DatasetSubmissionInput): DatasetCandidateBatch {
  const sources = datasetSubmissionSources(input);
  const newDataset = buildDatasetDataFields(input, { includeName: input.name.trim() });

  return {
    schema_version: "1.0",
    created_at: new Date().toISOString().slice(0, 10),
    author: input.author.trim() || undefined,
    notes: "Generated from web Contribute tab (dataset); pending maintainer review.",
    candidates: [
      {
        operation: "add_dataset",
        rationale: input.rationale.trim(),
        sources,
        new_dataset: newDataset,
      },
    ],
  };
}

export function validateDatasetSubmission(input: DatasetSubmissionInput): ValidationResult {
  if (!input.name.trim()) return { ok: false, message: "name_required" };
  if (!input.rationale.trim()) return { ok: false, message: "rationale_required" };
  if (input.arxiv.trim() && !ARXIV_RE.test(input.arxiv.trim())) {
    return { ok: false, message: "arxiv_invalid" };
  }
  if (datasetSubmissionSources(input).length === 0) {
    return { ok: false, message: "url_required" };
  }
  return { ok: true };
}

export function suggestDatasetFilename(name: string): string {
  const base = suggestId(name) || "dataset";
  return `${base}-dataset-candidate.json`;
}

export { downloadJson };
