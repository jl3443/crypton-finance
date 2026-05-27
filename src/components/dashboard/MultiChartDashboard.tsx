import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/docs/shared";

/**
 * MultiChartDashboard — 6-panel grid mounted alongside step 7
 * (Financial report assembly) of the Accounting flow. Mixes a
 * hand-rolled variance heat with Recharts stacked bars, donut,
 * line, and a waterfall.
 */

export function MultiChartDashboard() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel eyebrow="Variance heat" title="Cost centre × month · variance %">
        <VarianceHeat />
      </Panel>
      <Panel eyebrow="AP aging" title="Buckets × $K">
        <APAgingStackedChart />
      </Panel>
      <Panel eyebrow="AR aging" title="Tier × bucket × $K">
        <ARAgingStackedChart />
      </Panel>
      <Panel eyebrow="GL completeness" title="Posted / draft / pending">
        <GLCompletenessDonut />
      </Panel>
      <Panel eyebrow="12-month revenue" title="Actual vs Budget · $K">
        <RevenueTrendChart />
      </Panel>
      <Panel eyebrow="Period-over-period" title="April → May net movement · $K">
        <PeriodWaterfall />
      </Panel>
    </section>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-white border border-divider rounded-md p-5">
      <header className="mb-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="text-[14px] font-bold text-ink leading-[20px] mt-0.5">{title}</h3>
      </header>
      <div className="h-[220px]">{children}</div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 1 · Variance heat (hand-rolled) — cost centre × month, variance % cells
// ──────────────────────────────────────────────────────────────────────
const HEAT_MONTHS = ["Feb", "Mar", "Apr", "May"];
const HEAT_ROWS = [
  { cc: "CC-2000 · Derivatives BU", values: [0.014, -0.022, 0.038, 0.082] },
  { cc: "CC-2100 · Spot BU", values: [0.005, 0.011, 0.015, 0.038] },
  { cc: "CC-2200 · Institutional", values: [-0.004, -0.011, 0.008, 0.012] },
  { cc: "CC-3000 · Engineering", values: [0.018, 0.012, 0.022, 0.015] },
  { cc: "CC-3200 · Wallet & custody", values: [0.006, 0.034, 0.041, 0.092] },
  { cc: "CC-4000 · Compliance", values: [0.008, 0.020, 0.043, 0.071] },
  { cc: "CC-4100 · Legal", values: [0.011, 0.014, 0.038, 0.049] },
  { cc: "CC-6000 · Marketing", values: [-0.020, -0.054, -0.110, -0.210] },
];

