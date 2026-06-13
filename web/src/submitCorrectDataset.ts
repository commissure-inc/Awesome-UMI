import { downloadJson, suggestId, type ValidationResult } from "./submitDevice";
import {
  buildDatasetPatchFields,
  datasetSubmissionSources,
  type DatasetSubmissionInput,
} from "./submitDataset";

export type DatasetCorrectionInput = Omit<DatasetSubmissionInput, "name"> & {
  targetName: string;
  newName: string;
};

export type DatasetPatchBatch = {
  schema_version: "1.0";
  created_at: string;
  author?: string;
  notes?: string;
  candidates: Array<{
    operation: "patch_dataset";
    dataset_name: string;
    fields: Record<string, unknown>;
    rationale: string;
    sources: Array<{
      type: string;
      url: string;
      retrieved_at: string;
    }>;
  }>;
};

export function buildDatasetPatchBatch(input: DatasetCorrectionInput): DatasetPatchBatch {
  return {
    schema_version: "1.0",
    created_at: new Date().toISOString().slice(0, 10),
    author: input.author.trim() || undefined,
    notes: "Generated from web Contribute tab (dataset correction); pending maintainer review.",
    candidates: [
      {
        operation: "patch_dataset",
        dataset_name: input.targetName.trim(),
        fields: buildDatasetPatchFields(input),
        rationale: input.rationale.trim(),
        sources: datasetSubmissionSources(input),
      },
    ],
  };
}

export function validateDatasetCorrection(input: DatasetCorrectionInput): ValidationResult {
  if (!input.targetName.trim()) return { ok: false, message: "target_name_required" };
  if (!input.rationale.trim()) return { ok: false, message: "rationale_required" };
  if (input.arxiv.trim() && !/^\d{4}\.\d{4,5}$/.test(input.arxiv.trim())) {
    return { ok: false, message: "arxiv_invalid" };
  }
  if (datasetSubmissionSources(input).length === 0) {
    return { ok: false, message: "url_required" };
  }
  if (Object.keys(buildDatasetPatchFields(input)).length === 0) {
    return { ok: false, message: "changes_required" };
  }
  return { ok: true };
}

export function suggestDatasetPatchFilename(targetName: string): string {
  const base = suggestId(targetName) || "dataset";
  return `${base}-patch-candidate.json`;
}

export { downloadJson };
