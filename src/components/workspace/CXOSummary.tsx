import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { FlowId } from "@/state";
import { Eyebrow, fmtUSD } from "@/components/docs/shared";
import { KPIStrip, type KPI } from "@/components/blocks/KPIStrip";
import { PNL, lineTotals, SCENARIOS, SYNERGIES, FLAG_RECOMMENDATION } from "@/components/docs/bp/data";

/**
 * CXOSummary — total report mounted above ExportCeremony on the
 * final step of each flow. Headline paragraph + 4 KPI tiles + 2 mini
 * charts. Numbers tie to the underlying docs + dashboards.
 */
export function CXOSummary({ flow }: { flow: FlowId }) {
  if (flow === "accounting") return <AccountingSummary />;
  if (flow === "treasury") return <TreasurySummary />;
  return <BPSummary />;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <article className="bg-white border border-divider rounded-md p-6 ai-spring">{children}</article>
  );
}

function MiniPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-white border border-divider p-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="text-[13px] font-bold text-ink leading-[18px] mt-0.5 mb-2">{title}</div>
      <div className="h-[180px]">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Accounting
// ─────────────────────────────────────────────────────────────────────
const ACCT_KPIS: KPI[] = [
  { label: "May revenue", value: 80.08, prefix: "$", suffix: "M", decimals: 2, trend: { delta: "7.4% MoM", direction: "up" }, spark: [74, 75, 76, 75, 77, 78, 79, 80] },
  { label: "Net margin", value: 66, suffix: "%", trend: { delta: "in guidance band", direction: "flat" } },
  { label: "Adjusting entries", value: 4, trend: { delta: "all balanced", direction: "up" } },
  { label: "Flagged accounts", value: 10, trend: { delta: "all explained", direction: "flat" } },
];
const ACCT_TREND = [
  { m: "Dec", actual: 73, budget: 71 },
  { m: "Jan", actual: 71, budget: 72 },
  { m: "Feb", actual: 73, budget: 74 },
  { m: "Mar", actual: 76, budget: 75 },
  { m: "Apr", actual: 75, budget: 76 },
  { m: "May", actual: 80, budget: 78 },
];
const ACCT_AGING = [
  { bucket: "Current", AP: 1136, AR: 4317 },
  { bucket: "1-30", AP: 477, AR: 740 },
  { bucket: "31-60", AP: 567, AR: 920 },
  { bucket: "61+", AP: 598, AR: 3011 },
];

function AccountingSummary() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <Eyebrow>CXO summary · May close</Eyebrow>
          <h2 className="text-[24px] font-bold text-ink leading-[28px] tracking-[-0.01em] mt-1">
            Books close at $80.08M · ready for sign-off
          </h2>
        </div>
        <span className="text-[10px] tracking-[0.08em] uppercase font-bold text-surface-deep bg-surface-mint px-2 py-1 rounded-full whitespace-nowrap">
          Audit-committee ready
        </span>
      </div>
      <p className="text-[14px] text-ink leading-[24px] max-w-[760px] mb-5">
        May delivered <strong className="font-bold">$80.08M</strong> revenue (+<strong className="font-bold">7.4%</strong> MoM)
        with operating expense at <strong className="font-bold">$14.6M</strong>. Net margin held at <strong className="font-bold">66.0%</strong>,
        inside the FY-Q1 board guidance band. Ten accounts crossed the 5% variance threshold; all are policy-substantiated.
        Four adjusting entries (<strong className="font-bold">JE-0429 to JE-0432</strong>) tie out and are queued for tonight's Oracle batch.
      </p>
      <KPIStrip items={ACCT_KPIS} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        <MiniPanel eyebrow="12-month revenue trend" title="Actual vs budget · $M">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ACCT_TREND} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 10 }} stroke="var(--mute)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, ""]} />
              <Line type="monotone" dataKey="actual" stroke="var(--accent-green-deep)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="budget" stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MiniPanel>
        <MiniPanel eyebrow="AP + AR aging" title="By bucket · $K">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACCT_AGING} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 10 }} stroke="var(--mute)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}K`} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}K`, ""]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="AP" fill="var(--accent-green-deep)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="AR" fill="var(--accent-green)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniPanel>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Treasury
