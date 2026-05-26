import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { cn } from "@/lib/utils";

/**
 * AR aging — institutional client receivables, tier-banded.
 * 4 aging buckets (Current / 1-15 / 16-30 / 30+), Tier-1 OTC / Tier-2 Prime /
 * Tier-3 API badges per row.
 */

type Tier = "Tier-1 · OTC" | "Tier-2 · Prime" | "Tier-3 · API";
type Receivable = {
  client: string;
  tier: Tier;
  invoiceId: string;
  invoiceDate: string;
  amount: number;
  bucket: "Current" | "1-15" | "16-30" | "30+";
  aiNote?: string;
};

const ROWS: Receivable[] = [
  { client: "Northstar Capital Partners", tier: "Tier-1 · OTC", invoiceId: "AR-NOR-2026000", invoiceDate: "2026-03-31", amount: 1_770_681, bucket: "30+", aiNote: "Outstanding past T+30 — RM scheduled to escalate. History clean." },
  { client: "Aurora Trading", tier: "Tier-1 · OTC", invoiceId: "AR-AUR-2026008", invoiceDate: "2026-04-12", amount: 1_240_400, bucket: "30+", aiNote: "First time past T+30 in 9 months — RM contact today." },
  { client: "Ironwood Treasury Services", tier: "Tier-1 · OTC", invoiceId: "AR-IRO-2026017", invoiceDate: "2026-05-04", amount: 920_320, bucket: "16-30" },
  { client: "Meridian Quant", tier: "Tier-1 · OTC", invoiceId: "AR-MER-2026021", invoiceDate: "2026-05-12", amount: 740_220, bucket: "1-15" },
  { client: "Helios Fund Management", tier: "Tier-2 · Prime", invoiceId: "AR-HEL-2026028", invoiceDate: "2026-05-19", amount: 410_600, bucket: "Current" },
  { client: "Pelagic Strategies", tier: "Tier-2 · Prime", invoiceId: "AR-PEL-2026032", invoiceDate: "2026-05-20", amount: 388_400, bucket: "Current" },
  { client: "Vector Quantitative", tier: "Tier-2 · Prime", invoiceId: "AR-VEC-2026036", invoiceDate: "2026-05-21", amount: 312_870, bucket: "Current" },
  { client: "Equinox Digital Assets", tier: "Tier-2 · Prime", invoiceId: "AR-EQU-2026037", invoiceDate: "2026-05-22", amount: 264_120, bucket: "Current" },
  { client: "Brightline Liquidity", tier: "Tier-1 · OTC", invoiceId: "AR-BRI-2026040", invoiceDate: "2026-05-22", amount: 1_120_900, bucket: "Current" },
  { client: "Cipher Lakes Capital", tier: "Tier-2 · Prime", invoiceId: "AR-CIP-2026044", invoiceDate: "2026-05-24", amount: 198_500, bucket: "Current" },
  { client: "Sterling Bridge Markets", tier: "Tier-3 · API", invoiceId: "AR-STE-2026045", invoiceDate: "2026-05-24", amount: 88_240, bucket: "Current" },
  { client: "Coastal Block Securities", tier: "Tier-3 · API", invoiceId: "AR-COA-2026046", invoiceDate: "2026-05-25", amount: 64_700, bucket: "Current" },
];

const BUCKET_TONE: Record<Receivable["bucket"], string> = {
  Current: "text-mute",
  "1-15": "text-ink",
  "16-30": "text-mark-red",
  "30+": "text-mark-red",
};

const TIER_TONE: Record<Tier, string> = {
  "Tier-1 · OTC": "bg-surface-deep text-ink-inverse",
  "Tier-2 · Prime": "bg-surface-mint text-surface-deep",
  "Tier-3 · API": "bg-surface-fog text-mute border border-divider",
};

