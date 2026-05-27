import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import { Eyebrow } from "@/components/docs/shared";
import { PNL, SCENARIOS, SYNERGIES, lineTotals } from "@/components/docs/bp/data";
import { WithDateRange, MONTH_PRESETS } from "@/components/dashboard/TimeRangeFilter";

export function BPDashboard() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel eyebrow="Revenue waterfall" title="April → May · per line ($M)">
        <WaterfallChart />
      </Panel>
      <Panel eyebrow="Margin radar" title="Per-line margin · April / May">
        <MarginRadar />
      </Panel>
      <Panel eyebrow="Scenario tornado" title="Q3 sensitivity · ±$M">
        <TornadoChart />
      </Panel>
      <Panel eyebrow="Synergy quadrant" title="Impact / Q × confidence">
        <SynergyQuadrant />
      </Panel>
      <Panel eyebrow="Quarterly trend" title="Per-line revenue · Apr / May / Jun-fcst">
        <QuarterlyTrend />
      </Panel>
      <Panel eyebrow="Headcount mix" title="FTE across 4 lines">
        <HeadcountMix />
      </Panel>
    </section>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
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

function WaterfallChart() {
  const prior = 74_560_000;
  const contributions = PNL.map((l) => ({ label: l.id, value: lineTotals(l, "may").revenue - lineTotals(l, "apr").revenue }));
  const current = prior + contributions.reduce((s, c) => s + c.value, 0);
  const series = [
    { label: "Apr", value: prior, kind: "anchor" as const },
    ...contributions.map((c) => ({ label: c.label.slice(0, 4), value: c.value, kind: (c.value >= 0 ? "up" : "down") as "up" | "down" })),
    { label: "May", value: current, kind: "anchor" as const },
  ];
  let running = 0;
  const bars = series.map((d) => {
    if (d.kind === "anchor") {
      running = d.value;
      return { ...d, start: 0, height: d.value / 1_000_000 };
    }
    const start = (d.value >= 0 ? running : running + d.value) / 1_000_000;
    const height = Math.abs(d.value) / 1_000_000;
    running += d.value;
    return { ...d, start, height };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={bars} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--mute)" />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="var(--mute)"
          tickFormatter={(v) => `$${v}M`}
          domain={[60, 90]}
          allowDataOverflow
        />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(_v, _n, p) => {
            const pl = (p as { payload?: { value?: number; kind?: string } } | undefined)?.payload;
            const v = pl?.value ?? 0;
            if (pl?.kind === "anchor") return [`$${(v / 1_000_000).toFixed(2)}M`, "Total"];
            return [`${v >= 0 ? "+" : "−"}$${Math.abs(v / 1_000_000).toFixed(2)}M`, "Δ"];
          }}
        />
        <Bar dataKey="start" stackId="w" fill="transparent" />
        <Bar dataKey="height" stackId="w" radius={[2, 2, 0, 0]}>
          {bars.map((b, i) => (
            <Cell key={i} fill={b.kind === "anchor" ? "var(--ink)" : b.kind === "up" ? "var(--accent-green)" : "var(--mark-red)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function MarginRadar() {
  const data = PNL.map((l) => ({
    line: l.id,
    Apr: Math.max(0, lineTotals(l, "apr").margin * 100),
    May: Math.max(0, lineTotals(l, "may").margin * 100),
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="80%">
        <PolarGrid stroke="var(--divider)" />
        <PolarAngleAxis dataKey="line" tick={{ fontSize: 11, fill: "var(--mute)" }} />
        <PolarRadiusAxis tick={{ fontSize: 10, fill: "var(--mute)" }} angle={90} tickFormatter={(v) => `${v}%`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`${Number(v ?? 0).toFixed(1)}%`, ""]} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Radar dataKey="Apr" stroke="var(--accent-green)" fill="var(--accent-green)" fillOpacity={0.18} />
        <Radar dataKey="May" stroke="var(--accent-green-deep)" fill="var(--accent-green-deep)" fillOpacity={0.32} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function TornadoChart() {
  const sorted = [...SCENARIOS].sort((a, b) => Math.abs(b.upsideUSD - b.downsideUSD) - Math.abs(a.upsideUSD - a.downsideUSD));
  const data = sorted.map((s) => ({
    label: s.driver.split(" ").slice(0, 3).join(" "),
    downside: s.downsideUSD / 1_000_000,
    upside: s.upsideUSD / 1_000_000,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }} stackOffset="sign">
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `${v >= 0 ? "+" : ""}$${v}M`} />
        <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} stroke="var(--mute)" width={100} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`${Number(v ?? 0) >= 0 ? "+" : "−"}$${Math.abs(Number(v ?? 0)).toFixed(1)}M`, ""]} />
        <Bar dataKey="downside" stackId="t" fill="var(--mark-red)" />
        <Bar dataKey="upside" stackId="t" fill="var(--accent-green-deep)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SynergyQuadrant() {
  const data = SYNERGIES.map((s) => ({
    x: s.confidence,
    y: s.impactUSDQ / 1_000_000,
    z: s.impactUSDQ / 100_000,
    label: s.pair,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" />
        <XAxis type="number" dataKey="x" name="Confidence" domain={[0, 1]} tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <YAxis type="number" dataKey="y" name="$M / Q" tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
        <ZAxis type="number" dataKey="z" range={[40, 220]} />
        <ReferenceLine x={0.6} stroke="var(--divider)" strokeDasharray="3 3" />
        <ReferenceLine y={3} stroke="var(--divider)" strokeDasharray="3 3" />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(_v, _n, p) => {
            const pl = (p as { payload?: { label?: string; y?: number; x?: number } }).payload;
            if (!pl) return ["—", "—"];
            return [`$${pl.y}M @ ${(pl.x! * 100).toFixed(0)}%`, pl.label!];
          }}
        />
        <Scatter data={data} fill="var(--accent-green-deep)" fillOpacity={0.85} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function QuarterlyTrend() {
  const months = [
    { date: "2026-04-01", m: "Apr", key: "apr" as const },
    { date: "2026-05-01", m: "May", key: "may" as const },
    { date: "2026-06-01", m: "Jun-fcst", key: "jun" as const },
  ];
  const data: ({ date: string; m: string } & Record<string, number | string>)[] = months.map(({ date, m, key }) => {
    const row: { date: string; m: string } & Record<string, number | string> = { date, m };
    PNL.forEach((l) => {
      row[l.id] = Math.round(lineTotals(l, key).revenue / 1_000_000);
    });
    return row;
  });
  const COLORS = ["var(--accent-green-deep)", "var(--accent-green)", "var(--mark-red)", "var(--mute)"];
  return (
    <WithDateRange data={data} presets={MONTH_PRESETS}>
      {(filtered) => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11 }} stroke="var(--mute)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
            <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${v}M`, ""]} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {PNL.map((l, i) => (
              <Line key={l.id} type="monotone" dataKey={l.id} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 2 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </WithDateRange>
  );
}

function HeadcountMix() {
  const data = PNL.map((l) => ({ line: l.id, FTE: l.headcount }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="line" tick={{ fontSize: 11 }} stroke="var(--mute)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="FTE" fill="var(--accent-green-deep)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
