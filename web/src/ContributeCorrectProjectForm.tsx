import { useMemo, useState, type ChangeEvent } from "react";
import { axisValueLabel } from "./catalog";
import {
  CorrectionAxisSelect,
  CorrectionField,
  formatCorrectionDisplay,
} from "./contributeCorrectionField";
import { CONTRIBUTE_CORRECT_PROJECT_UI, CONTRIBUTE_UI } from "./i18n";
import {
  DOCS_ADD_DEVICE,
  ISSUE_CORRECT_DEVICE,
  REPO_URL,
} from "./repoLinks";
import {
  buildProjectPatchBatch,
  downloadJson,
  suggestProjectPatchFilename,
  validateProjectCorrection,
  type ProjectCorrectionInput,
} from "./submitCorrectProject";
import type { FilterAxes, Product } from "./types";

const STAGES = [
  "paper_only",
  "oss_diy",
  "commercial_product",
  "full_stack_business",
  "oss_ecosystem",
] as const;

const EMPTY: ProjectCorrectionInput = {
  targetId: "",
  rationale: "",
  projectUrl: "",
  githubUrl: "",
  paperUrl: "",
  author: "",
  name: "",
  commercializationStage: "",
  formCategory: "",
  keyInnovation: "",
  country: "",
  yearFirst: "",
  fullName: "",
  organization: "",
  formFactor: "",
  tactileIntegration: "",
  forceTorqueIntegration: "",
  poseTracking: "",
  bimanual: "",
  license: "",
  notes: "",
  imageUrl: "",
};

