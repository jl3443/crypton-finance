import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { WALLETS, totalUSDByCustody } from "@/components/docs/treasury/data";
import { cn } from "@/lib/utils";

/**
 * Wallet balance sheet — 21 wallets across 6 chains × 3 custody classes.
 * Subtotalled by class with custody venue badges.
 */

const CLASS_TONE = {
  Hot: "bg-mark-red/15 text-mark-red border border-mark-red/40",
  Warm: "bg-surface-mint text-surface-deep border border-surface-deep/30",
  Cold: "bg-surface-deep text-ink-inverse border border-surface-deep",
} as const;

const CUSTODY_TONE: Record<string, string> = {
  Fireblocks: "bg-surface-fog text-ink border border-divider",
  "Anchorage Digital": "bg-surface-mint/60 text-surface-deep border border-surface-deep/20",
};

export function WalletBalanceSheet() {
  const totals = totalUSDByCustody();
  const total = totals.fireblocks + totals.anchorage;
  const hotTotal = WALLETS.filter((w) => w.cls === "Hot").reduce((s, w) => s + w.balanceUSD, 0);
  const coldUtilization = totals.anchorage / 6_500_000_000; // assumed capacity

  return (
    <DocChrome
      title="Wallet balance sheet"
      primary={{ label: "Approve refresh", onClick: () => alert("Day-5 wires the refresh ceremony.") }}
      secondary={{ label: "Export CSV", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="2026-05-28 · 03:22 UTC sync"
          title="Wallet balance sheet"
          subtitle="Hot, warm, cold wallets across 6 chains. Subtotals show why $80M needs to move from Anchorage to Fireblocks today."
        />

        <StatRow
          items={[
            { label: "Total wallets", value: fmtUSD(total, { compact: true }) },
            { label: "Fireblocks (hot+warm)", value: fmtUSD(totals.fireblocks, { compact: true }) },
            { label: "Anchorage (cold)", value: fmtUSD(totals.anchorage, { compact: true }) },
            { label: "Hot float", value: fmtUSD(hotTotal, { compact: true }), tone: "warn" },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>21 wallets · sorted by chain</Eyebrow>
          <div className="mt-2 overflow-hidden rounded-md border border-divider">
            <table className="w-full text-[12px] leading-[18px]">
              <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Wallet</th>
                  <th className="px-3 py-2 text-left w-24">Chain</th>
                  <th className="px-3 py-2 text-left w-20">Class</th>
                  <th className="px-3 py-2 text-left w-44">Custody</th>
                  <th className="px-3 py-2 text-right w-32">Balance (USD)</th>
                  <th className="px-3 py-2 text-left w-20">Last sync</th>
                  <th className="px-3 py-2 text-right w-16">Whitelist</th>
                </tr>
              </thead>
              <tbody>
                {WALLETS.map((w) => (
                  <tr key={w.id} className="border-t border-divider/60 hover:bg-surface-mint/30">
                    <td className="px-3 py-2 font-mono text-ink">{w.id}</td>
                    <td className="px-3 py-2 text-ink">{w.chain}</td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-[0.08em] uppercase font-bold", CLASS_TONE[w.cls])}>
                        {w.cls}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-[0.04em] uppercase font-medium", CUSTODY_TONE[w.custody])}>
                        {w.custody}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-ink">{fmtUSD(w.balanceUSD)}</td>
                    <td className="px-3 py-2 text-mute tabular-nums">{w.lastSync}</td>
                    <td className="px-3 py-2 text-right text-mute tabular-nums">{w.whitelistMembers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>AI commentary</Eyebrow>
          <p className="text-[14px] text-ink leading-[24px] pt-2 max-w-[760px]">
            Hot-wallet float is <strong className="font-bold">8% below</strong> the {fmtUSD(36_000_000, { compact: true })} target —
            mostly USDT (Tron) and USDC (Ethereum) drawn down by yesterday's OTC settlement burst. Cold custody
            utilisation is {(coldUtilization * 100).toFixed(1)}% (Anchorage), within the 90-92% operational band
            but at the upper end. Tonight's recommended rebalancing (see RebalancingPlan) moves $80M USDT from
            Anchorage to Fireblocks to restore the float and free 4% of cold capacity.
          </p>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Fireblocks API · Anchorage API · last sync 03:22 UTC"
          generatedAt="2026-05-28 03:22"
          notes="Balances marked-to-USD using 03:00 UTC Chainalysis ref prices. Cold custody utilisation against the $6.5B internal capacity ceiling."
        />
        <CrossLinks
          links={[
            { id: "bank-account-summary", label: "Bank account summary" },
            { id: "transaction-ledger-24h", label: "Transaction ledger · 24h" },
            { id: "anomaly-brief", label: "Anomaly brief · 2 surfaced" },
            { id: "rebalancing-plan", label: "Rebalancing plan · $80M USDT" },
            { id: "daily-treasury-brief", label: "Daily treasury brief" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
