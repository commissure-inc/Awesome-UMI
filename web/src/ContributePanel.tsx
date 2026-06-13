import { useEffect, useState } from "react";
import { ContributeCorrectDatasetForm } from "./ContributeCorrectDatasetForm";
import { ContributeCorrectProjectForm } from "./ContributeCorrectProjectForm";
import { ContributeDatasetForm } from "./ContributeDatasetForm";
import { ContributeProjectForm } from "./ContributeProjectForm";
import { CONTRIBUTE_UI } from "./i18n";
import type { FilterAxes, Product } from "./types";

export type ContributeKind = "project" | "dataset";
export type ContributeMode = "add" | "correct";

export function ContributePanel({
  filterAxes,
  products,
  datasets,
  initialKind = "project",
  initialMode = "add",
}: {
  filterAxes: FilterAxes;
  products: Product[];
  datasets: Array<Record<string, unknown>>;
  initialKind?: ContributeKind;
  initialMode?: ContributeMode;
}) {
  const ui = CONTRIBUTE_UI.en;
  const [kind, setKind] = useState<ContributeKind>(initialKind);
  const [mode, setMode] = useState<ContributeMode>(initialMode);

  useEffect(() => {
    setKind(initialKind);
  }, [initialKind]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="contribute-panel">
      <div className="contribute-kind segmented" role="tablist">
        <button
          type="button"
          role="tab"
          className={kind === "project" ? "selected" : ""}
          aria-selected={kind === "project"}
          onClick={() => setKind("project")}
        >
          {ui.kindProject}
        </button>
        <button
          type="button"
          role="tab"
          className={kind === "dataset" ? "selected" : ""}
          aria-selected={kind === "dataset"}
          onClick={() => setKind("dataset")}
        >
          {ui.kindDataset}
        </button>
      </div>

      <div className="contribute-mode segmented" role="tablist">
        <button
          type="button"
          role="tab"
          className={mode === "add" ? "selected" : ""}
          aria-selected={mode === "add"}
          onClick={() => setMode("add")}
        >
          {ui.modeAdd}
        </button>
        <button
          type="button"
          role="tab"
          className={mode === "correct" ? "selected" : ""}
          aria-selected={mode === "correct"}
          onClick={() => setMode("correct")}
        >
          {ui.modeCorrect}
        </button>
      </div>

      {kind === "project" && mode === "add" && (
        <ContributeProjectForm filterAxes={filterAxes} />
      )}
      {kind === "project" && mode === "correct" && (
        <ContributeCorrectProjectForm filterAxes={filterAxes} products={products} />
      )}
      {kind === "dataset" && mode === "add" && <ContributeDatasetForm />}
      {kind === "dataset" && mode === "correct" && (
        <ContributeCorrectDatasetForm datasets={datasets} />
      )}
    </div>
  );
}