// ─────────────────────────────────────────────────────────────────────
const TREAS_KPIS: KPI[] = [
  { label: "Total treasury", value: 8.41, prefix: "$", suffix: "B", decimals: 2, trend: { delta: "2.1% w/w", direction: "up" }, spark: [7.9, 8.0, 8.1, 8.2, 8.2, 8.3, 8.35, 8.41] },
  { label: "Hot wallet float", value: 30.89, prefix: "$", suffix: "M", decimals: 2, trend: { delta: "-8% vs target", direction: "down" } },
  { label: "Cold utilisation", value: 91, suffix: "%", trend: { delta: "at upper band", direction: "up" } },
  { label: "Anomalies pending", value: 2, trend: { delta: "same root cause", direction: "flat" } },
];
const TREAS_FLOW = Array.from({ length: 30 }, (_, i) => {
  const base = 8 + Math.sin(i / 4) * 4;
  const weekend = ((i + 6) % 7 < 2) ? -3 : 0;
  return { d: `${i + 1}`, net: Math.round((base + weekend + (i === 13 ? 18 : 0)) * 10) / 10 };
});
const TREAS_JUR = [
  { name: "US", v: 88 },
  { name: "SG", v: 42 },
  { name: "UK", v: 25 },
  { name: "HK", v: 19 },
  { name: "KY", v: 15 },
  { name: "CH", v: 12 },
  { name: "AE", v: 9 },
];

function TreasurySummary() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <Eyebrow>CXO summary · daily treasury</Eyebrow>
          <h2 className="text-[24px] font-bold text-ink leading-[28px] tracking-[-0.01em] mt-1">
            $8.41B treasury · $80M USDT rebalance recommended
          </h2>
        </div>
        <span className="text-[10px] tracking-[0.08em] uppercase font-bold text-mark-red bg-surface-rose px-2 py-1 rounded-full whitespace-nowrap">
          2 anomalies · ack pending
        </span>
      </div>
      <p className="text-[14px] text-ink leading-[24px] max-w-[760px] mb-5">
        Group treasury closed the overnight at <strong className="font-bold">$8.41B</strong> USD-equivalent. Cold custody at
        <strong className="font-bold"> 91% utilisation</strong> (upper band); hot float
        <strong className="font-bold"> 8% below target</strong>. Recommended tonight:
        <strong className="font-bold"> $80M USDT</strong> Anchorage → Fireblocks, ETA T+4h. Two anomalies on ETH-Hot-02 both
        trace to a single Northstar Capital OTC prime settlement and are recommended for a single ack.
      </p>
      <KPIStrip items={TREAS_KPIS} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        <MiniPanel eyebrow="30-day net flow" title="Customer in − out · $M">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREAS_FLOW} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 9 }} stroke="var(--mute)" interval={2} />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, "Net"]} />
              <Line type="monotone" dataKey="net" stroke="var(--accent-green-deep)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MiniPanel>
        <MiniPanel eyebrow="Fiat by jurisdiction" title="USD-equiv · $M">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TREAS_JUR} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="var(--mute)" width={28} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, ""]} />
              <Bar dataKey="v" fill="var(--accent-green-deep)" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniPanel>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────
