import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { BANKS, totalUSDByJurisdiction } from "@/components/docs/treasury/data";

const FLAG: Record<string, string> = {
  US: "🇺🇸",
  UK: "🇬🇧",
  SG: "🇸🇬",
  HK: "🇭🇰",
  AE: "🇦🇪",
  KY: "🇰🇾",
  CH: "🇨🇭",
};

export function BankAccountSummary() {
  const total = BANKS.reduce((s, b) => s + b.balanceUSDEquiv, 0);
  const byJurisdiction = totalUSDByJurisdiction();
  const topJurisdiction = Object.entries(byJurisdiction).sort((a, b) => b[1] - a[1])[0];
  const fxRisk = BANKS.filter((b) => b.currency !== "USD").reduce((s, b) => s + b.balanceUSDEquiv, 0);

  return (
    <DocChrome
      title="Bank account summary"
      primary={{ label: "Approve refresh", onClick: () => alert("Day-5 wires the refresh ceremony.") }}
      secondary={{ label: "Export CSV", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="2026-05-28 · 03:30 UTC sync"
          title="Bank account summary"
          subtitle="7 operating bank accounts across 7 jurisdictions. Fiat float that backs customer withdrawals and OTC settlement legs."
        />

        <StatRow
          items={[
            { label: "Total fiat", value: fmtUSD(total, { compact: true }) },
            { label: "Top jurisdiction", value: `${FLAG[topJurisdiction[0]]} ${topJurisdiction[0]}` },
            { label: "Non-USD exposure", value: fmtUSD(fxRisk, { compact: true }), tone: "warn" },
            { label: "Active accounts", value: String(BANKS.length) },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>7 accounts</Eyebrow>
          <div className="mt-2 overflow-hidden rounded-md border border-divider">
            <table className="w-full text-[12px] leading-[18px]">
              <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Bank account</th>
                  <th className="px-3 py-2 text-left w-28">Jurisdiction</th>
                  <th className="px-3 py-2 text-left w-20">Currency</th>
                  <th className="px-3 py-2 text-right w-36">USD-equivalent</th>
                  <th className="px-3 py-2 text-left w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {BANKS.map((b) => (
                  <tr key={b.name} className="border-t border-divider/60 hover:bg-surface-mint/30">
                    <td className="px-3 py-2 text-ink">{b.name}</td>
                    <td className="px-3 py-2 text-ink">
                      <span className="mr-1.5">{FLAG[b.jurisdiction]}</span>
                      {b.jurisdiction}
                    </td>
                    <td className="px-3 py-2 font-mono text-mute">{b.currency}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-ink">{fmtUSD(b.balanceUSDEquiv)}</td>
                    <td className="px-3 py-2 text-[var(--ok)] font-medium">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>AI commentary</Eyebrow>
          <p className="text-[14px] text-ink leading-[24px] pt-2 max-w-[760px]">
            US dollar exposure dominates (44% in JPM); Asia coverage (SG / HK) is intentionally heavier than the
            book's revenue weighting to keep customer-withdrawal latency low during Asia hours. Sygnum Bank Swiss
            line trending {fmtUSD(2_300_000)} below the {fmtUSD(14_500_000)} target — recommend topping up via
            inter-co transfer next week. No accounts flagged for compliance follow-up.
          </p>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Plaid / SWIFT bridges · last sync 03:30 UTC"
          generatedAt="2026-05-28 03:30"
          notes="USD-equiv computed at 03:00 UTC FX fix · sources Bloomberg + Refinitiv."
        />
        <CrossLinks
          links={[
            { id: "wallet-balance-sheet", label: "Wallet balance sheet" },
            { id: "transaction-ledger-24h", label: "Transaction ledger · 24h" },
            { id: "daily-treasury-brief", label: "Daily treasury brief" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
