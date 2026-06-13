import { useMemo, useState, type ChangeEvent } from "react";
import { axisValueLabel } from "./catalog";
import { AxisSelect } from "./contributeShared";
import { CONTRIBUTE_PROJECT_UI, CONTRIBUTE_UI } from "./i18n";
import {
  DOCS_ADD_DEVICE,
  DOCS_SCOPE,
  ISSUE_ADD_DEVICE,
  REPO_URL,
} from "./repoLinks";
import {
  buildCandidateBatch,
  downloadJson,
  suggestId,
  validateSubmission,
  type DeviceSubmissionInput,
} from "./submitDevice";
import type { FilterAxes } from "./types";

const STAGES = [
  "paper_only",
  "oss_diy",
  "commercial_product",
  "full_stack_business",
  "oss_ecosystem",
] as const;

const EMPTY: DeviceSubmissionInput = {
  name: "",
  id: "",
  commercializationStage: "oss_diy",
  projectUrl: "",
  githubUrl: "",
  paperUrl: "",
  rationale: "",
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
  author: "",
};

export function ContributeProjectForm({ filterAxes }: { filterAxes: FilterAxes }) {
  const common = CONTRIBUTE_UI.en;
  const ui = CONTRIBUTE_PROJECT_UI.en;
  const [form, setForm] = useState<DeviceSubmissionInput>(EMPTY);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const batch = useMemo(() => buildCandidateBatch(form), [form]);

  const set =
    (key: keyof DeviceSubmissionInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => {
        const next = { ...prev, [key]: e.target.value };
        if (key === "name" && !prev.id) next.id = suggestId(e.target.value);
        return next;
      });
      setErrorKey(null);
    };

  const onDownload = () => {
    const v = validateSubmission(form);
    if (!v.ok) {
      setErrorKey(v.message);
      return;
    }
    downloadJson(`${form.id || "project"}-candidate.json`, batch);
  };

  return (
    <>
      <section className="contribute-intro">
        <p>{ui.intro}</p>
        <ul>
          <li>{ui.stepScope}</li>
          <li>{ui.stepForm}</li>
          <li>{ui.stepReview}</li>
        </ul>
        <p className="contribute-links">
          <a href={DOCS_SCOPE} target="_blank" rel="noreferrer">
            {ui.linkScope}
          </a>
          {" · "}
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
        className="contribute-form"
        onSubmit={(e) => {
          e.preventDefault();
          onDownload();
        }}
      >
        <fieldset>
          <legend>{common.sectionRequired}</legend>
          <label>
            {common.labelName}
            <input type="text" value={form.name} onChange={set("name")} required />
          </label>
          <label>
            {common.labelId}
            <input
              type="text"
              className="mono"
              value={form.id}
              onChange={set("id")}
              pattern="[a-z0-9_]+"
              required
            />
          </label>
          <label>
            {common.labelStage}
            <select
              value={form.commercializationStage}
              onChange={set("commercializationStage")}
              required
            >
              {STAGES.map((v) => (
                <option key={v} value={v}>
                  {axisValueLabel(filterAxes, "commercialization_stage", v, "en")}
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
          <legend>{common.sectionOptional}</legend>
          <AxisSelect
            label={common.labelFormCategory}
            value={form.formCategory}
            axisKey="form_category"
            filterAxes={filterAxes}
            onChange={set("formCategory")}
          />
          <label>
            {common.labelInnovation}
            <textarea value={form.keyInnovation} onChange={set("keyInnovation")} rows={2} />
          </label>
          <AxisSelect
            label={common.labelCountry}
            value={form.country}
            axisKey="country"
            filterAxes={filterAxes}
            onChange={set("country")}
          />
          <label>
            {common.labelYear}
            <input type="number" value={form.yearFirst} onChange={set("yearFirst")} />
          </label>
          <label>
            {common.labelFullName}
            <input type="text" value={form.fullName} onChange={set("fullName")} />
          </label>
          <label>
            {common.labelOrganization}
            <input type="text" value={form.organization} onChange={set("organization")} />
          </label>
          <AxisSelect
            label={common.labelFormFactor}
            value={form.formFactor}
            axisKey="form_factor"
            filterAxes={filterAxes}
            onChange={set("formFactor")}
          />
          <AxisSelect
            label={common.labelTactile}
            value={form.tactileIntegration}
            axisKey="tactile_integration"
            filterAxes={filterAxes}
            onChange={set("tactileIntegration")}
          />
          <AxisSelect
            label={common.labelForceTorque}
            value={form.forceTorqueIntegration}
            axisKey="force_torque_integration"
            filterAxes={filterAxes}
            onChange={set("forceTorqueIntegration")}
          />
          <AxisSelect
            label={common.labelPoseTracking}
            value={form.poseTracking}
            axisKey="pose_tracking"
            filterAxes={filterAxes}
            onChange={set("poseTracking")}
          />
          <AxisSelect
            label={common.labelBimanual}
            value={form.bimanual}
            axisKey="bimanual"
            filterAxes={filterAxes}
            onChange={set("bimanual")}
          />
          <AxisSelect
            label={common.labelLicense}
            value={form.license}
            axisKey="license"
            filterAxes={filterAxes}
            onChange={set("license")}
          />
          <label>
            {common.labelNotes}
            <textarea value={form.notes} onChange={set("notes")} rows={2} />
          </label>
          <label>
            {common.labelImageUrl}
            <input
              type="url"
              className="mono"
              value={form.imageUrl}
              onChange={set("imageUrl")}
              placeholder="https://"
            />
          </label>
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
          <a className="contribute-issue-link" href={ISSUE_ADD_DEVICE} target="_blank" rel="noreferrer">
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
          <li>{common.after3}</li>
        </ol>
        <p className="contribute-note">{common.licenseNote}</p>
      </section>
    </>
  );
}
