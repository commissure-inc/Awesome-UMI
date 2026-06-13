import { downloadJson, suggestId, uniqueSources, type ValidationResult } from "./submitDevice";

export type ProjectCorrectionInput = {
  targetId: string;
  rationale: string;
  projectUrl: string;
  githubUrl: string;
  paperUrl: string;
  author: string;
  name: string;
  commercializationStage: string;
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
};

export type ProjectPatchBatch = {
  schema_version: "1.0";
  created_at: string;
  author?: string;
  notes?: string;
  candidates: Array<{
    operation: "patch_product";
    id: string;
    fields: Record<string, unknown>;
    rationale: string;
    sources: Array<{
      type: string;
      url: string;
      retrieved_at: string;
    }>;
  }>;
};

const URL_RE = /^https:\/\/[^\s]+$/;

function setIf(value: string, key: string, target: Record<string, unknown>): void {
  const trimmed = value.trim();
  if (trimmed) target[key] = trimmed;
}

export function buildProjectPatchFields(input: ProjectCorrectionInput): Record<string, unknown> {
  const fields: Record<string, unknown> = {};

  setIf(input.name, "name", fields);
  if (input.commercializationStage) fields.commercialization_stage = input.commercializationStage;
  if (input.formCategory) fields.form_category = input.formCategory;
  setIf(input.keyInnovation, "key_innovation", fields);
  if (input.country) fields.country = input.country;
  if (input.yearFirst.trim()) {
    const y = Number(input.yearFirst);
    if (!Number.isNaN(y)) fields.year_first = y;
  }
  setIf(input.fullName, "full_name", fields);
  const orgs = input.organization
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (orgs.length > 0) fields.organization = orgs;
  if (input.formFactor) fields.form_factor = input.formFactor;
  if (input.tactileIntegration) fields.tactile_integration = input.tactileIntegration;
  if (input.forceTorqueIntegration) {
    fields.force_torque_integration = input.forceTorqueIntegration;
  }
  if (input.poseTracking) fields.pose_tracking = input.poseTracking;
  if (input.bimanual) fields.bimanual = input.bimanual;
  if (input.license) fields.license = input.license;
  setIf(input.notes, "notes", fields);
  setIf(input.imageUrl, "image_url", fields);

  return fields;
}

export function buildProjectPatchBatch(input: ProjectCorrectionInput): ProjectPatchBatch {
  return {
    schema_version: "1.0",
    created_at: new Date().toISOString().slice(0, 10),
    author: input.author.trim() || undefined,
    notes: "Generated from web Contribute tab (project correction); pending maintainer review.",
    candidates: [
      {
        operation: "patch_product",
        id: input.targetId.trim(),
        fields: buildProjectPatchFields(input),
        rationale: input.rationale.trim(),
        sources: uniqueSources([input.projectUrl, input.githubUrl, input.paperUrl]),
      },
    ],
  };
}

export function validateProjectCorrection(input: ProjectCorrectionInput): ValidationResult {
  if (!input.targetId.trim() || !/^[a-z0-9_]+$/.test(input.targetId.trim())) {
    return { ok: false, message: "target_id_required" };
  }
  if (!input.rationale.trim()) return { ok: false, message: "rationale_required" };
  if (uniqueSources([input.projectUrl, input.githubUrl, input.paperUrl]).length === 0) {
    return { ok: false, message: "url_required" };
  }
  if (Object.keys(buildProjectPatchFields(input)).length === 0) {
    return { ok: false, message: "changes_required" };
  }
  if (input.imageUrl.trim() && !URL_RE.test(input.imageUrl.trim())) {
    return { ok: false, message: "image_url_invalid" };
  }
  return { ok: true };
}

export function suggestProjectPatchFilename(targetId: string): string {
  const base = suggestId(targetId) || "project";
  return `${base}-patch-candidate.json`;
}

export { downloadJson };
