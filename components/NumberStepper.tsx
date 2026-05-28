"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

type NumberStepperProps = {
  label: string;
  name?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  presets?: number[];
  helperText?: string;
  className?: string;
};

function decimalPlaces(value: number) {
  const text = String(value);
  return text.includes(".") ? text.split(".")[1].length : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function NumberStepper({
  label,
  name,
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  unit,
  presets,
  helperText,
  className = ""
}: NumberStepperProps) {
  const controlled = value !== undefined;
  const initial = clamp(defaultValue ?? value ?? min, min, max);
  const [internalValue, setInternalValue] = useState(initial);
  const [draft, setDraft] = useState(String(initial));
  const currentValue = controlled ? clamp(value, min, max) : internalValue;
  const precision = useMemo(() => decimalPlaces(step), [step]);
  const invalid = Number.isNaN(Number(draft)) || Number(draft) < min || Number(draft) > max;

  function commit(nextValue: number) {
    const rounded = Number(clamp(nextValue, min, max).toFixed(precision));
    if (!controlled) setInternalValue(rounded);
    setDraft(String(rounded));
    onChange?.(rounded);
  }

  function nudge(direction: -1 | 1) {
    commit(currentValue + direction * step);
  }

  function handleBlur() {
    const parsed = Number(draft);
    commit(Number.isFinite(parsed) ? parsed : currentValue);
  }

  return (
    <div className={className}>
      <label className="block">
        <span className="mb-2 block text-sm font-black text-fit-text dark:text-white">{label}</span>
        <div className="grid min-h-14 grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center overflow-hidden rounded-[24px] border border-fit-border bg-fit-surfaceElevated shadow-sm dark:border-white/10 dark:bg-white/5">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={currentValue <= min}
            className="grid h-14 place-items-center text-fit-text transition active:scale-95 disabled:opacity-35 dark:text-white"
            aria-label={`Decrease ${label}`}
          >
            <Minus size={18} />
          </button>
          <div className="flex min-w-0 items-center justify-center gap-1 border-x border-fit-border px-2 dark:border-white/10">
            <input
              name={name}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={handleBlur}
              inputMode={step % 1 === 0 ? "numeric" : "decimal"}
              pattern={step % 1 === 0 ? "[0-9]*" : "[0-9]*[.]?[0-9]*"}
              aria-label={label}
              aria-invalid={invalid}
              className="h-14 min-w-0 flex-1 bg-transparent text-center text-lg font-black text-fit-text outline-none dark:text-white"
            />
            {unit && <span className="shrink-0 text-xs font-black uppercase text-fit-mutedText dark:text-white/55">{unit}</span>}
          </div>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={currentValue >= max}
            className="grid h-14 place-items-center text-fit-text transition active:scale-95 disabled:opacity-35 dark:text-white"
            aria-label={`Increase ${label}`}
          >
            <Plus size={18} />
          </button>
        </div>
      </label>
      {(helperText || invalid) && (
        <p className={`mt-2 text-xs font-bold ${invalid ? "text-fit-danger" : "text-fit-mutedText dark:text-white/55"}`}>
          {invalid ? `${label} should be between ${min}${unit ? ` ${unit}` : ""} and ${max}${unit ? ` ${unit}` : ""}.` : helperText}
        </p>
      )}
      {presets && presets.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => commit(preset)}
              className="shrink-0 rounded-full bg-fit-muted px-3 py-2 text-xs font-black text-fit-mutedText transition active:scale-95 dark:bg-white/5 dark:text-white/60"
            >
              {preset}{unit ? ` ${unit}` : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
