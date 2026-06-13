import type { ChangeEvent, ReactNode } from "react";
import { axisValueLabel, axisValues } from "./catalog";
import { CONTRIBUTE_UI } from "./i18n";
import type { FilterAxes } from "./types";

export function formatCorrectionDisplay(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function CorrectionField({
  label,
  current,
  mono,
  children,
}: {
  label: string;
  current: string;
  mono?: boolean;
  children: ReactNode;
}) {
  const ui = CONTRIBUTE_UI.en;
  return (
    <div className="contribute-correction-field">
      <span className="contribute-correction-label">{label}</span>
      <div className="contribute-correction-cols">
        <div className="contribute-correction-col">
          <span className="contribute-correction-sub">{ui.labelCurrent}</span>
          <div
            className={`contribute-correction-current${mono ? " mono" : ""}`}
          >
            {current}
          </div>
        </div>
        <div className="contribute-correction-col">
          <span className="contribute-correction-sub">{ui.labelProposed}</span>
          <div className="contribute-correction-input">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function CorrectionAxisSelect(props: {
  label: string;
  current: string;
  value: string;
  axisKey: string;
  filterAxes: FilterAxes;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const options = axisValues(props.filterAxes, props.axisKey) ?? [];
  return (
    <CorrectionField label={props.label} current={props.current}>
      <select value={props.value} onChange={props.onChange}>
        <option value="">{CONTRIBUTE_UI.en.selectUnset}</option>
        {options.map((v) => (
          <option key={v} value={v}>
            {axisValueLabel(props.filterAxes, props.axisKey, v, "en")}
          </option>
        ))}
      </select>
    </CorrectionField>
  );
}
