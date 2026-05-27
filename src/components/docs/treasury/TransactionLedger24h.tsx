import { useState, useMemo } from "react";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, fmtUSD } from "@/components/docs/shared";
import { cn } from "@/lib/utils";

/**
 * Transaction ledger · 24h — scrollable list with category filter pills.
 * 1247 conceptual rows; 60 surfaced here as a representative slice
 * (top by amount + 2 anomalies pinned at top).
 */

type Category = "Operational" | "Customer flow" | "Hedging" | "Inter-co" | "Other";
type Row = {
  ts: string;
  counterparty: string;
  category: Category;
  amountUSD: number;
  direction: "in" | "out";
  wallet: string;
  classifiedBy: "AI auto" | "Human review";
  anomaly?: string;
};

const CATEGORIES: Category[] = ["Operational", "Customer flow", "Hedging", "Inter-co", "Other"];

const ROWS: Row[] = [
  { ts: "03:17:42", counterparty: "0xNEWa…3c2f1 (whitelist · new)", category: "Customer flow", amountUSD: 42_000_000, direction: "out", wallet: "ETH-Hot-02", classifiedBy: "Human review", anomaly: "Large transfer to new whitelist" },
  { ts: "03:17:09", counterparty: "Hot-04 off-hours egress", category: "Other", amountUSD: 280_000, direction: "out", wallet: "ETH-Hot-02", classifiedBy: "Human review", anomaly: "Off-hours wallet activity" },
  { ts: "02:48:11", counterparty: "Northstar Capital OTC", category: "Customer flow", amountUSD: 18_400_000, direction: "in", wallet: "JPM-USD", classifiedBy: "AI auto" },
  { ts: "02:31:55", counterparty: "Aurora Trading OTC", category: "Customer flow", amountUSD: 12_280_000, direction: "in", wallet: "DBS-SGD", classifiedBy: "AI auto" },
  { ts: "02:18:04", counterparty: "User-withdrawal batch · BTC", category: "Customer flow", amountUSD: 8_400_000, direction: "out", wallet: "BTC-Hot-01", classifiedBy: "AI auto" },
  { ts: "01:55:21", counterparty: "Settlement sweep · cold-warm", category: "Operational", amountUSD: 6_200_000, direction: "in", wallet: "ETH-Warm-01", classifiedBy: "AI auto" },
  { ts: "01:42:33", counterparty: "Fireblocks API · MM rebate", category: "Operational", amountUSD: 1_840_000, direction: "in", wallet: "ETH-Hot-01", classifiedBy: "AI auto" },
  { ts: "01:21:09", counterparty: "Inter-co · Group SG", category: "Inter-co", amountUSD: 4_120_000, direction: "out", wallet: "JPM-USD", classifiedBy: "AI auto" },
  { ts: "00:58:42", counterparty: "Hedging desk · BTC short cover", category: "Hedging", amountUSD: 2_400_000, direction: "out", wallet: "BTC-Hot-01", classifiedBy: "AI auto" },
  { ts: "00:42:18", counterparty: "User-deposit batch · USDT (Tron)", category: "Customer flow", amountUSD: 14_200_000, direction: "in", wallet: "TRX-Hot-01", classifiedBy: "AI auto" },
  { ts: "00:21:55", counterparty: "Meridian Quant OTC", category: "Customer flow", amountUSD: 5_840_000, direction: "out", wallet: "BTC-Hot-01", classifiedBy: "AI auto" },
  { ts: "00:11:03", counterparty: "AWS billing", category: "Operational", amountUSD: 487_220, direction: "out", wallet: "JPM-USD", classifiedBy: "AI auto" },
  { ts: "23:44:21", counterparty: "Chainalysis billing", category: "Operational", amountUSD: 168_900, direction: "out", wallet: "JPM-USD", classifiedBy: "AI auto" },
  { ts: "23:18:09", counterparty: "User-withdrawal batch · ETH", category: "Customer flow", amountUSD: 6_400_000, direction: "out", wallet: "ETH-Hot-01", classifiedBy: "AI auto" },
  { ts: "22:55:42", counterparty: "Hedging desk · ETH delta hedge", category: "Hedging", amountUSD: 3_120_000, direction: "out", wallet: "ETH-Hot-02", classifiedBy: "AI auto" },
  { ts: "22:31:18", counterparty: "Inter-co · Group CH (CHF top-up)", category: "Inter-co", amountUSD: 1_840_000, direction: "out", wallet: "Sygnum-CHF", classifiedBy: "AI auto" },
];

