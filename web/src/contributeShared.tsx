import type { ChangeEvent } from "react";
import { axisValueLabel, axisValues } from "./catalog";
import { CONTRIBUTE_UI } from "./i18n";
import type { FilterAxes } from "./types";

export function AxisSelect(props: {
  label: string;
  value: string;
  axisKey: string;
  filterAxes: FilterAxes;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) {
  const options = axisValues(props.filterAxes, props.axisKey) ?? [];
  return (
    <label>
      {props.label}
      <select value={props.value} onChange={props.onChange} required={props.required}>
        {!props.required && (
          <option value="">{CONTRIBUTE_UI.en.selectUnset}</option>
        )}
        {options.map((v) => (
          <option key={v} value={v}>
            {axisValueLabel(props.filterAxes, props.axisKey, v, "en")}
          </option>
        ))}
      </select>
    </label>
  );
}
