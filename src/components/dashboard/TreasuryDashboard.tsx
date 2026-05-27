import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Eyebrow } from "@/components/docs/shared";
import { BANKS, totalUSDByChain } from "@/components/docs/treasury/data";

/**
 * TreasuryDashboard — 5-panel grid. Mounted on step 4 (Liquidity position)
 * of the treasury workspace. Hand-rolled runway gauge + 4 Recharts panels.
 */

export function TreasuryDashboard() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel eyebrow="Fiat position" title="Cash by jurisdiction · $M">
        <CashByJurisdiction />
      </Panel>
      <Panel eyebrow="Crypto position" title="Wallets by chain · $M">
        <WalletByChainDonut />
      </Panel>
      <Panel eyebrow="30-day net flow" title="Customer in − out · $M">
        <NetFlowChart />
      </Panel>
      <Panel eyebrow="Anomaly cluster" title="Time-of-day × amount · 24h">
        <AnomalyScatter />
      </Panel>
      <Panel eyebrow="Operating runway" title="Months at current burn">
        <RunwayGauge />
      </Panel>
      <Panel eyebrow="Custody utilisation" title="Anchorage cold capacity">
        <CustodyUtilisation />
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

// ────────────────────────────────────────────────────────────── 1
function CashByJurisdiction() {
  const data = BANKS.map((b) => ({
    name: b.jurisdiction,
    value: Math.round(b.balanceUSDEquiv / 1_000_000),
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="var(--mute)" width={36} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${v}M`, "USD-equiv"]} />
        <Bar dataKey="value" fill="var(--accent-green-deep)" radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ────────────────────────────────────────────────────────────── 2
function WalletByChainDonut() {
  const byChain = totalUSDByChain();
  const data = Object.entries(byChain).map(([name, v]) => ({ name, value: Math.round(v / 1_000_000) }));
  const total = data.reduce((s, x) => s + x.value, 0);
  const COLORS = [
    "var(--accent-green-deep)",
    "var(--accent-green)",
    "var(--surface-mint)",
    "var(--surface-deep)",
    "var(--mark-red)",
    "var(--mute)",
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          stroke="var(--surface-fog)"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(v, n) => [`$${v}M (${((Number(v ?? 0) / total) * 100).toFixed(0)}%)`, n]}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ────────────────────────────────────────────────────────────── 3
const FLOW_30D = Array.from({ length: 30 }, (_, i) => {
  const dayOfMonth = i + 1;
  // Slightly noisy net flow centred around +$8M/day with weekend dips
  const base = 8 + Math.sin(i / 4) * 4;
  const weekend = ((i + 6) % 7 < 2) ? -3 : 0;
  return { d: `${dayOfMonth}`, net: Math.round((base + weekend + (i === 13 ? 18 : 0)) * 10) / 10 };
});

function NetFlowChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={FLOW_30D} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
        <XAxis dataKey="d" tick={{ fontSize: 10 }} stroke="var(--mute)" interval={2} />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${v}M`, "Net"]} labelFormatter={(l) => `Day ${l}`} />
        <Line type="monotone" dataKey="net" stroke="var(--accent-green-deep)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ────────────────────────────────────────────────────────────── 4
const ANOMALY_POINTS = [
  // Normal cluster
  ...Array.from({ length: 50 }, (_, i) => ({
    hour: (i * 13) % 24,
    amount: Math.exp(2 + ((i * 7) % 11) / 3),
    kind: "normal" as const,
  })),
  // 2 anomalies
  { hour: 3.28, amount: 42_000, kind: "anomaly" as const, label: "Large transfer" },
  { hour: 3.28, amount: 280, kind: "anomaly" as const, label: "Off-hours" },
];

function AnomalyScatter() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" />
        <XAxis type="number" dataKey="hour" name="UTC hour" domain={[0, 24]} tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `${v}`} />
        <YAxis type="number" dataKey="amount" name="Amount $K" scale="log" domain={[1, 100_000]} tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => v >= 1000 ? `${v / 1000}M` : `${v}K`} />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(v, n) => [n === "Amount $K" ? `$${Number(v).toLocaleString()}K` : v, n]}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Scatter data={ANOMALY_POINTS.filter((p) => p.kind === "normal")} fill="var(--accent-green-deep)" fillOpacity={0.5} />
        <Scatter data={ANOMALY_POINTS.filter((p) => p.kind === "anomaly")} fill="var(--mark-red)" shape="star" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

// ────────────────────────────────────────────────────────────── 5
function RunwayGauge() {
  const months = 47;
  const target = 60;
  const ratio = Math.min(1, months / target);
  // Half-circle gauge (180° → 360° clockwise)
  const cx = 100;
  const cy = 100;
  const r = 70;
  // unused: const startAngle = Math.PI; // left
  const endAngle = Math.PI + Math.PI * ratio;
  const x = cx + r * Math.cos(endAngle);
  const y = cy + r * Math.sin(endAngle);
  const largeArc = ratio > 0.5 ? 1 : 0;
  const path = `M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
  const fullPath = `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 130" className="w-full h-full">
        <path d={fullPath} stroke="var(--divider)" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={path} stroke={ratio < 0.7 ? "var(--mark-red)" : "var(--accent-green-deep)"} strokeWidth="14" fill="none" strokeLinecap="round" />
        <text x="100" y="92" textAnchor="middle" className="fill-ink font-bold" fontSize="28">{months}</text>
        <text x="100" y="112" textAnchor="middle" className="fill-mute" fontSize="11" style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>months / target {target}</text>
      </svg>
    </div>
  );
}

// ────────────────────────────────────────────────────────────── 6
function CustodyUtilisation() {
  // Stacked bar: Anchorage utilised vs free
  const used = 91;
  const free = 100 - used;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={[{ name: "Anchorage", Utilised: used, Free: free }]} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="var(--mute)" width={64} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v, n) => [`${v}%`, n]} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Utilised" stackId="cu" fill="var(--mark-red)" />
        <Bar dataKey="Free" stackId="cu" fill="var(--surface-mint)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
