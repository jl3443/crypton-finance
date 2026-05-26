import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD, fmtPct } from "@/components/docs/shared";
import { cn } from "@/lib/utils";

/**
 * Trial Balance reconciliation worksheet — prior-period vs. current-period
 * by account, with delta + variance %. Rows whose abs variance > 5% are
 * flagged in surface-rose; an inline AI commentary string surfaces the
 * top driver per flagged row.
 */

type RecRow = {
  account: string;
  name: string;
  category: "Revenue" | "OpEx";
  opening: number;
  current: number;
  driver?: string;
};

// Realistic Crypton numbers — keep in sync with what AI would actually see
// in the seeded May 2026 GL. Values in USD.
const ROWS: RecRow[] = [
  { account: "4010", name: "Trading fee revenue · maker (Spot)", category: "Revenue", opening: 3_120_000, current: 3_437_947, driver: "Maker volume +9.6% MoM" },
  { account: "4011", name: "Trading fee revenue · taker (Spot)", category: "Revenue", opening: 7_840_000, current: 8_217_503 },
  { account: "4020", name: "Funding rate revenue (Perpetuals)", category: "Revenue", opening: 28_400_000, current: 31_142_211, driver: "Bull-skewed funding · 18 of 21 days positive" },
  { account: "4022", name: "Auto-deleveraging fund contribution (Perp.)", category: "Revenue", opening: 9_120_000, current: 11_504_780, driver: "+26% MoM on liquidation cascade May 14" },
  { account: "4030", name: "Principal trading PnL (Derivatives)", category: "Revenue", opening: 4_780_000, current: 4_412_330 },
  { account: "4040", name: "Market-maker rebate net (Derivatives)", category: "Revenue", opening: 5_220_000, current: 5_018_117 },
  { account: "4050", name: "RFQ spread net (Institutional)", category: "Revenue", opening: 13_770_000, current: 13_932_504 },
  { account: "4060", name: "Prime brokerage interest income (Institutional)", category: "Revenue", opening: 2_310_000, current: 2_417_905 },
  { account: "5000", name: "Liquidation engine operational cost", category: "OpEx", opening: 720_000, current: 851_212, driver: "Settlement gas +18% MoM · auto-replenish triggered 4×" },
  { account: "5020", name: "Insurance fund top-up", category: "OpEx", opening: 1_200_000, current: 1_410_500 },
  { account: "5100", name: "AWS infrastructure", category: "OpEx", opening: 1_840_000, current: 1_882_018 },
  { account: "5110", name: "Chainalysis (compliance screening)", category: "OpEx", opening: 240_000, current: 240_000 },
  { account: "5120", name: "Fireblocks custody fee", category: "OpEx", opening: 580_000, current: 580_000 },
  { account: "5200", name: "Marketing & growth", category: "OpEx", opening: 1_240_000, current: 980_500, driver: "Listing campaign deferred to Q3" },
  { account: "5300", name: "People · Engineering", category: "OpEx", opening: 4_810_000, current: 4_882_700 },
  { account: "5310", name: "People · Treasury & Finance", category: "OpEx", opening: 1_220_000, current: 1_244_100 },
  { account: "5320", name: "People · Compliance & Legal", category: "OpEx", opening: 1_640_000, current: 1_780_300, driver: "Singapore MAS application headcount" },
  { account: "5410", name: "Legal · external counsel", category: "OpEx", opening: 410_000, current: 612_400, driver: "MAS MPI application · ongoing matter" },
  { account: "5500", name: "Sanction screening per-K-transaction", category: "OpEx", opening: 88_000, current: 102_300 },
];

