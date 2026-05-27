import { useState } from "react";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { PillButton } from "@/components/blocks/PillButton";
import { cn } from "@/lib/utils";

/**
 * Journal Entry Proposals — 4 adjusting entries drafted by AI for May
 * 2026 close. Each entry shows Dr/Cr balance, cost-centre mapping,
 * policy citation, AI rationale, and per-entry Approve / Edit / Reject
 * pills. Sum at bottom enforces Dr/Cr tie-out.
 */

type Line = { side: "Dr" | "Cr"; account: string; name: string; amount: number };
type Entry = {
  id: string;
  title: string;
  effectiveDate: string;
  costCenter: string;
  policy: string;
  rationale: string;
  lines: Line[];
};

const ENTRIES: Entry[] = [
  {
    id: "JE-0429",
    title: "Accrue May funding-rate revenue (Perpetuals)",
    effectiveDate: "2026-05-31",
    costCenter: "CC-2000 · Derivatives BU",
    policy: "ACCT-POL-2026-04 §3.2 · Revenue recognition · settlement-cycle accruals",
    rationale:
      "May 31 EOD funding cycle settled 2026-06-01 04:00 UTC. Per policy §3.2 accrual recognised in May. AI matched 21 daily cycles to settlement registry; tie-out variance < 0.01% accepted.",
    lines: [
      { side: "Dr", account: "1230", name: "Funding rate receivable", amount: 2_321_400 },
      { side: "Cr", account: "4020", name: "Funding rate revenue (Perpetuals)", amount: 2_321_400 },
    ],
  },
  {
    id: "JE-0430",
    title: "Liquidation engine cost · settlement gas reclass",
    effectiveDate: "2026-05-31",
    costCenter: "CC-2000 → CC-3200 · Wallet & custody (50%)",
    policy: "ACCT-POL-2026-02 §1.7 · Cross-BU cost attribution",
    rationale:
      "50% of May liquidation engine gas spend belongs to Wallet & custody runtime infra per the 2026 cost-attribution memo. AI tagged $425.6K of $851.2K total for reclass. Variance memo cites the +18% MoM driver here.",
    lines: [
      { side: "Dr", account: "5010", name: "Hot-wallet sweep & gas (CC-3200)", amount: 425_606 },
      { side: "Cr", account: "5000", name: "Liquidation engine operational cost (CC-2000)", amount: 425_606 },
    ],
  },
  {
    id: "JE-0431",
    title: "Insurance fund top-up (Perpetuals)",
    effectiveDate: "2026-05-31",
    costCenter: "CC-2000 · Derivatives BU",
    policy: "ACCT-POL-2026-04 §5.1 · Insurance fund replenishment policy",
    rationale:
      "Auto-deleveraging contribution net of insurance-fund draw on May 14 cascade required a $210.5K top-up to keep coverage ratio ≥ 1.5×. AI cross-checked the on-chain receipt against treasury's confirmation; matched.",
    lines: [
      { side: "Dr", account: "5020", name: "Insurance fund top-up", amount: 210_500 },
      { side: "Cr", account: "1110", name: "Operating cash (Fireblocks · USD)", amount: 210_500 },
    ],
  },
  {
    id: "JE-0432",
    title: "Marketing & growth · listing campaign deferral",
    effectiveDate: "2026-05-31",
    costCenter: "CC-6000 · Marketing",
    policy: "ACCT-POL-2026-01 §2.4 · Period-cost deferral on incomplete campaigns",
    rationale:
      "Listing campaign for token X was paused on May 18 pending revised exchange ToS; $259.5K of pre-paid spend deferred to Q3 per policy §2.4. AI flagged the campaign-pause memo as supporting evidence.",
    lines: [
      { side: "Dr", account: "1820", name: "Prepaid marketing", amount: 259_500 },
      { side: "Cr", account: "5200", name: "Marketing & growth", amount: 259_500 },
    ],
  },
];

type Decision = "pending" | "approved" | "edit" | "rejected";

