import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { WALLETS, BANKS, ANOMALIES, totalUSDByCustody, grandTotalUSD } from "@/components/docs/treasury/data";

/**
 * Daily treasury brief — 1-page exec summary that the CFO files to
 * the morning ops review. ~240 words plus a compact position table.
 */

export function DailyTreasuryBrief() {
  const total = grandTotalUSD();
  const custody = totalUSDByCustody();
  const banks = BANKS.reduce((s, b) => s + b.balanceUSDEquiv, 0);
  const hotFloat = WALLETS.filter((w) => w.cls === "Hot").reduce((s, w) => s + w.balanceUSD, 0);

  return (
    <DocChrome
      title="Daily treasury brief · 2026-05-28"
      primary={{ label: "File with morning ops", onClick: () => alert("Day-5 wires the file ceremony.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Internal · CFO desk · daily"
          title="Treasury daily brief"
          subtitle="2026-05-28 · 03:35 UTC · for CFO morning review"
        />

        <section className="pt-6 space-y-5 max-w-[700px]">
          <div>
            <Eyebrow>Headline</Eyebrow>
            <p className="text-[14px] text-ink leading-[24px] pt-1.5">
              Group treasury closed the overnight at <strong className="font-bold">{fmtUSD(total, { compact: true })}</strong> USD-equivalent — flat against
              yesterday. Cold custody (Anchorage) sits at <strong className="font-bold">91%</strong> utilisation
              and hot float is <strong className="font-bold">8% below target</strong>. Tonight's recommended
              rebalancing (<strong className="font-bold">$80M USDT</strong> Anchorage → Fireblocks) restores
              the float and brings cold utilisation back to <strong className="font-bold">87%</strong>.
            </p>
          </div>

          <div>
            <Eyebrow>Position snapshot</Eyebrow>
            <table className="text-[12px] leading-[18px] w-full mt-2">
              <tbody>
                <Row label="Crypto (Fireblocks · hot + warm)" value={fmtUSD(custody.fireblocks, { compact: true })} share={`${((custody.fireblocks / total) * 100).toFixed(1)}%`} />
                <Row label="Crypto (Anchorage · cold)" value={fmtUSD(custody.anchorage, { compact: true })} share={`${((custody.anchorage / total) * 100).toFixed(1)}%`} />
                <Row label="Fiat (banks, 7 jurisdictions)" value={fmtUSD(banks, { compact: true })} share={`${((banks / total) * 100).toFixed(1)}%`} />
                <Row label="Hot wallet float" value={fmtUSD(hotFloat, { compact: true })} share={`vs $36M target`} flag />
              </tbody>
            </table>
          </div>

          <div>
            <Eyebrow>Notable movements (last 24h)</Eyebrow>
            <ul className="text-[14px] text-ink leading-[24px] pt-1.5 list-disc pl-5 space-y-0.5">
              <li>{fmtUSD(42_000_000)} OTC settlement to a new whitelist address (Northstar onboarding) — see anomaly brief.</li>
              <li>{fmtUSD(18_400_000)} OTC inflow from Northstar Capital (USD via JPM).</li>
              <li>{fmtUSD(12_280_000)} OTC inflow from Aurora Trading (SGD via DBS).</li>
              <li>Net customer flow positive {fmtUSD(8_700_000)}; net hedging flow {fmtUSD(-4_200_000)}.</li>
            </ul>
          </div>

          <div>
            <Eyebrow>Anomalies pending acknowledgement</Eyebrow>
            <ul className="text-[14px] text-ink leading-[24px] pt-1.5 space-y-1.5">
              {ANOMALIES.map((a) => (
                <li key={a.id} className="border-l-2 border-mark-red pl-3">
                  <strong className="font-bold">{a.title}</strong> · {a.walletOrBank}
                  {a.amountUSD && <span> · {fmtUSD(a.amountUSD)}</span>}
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-mute italic pt-2">
              Single ack recommended — both events trace to one Northstar prime settlement.
            </p>
          </div>

          <div>
            <Eyebrow>Sign-off</Eyebrow>
            <p className="text-[14px] text-ink leading-[24px] pt-1.5">
              Filing today's brief with two requested approvals: (1) the rebalancing plan, (2) the anomaly
              ack. Both routed through the step-7 ceremony for auditability.
            </p>
          </div>

          <div className="pt-2 text-[12px] text-mute italic">
            Drafted by AI · reviewed by Wei Chen · circulated to Treasury team + CFO morning review at 04:00 UTC.
          </div>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Treasury daily brief · 2026-05-28 03:35"
          generatedAt="2026-05-28 03:35"
          notes="240 words · 4 sections. Sources: wallet balance sheet, bank account summary, anomaly brief, rebalancing plan."
        />
        <CrossLinks
          links={[
            { id: "wallet-balance-sheet", label: "Wallet balance sheet" },
            { id: "bank-account-summary", label: "Bank account summary" },
            { id: "transaction-ledger-24h", label: "Transaction ledger · 24h" },
            { id: "anomaly-brief", label: "Anomaly brief" },
            { id: "rebalancing-plan", label: "Rebalancing plan" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function Row({ label, value, share, flag }: { label: string; value: string; share: string; flag?: boolean }) {
  return (
    <tr className="border-b border-divider/60">
      <td className="py-1.5 text-ink">{label}</td>
      <td className="py-1.5 text-right tabular-nums text-ink font-medium">{value}</td>
      <td className={`py-1.5 text-right text-[11px] ${flag ? "text-mark-red font-bold" : "text-mute"}`}>{share}</td>
    </tr>
  );
}