export function TrialBalanceRecon() {
  // Revenue rows are credit-natural — display as positive; computed deltas
  // honour the sign for tone.
  const revenue = ROWS.filter((r) => r.category === "Revenue");
  const opex = ROWS.filter((r) => r.category === "OpEx");

  const revOpening = sum(revenue.map((r) => r.opening));
  const revCurrent = sum(revenue.map((r) => r.current));
  const opexCurrent = sum(opex.map((r) => r.current));

  return (
    <DocChrome
      title="Trial Balance reconciliation"
      primary={{ label: "Approve as drafted", onClick: () => alert("Day-5 wires the approval ceremony.") }}
      secondary={{ label: "Export memo PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="May 2026 · Month-end close"
          title="Trial Balance reconciliation"
          subtitle="Opening (Apr 30) vs. current (May 31). Variance > 5% is flagged with AI commentary on the driver."
        />

        <StatRow
          items={[
            { label: "Revenue · May", value: fmtUSD(revCurrent, { compact: true }) },
            { label: "Revenue · ΔMoM", value: fmtPct((revCurrent - revOpening) / revOpening), tone: revCurrent >= revOpening ? "ok" : "warn" },
            { label: "OpEx · May", value: fmtUSD(opexCurrent, { compact: true }) },
            { label: "Flagged accounts", value: String(ROWS.filter((r) => Math.abs(deltaPct(r)) > 0.05).length), tone: "warn" },
          ]}
        />

        <ReconTable title="Revenue" rows={revenue} />
        <ReconTable title="Operating expense" rows={opex} />

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Reviewer notes</Eyebrow>
          <p className="text-[14px] text-ink leading-[24px] pt-2 max-w-[760px]">
            Headline: derivatives line strong, spot steady, OpEx tracking +2.6% above April with the
            increase concentrated in liquidation engine cost and Singapore compliance headcount. No
            entries fail the integrity tie-out. Sign-off recommended once compliance headcount
            allocation (CC-4000 vs CC-2200) is confirmed with HRBP — see audit trail
            <span className="text-mute">JE-AUDIT-2026-05</span>.
          </p>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Oracle Cloud GL · May export"
          generatedAt="2026-05-28 08:15"
          notes="Sourced from the uploaded workbook · matched against last-period TB stored in finance data lake."
        />
        <CrossLinks
          links={[
            { id: "oracle-gl-extract", label: "Oracle GL extract (source)" },
            { id: "ap-aging", label: "AP aging report" },
            { id: "ar-aging", label: "AR aging report" },
            { id: "journal-entry-proposal", label: "Adjusting entries proposed" },
            { id: "variance-memo", label: "Variance commentary memo" },
            { id: "close-audit-trail", label: "Close audit trail" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function ReconTable({ title, rows }: { title: string; rows: RecRow[] }) {
  const totalOpening = sum(rows.map((r) => r.opening));
  const totalCurrent = sum(rows.map((r) => r.current));
  const totalDelta = totalCurrent - totalOpening;
  return (
    <section className="pt-6">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-2 overflow-hidden rounded-md border border-divider">
        <table className="w-full text-[12px] leading-[18px]">
          <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
            <tr>
              <th className="px-3 py-2 text-left w-16">Acct</th>
              <th className="px-3 py-2 text-left">Account name</th>
              <th className="px-3 py-2 text-right w-32">Opening (Apr)</th>
              <th className="px-3 py-2 text-right w-32">Current (May)</th>
              <th className="px-3 py-2 text-right w-24">Δ MoM</th>
              <th className="px-3 py-2 text-right w-20">Variance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const delta = r.current - r.opening;
              const variance = deltaPct(r);
              const flagged = Math.abs(variance) > 0.05;
              return (
                <tr key={r.account} className={cn("border-t border-divider", flagged && "bg-surface-rose")}>
                  <td className="px-3 py-2 font-mono text-mute">{r.account}</td>
                  <td className="px-3 py-2 text-ink">
                    {r.name}
                    {flagged && r.driver && (
                      <div className="text-[11px] text-mute pt-0.5 italic">AI · {r.driver}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink/85">{fmtUSD(r.opening)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink">{fmtUSD(r.current)}</td>
                  <td className={cn("px-3 py-2 text-right tabular-nums", delta >= 0 ? "text-[var(--ok)]" : "text-mark-red")}>
                    {delta >= 0 ? "+" : ""}{fmtUSD(delta)}
                  </td>
                  <td className={cn("px-3 py-2 text-right tabular-nums font-bold", flagged ? "text-mark-red" : "text-mute")}>
                    {variance >= 0 ? "+" : ""}{fmtPct(variance, 1)}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-ink/30 bg-surface-fog/40 font-bold">
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2 text-ink uppercase text-[10px] tracking-[0.08em]">Total {title}</td>
              <td className="px-3 py-2 text-right tabular-nums text-ink">{fmtUSD(totalOpening)}</td>
              <td className="px-3 py-2 text-right tabular-nums text-ink">{fmtUSD(totalCurrent)}</td>
              <td className={cn("px-3 py-2 text-right tabular-nums", totalDelta >= 0 ? "text-[var(--ok)]" : "text-mark-red")}>
                {totalDelta >= 0 ? "+" : ""}{fmtUSD(totalDelta)}
              </td>
              <td className={cn("px-3 py-2 text-right tabular-nums", totalDelta >= 0 ? "text-[var(--ok)]" : "text-mark-red")}>
                {totalDelta >= 0 ? "+" : ""}{fmtPct(totalDelta / totalOpening, 1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function deltaPct(r: RecRow) {
  return (r.current - r.opening) / r.opening;
}
function sum(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0);
}