const CAT_TONE: Record<Category, string> = {
  Operational: "bg-surface-fog text-ink border border-divider",
  "Customer flow": "bg-surface-deep text-ink-inverse",
  Hedging: "bg-surface-mint text-surface-deep border border-surface-deep/30",
  "Inter-co": "bg-accent-green/20 text-surface-deep border border-surface-deep/30",
  Other: "bg-surface-rose text-mark-red border border-mark-red/40",
};

export function TransactionLedger24h() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const filtered = useMemo(() => (filter === "All" ? ROWS : ROWS.filter((r) => r.category === filter)), [filter]);

  const totalIn = ROWS.filter((r) => r.direction === "in").reduce((s, r) => s + r.amountUSD, 0);
  const totalOut = ROWS.filter((r) => r.direction === "out").reduce((s, r) => s + r.amountUSD, 0);
  const aiClassified = (ROWS.filter((r) => r.classifiedBy === "AI auto").length / ROWS.length);

  return (
    <DocChrome
      title="Transaction ledger · 24h"
      primary={{ label: "Approve classifications", onClick: () => alert("Day-5 wires approval.") }}
      secondary={{ label: "Export CSV", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="2026-05-27 03:30 → 2026-05-28 03:30 UTC"
          title="Transaction ledger · 24h"
          subtitle="1,247 transactions auto-classified. 16 shown below — sorted by amount with the 2 anomalies pinned top."
        />

        <StatRow
          items={[
            { label: "Transactions", value: "1,247" },
            { label: "Net (in − out)", value: fmtUSD(totalIn - totalOut, { compact: true }), tone: totalIn > totalOut ? "ok" : "warn" },
            { label: "AI-classified", value: `${(aiClassified * 100).toFixed(0)}%` },
            { label: "Anomalies", value: "2", tone: "warn" },
          ]}
        />

        <section className="pt-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] tracking-[0.08em] uppercase font-medium text-mute pr-2">Filter</span>
            <FilterPill label="All" active={filter === "All"} onClick={() => setFilter("All")} />
            {CATEGORIES.map((c) => (
              <FilterPill key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />
            ))}
          </div>
          <div className="mt-3 overflow-hidden rounded-md border border-divider">
            <table className="w-full text-[12px] leading-[18px]">
              <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
                <tr>
                  <th className="px-3 py-2 text-left w-20">UTC</th>
                  <th className="px-3 py-2 text-left">Counterparty</th>
                  <th className="px-3 py-2 text-left w-32">Category</th>
                  <th className="px-3 py-2 text-right w-32">Amount (USD)</th>
                  <th className="px-3 py-2 text-left w-12">Dir</th>
                  <th className="px-3 py-2 text-left w-32">Wallet / bank</th>
                  <th className="px-3 py-2 text-left w-28">Classified by</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-t border-divider/60 hover:bg-surface-mint/30",
                      r.anomaly && "bg-surface-rose/50",
                    )}
                  >
                    <td className="px-3 py-2 font-mono text-mute tabular-nums">{r.ts}</td>
                    <td className="px-3 py-2 text-ink">
                      {r.counterparty}
                      {r.anomaly && <span className="ml-1.5 text-[10px] tracking-[0.08em] uppercase font-bold text-mark-red">· {r.anomaly}</span>}
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-[0.04em] uppercase font-medium", CAT_TONE[r.category])}>
                        {r.category}
                      </span>
                    </td>
                    <td className={cn("px-3 py-2 text-right tabular-nums font-medium", r.direction === "out" ? "text-mark-red" : "text-[var(--ok)]")}>
                      {r.direction === "out" ? "−" : "+"}
                      {fmtUSD(r.amountUSD)}
                    </td>
                    <td className="px-3 py-2 font-bold text-mute uppercase text-[10px] tracking-[0.08em]">{r.direction}</td>
                    <td className="px-3 py-2 font-mono text-mute">{r.wallet}</td>
                    <td className={cn("px-3 py-2 text-[11px]", r.classifiedBy === "Human review" ? "text-mark-red font-medium" : "text-mute")}>
                      {r.classifiedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Fireblocks events stream + bank ACH/SWIFT feeds"
          generatedAt="2026-05-28 03:30"
          notes={`AI accuracy: ${(aiClassified * 100).toFixed(0)}% (95.4% lifetime).  73 transactions flagged for human review.`}
        />
        <CrossLinks
          links={[
            { id: "wallet-balance-sheet", label: "Wallet balance sheet" },
            { id: "bank-account-summary", label: "Bank account summary" },
            { id: "anomaly-brief", label: "Anomaly brief · 2 surfaced" },
            { id: "daily-treasury-brief", label: "Daily treasury brief" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "ui-pill px-3 py-1.5 text-[11px] font-medium rounded-full border",
        active
          ? "bg-surface-deep text-ink-inverse border-surface-deep"
          : "bg-white text-mute border-divider hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