// BP
// ─────────────────────────────────────────────────────────────────────
function BPSummary() {
  const totalRev = PNL.reduce((s, l) => s + lineTotals(l, "may").revenue, 0);
  const totalNet = PNL.reduce((s, l) => s + lineTotals(l, "may").net, 0);
  const kpis: KPI[] = [
    { label: "May revenue", value: totalRev / 1_000_000, prefix: "$", suffix: "M", decimals: 1, trend: { delta: "+7.4% MoM", direction: "up" } },
    { label: "Net margin", value: (totalNet / totalRev) * 100, suffix: "%", decimals: 1, trend: { delta: "in guidance", direction: "flat" } },
    { label: "Q3 ask", value: 2, prefix: "$", suffix: "M", trend: { delta: "annualised +$18M", direction: "up" } },
    { label: "Synergies", value: SYNERGIES.length, trend: { delta: "top 82% conf.", direction: "up" } },
  ];

  const waterfall = (() => {
    const prior = 74.56;
    const contributions = PNL.map((l) => ({
      label: l.id.slice(0, 4),
      value: (lineTotals(l, "may").revenue - lineTotals(l, "apr").revenue) / 1_000_000,
    }));
    const current = prior + contributions.reduce((s, c) => s + c.value, 0);
    const series = [
      { label: "Apr", value: prior, kind: "anchor" as const },
      ...contributions.map((c) => ({ label: c.label, value: c.value, kind: (c.value >= 0 ? "up" : "down") as "up" | "down" })),
      { label: "May", value: current, kind: "anchor" as const },
    ];
    let running = 0;
    return series.map((d) => {
      if (d.kind === "anchor") {
        running = d.value;
        return { ...d, start: 0, height: d.value };
      }
      const start = d.value >= 0 ? running : running + d.value;
      const height = Math.abs(d.value);
      running += d.value;
      return { ...d, start, height };
    });
  })();

  const marginRadar = PNL.map((l) => ({
    line: l.id,
    Apr: Math.max(0, lineTotals(l, "apr").margin * 100),
    May: Math.max(0, lineTotals(l, "may").margin * 100),
  }));

  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <Eyebrow>CXO summary · Q2 BP review</Eyebrow>
          <h2 className="text-[24px] font-bold text-ink leading-[28px] tracking-[-0.01em] mt-1">
            {FLAG_RECOMMENDATION.ask}
          </h2>
        </div>
        <span className="text-[10px] tracking-[0.08em] uppercase font-bold text-surface-deep bg-surface-mint px-2 py-1 rounded-full whitespace-nowrap">
          Decision by Jun 12
        </span>
      </div>
      <p className="text-[14px] text-ink leading-[24px] max-w-[760px] mb-5">
        Q2 delivered <strong className="font-bold">{fmtUSD(totalRev, { compact: true })}</strong> revenue on
        {" "}<strong className="font-bold">{((totalNet / totalRev) * 100).toFixed(1)}%</strong> net margin. Derivatives
        carried the quarter on a positive-skew funding regime ({SCENARIOS[0].baseAssumption.toLowerCase()}).
        Top controllable lever is institutional: {FLAG_RECOMMENDATION.rationale} Expected annualised net{" "}
        <strong className="font-bold">{fmtUSD(FLAG_RECOMMENDATION.expectedNet, { compact: true })}</strong>; risk is
        MAS MPI timing — mitigated by tranche.
      </p>
      <KPIStrip items={kpis} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        <MiniPanel eyebrow="Revenue waterfall" title="April → May · per line ($M)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfall} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--mute)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(_v, _n, p) => {
                  const v = (p as { payload?: { value?: number } } | undefined)?.payload?.value ?? 0;
                  return [`${v >= 0 ? "+" : "−"}$${Math.abs(v).toFixed(2)}M`, "Δ"];
                }}
              />
              <Bar dataKey="start" stackId="w" fill="transparent" />
              <Bar dataKey="height" stackId="w" radius={[2, 2, 0, 0]}>
                {waterfall.map((b, i) => (
                  <Cell
                    key={i}
                    fill={b.kind === "anchor" ? "var(--ink)" : b.kind === "up" ? "var(--accent-green-deep)" : "var(--mark-red)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </MiniPanel>
        <MiniPanel eyebrow="Margin radar" title="Per-line margin · Apr / May">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={marginRadar} outerRadius="76%">
              <PolarGrid stroke="var(--divider)" />
              <PolarAngleAxis dataKey="line" tick={{ fontSize: 10, fill: "var(--mute)" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "var(--mute)" }} angle={90} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`${Number(v ?? 0).toFixed(1)}%`, ""]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Radar dataKey="Apr" stroke="var(--accent-green)" fill="var(--accent-green)" fillOpacity={0.18} />
              <Radar dataKey="May" stroke="var(--accent-green-deep)" fill="var(--accent-green-deep)" fillOpacity={0.32} />
            </RadarChart>
          </ResponsiveContainer>
        </MiniPanel>
      </div>
    </Card>
  );
}
