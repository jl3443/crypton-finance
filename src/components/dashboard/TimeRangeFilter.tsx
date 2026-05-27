import { useState, useMemo, useEffect } from "react";

/**
 * Shared date-range filter for every time-series chart in the demo.
 * - `useDateRange` returns filtered data + bounds + setters.
 * - `DateRangeBar` renders 2 native date inputs + optional preset pills,
 *   styled in the project's warm palette.
 *
 * Convention: each data point carries an ISO `date` field (e.g. "2026-05-01").
 * Display fields (e.g. `m: "May-26"` or `d: "1"`) can coexist — the chart's
 * `dataKey` on the X axis remains the display field; `date` is filter-only.
 */

export type Dated = { date: string; [k: string]: unknown };

export type Preset = {
  label: string;
  /** Returns the "from" ISO date when applied; reads the data's max as anchor. */
  from: (maxISO: string, minISO: string) => string;
};

function shiftDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function shiftMonths(iso: string, months: number) {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export const DAY_PRESETS: Preset[] = [
  { label: "7d", from: (max) => shiftDays(max, -6) },
  { label: "14d", from: (max) => shiftDays(max, -13) },
  { label: "30d", from: (max, min) => maxOf(shiftDays(max, -29), min) },
  { label: "All", from: (_max, min) => min },
];

export const MONTH_PRESETS: Preset[] = [
  { label: "3M", from: (max, min) => maxOf(shiftMonths(max, -2), min) },
  { label: "6M", from: (max, min) => maxOf(shiftMonths(max, -5), min) },
  { label: "12M", from: (max, min) => maxOf(shiftMonths(max, -11), min) },
  { label: "All", from: (_max, min) => min },
];

function maxOf(a: string, b: string) {
  return a >= b ? a : b;
}

export function useDateRange<T extends Dated>(data: T[]) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => a.date.localeCompare(b.date)),
    [data],
  );
  const min = sorted[0]?.date ?? "";
  const max = sorted[sorted.length - 1]?.date ?? "";

  const [from, setFrom] = useState(min);
  const [to, setTo] = useState(max);

  // If the underlying data range changes (shouldn't happen often), keep
  // selections sensible.
  useEffect(() => {
    setFrom(min);
    setTo(max);
  }, [min, max]);

  const filtered = useMemo(
    () => sorted.filter((d) => d.date >= from && d.date <= to),
    [sorted, from, to],
  );

  return { filtered, from, to, setFrom, setTo, min, max, total: sorted.length };
}

export function DateRangeBar({
  from,
  to,
  min,
  max,
  onFrom,
  onTo,
  presets,
}: {
  from: string;
  to: string;
  min: string;
  max: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  presets?: Preset[];
}) {
  function applyPreset(p: Preset) {
    onFrom(p.from(max, min));
    onTo(max);
  }
  return (
    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
      <span className="text-[9px] tracking-[0.18em] uppercase font-medium text-mute pr-1">
        Range
      </span>
      <input
        type="date"
        value={from}
        min={min}
        max={to || max}
        onChange={(e) => onFrom(e.target.value)}
        className="px-1.5 py-0.5 rounded border border-divider bg-white font-mono text-[10px] text-ink focus:outline-none focus:border-surface-deep"
      />
      <span className="text-mute">→</span>
      <input
        type="date"
        value={to}
        min={from || min}
        max={max}
        onChange={(e) => onTo(e.target.value)}
        className="px-1.5 py-0.5 rounded border border-divider bg-white font-mono text-[10px] text-ink focus:outline-none focus:border-surface-deep"
      />
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1 ml-1">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="ui-pill px-1.5 py-0.5 rounded-full border border-divider text-[10px] text-mute hover:text-ink hover:border-surface-deep transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Convenience wrapper: takes data + presets, renders the bar AND returns
 * the filtered data via children render prop. Saves boilerplate in chart
 * components.
 */
export function WithDateRange<T extends Dated>({
  data,
  presets,
  children,
}: {
  data: T[];
  presets?: Preset[];
  children: (filtered: T[]) => React.ReactNode;
}) {
  const { filtered, from, to, setFrom, setTo, min, max } = useDateRange(data);
  return (
    <div className="flex flex-col gap-2 h-full">
      <DateRangeBar from={from} to={to} min={min} max={max} onFrom={setFrom} onTo={setTo} presets={presets} />
      <div className="flex-1 min-h-0">{children(filtered)}</div>
    </div>
  );
}