export function JournalEntryProposal() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const set = (id: string, d: Decision) => setDecisions((s) => ({ ...s, [id]: d }));

  const totalDr = ENTRIES.reduce((s, e) => s + e.lines.filter((l) => l.side === "Dr").reduce((x, l) => x + l.amount, 0), 0);
  const totalCr = ENTRIES.reduce((s, e) => s + e.lines.filter((l) => l.side === "Cr").reduce((x, l) => x + l.amount, 0), 0);
  const approved = ENTRIES.filter((e) => decisions[e.id] === "approved").length;

  return (
    <DocChrome
      title="Journal entry proposals"
      primary={{
        label: approved === ENTRIES.length ? "Post all to Oracle" : `Approve remaining (${ENTRIES.length - approved})`,
        onClick: () =>
          setDecisions(Object.fromEntries(ENTRIES.map((e) => [e.id, "approved" as Decision]))),
      }}
      secondary={{ label: "Export memo PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="May 2026 · Adjusting entries"
          title="Journal entry proposals"
          subtitle="Four AI-drafted adjustments. Approve to post to Oracle; reject to send back to the agent with notes."
        />

        <StatRow
          items={[
            { label: "Entries", value: String(ENTRIES.length) },
            { label: "Total Dr", value: fmtUSD(totalDr, { compact: true }) },
            { label: "Total Cr", value: fmtUSD(totalCr, { compact: true }) },
            { label: "Tie-out", value: totalDr === totalCr ? "Balanced" : "OFF", tone: totalDr === totalCr ? "ok" : "warn" },
          ]}
        />

        <section className="space-y-4 pt-6">
          {ENTRIES.map((e) => (
            <EntryCard key={e.id} entry={e} decision={decisions[e.id] ?? "pending"} setDecision={(d) => set(e.id, d)} />
          ))}
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="AI-drafted · cited policies linked per entry"
          generatedAt="2026-05-28 08:19"
          notes="Cross-checked against Oracle Cloud GL chart of accounts · all entries tie out individually and in aggregate."
        />
        <CrossLinks
          links={[
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "variance-memo", label: "Variance commentary memo" },
            { id: "board-financial-report", label: "Board financial report" },
            { id: "close-audit-trail", label: "Close audit trail" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function EntryCard({
  entry,
  decision,
  setDecision,
}: {
  entry: Entry;
  decision: Decision;
  setDecision: (d: Decision) => void;
}) {
  const drTotal = entry.lines.filter((l) => l.side === "Dr").reduce((x, l) => x + l.amount, 0);
  const crTotal = entry.lines.filter((l) => l.side === "Cr").reduce((x, l) => x + l.amount, 0);
  const balanced = drTotal === crTotal;

  return (
    <article
      className={cn(
        "border rounded-md bg-white overflow-hidden",
        decision === "approved" ? "border-surface-deep" : decision === "rejected" ? "border-mark-red" : "border-divider",
      )}
    >
      <header
        className={cn(
          "px-5 py-4 flex items-start justify-between gap-4",
          decision === "approved" ? "bg-surface-mint/40" : decision === "rejected" ? "bg-surface-rose" : "bg-surface-fog/60",
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-1">
            <span className="font-mono text-ink">{entry.id}</span>
            <span>·</span>
            <span>Effective {entry.effectiveDate}</span>
            <span>·</span>
            <span>{entry.costCenter}</span>
          </div>
          <h3 className="text-[18px] font-bold text-ink tracking-[-0.01em]">{entry.title}</h3>
        </div>
        <DecisionBadge decision={decision} />
      </header>

      <div className="px-5 py-4 border-t border-divider">
        <table className="w-full text-[12px] leading-[18px]">
          <thead className="text-mute text-[10px] tracking-[0.08em] uppercase">
            <tr>
              <th className="text-left w-12">Side</th>
              <th className="text-left w-20">Acct</th>
              <th className="text-left">Account name</th>
              <th className="text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {entry.lines.map((l, i) => (
              <tr key={i} className="border-t border-divider/60">
                <td className="py-1.5 font-bold text-ink">{l.side}</td>
                <td className="py-1.5 font-mono text-mute">{l.account}</td>
                <td className="py-1.5 text-ink">{l.name}</td>
                <td className="py-1.5 text-right tabular-nums text-ink">{fmtUSD(l.amount)}</td>
              </tr>
            ))}
            <tr className="border-t border-ink/30 font-bold">
              <td colSpan={2} className="py-1.5"></td>
              <td className="py-1.5 text-mute uppercase text-[10px] tracking-[0.08em]">
                Dr / Cr · {balanced ? "balanced" : "MISMATCH"}
              </td>
              <td className="py-1.5 text-right tabular-nums text-ink">
                {fmtUSD(drTotal)} / {fmtUSD(crTotal)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="pt-3 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
          <div className="space-y-2">
            <Eyebrow>Policy citation</Eyebrow>
            <p className="text-[12px] text-ink leading-[18px]">{entry.policy}</p>
            <Eyebrow>AI rationale</Eyebrow>
            <p className="text-[12px] text-ink leading-[18px]">{entry.rationale}</p>
          </div>
          <div className="flex md:flex-col gap-2">
            <PillButton
              variant={decision === "approved" ? "deep" : "primary"}
              size="sm"
              onClick={() => setDecision("approved")}
            >
              {decision === "approved" ? "✓ Approved" : "Approve"}
            </PillButton>
            <PillButton variant="secondary" size="sm" onClick={() => setDecision("edit")}>
              Edit
            </PillButton>
            <PillButton variant="ghost" size="sm" onClick={() => setDecision("rejected")}>
              {decision === "rejected" ? "✗ Rejected" : "Reject"}
            </PillButton>
          </div>
        </div>
      </div>
    </article>
  );
}

function DecisionBadge({ decision }: { decision: Decision }) {
  if (decision === "pending") {
    return (
      <span className="text-[10px] tracking-[0.08em] uppercase font-bold px-2 py-1 rounded-full bg-white text-mute border border-divider whitespace-nowrap">
        Awaiting review
      </span>
    );
  }
  const tone =
    decision === "approved"
      ? "bg-surface-deep text-ink-inverse"
      : decision === "rejected"
        ? "bg-mark-red text-ink-inverse"
        : "bg-surface-mint text-surface-deep";
  return (
    <span className={cn("text-[10px] tracking-[0.08em] uppercase font-bold px-2 py-1 rounded-full whitespace-nowrap", tone)}>
      {decision === "approved" ? "Approved" : decision === "rejected" ? "Rejected" : "Edit requested"}
    </span>
  );
}