export function ContributeCorrectProjectForm({
  filterAxes,
  products,
}: {
  filterAxes: FilterAxes;
  products: Product[];
}) {
  const common = CONTRIBUTE_UI.en;
  const ui = CONTRIBUTE_CORRECT_PROJECT_UI.en;
  const [form, setForm] = useState<ProjectCorrectionInput>(EMPTY);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  const target = useMemo(
    () => products.find((p) => p.id === form.targetId),
    [products, form.targetId],
  );

  const batch = useMemo(() => buildProjectPatchBatch(form), [form]);

  const axisCurrent = (axisKey: string, value: string | null | undefined) =>
    value ? axisValueLabel(filterAxes, axisKey, value, "en") : "—";

  const set =
    (key: keyof ProjectCorrectionInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrorKey(null);
    };

  const onDownload = () => {
    const v = validateProjectCorrection(form);
    if (!v.ok) {
      setErrorKey(v.message);
      return;
    }
    downloadJson(suggestProjectPatchFilename(form.targetId), batch);
  };

  return (
    <>
      <section className="contribute-intro">
        <p>{ui.intro}</p>
        <ul>
          <li>{ui.stepSelect}</li>
          <li>{ui.stepEvidence}</li>
          <li>{ui.stepReview}</li>
        </ul>
        <p className="contribute-links">
          <a href={DOCS_ADD_DEVICE} target="_blank" rel="noreferrer">
            {ui.linkGuide}
          </a>
          {" · "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            {ui.linkRepo}
          </a>
        </p>
      </section>

      <form
        className="contribute-form contribute-form--correct"
        onSubmit={(e) => {
          e.preventDefault();
          onDownload();
        }}
      >
        <fieldset>
          <legend>{common.sectionRequired}</legend>
          <label>
            {ui.labelTarget}
            <select value={form.targetId} onChange={set("targetId")} required>
              <option value="">{common.selectUnset}</option>
              {sortedProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </label>
          <p className="contribute-section-hint">{ui.hintUrls}</p>
          <label>
            {common.labelProjectUrl}
            <input
              type="url"
              className="mono"
              value={form.projectUrl}
              onChange={set("projectUrl")}
              placeholder="https://"
            />
          </label>
          <label>
            {common.labelGithub}
            <input
              type="url"
              className="mono"
              value={form.githubUrl}
              onChange={set("githubUrl")}
              placeholder="https://github.com/..."
            />
          </label>
          <label>
            {common.labelPaper}
            <input
              type="url"
              className="mono"
              value={form.paperUrl}
              onChange={set("paperUrl")}
              placeholder="https://arxiv.org/abs/..."
            />
          </label>
          <label>
            {common.labelRationale}
            <textarea value={form.rationale} onChange={set("rationale")} rows={3} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>{common.sectionProposedChanges}</legend>
          <p className="contribute-section-hint">{common.hintProposedChanges}</p>

          <CorrectionField label={common.labelName} current={formatCorrectionDisplay(target?.name)}>
            <input type="text" value={form.name} onChange={set("name")} />
          </CorrectionField>

          <CorrectionField
            label={common.labelStage}
            current={axisCurrent("commercialization_stage", target?.commercialization_stage)}
          >
            <select value={form.commercializationStage} onChange={set("commercializationStage")}>
              <option value="">{common.selectUnset}</option>
              {STAGES.map((v) => (
                <option key={v} value={v}>
                  {axisValueLabel(filterAxes, "commercialization_stage", v, "en")}
                </option>
              ))}
            </select>
          </CorrectionField>

          <CorrectionAxisSelect
            label={common.labelFormCategory}
            current={axisCurrent("form_category", target?.form_category)}
            value={form.formCategory}
            axisKey="form_category"
            filterAxes={filterAxes}
            onChange={set("formCategory")}
          />

          <CorrectionField
            label={common.labelInnovation}
            current={formatCorrectionDisplay(target?.key_innovation)}
          >
            <textarea value={form.keyInnovation} onChange={set("keyInnovation")} rows={2} />
          </CorrectionField>

          <CorrectionAxisSelect
            label={common.labelCountry}
            current={axisCurrent("country", target?.country)}
            value={form.country}
            axisKey="country"
            filterAxes={filterAxes}
            onChange={set("country")}
          />

          <CorrectionField
            label={common.labelYear}
            current={formatCorrectionDisplay(target?.year_first)}
          >
            <input type="number" value={form.yearFirst} onChange={set("yearFirst")} />
          </CorrectionField>

          <CorrectionField
            label={common.labelFullName}
            current={formatCorrectionDisplay(target?.full_name)}
          >
            <input type="text" value={form.fullName} onChange={set("fullName")} />
          </CorrectionField>

          <CorrectionField
            label={common.labelOrganization}
            current={formatCorrectionDisplay(target?.organization)}
          >
            <input type="text" value={form.organization} onChange={set("organization")} />
          </CorrectionField>

          <CorrectionAxisSelect
            label={common.labelFormFactor}
            current={axisCurrent("form_factor", target?.form_factor)}
            value={form.formFactor}
            axisKey="form_factor"
            filterAxes={filterAxes}
            onChange={set("formFactor")}
          />

          <CorrectionAxisSelect
            label={common.labelTactile}
            current={axisCurrent("tactile_integration", target?.tactile_integration)}
            value={form.tactileIntegration}
            axisKey="tactile_integration"
            filterAxes={filterAxes}
            onChange={set("tactileIntegration")}
          />

          <CorrectionAxisSelect
            label={common.labelForceTorque}
            current={axisCurrent("force_torque_integration", target?.force_torque_integration)}
            value={form.forceTorqueIntegration}
            axisKey="force_torque_integration"
            filterAxes={filterAxes}
            onChange={set("forceTorqueIntegration")}
          />

          <CorrectionAxisSelect
            label={common.labelPoseTracking}
            current={axisCurrent("pose_tracking", target?.pose_tracking)}
            value={form.poseTracking}
            axisKey="pose_tracking"
            filterAxes={filterAxes}
            onChange={set("poseTracking")}
          />

          <CorrectionAxisSelect
            label={common.labelBimanual}
            current={axisCurrent("bimanual", target?.bimanual)}
            value={form.bimanual}
            axisKey="bimanual"
            filterAxes={filterAxes}
            onChange={set("bimanual")}
          />

          <CorrectionAxisSelect
            label={common.labelLicense}
            current={axisCurrent("license", target?.license)}
            value={form.license}
            axisKey="license"
            filterAxes={filterAxes}
            onChange={set("license")}
          />

          <CorrectionField label={common.labelNotes} current={formatCorrectionDisplay(target?.notes)}>
            <textarea value={form.notes} onChange={set("notes")} rows={2} />
          </CorrectionField>

          <CorrectionField
            label={common.labelImageUrl}
            current={formatCorrectionDisplay(target?.image_url)}
            mono
          >
            <input
              type="url"
              className="mono"
              value={form.imageUrl}
              onChange={set("imageUrl")}
              placeholder="https://"
            />
          </CorrectionField>

          <label>
            {common.labelAuthor}
            <input type="text" value={form.author} onChange={set("author")} placeholder="@you" />
          </label>
        </fieldset>

        {errorKey && (
          <p className="contribute-error" role="alert">
            {common.errors[errorKey] ?? errorKey}
          </p>
        )}

        <div className="contribute-actions">
          <button type="submit">{common.downloadJson}</button>
          <button type="button" onClick={() => setPreviewOpen((v) => !v)}>
            {previewOpen ? common.hidePreview : common.showPreview}
          </button>
          <a
            className="contribute-issue-link"
            href={ISSUE_CORRECT_DEVICE}
            target="_blank"
            rel="noreferrer"
          >
            {common.openIssue}
          </a>
        </div>

        {previewOpen && (
          <pre className="contribute-preview mono">{JSON.stringify(batch, null, 2)}</pre>
        )}
      </form>

      <section className="contribute-after">
        <h3>{common.afterTitle}</h3>
        <ol>
          <li>{common.after1}</li>
          <li>{common.after2}</li>
          <li>{ui.after3}</li>
        </ol>
        <p className="contribute-note">{common.licenseNote}</p>
      </section>
    </>
  );
}
