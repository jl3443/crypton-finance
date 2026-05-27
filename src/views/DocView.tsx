import { useApp, type DocId } from "@/state";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance } from "@/components/docs/shared";
import { OracleGLExtract } from "@/components/docs/accounting/OracleGLExtract";
import { TrialBalanceRecon } from "@/components/docs/accounting/TrialBalanceRecon";
import { APAgingReport } from "@/components/docs/accounting/APAgingReport";
import { ARAgingReport } from "@/components/docs/accounting/ARAgingReport";
import { JournalEntryProposal } from "@/components/docs/accounting/JournalEntryProposal";
import { VarianceCommentaryMemo } from "@/components/docs/accounting/VarianceCommentaryMemo";
import { BoardFinancialReport } from "@/components/docs/accounting/BoardFinancialReport";
import { CloseAuditTrail } from "@/components/docs/accounting/CloseAuditTrail";

/**
 * Dispatcher — maps DocId → hand-built doc component. Docs not yet
 * built for Day 2 (journal entries, variance memo, board report, audit
 * trail; all 13 treasury + bp docs) fall through to a friendly stub.
 */
export function DocView({ id }: { id: DocId }) {
  switch (id) {
    case "oracle-gl-extract":
      return <OracleGLExtract />;
    case "trial-balance-recon":
      return <TrialBalanceRecon />;
    case "ap-aging":
      return <APAgingReport />;
    case "ar-aging":
      return <ARAgingReport />;
    case "journal-entry-proposal":
      return <JournalEntryProposal />;
    case "variance-memo":
      return <VarianceCommentaryMemo />;
    case "board-financial-report":
      return <BoardFinancialReport />;
    case "close-audit-trail":
      return <CloseAuditTrail />;
    default:
      return <ComingSoon id={id} />;
  }
}

function ComingSoon({ id }: { id: DocId }) {
  const { back } = useApp();
  const day = COMING_DAY[id] ?? "soon";
  return (
    <DocChrome title={`Document · ${id}`} secondary={{ label: "Back", onClick: back }}>
      <Paper>
        <DocHeader
          eyebrow="Building schedule"
          title={prettify(id)}
          subtitle={`This document ships on ${day}. See the project plan §6/§7/§8 for the full inventory.`}
        />
        <p className="text-[14px] text-mute leading-[24px] pt-4">
          Day-1 placeholder is intentional — the workspace flow is the source of truth for sequencing.
          Once we wire the underlying analysis (journal entries proposals, variance commentary, board
          report assembly, audit trail, etc.) the chip lands on this URL with the real content.
        </p>
      </Paper>
      <SideRail>
        <Provenance
          source="Plan reference"
          generatedAt={new Date().toISOString().slice(0, 16).replace("T", " ")}
          auditId="—"
          notes="Inventory tracked in docs/superpowers/specs/2026-05-27-crypton-finance.md (§6 / §7 / §8)."
        />
      </SideRail>
    </DocChrome>
  );
}

const COMING_DAY: Partial<Record<DocId, string>> = {
  "wallet-balance-sheet": "Day 4",
  "bank-account-summary": "Day 4",
  "transaction-ledger-24h": "Day 4",
  "anomaly-brief": "Day 4",
  "rebalancing-plan": "Day 4",
  "daily-treasury-brief": "Day 4",
  "business-line-pnl": "Day 5",
  "revenue-waterfall": "Day 5",
  "cost-breakdown": "Day 5",
  "scenario-analysis": "Day 5",
  "synergy-map": "Day 5",
  "bp-strategic-memo": "Day 5",
  "bp-board-deck": "Day 5",
};

function prettify(id: string) {
  return id
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
