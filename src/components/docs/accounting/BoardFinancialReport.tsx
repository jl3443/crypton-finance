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
  Legend,
  ComposedChart,
} from "recharts";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD, fmtPct } from "@/components/docs/shared";
import { cn } from "@/lib/utils";

/**
 * Board Financial Report — 14-section vertical scroll mimicking a real
 * board pack. Cover, agenda, exec summary, P&L, BS, CF, KPI dashboard,
 * variance walk (chart), forward outlook, risks, ESG, appendix, audit,
 * sign-off. Three Recharts embedded: YoY revenue line, cost trend bar,
 * cash bridge waterfall (composed bar).
 */

// ---------------------------------------------------------------- data
const REVENUE_MONTHLY = [
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

const COSTS_BY_BUCKET = [
  { bucket: "People", apr: 9_120, may: 9_290 },
  { bucket: "Infra & cloud", apr: 2_660, may: 2_705 },
  { bucket: "Custody fees", apr: 800, may: 800 },
  { bucket: "Compliance", apr: 568, may: 622 },
  { bucket: "Marketing", apr: 1_240, may: 980 },
  { bucket: "Trading ops", apr: 1_920, may: 2_262 },
];

const CASH_BRIDGE = [
  { label: "Opening cash (Apr 30)", value: 8_240_000 / 1_000_000 },
  { label: "+ Operating cash in", value: 80_080_000 / 1_000_000 },
  { label: "− Operating cash out", value: -14_570_000 / 1_000_000 },
  { label: "− Treasury rebalancing", value: -2_300_000 / 1_000_000 },
  { label: "+ Settlement timing", value: 590_000 / 1_000_000 },
  { label: "Closing cash (May 31)", value: 8_410_000 / 1_000_000 },
];

// ---------------------------------------------------------------- main
export function BoardFinancialReport() {
  return (
    <DocChrome
      title="Board financial report · May 2026"
      primary={{ label: "Sign & route to board", onClick: () => alert("Day-5 wires the EXCO routing ceremony.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        {/* Cover */}
        <Section eyebrow="01 · Cover">
          <div className="space-y-4">
            <div className="text-[11px] tracking-[0.18em] uppercase font-bold text-surface-deep">
              Crypton · Group · Confidential · Board pack
            </div>
            <h1 className="text-ink text-[56px] leading-[1.0] tracking-[-0.02em]">
              May 2026<br />Financial report
            </h1>
            <p className="text-[14px] text-mute leading-[22px] max-w-[520px]">
              Prepared by Group Finance for the June 2026 Board of Directors meeting. AI-drafted,
              CFO-reviewed. Numbers traceable to the Oracle Cloud GL extract referenced in the close
              audit trail.
            </p>
          </div>
        </Section>

        <Section eyebrow="02 · Agenda">
          <ol className="list-decimal pl-5 text-[14px] leading-[26px] text-ink space-y-0.5">
            <li>Executive summary · 1 page</li>
            <li>P&amp;L by business line · with month-over-month deltas</li>
            <li>Balance sheet · summary</li>
            <li>Cash flow bridge · April closing → May closing</li>
            <li>KPI dashboard · 4 board-level metrics</li>
            <li>Variance walk · YoY revenue + cost trend</li>
            <li>Forward outlook · Q3 guidance and assumptions</li>
            <li>Risks &amp; mitigants</li>
            <li>ESG &amp; compliance milestones</li>
            <li>Appendix · adjusting entries and cost reclassifications</li>
            <li>Audit trail reference</li>
            <li>Sign-off page</li>
          </ol>
        </Section>

        {/* Exec summary */}
        <Section eyebrow="03 · Executive summary">
          <p className="text-[14px] text-ink leading-[24px]">
            May delivered <Bold>$80.1M</Bold> revenue (+<Bold>7.4%</Bold> MoM), with derivatives the
            primary contributor and spot ticking up on two new token listings. Operating expense rose
            modestly to <Bold>$14.6M</Bold> (+<Bold>2.6%</Bold> MoM), keeping net margin at{" "}
            <Bold>66.0%</Bold> — inside the FY-Q1 guidance band. Treasury closed at{" "}
            <Bold>$8.41B</Bold> USD-equivalent (+<Bold>2.1%</Bold> w/w on settlement timing). Four
            adjusting entries (JE-0429 to JE-0432) are queued for tonight's Oracle posting.
          </p>
        </Section>

        {/* P&L */}
        <Section eyebrow="04 · P&L by business line">
          <PnLTable />
        </Section>

        {/* Balance sheet */}
        <Section eyebrow="05 · Balance sheet · summary (USD-equivalent)">
          <BalanceSheetTable />
        </Section>

        {/* Cash flow bridge */}
        <Section eyebrow="06 · Cash flow bridge">
          <p className="text-[13px] text-mute leading-[20px] mb-3">
            Opening to closing cash, in USD millions. Operating cash-in is dominated by funding-rate
            revenue and spot fees.
          </p>
          <div className="h-[260px] bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASH_BRIDGE} margin={{ top: 16, right: 16, bottom: 36, left: 8 }}>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" interval={0} stroke="var(--mute)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}M`, "USD"]}
                />
                <Bar dataKey="value" fill="var(--accent-green-deep)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* KPI */}
        <Section eyebrow="07 · KPI dashboard · board-level metrics">
          <StatRow
            items={[
              { label: "Revenue · May", value: fmtUSD(80_080_000, { compact: true }) },
              { label: "Net margin", value: fmtPct(0.66), tone: "ok" },
              { label: "Days to close", value: "4.2" },
              { label: "Treasury position", value: "$8.41B" },
            ]}
          />
        </Section>

        {/* Variance walk: YoY revenue */}
        <Section eyebrow="08 · Variance walk · YoY revenue trend">
          <p className="text-[13px] text-mute leading-[20px] mb-3">
            Monthly revenue actual vs budget, last 12 months. May exceeded budget by $2.58M on
            funding-rate strength.
          </p>
          <div className="h-[260px] bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_MONTHLY} margin={{ top: 16, right: 16, bottom: 16, left: 8 }}>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} stroke="var(--mute)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}k`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--accent-green-deep)" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="budget" name="Budget" stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Cost trend */}
        <Section eyebrow="09 · Cost trend · April → May by bucket">
          <div className="h-[260px] bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={COSTS_BY_BUCKET} margin={{ top: 16, right: 16, bottom: 16, left: 8 }}>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} stroke="var(--mute)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}k`} />
                <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}k`, ""]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="apr" name="April" fill="var(--surface-mint)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="may" name="May" fill="var(--accent-green-deep)" radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Outlook */}
        <Section eyebrow="10 · Forward outlook">
          <p className="text-[14px] text-ink leading-[24px]">
            Q3 base case: revenue <Bold>$245-260M</Bold>, OpEx <Bold>$46-49M</Bold>, net margin
            <Bold> 60-64%</Bold>. Sensitivity driven primarily by perp funding regime — if the May
            positive-skew normalises, funding revenue could compress 15-20%. The institutional pipeline
            (4 new onboards) should partly offset.
          </p>
        </Section>

        <Section eyebrow="11 · Risks & mitigants">
          <ul className="list-disc pl-5 text-[14px] leading-[24px] text-ink space-y-1">
            <li>Singapore MAS MPI application timing — mitigated by external counsel engagement (see JE-0432 prepaid marketing deferral)</li>
            <li>Funding regime mean-reversion — mitigated by spot listing pipeline ROI ramp</li>
            <li>Vendor concentration in custody (Fireblocks + Anchorage = 86% of cold) — diversification RFP in progress, see Treasury board memo</li>
          </ul>
        </Section>

        <Section eyebrow="12 · ESG & compliance">
          <p className="text-[14px] text-ink leading-[24px]">
            Compliance scan coverage: <Bold>100%</Bold> of inbound institutional flows screened
            (Chainalysis + Elliptic + TRM Labs). Sanction-screening cost per K-transaction at{" "}
            <Bold>$0.40</Bold>, down from $0.46 in April. Zero positive matches escalated to MLRO.
          </p>
        </Section>

        <Section eyebrow="13 · Appendix · adjusting entries">
          <ul className="list-disc pl-5 text-[14px] leading-[24px] text-ink space-y-1">
            <li>JE-0429 · Accrue May funding-rate revenue · $2.32M</li>
            <li>JE-0430 · Liquidation engine cost · settlement-gas reclass · $425.6K</li>
            <li>JE-0431 · Insurance fund top-up · $210.5K</li>
            <li>JE-0432 · Marketing & growth · listing campaign deferral · $259.5K</li>
          </ul>
        </Section>

        <Section eyebrow="14 · Sign-off">
          <div className="grid grid-cols-2 gap-6 max-w-[520px] text-[13px] leading-[22px]">
            <SignBlock role="CFO" name="Wei Chen" date="2026-05-28" />
            <SignBlock role="Audit Committee chair" name="—" date="—" />
          </div>
        </Section>
      </Paper>
      <SideRail>
        <Provenance
          source="AI-drafted from Oracle GL + audit-committee guidance memo"
          generatedAt="2026-05-28 08:24"
          notes="14 sections · 3 embedded charts · cited entries traceable to Journal entry proposals doc."
        />
        <CrossLinks
          links={[
            { id: "oracle-gl-extract", label: "Oracle GL extract (source)" },
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "variance-memo", label: "Variance commentary memo" },
            { id: "journal-entry-proposal", label: "Journal entry proposals" },
            { id: "close-audit-trail", label: "Close audit trail" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

// ---------------------------------------------------------------- inner sections
function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="pt-8 first:pt-0 border-b border-divider pb-8 last:border-b-0">
      <div className="text-[10px] tracking-[0.18em] uppercase font-bold text-surface-deep mb-3">
        {eyebrow}
      </div>
      {children}
    </section>
  );
}

function PnLTable() {
  const rows = [
    { line: "Derivatives", revenue: 51_098, opex: 6_840 },
    { line: "Spot", revenue: 11_655, opex: 2_310 },
    { line: "Institutional", revenue: 16_350, opex: 2_120 },
    { line: "Legal / Compliance", revenue: 977, opex: 3_300 },
  ];
  const totalRev = rows.reduce((s, r) => s + r.revenue, 0);
  const totalOpex = rows.reduce((s, r) => s + r.opex, 0);
  return (
    <table className="w-full text-[12px] leading-[18px]">
      <thead className="text-mute text-[10px] tracking-[0.08em] uppercase">
        <tr className="border-b border-divider">
          <th className="text-left py-2">Business line</th>
          <th className="text-right py-2">Revenue ($K)</th>
          <th className="text-right py-2">OpEx ($K)</th>
          <th className="text-right py-2">Net ($K)</th>
          <th className="text-right py-2">Margin</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const net = r.revenue - r.opex;
          const margin = net / r.revenue;
          return (
            <tr key={r.line} className="border-b border-divider/60">
              <td className="py-2 text-ink">{r.line}</td>
              <td className="py-2 text-right tabular-nums text-ink">{r.revenue.toLocaleString()}</td>
              <td className="py-2 text-right tabular-nums text-ink/80">{r.opex.toLocaleString()}</td>
              <td className={cn("py-2 text-right tabular-nums font-medium", net >= 0 ? "text-[var(--ok)]" : "text-mark-red")}>
                {net.toLocaleString()}
              </td>
              <td className="py-2 text-right tabular-nums text-ink">{fmtPct(margin)}</td>
            </tr>
          );
        })}
        <tr className="border-t-2 border-ink/30 font-bold">
          <td className="py-2 text-ink uppercase text-[10px] tracking-[0.08em]">Total</td>
          <td className="py-2 text-right tabular-nums text-ink">{totalRev.toLocaleString()}</td>
          <td className="py-2 text-right tabular-nums text-ink">{totalOpex.toLocaleString()}</td>
          <td className="py-2 text-right tabular-nums text-ink">{(totalRev - totalOpex).toLocaleString()}</td>
          <td className="py-2 text-right tabular-nums text-ink">{fmtPct((totalRev - totalOpex) / totalRev)}</td>
        </tr>
      </tbody>
    </table>
  );
}

function BalanceSheetTable() {
  const rows = [
    { side: "Assets", line: "Cash & equivalents (hot/warm/cold)", value: 8_410_000 },
    { side: "Assets", line: "Trading inventory (USD-equiv)", value: 1_870_000 },
    { side: "Assets", line: "Customer fund receivables", value: 540_000 },
    { side: "Assets", line: "Property & intangibles", value: 210_000 },
    { side: "Liabilities", line: "Customer fund liabilities (segregated)", value: 8_140_000 },
    { side: "Liabilities", line: "Accounts payable & accruals", value: 248_000 },
    { side: "Liabilities", line: "Insurance fund balance", value: 412_000 },
    { side: "Equity", line: "Retained earnings", value: 1_998_000 },
    { side: "Equity", line: "Period earnings (May)", value: 232_000 },
  ];
  return (
    <table className="w-full text-[12px] leading-[18px]">
      <thead className="text-mute text-[10px] tracking-[0.08em] uppercase">
        <tr className="border-b border-divider">
          <th className="text-left py-2 w-32">Side</th>
          <th className="text-left py-2">Line</th>
          <th className="text-right py-2">USD-equiv ($K)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-divider/60">
            <td className="py-2 text-mute uppercase text-[10px] tracking-[0.08em]">{r.side}</td>
            <td className="py-2 text-ink">{r.line}</td>
            <td className="py-2 text-right tabular-nums text-ink">{(r.value / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SignBlock({ role, name, date }: { role: string; name: string; date: string }) {
  return (
    <div>
      <Eyebrow>{role}</Eyebrow>
      <div className="h-12 border-b border-ink/40 mb-1.5"></div>
      <div className="text-ink">{name}</div>
      <div className="text-mute text-[11px]">{date}</div>
    </div>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-ink">{children}</strong>;
}