export function ARAgingReport() {
  const total = ROWS.reduce((s, r) => s + r.amount, 0);
  const overdue = ROWS.filter((r) => r.bucket === "30+");
  const overdueTotal = overdue.reduce((s, r) => s + r.amount, 0);
  const t1Total = ROWS.filter((r) => r.tier === "Tier-1 · OTC").reduce((s, r) => s + r.amount, 0);

  return (
    <DocChrome
      title="Accounts receivable aging"
      primary={{ label: "Approve collection plan", onClick: () => alert("Day-5 wires the approval ceremony.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="May 2026 · Institutional receivables"
          title="Accounts receivable aging"
          subtitle="64 open invoices across 12 institutional clients. Top exposures tier-banded; AI surfaces clients drifting past T+30 for the first time."
        />

        <StatRow
          items={[
            { label: "Total open", value: fmtUSD(total, { compact: true }) },
            { label: "Past due > 30d", value: fmtUSD(overdueTotal, { compact: true }), tone: overdueTotal > 0 ? "warn" : "ok" },
            { label: "Tier-1 · OTC", value: fmtUSD(t1Total, { compact: true }) },
            { label: "Overdue clients", value: String(overdue.length), tone: overdue.length > 0 ? "warn" : "ok" },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Top 12 exposures · sorted by amount</Eyebrow>
          <div className="mt-2 overflow-hidden rounded-md border border-divider">
            <table className="w-full text-[12px] leading-[18px]">
              <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left w-32">Tier</th>
                  <th className="px-3 py-2 text-left w-40">Invoice</th>
                  <th className="px-3 py-2 text-left w-28">Date</th>
                  <th className="px-3 py-2 text-right w-28">Amount</th>
                  <th className="px-3 py-2 text-left w-20">Bucket</th>
                </tr>
              </thead>
              <tbody>
                {[...ROWS]
                  .sort((a, b) => b.amount - a.amount)
                  .map((r) => (
                    <tr
                      key={r.invoiceId}
                      className={cn(
                        "border-t border-divider/60 hover:bg-surface-mint/30",
                        r.bucket === "30+" && "bg-surface-rose/40",
                      )}
                    >
                      <td className="px-3 py-2 text-ink">
                        {r.client}
                        {r.aiNote && (
                          <div className="text-[11px] text-mute italic pt-0.5">AI · {r.aiNote}</div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-[0.04em] uppercase font-bold whitespace-nowrap",
                            TIER_TONE[r.tier],
                          )}
                        >
                          {r.tier}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-mute">{r.invoiceId}</td>
                      <td className="px-3 py-2 text-ink/85 tabular-nums">{r.invoiceDate}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-ink font-medium">{fmtUSD(r.amount)}</td>
                      <td className={cn("px-3 py-2 font-bold tabular-nums", BUCKET_TONE[r.bucket])}>{r.bucket}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Recommended collection actions</Eyebrow>
          <ol className="list-decimal pl-5 text-[14px] text-ink leading-[24px] pt-2 max-w-[760px] space-y-1">
            <li>
              Northstar Capital Partners — Tier-1 OTC, $1.77M past T+30. RM Sara to call today; offer
              netting against pending settlement to clear by Friday.
            </li>
            <li>
              Aurora Trading — Tier-1 OTC, $1.24M past T+30 for the first time in 9 months. RM Marcus
              to investigate (counterparty-side ops glitch suspected). Tier-1 escalation if not resolved
              by T+45.
            </li>
            <li>
              Ironwood Treasury Services — Tier-1 OTC, $920K aging 16-30; standard Tier-1 reminder.
            </li>
            <li>
              No action on Current bucket; T+14 statements queue as usual.
            </li>
          </ol>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Oracle Cloud GL · AR_Aging sheet"
          generatedAt="2026-05-28 08:17"
          notes="Tier mapping via Institutional CRM · client names per Northstar agreement nomenclature."
        />
        <CrossLinks
          links={[
            { id: "oracle-gl-extract", label: "Oracle GL extract (source)" },
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "ap-aging", label: "AP aging report" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