function VarianceHeat() {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-[11px] leading-[14px]">
        <thead>
          <tr>
            <th className="text-left text-mute text-[10px] tracking-[0.08em] uppercase font-medium pb-1.5">
              Cost centre
            </th>
            {HEAT_MONTHS.map((m) => (
              <th
                key={m}
                className="text-center text-mute text-[10px] tracking-[0.08em] uppercase font-medium pb-1.5 w-14"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HEAT_ROWS.map((r) => (
            <tr key={r.cc}>
              <td className="py-1 text-ink whitespace-nowrap pr-2">{r.cc}</td>
              {r.values.map((v, i) => (
                <td key={i} className="py-1 px-0.5">
                  <div
                    className={cn(
                      "h-5 rounded-sm flex items-center justify-center text-[10px] font-bold tabular-nums",
                      heatTone(v),
                    )}
                    title={`${(v * 100).toFixed(1)}%`}
                  >
                    {v >= 0 ? "+" : ""}
                    {(v * 100).toFixed(1)}%
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function heatTone(v: number): string {
  if (v > 0.05) return "bg-mark-red text-ink-inverse";
  if (v > 0.02) return "bg-surface-rose text-mark-red";
  if (v < -0.05) return "bg-surface-deep text-ink-inverse";
  if (v < -0.02) return "bg-surface-mint text-surface-deep";
  return "bg-surface-fog text-mute";
}

// ──────────────────────────────────────────────────────────────────────
// 2 · AP aging stacked bar
// ──────────────────────────────────────────────────────────────────────
const AP_BUCKETS = [
  { bucket: "Current", value: 1_136 },
  { bucket: "1-30", value: 477 },
  { bucket: "31-60", value: 567 },
  { bucket: "61-90", value: 533 },
  { bucket: "90+", value: 65 },
];

function APAgingStackedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={AP_BUCKETS} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="bucket" tick={{ fontSize: 11 }} stroke="var(--mute)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}K`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${v}K`, "Open AP"]} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {AP_BUCKETS.map((_b, i) => (
            <Cell key={i} fill={i >= 2 ? "var(--mark-red)" : "var(--accent-green-deep)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 3 · AR aging stacked bar by tier
// ──────────────────────────────────────────────────────────────────────
const AR_BUCKETS = [
  { bucket: "Current", T1: 2_891, T2: 1_273, T3: 153 },
  { bucket: "1-15", T1: 740, T2: 0, T3: 0 },
  { bucket: "16-30", T1: 920, T2: 0, T3: 0 },
  { bucket: "30+", T1: 3_011, T2: 0, T3: 0 },
];

function ARAgingStackedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={AR_BUCKETS} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="bucket" tick={{ fontSize: 11 }} stroke="var(--mute)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}K`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${v}K`, ""]} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="T1" name="Tier-1 OTC" stackId="ar" fill="var(--accent-green-deep)" />
        <Bar dataKey="T2" name="Tier-2 Prime" stackId="ar" fill="var(--accent-green)" />
        <Bar dataKey="T3" name="Tier-3 API" stackId="ar" fill="var(--surface-mint)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 4 · GL completeness donut
// ──────────────────────────────────────────────────────────────────────
const GL_COMPLETENESS = [
  { name: "Posted", value: 218 },
  { name: "Draft (queued)", value: 25 },
  { name: "Pending review", value: 4 },
];
const GL_COLORS = ["var(--accent-green-deep)", "var(--accent-green)", "var(--mark-red)"];

function GLCompletenessDonut() {
  const total = GL_COMPLETENESS.reduce((s, x) => s + x.value, 0);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={GL_COMPLETENESS}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          stroke="var(--surface-fog)"
        >
          {GL_COMPLETENESS.map((_, i) => (
            <Cell key={i} fill={GL_COLORS[i]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(v, n) => [`${v} (${((Number(v ?? 0) / total) * 100).toFixed(0)}%)`, n]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 5 · Revenue trend line · actual vs budget (12 months)
// ──────────────────────────────────────────────────────────────────────
const TREND = [
  { m: "Jun-25", actual: 58_400, budget: 58_000 },
  { m: "Jul-25", actual: 61_200, budget: 60_500 },
  { m: "Aug-25", actual: 63_100, budget: 62_000 },
  { m: "Sep-25", actual: 64_500, budget: 64_000 },
  { m: "Oct-25", actual: 68_200, budget: 66_500 },
  { m: "Nov-25", actual: 70_100, budget: 68_500 },
  { m: "Dec-25", actual: 73_300, budget: 71_000 },
  { m: "Jan-26", actual: 70_900, budget: 72_000 },
  { m: "Feb-26", actual: 72_500, budget: 73_500 },
  { m: "Mar-26", actual: 75_600, budget: 75_000 },
  { m: "Apr-26", actual: 74_560, budget: 76_000 },
  { m: "May-26", actual: 80_080, budget: 77_500 },
];

function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={TREND} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="m" tick={{ fontSize: 9 }} stroke="var(--mute)" interval={1} />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}k`, ""]} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--accent-green-deep)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="budget" name="Budget" stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────────────────────────────
// 6 · Period-over-period net waterfall — Apr net → drivers → May net
// ──────────────────────────────────────────────────────────────────────
const WATERFALL = [
  { label: "Apr net", value: 60_240, kind: "anchor" as const },
  { label: "+ Funding rate", value: 2_742, kind: "up" as const },
  { label: "+ ADL fund", value: 2_385, kind: "up" as const },
  { label: "+ Spot maker", value: 376, kind: "up" as const },
  { label: "- Liquidation eng cost", value: -131, kind: "down" as const },
  { label: "- Compliance HC", value: -140, kind: "down" as const },
  { label: "- Legal counsel", value: -202, kind: "down" as const },
  { label: "+ Marketing deferral", value: 260, kind: "up" as const },
  { label: "May net", value: 65_510, kind: "anchor" as const },
];

function PeriodWaterfall() {
  // Compute floating bar (start, end) per non-anchor row to render waterfall.
  let running = 0;
  const bars = WATERFALL.map((d) => {
    if (d.kind === "anchor") {
      running = d.value;
      return { ...d, start: 0, height: d.value };
    }
    const start = d.value >= 0 ? running : running + d.value;
    const height = Math.abs(d.value);
    running += d.value;
    return { ...d, start, height };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={bars} margin={{ top: 8, right: 8, bottom: 28, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 9 }} stroke="var(--mute)" angle={-30} textAnchor="end" height={48} interval={0} />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(_v, _n, p) => {
          const pv = (p as { payload?: { value?: number } } | undefined)?.payload?.value ?? 0;
          return [`$${pv.toLocaleString()}k`, "Δ"];
        }} />
        <Bar dataKey="start" stackId="w" fill="transparent" />
        <Bar dataKey="height" stackId="w" radius={[2, 2, 0, 0]}>
          {bars.map((b, i) => (
            <Cell
              key={i}
              fill={
                b.kind === "anchor"
                  ? "var(--ink)"
                  : b.kind === "up"
                    ? "var(--accent-green-deep)"
                    : "var(--mark-red)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
