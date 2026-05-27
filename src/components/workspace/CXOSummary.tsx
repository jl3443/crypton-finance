import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download } from "lucide-react";
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
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";
import type { FlowId } from "@/state";
import { Eyebrow, fmtUSD } from "@/components/docs/shared";
import { KPIStrip, type KPI } from "@/components/blocks/KPIStrip";
import { PillButton } from "@/components/blocks/PillButton";
import { PNL, lineTotals, SCENARIOS, SYNERGIES, FLAG_RECOMMENDATION } from "@/components/docs/bp/data";
import { WALLETS, BANKS, ANOMALIES, totalUSDByChain, totalUSDByCustody, grandTotalUSD } from "@/components/docs/treasury/data";
import { WithDateRange, MONTH_PRESETS, DAY_PRESETS } from "@/components/dashboard/TimeRangeFilter";
import { cn } from "@/lib/utils";

/**
 * CXOSummary — board-pack-grade total report mounted above ExportCeremony
 * on the final step of each flow. 4 analysis sections (headline / drivers /
 * risk / recommendation), 4 KPI tiles, 4 mini Recharts panels. Downloadable
 * as PDF via react-to-print v3 (browser-native Save-as-PDF).
 */
export function CXOSummary({ flow }: { flow: FlowId }) {
  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: documentTitleFor(flow),
    pageStyle: PRINT_STYLE,
  });

  return (
    <article className="bg-white border border-divider rounded-md ai-spring overflow-hidden">
      {/* Toolbar (not part of the printable area) */}
      <header className="px-6 py-4 border-b border-divider bg-surface-fog/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Eyebrow>{eyebrowFor(flow)}</Eyebrow>
          <span className="text-[10px] tracking-[0.08em] uppercase font-bold text-surface-deep bg-surface-mint px-2 py-1 rounded-full">
            {badgeFor(flow)}
          </span>
        </div>
        <PillButton variant="primary" size="sm" onClick={handlePrint}>
          <Download size={14} />
          Download PDF
        </PillButton>
      </header>

      {/* Printable body */}
      <div ref={ref} className="cxo-printable p-6 space-y-7">
        {/* Cover */}
        <section>
          <div className="cxo-print-only text-[11px] tracking-[0.18em] uppercase font-bold text-surface-deep mb-2 hidden">
            Crypton · CFO desk · CXO summary
          </div>
          <h1 className="text-[28px] font-bold text-ink leading-[32px] tracking-[-0.01em]">
            {headlineFor(flow)}
          </h1>
          <p className="text-[14px] text-mute leading-[20px] mt-2 max-w-[760px]">
            {subheadFor(flow)}
          </p>
        </section>

        {/* KPIs */}
        <section>
          <KPIStrip items={kpisFor(flow)} />
        </section>

        {/* 4 analysis sections */}
        {flow === "accounting" && <AccountingBody />}
        {flow === "treasury" && <TreasuryBody />}
        {flow === "bp" && <BPBody />}

        {/* Footer (visible in print) */}
        <footer className="pt-4 border-t border-divider text-[11px] text-mute leading-[16px] flex items-center justify-between">
          <span>Drafted by AI · CFO reviewed · {new Date().toISOString().slice(0, 10)} · Confidential</span>
          <span>Crypton Finance · CFO desk</span>
        </footer>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Per-flow surface copy
// ─────────────────────────────────────────────────────────────────────

function documentTitleFor(flow: FlowId): string {
  if (flow === "accounting") return "Crypton · May close · CXO summary";
  if (flow === "treasury") return "Crypton · daily treasury · CXO summary";
  return "Crypton · Q2 BP review · CXO summary";
}
function eyebrowFor(flow: FlowId): string {
  if (flow === "accounting") return "CXO summary · May close";
  if (flow === "treasury") return "CXO summary · daily treasury";
  return "CXO summary · Q2 BP review";
}
function badgeFor(flow: FlowId): string {
  if (flow === "accounting") return "Audit-committee ready";
  if (flow === "treasury") return "2 anomalies · ack pending";
  return "Decision by Jun 12";
}
function headlineFor(flow: FlowId): string {
  if (flow === "accounting") return "Books close at $80.08M · ready for sign-off";
  if (flow === "treasury") return "$8.41B treasury · $80M USDT rebalance recommended";
  return FLAG_RECOMMENDATION.ask;
}
function subheadFor(flow: FlowId): string {
  if (flow === "accounting")
    return "Total report for the Audit Committee — what AI did, what it found, what it recommends. Numbers tie to the Trial Balance reconciliation, journal entry proposals, and 14-page board financial report linked below.";
  if (flow === "treasury")
    return "Daily exec brief for the CFO desk and morning ops review. Cash position · custody mix · 24h flow · anomalies · rebalancing recommendation. Numbers tie to the wallet balance sheet, transaction ledger, and rebalancing plan.";
  return "Q2 quarterly review for the Executive Committee. Per-line P&L, scenario sensitivity, and the single Q3 ask. Numbers tie to the 4-line P&L pack, scenario analysis, and synergy map.";
}

function kpisFor(flow: FlowId): KPI[] {
  if (flow === "accounting") {
    return [
      { label: "May revenue", value: 80.08, prefix: "$", suffix: "M", decimals: 2, trend: { delta: "7.4% MoM", direction: "up" }, spark: [74, 75, 76, 75, 77, 78, 79, 80] },
      { label: "Net margin", value: 66, suffix: "%", trend: { delta: "in guidance band", direction: "flat" } },
      { label: "Adjusting entries", value: 4, trend: { delta: "all balanced", direction: "up" } },
      { label: "Flagged accounts", value: 10, trend: { delta: "all explained", direction: "flat" } },
    ];
  }
  if (flow === "treasury") {
    return [
      { label: "Total treasury", value: 8.41, prefix: "$", suffix: "B", decimals: 2, trend: { delta: "2.1% w/w", direction: "up" }, spark: [7.9, 8.0, 8.1, 8.2, 8.2, 8.3, 8.35, 8.41] },
      { label: "Hot wallet float", value: 30.89, prefix: "$", suffix: "M", decimals: 2, trend: { delta: "-8% vs target", direction: "down" } },
      { label: "Cold utilisation", value: 91, suffix: "%", trend: { delta: "at upper band", direction: "up" } },
      { label: "Anomalies pending", value: 2, trend: { delta: "same root cause", direction: "flat" } },
    ];
  }
  const totalRev = PNL.reduce((s, l) => s + lineTotals(l, "may").revenue, 0);
  const totalNet = PNL.reduce((s, l) => s + lineTotals(l, "may").net, 0);
  return [
    { label: "May revenue", value: totalRev / 1_000_000, prefix: "$", suffix: "M", decimals: 1, trend: { delta: "+7.4% MoM", direction: "up" } },
    { label: "Net margin", value: (totalNet / totalRev) * 100, suffix: "%", decimals: 1, trend: { delta: "in guidance", direction: "flat" } },
    { label: "Q3 ask", value: 2, prefix: "$", suffix: "M", trend: { delta: "annualised +$18M", direction: "up" } },
    { label: "Synergies", value: SYNERGIES.length, trend: { delta: "top 82% conf.", direction: "up" } },
  ];
}

// ─────────────────────────────────────────────────────────────────────
// Section building blocks
// ─────────────────────────────────────────────────────────────────────

function Section({
  num,
  eyebrow,
  title,
  body,
  chart,
}: {
  num: number;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  chart: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-6 items-start border-t border-divider pt-6 first:border-t-0 first:pt-0 cxo-section">
      <div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-surface-deep">
            {String(num).padStart(2, "0")} · {eyebrow}
          </span>
        </div>
        <h3 className="text-[16px] font-bold text-ink leading-[20px] tracking-[-0.01em] mb-2">{title}</h3>
        <div className="text-[13px] text-ink leading-[22px] space-y-2">{body}</div>
      </div>
      <div className="rounded-md bg-white border border-divider p-3 h-[220px]">{chart}</div>
    </section>
  );
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-ink">{children}</strong>;
}

// ─────────────────────────────────────────────────────────────────────
// Accounting body — 4 sections
// ─────────────────────────────────────────────────────────────────────
const ACCT_TREND = [
  { date: "2025-12-01", m: "Dec", actual: 73, budget: 71 },
  { date: "2026-01-01", m: "Jan", actual: 71, budget: 72 },
  { date: "2026-02-01", m: "Feb", actual: 73, budget: 74 },
  { date: "2026-03-01", m: "Mar", actual: 76, budget: 75 },
  { date: "2026-04-01", m: "Apr", actual: 75, budget: 76 },
  { date: "2026-05-01", m: "May", actual: 80, budget: 78 },
];
const ACCT_COSTS = [
  { bucket: "People", apr: 9.12, may: 9.29 },
  { bucket: "Infra", apr: 2.66, may: 2.71 },
  { bucket: "Custody", apr: 0.8, may: 0.8 },
  { bucket: "Compliance", apr: 0.57, may: 0.62 },
  { bucket: "Marketing", apr: 1.24, may: 0.98 },
  { bucket: "Trading ops", apr: 1.92, may: 2.26 },
];
const ACCT_AGING = [
  { bucket: "Current", AP: 1136, AR: 4317 },
  { bucket: "1-30", AP: 477, AR: 740 },
  { bucket: "31-60", AP: 567, AR: 920 },
  { bucket: "61+", AP: 598, AR: 3011 },
];
const ACCT_GL = [
  { name: "Posted", value: 218 },
  { name: "Draft", value: 25 },
  { name: "Pending review", value: 4 },
];
const ACCT_GL_COLORS = ["var(--accent-green-deep)", "var(--accent-green)", "var(--mark-red)"];

function AccountingBody() {
  return (
    <>
      <Section
        num={1}
        eyebrow="Revenue analysis"
        title="Derivatives drove the $5.5M MoM uplift"
        body={
          <>
            <p>
              May delivered <B>$80.08M</B> revenue, up <B>+7.4%</B> on April and{" "}
              <B>+$2.58M above budget</B>. The driver is funding-rate revenue on perpetuals:{" "}
              <B>18 of 21 days positive</B> during the month, plus a one-off boost from the May 14
              liquidation cascade (+26% MoM on auto-deleveraging fund contribution).
            </p>
            <p>
              Spot ticked up <B>+10.2%</B> on two new token listings; institutional held flat at
              <B> $16.4M</B>, in line with the soft RFQ window communicated to the board in February.
            </p>
          </>
        }
        chart={
          <WithDateRange data={ACCT_TREND} presets={MONTH_PRESETS}>
            {(filtered) => (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filtered} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 10 }} stroke="var(--mute)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--accent-green-deep)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="budget" name="Budget" stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </WithDateRange>
        }
      />
      <Section
        num={2}
        eyebrow="Cost analysis"
        title="OpEx within band · 2 reclasses landed"
        body={
          <>
            <p>
              OpEx came in at <B>$14.57M</B> (+<B>2.6%</B> MoM). People stays the dominant bucket;
              trading-ops rose <B>+18%</B> on settlement-gas pressure — <B>50% reclassified</B> to
              Wallet & custody runtime via entry <B>JE-0430</B> per ACCT-POL-2026-02 §1.7.
            </p>
            <p>
              Marketing fell <B>-21%</B> on the deliberate Q3 deferral of the listing campaign
              (entry <B>JE-0432</B>). Singapore compliance headcount lifted People · Compliance
              <B> +8.6%</B>; legal counsel <B>+49%</B> — both pre-committed MAS MPI items.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACCT_COSTS} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 9 }} stroke="var(--mute)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, ""]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="apr" name="April" fill="var(--surface-mint)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="may" name="May" fill="var(--accent-green-deep)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />
      <Section
        num={3}
        eyebrow="Risk · receivables"
        title="$1.16M AP past 30d · 2 institutional ARs in collection"
        body={
          <>
            <p>
              AP open balance is <B>$2.78M</B>; <B>$1.16M</B> sits past 30 days, concentrated in two
              vendor engagements: <B>PwC audit</B> ($410K · awaiting AC sign-off) and{" "}
              <B>Linklaters MAS counsel</B> ($286K · adjustment requested). One TRM Labs invoice in
              90+ pending vendor escalation.
            </p>
            <p>
              AR side: <B>$7.52M</B> open with <B>$3.01M</B> past 30 days, all Tier-1 OTC. Northstar
              Capital ($1.77M) and Aurora Trading ($1.24M) escalated to RM today — both clean
              counterparty history; resolution expected by Friday.
            </p>
          </>
        }
        chart={
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
        }
      />
      <Section
        num={4}
        eyebrow="Recommendation"
        title="Sign the close · 4 entries post tonight"
        body={
          <>
            <p>
              Recommend signing the May close with the four adjusting entries proposed (
              <B>JE-0429 to JE-0432</B>) in tonight's Oracle nightly. The only open item is the
              Compliance vs Institutional cost-centre allocation for the four new Singapore hires;
              HRBP confirmation expected by <B>2026-05-30</B>.
            </p>
            <p>
              GL completeness: <B>218 entries posted</B>, <B>25 drafts queued</B> (the four JEs plus
              21 auto-postings), and <B>4 pending human review</B>. Book ready for the Audit
              Committee review on <B>June 2</B>.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ACCT_GL} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="var(--surface-fog)">
                {ACCT_GL.map((_, i) => (
                  <Cell key={i} fill={ACCT_GL_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v, n) => [`${v} entries`, n]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        }
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Treasury body — 4 sections
// ─────────────────────────────────────────────────────────────────────
const TREAS_FLOW = Array.from({ length: 30 }, (_, i) => {
  const base = 8 + Math.sin(i / 4) * 4;
  const weekend = ((i + 6) % 7 < 2) ? -3 : 0;
  return {
    date: `2026-04-${String(i + 1).padStart(2, "0")}`,
    d: `${i + 1}`,
    net: Math.round((base + weekend + (i === 13 ? 18 : 0)) * 10) / 10,
  };
});

function TreasuryBody() {
  const total = grandTotalUSD();
  const custody = totalUSDByCustody();
  const banks = BANKS.reduce((s, b) => s + b.balanceUSDEquiv, 0);
  const chains = totalUSDByChain();
  const chainData = Object.entries(chains).map(([name, v]) => ({ name, value: Math.round(v / 1_000_000) }));
  const CHAIN_COLORS = [
    "var(--accent-green-deep)",
    "var(--accent-green)",
    "var(--surface-mint)",
    "var(--surface-deep)",
    "var(--mark-red)",
    "var(--mute)",
  ];
  const TREAS_JUR = BANKS.map((b) => ({
    name: b.jurisdiction,
    value: Math.round(b.balanceUSDEquiv / 1_000_000),
  })).sort((a, b) => b.value - a.value);
  const anomalyPoints = [
    ...Array.from({ length: 50 }, (_, i) => ({
      hour: (i * 13) % 24,
      amount: Math.exp(2 + ((i * 7) % 11) / 3),
      kind: "normal" as const,
    })),
    { hour: 3.28, amount: 42_000, kind: "anomaly" as const },
    { hour: 3.28, amount: 280, kind: "anomaly" as const },
  ];

  return (
    <>
      <Section
        num={1}
        eyebrow="Position snapshot"
        title="$8.41B closed · 7-jurisdiction fiat float"
        body={
          <>
            <p>
              Group treasury closed the overnight at <B>{fmtUSD(total, { compact: true })}</B>{" "}
              USD-equivalent — flat against yesterday. Crypto on{" "}
              <B>{fmtUSD(custody.fireblocks + custody.anchorage, { compact: true })}</B> across
              Fireblocks (hot + warm) and Anchorage (cold). Fiat float at{" "}
              <B>{fmtUSD(banks, { compact: true })}</B> across 7 jurisdictions; JPM USD dominates at
              <B> 44%</B>, Asia (SG/HK) intentionally over-weighted for Asia-hours withdrawal latency.
            </p>
            <p>
              No accounts flagged for compliance follow-up. Sygnum CHF line is <B>$2.3M</B> below
              target — recommend inter-co top-up next week.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TREAS_JUR} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="var(--mute)" width={28} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, ""]} />
              <Bar dataKey="value" fill="var(--accent-green-deep)" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />
      <Section
        num={2}
        eyebrow="Custody mix"
        title="Bitcoin · Ethereum dominate · 91% cold utilisation"
        body={
          <>
            <p>
              By chain: Bitcoin <B>$3.02B</B> (47% of crypto), Ethereum <B>$2.19B</B> (34%), Solana{" "}
              <B>$405M</B>, with USDT on Tron + Polygon + Arbitrum on the long tail. <B>91%</B> of
              the {fmtUSD(custody.anchorage, { compact: true })} cold custody sits in Anchorage — at
              the upper end of the 90-92% operational band.
            </p>
            <p>
              Hot-wallet float is <B>{fmtUSD(WALLETS.filter((w) => w.cls === "Hot").reduce((s, w) => s + w.balanceUSD, 0), { compact: true })}</B>,
              <B> 8% below</B> the $36M target — mostly USDT (Tron) and USDC (Ethereum) drawn down
              by yesterday's OTC settlement burst.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chainData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="var(--surface-fog)">
                {chainData.map((_, i) => (
                  <Cell key={i} fill={CHAIN_COLORS[i % CHAIN_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v, n) => [`$${v}M`, n]} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </PieChart>
          </ResponsiveContainer>
        }
      />
      <Section
        num={3}
        eyebrow="Flow · anomalies"
        title="2 events on ETH-Hot-02 · single root cause"
        body={
          <>
            <p>
              <B>1,247 transactions</B> classified in the last 24h; AI auto-classified <B>94%</B>.
              Net customer flow positive at <B>+$8.7M</B>; net hedging flow <B>−$4.2M</B>. Big
              inflows: Northstar Capital OTC <B>$18.4M</B>, Aurora Trading <B>$12.3M</B>.
            </p>
            <p>
              Anomalies surfaced: <B>{ANOMALIES.length} events</B>, both on ETH-Hot-02 in the same
              minute — a <B>$42M outbound</B> to a new whitelist address (03:17:42 UTC) and a
              concurrent off-hours egress. Both trace to the same Northstar prime onboarding
              settlement and are recommended for <B>single ack</B>.
            </p>
          </>
        }
        chart={
          <WithDateRange data={TREAS_FLOW} presets={DAY_PRESETS}>
            {(filtered) => (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filtered} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 9 }} stroke="var(--mute)" interval={2} />
                  <YAxis tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`$${v}M`, "Net"]} />
                  <Line type="monotone" dataKey="net" stroke="var(--accent-green-deep)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </WithDateRange>
        }
      />
      <Section
        num={4}
        eyebrow="Recommendation"
        title="Approve $80M USDT rebalancing · ack both anomalies as one event"
        body={
          <>
            <p>
              Recommend moving <B>$80M USDT</B> from Anchorage cold → Fireblocks hot to restore the
              float and free 4 points of cold utilisation. <B>Travel-rule + sanction checks all
              pass</B>; daily cap usage <B>53%</B>; Anchorage T+0 SLA ETA <B>~4h</B>. Travel-rule
              audit + signed Fireblocks instruction emit on approval.
            </p>
            <p>
              Operating runway holds at <B>47 months</B> at current burn; license runway tracks the
              MAS MPI timeline. Brief filed with morning ops at 04:00 UTC.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" />
              <XAxis type="number" dataKey="hour" name="UTC hour" domain={[0, 24]} tick={{ fontSize: 10 }} stroke="var(--mute)" />
              <YAxis type="number" dataKey="amount" name="Amount $K" scale="log" domain={[1, 100_000]} tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => v >= 1000 ? `${v / 1000}M` : `${v}K`} />
              <ZAxis range={[40, 200]} />
              <Tooltip contentStyle={{ fontSize: 11 }} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={anomalyPoints.filter((p) => p.kind === "normal")} fill="var(--accent-green-deep)" fillOpacity={0.5} />
              <Scatter data={anomalyPoints.filter((p) => p.kind === "anomaly")} fill="var(--mark-red)" shape="star" />
            </ScatterChart>
          </ResponsiveContainer>
        }
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// BP body — 4 sections
// ─────────────────────────────────────────────────────────────────────
function BPBody() {
  const prior = 74.56;
  const contributions = PNL.map((l) => ({
    label: l.id.slice(0, 4),
    value: (lineTotals(l, "may").revenue - lineTotals(l, "apr").revenue) / 1_000_000,
  }));
  const currentQ = prior + contributions.reduce((s, c) => s + c.value, 0);
  const waterfall = (() => {
    const series = [
      { label: "Apr", value: prior, kind: "anchor" as const },
      ...contributions.map((c) => ({ label: c.label, value: c.value, kind: (c.value >= 0 ? "up" : "down") as "up" | "down" })),
      { label: "May", value: currentQ, kind: "anchor" as const },
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
  const tornado = [...SCENARIOS].sort((a, b) => Math.abs(b.upsideUSD - b.downsideUSD) - Math.abs(a.upsideUSD - a.downsideUSD)).map((s) => ({
    label: s.driver.split(" ").slice(0, 3).join(" "),
    downside: s.downsideUSD / 1_000_000,
    upside: s.upsideUSD / 1_000_000,
  }));
  const synergyData = SYNERGIES.map((s) => ({
    x: s.confidence,
    y: s.impactUSDQ / 1_000_000,
    z: s.impactUSDQ / 100_000,
    label: s.pair,
  }));

  return (
    <>
      <Section
        num={1}
        eyebrow="Q2 performance"
        title="Derivatives carried Q2 on funding strength"
        body={
          <>
            <p>
              Q2 closed at <B>$230M</B> revenue (May annualised). Derivatives generated{" "}
              <B>$51M of May revenue</B> — funding rate <B>$31M</B> + auto-deleveraging contribution{" "}
              <B>$12M</B> + principal trading + MM net. Spot lifted <B>+10%</B> on two listings;
              Institutional flat; Compliance net-cost ($-7M) is the MAS investment line item, not a
              health flag.
            </p>
            <p>
              <B>73%</B> of the MoM uplift came from Derivatives + Institutional combined — i.e.,
              the two lines where additional sales capacity has the highest marginal yield.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfall} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--mute)" />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="var(--mute)"
                tickFormatter={(v) => `$${v}M`}
                domain={[60, 90]}
                allowDataOverflow
              />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(_v, _n, p) => {
                  const pl = (p as { payload?: { value?: number; kind?: string } } | undefined)?.payload;
                  const v = pl?.value ?? 0;
                  if (pl?.kind === "anchor") return [`$${v.toFixed(2)}M`, "Total"];
                  return [`${v >= 0 ? "+" : "−"}$${Math.abs(v).toFixed(2)}M`, "Δ"];
                }}
              />
              <Bar dataKey="start" stackId="w" fill="var(--ink)" isAnimationActive={false} />
              <Bar
                dataKey="height"
                stackId="w"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              >
                {waterfall.map((b, i) => (
                  <Cell key={i} fill={b.kind === "anchor" ? "var(--ink)" : b.kind === "up" ? "var(--accent-green)" : "var(--mark-red)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        }
      />
      <Section
        num={2}
        eyebrow="Per-line health"
        title="Margins held · Compliance is the carry"
        body={
          <>
            <p>
              Margin radar: Derivatives <B>86.3%</B>, Institutional <B>87.1%</B>, Spot <B>79.4%</B>,
              Compliance <B>net-negative</B> by design (MAS investment line). Apr → May barely moves
              the radar, confirming margins are structural — the variance memo's revenue uplift is
              clean, not noise.
            </p>
            <p>
              Headcount distribution maps to revenue: <B>Derivatives 38 FTE</B>, Spot 22, Institutional 17,
              Compliance 24. Institutional has the highest revenue-per-FTE — and is the line we are
              recommending to invest into.
            </p>
          </>
        }
        chart={
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
        }
      />
      <Section
        num={3}
        eyebrow="Q3 sensitivity"
        title="Perp funding mean-reversion is the dominant tail"
        body={
          <>
            <p>
              Sensitivity tornado on 6 Q3 drivers: <B>perp funding mean-reversion</B> is the biggest
              tail with <B>−$41M</B> downside if days-positive normalises. Institutional onboards
              the second-largest upside at <B>+$18M</B>. Spot listing pipeline contributes up to{" "}
              <B>+$9M</B> if both pending tokens launch on schedule.
            </p>
            <p>
              Total envelope: <B>−$54M</B> downside / <B>+$44M</B> upside against the Q3 base of
              ~$245-260M. Risk-adjusted, the institutional lever has the best impact-to-controllable
              ratio.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={tornado} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} stackOffset="sign">
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `${v >= 0 ? "+" : ""}$${v}M`} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 9 }} stroke="var(--mute)" width={100} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`${Number(v ?? 0) >= 0 ? "+" : "−"}$${Math.abs(Number(v ?? 0)).toFixed(1)}M`, ""]} />
              <Bar dataKey="downside" stackId="t" fill="var(--mark-red)" />
              <Bar dataKey="upside" stackId="t" fill="var(--accent-green-deep)" />
            </BarChart>
          </ResponsiveContainer>
        }
      />
      <Section
        num={4}
        eyebrow="Strategic recommendation"
        title={FLAG_RECOMMENDATION.ask}
        body={
          <>
            <p>
              {FLAG_RECOMMENDATION.rationale} Expected annualised net contribution{" "}
              <B>{fmtUSD(FLAG_RECOMMENDATION.expectedNet, { compact: true })}</B>.
            </p>
            <p>
              Risk: <B>{FLAG_RECOMMENDATION.risk}</B> Mitigation: tranche the $2M against MAS
              milestones; first <B>$500K</B> on application acknowledgement; remaining $1.5M against
              signed clients. Decision needed by <B>June 12</B>.
            </p>
            <p>
              Synergy map confirms the case: Spot maker liquidity → Derivatives MM rebate uplift at{" "}
              <B>82% confidence</B>, $4.2M/quarter — top-right of the impact × confidence quadrant.
            </p>
          </>
        }
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" />
              <XAxis type="number" dataKey="x" name="Confidence" domain={[0, 1]} tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <YAxis type="number" dataKey="y" name="$M / Q" tick={{ fontSize: 10 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
              <ZAxis type="number" dataKey="z" range={[40, 220]} />
              <ReferenceLine x={0.6} stroke="var(--divider)" strokeDasharray="3 3" />
              <ReferenceLine y={3} stroke="var(--divider)" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(_v, _n, p) => {
                  const pl = (p as { payload?: { label?: string; y?: number; x?: number } }).payload;
                  if (!pl) return ["—", "—"];
                  return [`$${pl.y}M @ ${(pl.x! * 100).toFixed(0)}%`, pl.label!];
                }}
              />
              <Scatter data={synergyData} fill="var(--accent-green-deep)" fillOpacity={0.85} />
            </ScatterChart>
          </ResponsiveContainer>
        }
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Print stylesheet — clean PDF output
// ─────────────────────────────────────────────────────────────────────
const PRINT_STYLE = `
@page {
  size: A4;
  margin: 18mm 14mm;
}
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cxo-print-only { display: block !important; }
  .cxo-section {
    page-break-inside: avoid;
    grid-template-columns: 1.05fr 1fr !important;
  }
  .recharts-responsive-container { page-break-inside: avoid; }
}
`;
// Silence unused-utility-import warning when CSS classes referenced only in
// dynamic strings — keep cn imported in case downstream components add classes.
void cn;
