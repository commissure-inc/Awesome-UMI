import { useMemo, useState, type ChangeEvent } from "react";
import { CorrectionField, formatCorrectionDisplay } from "./contributeCorrectionField";
import { CONTRIBUTE_CORRECT_DATASET_UI, CONTRIBUTE_DATASET_UI, CONTRIBUTE_UI } from "./i18n";
import { ISSUE_NEW, REPO_URL } from "./repoLinks";
import {
  buildDatasetPatchBatch,
  downloadJson,
  suggestDatasetPatchFilename,
  validateDatasetCorrection,
  type DatasetCorrectionInput,
} from "./submitCorrectDataset";

const EMPTY: DatasetCorrectionInput = {
  targetName: "",
  newName: "",
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

export function ContributeCorrectDatasetForm({
  datasets,
}: {
  datasets: Array<Record<string, unknown>>;
}) {
  const common = CONTRIBUTE_UI.en;
  const datasetUi = CONTRIBUTE_DATASET_UI.en;
  const ui = CONTRIBUTE_CORRECT_DATASET_UI.en;
  const [form, setForm] = useState<DatasetCorrectionInput>(EMPTY);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const sortedDatasets = useMemo(
    () =>
      [...datasets].sort((a, b) =>
        String(a.name ?? "").localeCompare(String(b.name ?? "")),
      ),
    [datasets],
  );

  const target = useMemo(
    () => datasets.find((row) => String(row.name ?? "") === form.targetName),
    [datasets, form.targetName],
  );

  const batch = useMemo(() => buildDatasetPatchBatch(form), [form]);

  const set =
    (key: keyof DatasetCorrectionInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrorKey(null);
    };

  const onDownload = () => {
    const v = validateDatasetCorrection(form);
    if (!v.ok) {
      setErrorKey(v.message);
      return;
    }
    downloadJson(suggestDatasetPatchFilename(form.targetName), batch);
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
            <select value={form.targetName} onChange={set("targetName")} required>
              <option value="">{common.selectUnset}</option>
              {sortedDatasets.map((row, i) => {
                const name = String(row.name ?? "");
                if (!name) return null;
                return (
                  <option key={`${name}-${i}`} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </label>
          <p className="contribute-section-hint">{datasetUi.hintSources}</p>
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

          <CorrectionField
            label={ui.labelNewName}
            current={formatCorrectionDisplay(target?.name)}
          >
            <input type="text" value={form.newName} onChange={set("newName")} />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelDatasetUrl}
            current={formatCorrectionDisplay(target?.url)}
            mono
          >
            <input
              type="url"
              className="mono"
              value={form.datasetUrl}
              onChange={set("datasetUrl")}
              placeholder="https://"
            />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelArxiv}
            current={formatCorrectionDisplay(target?.arxiv)}
            mono
          >
            <input
              type="text"
              className="mono"
              value={form.arxiv}
              onChange={set("arxiv")}
              placeholder="2403.12945"
            />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelProvider}
            current={formatCorrectionDisplay(target?.provider)}
          >
            <input type="text" value={form.provider} onChange={set("provider")} />
          </CorrectionField>

          <CorrectionField label={datasetUi.labelType} current={formatCorrectionDisplay(target?.type)}>
            <input
              type="text"
              value={form.type}
              onChange={set("type")}
              placeholder="real / manipulation"
            />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelTrajectories}
            current={formatCorrectionDisplay(target?.trajectories)}
          >
            <input type="text" value={form.trajectories} onChange={set("trajectories")} />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelEpisodes}
            current={formatCorrectionDisplay(target?.episodes)}
          >
            <input type="number" value={form.episodes} onChange={set("episodes")} />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelHours}
            current={formatCorrectionDisplay(target?.hours)}
          >
            <input type="text" value={form.hours} onChange={set("hours")} />
          </CorrectionField>

          <CorrectionField label={datasetUi.labelTasks} current={formatCorrectionDisplay(target?.tasks)}>
            <input type="number" value={form.tasks} onChange={set("tasks")} />
          </CorrectionField>

          <CorrectionField
            label={datasetUi.labelFormat}
            current={formatCorrectionDisplay(target?.format)}
            mono
          >
            <input type="text" value={form.format} onChange={set("format")} placeholder=".mcap" />
          </CorrectionField>

          <CorrectionField
            label={common.labelLicense}
            current={formatCorrectionDisplay(target?.license)}
          >
            <input type="text" value={form.license} onChange={set("license")} />
          </CorrectionField>

          <CorrectionField label={common.labelNotes} current={formatCorrectionDisplay(target?.notes)}>
            <textarea value={form.notes} onChange={set("notes")} rows={2} />
          </CorrectionField>

          <label>
            {common.labelAuthor}
            <input type="text" value={form.author} onChange={set("author")} placeholder="@you" />
          </label>
        </fieldset>

        {errorKey && (
          <p className="contribute-error" role="alert">
            {datasetUi.errors[errorKey] ?? common.errors[errorKey] ?? errorKey}
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
