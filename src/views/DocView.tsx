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
import { WalletBalanceSheet } from "@/components/docs/treasury/WalletBalanceSheet";
import { BankAccountSummary } from "@/components/docs/treasury/BankAccountSummary";
import { TransactionLedger24h } from "@/components/docs/treasury/TransactionLedger24h";
import { AnomalyBrief } from "@/components/docs/treasury/AnomalyBrief";
import { RebalancingPlan } from "@/components/docs/treasury/RebalancingPlan";
import { DailyTreasuryBrief } from "@/components/docs/treasury/DailyTreasuryBrief";
import { BusinessLinePnL } from "@/components/docs/bp/BusinessLinePnL";
import { RevenueWaterfall } from "@/components/docs/bp/RevenueWaterfall";
import { CostBreakdownByLine } from "@/components/docs/bp/CostBreakdownByLine";
import { ScenarioAnalysisTable } from "@/components/docs/bp/ScenarioAnalysisTable";
import { SynergyOpportunityMap } from "@/components/docs/bp/SynergyOpportunityMap";
import { BPStrategicMemo } from "@/components/docs/bp/BPStrategicMemo";
import { BPBoardDeck } from "@/components/docs/bp/BPBoardDeck";

/**
 * Dispatcher — maps DocId → hand-built doc component. Docs not yet
 * built for Day 2 (journal entries, variance memo, board report, audit
 * trail; all 13 treasury + bp docs) fall through to a friendly stub.
 */
export function DocView({ id }: { id: DocId }) {
  return renderDoc(id);
}

export function renderDoc(id: DocId) {
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
    case "wallet-balance-sheet":
      return <WalletBalanceSheet />;
    case "bank-account-summary":
      return <BankAccountSummary />;
    case "transaction-ledger-24h":
      return <TransactionLedger24h />;
    case "anomaly-brief":
      return <AnomalyBrief />;
    case "rebalancing-plan":
      return <RebalancingPlan />;
    case "daily-treasury-brief":
      return <DailyTreasuryBrief />;
    case "business-line-pnl":
      return <BusinessLinePnL />;
    case "revenue-waterfall":
      return <RevenueWaterfall />;
    case "cost-breakdown":
      return <CostBreakdownByLine />;
    case "scenario-analysis":
      return <ScenarioAnalysisTable />;
    case "synergy-map":
      return <SynergyOpportunityMap />;
    case "bp-strategic-memo":
      return <BPStrategicMemo />;
    case "bp-board-deck":
      return <BPBoardDeck />;
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

const COMING_DAY: Partial<Record<DocId, string>> = {};

function prettify(id: string) {
  return id
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
