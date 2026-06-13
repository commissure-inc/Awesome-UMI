import { useMemo, useState, type ChangeEvent } from "react";
import { CONTRIBUTE_DATASET_UI, CONTRIBUTE_UI } from "./i18n";
import { ISSUE_NEW, REPO_URL } from "./repoLinks";
import {
  buildDatasetCandidateBatch,
  downloadJson,
  suggestDatasetFilename,
  validateDatasetSubmission,
  type DatasetSubmissionInput,
} from "./submitDataset";

const EMPTY: DatasetSubmissionInput = {
  name: "",
  datasetUrl: "",
  paperUrl: "",
  arxiv: "",
  rationale: "",
  provider: "",
  type: "",
  trajectories: "",
  episodes: "",
  hours: "",
  tasks: "",
  format: "",
  license: "",
  notes: "",
  author: "",
};

export function ContributeDatasetForm() {
  const common = CONTRIBUTE_UI.en;
  const ui = CONTRIBUTE_DATASET_UI.en;
  const [form, setForm] = useState<DatasetSubmissionInput>(EMPTY);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const batch = useMemo(() => buildDatasetCandidateBatch(form), [form]);

  const set =
    (key: keyof DatasetSubmissionInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrorKey(null);
    };

  const onDownload = () => {
    const v = validateDatasetSubmission(form);
    if (!v.ok) {
      setErrorKey(v.message);
      return;
    }
    downloadJson(suggestDatasetFilename(form.name), batch);
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
          <p className="contribute-section-hint">{ui.hintSources}</p>
          <label>
            {ui.labelDatasetUrl}
            <input
              type="url"
              className="mono"
              value={form.datasetUrl}
              onChange={set("datasetUrl")}
              placeholder="https://"
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
            {ui.labelArxiv}
            <input
              type="text"
              className="mono"
              value={form.arxiv}
              onChange={set("arxiv")}
              placeholder="2403.12945"
            />
          </label>
          <label>
            {common.labelRationale}
            <textarea value={form.rationale} onChange={set("rationale")} rows={3} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>{common.sectionOptional}</legend>
          <label>
            {ui.labelProvider}
            <input type="text" value={form.provider} onChange={set("provider")} />
          </label>
          <label>
            {ui.labelType}
            <input
              type="text"
              value={form.type}
              onChange={set("type")}
              placeholder="real / manipulation"
            />
          </label>
          <div className="contribute-row">
            <label>
              {ui.labelTrajectories}
              <input type="text" value={form.trajectories} onChange={set("trajectories")} />
            </label>
            <label>
              {ui.labelEpisodes}
              <input type="number" value={form.episodes} onChange={set("episodes")} />
            </label>
          </div>
          <div className="contribute-row">
            <label>
              {ui.labelHours}
              <input type="text" value={form.hours} onChange={set("hours")} />
            </label>
            <label>
              {ui.labelTasks}
              <input type="number" value={form.tasks} onChange={set("tasks")} />
            </label>
          </div>
          <label>
            {ui.labelFormat}
            <input type="text" value={form.format} onChange={set("format")} placeholder=".mcap" />
          </label>
          <label>
            {common.labelLicense}
            <input type="text" value={form.license} onChange={set("license")} />
          </label>
          <label>
            {common.labelNotes}
            <textarea value={form.notes} onChange={set("notes")} rows={2} />
          </label>
          <label>
            {common.labelAuthor}
            <input type="text" value={form.author} onChange={set("author")} placeholder="@you" />
          </label>
        </fieldset>

        {errorKey && (
          <p className="contribute-error" role="alert">
            {ui.errors[errorKey] ?? common.errors[errorKey] ?? errorKey}
          </p>
        )}

        <div className="contribute-actions">
          <button type="submit">{common.downloadJson}</button>
          <button type="button" onClick={() => setPreviewOpen((v) => !v)}>
            {previewOpen ? common.hidePreview : common.showPreview}
          </button>
          <a className="contribute-issue-link" href={ISSUE_NEW} target="_blank" rel="noreferrer">
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
