/**
 * Crypton Finance — per-flow scripted scenarios.
 * Source of truth for the timeline (step titles, actor, detail, time) and
 * the AgentLiveStrip per-step `liveScripts`.
 *
 * Three flows, each ~7-8 steps. See the plan §6/§7/§8 for the narrative.
 */

import type { FlowId, DocId } from "@/state";

export type Actor = "Agent" | "CFO" | "Treasury" | "Auditor";

export type FlowStep = {
  /** Short title shown on the timeline node. */
  title: string;
  actor: Actor;
  /** Body shown under the title on the timeline node. */
  detail: string;
  /** Mock timestamp shown on the right of the timeline node. */
  time: string;
  /** AgentLiveStrip lines that play while this step is active. */
  liveScripts?: string[];
  /** Doc IDs revealed as chips when this step completes. */
  docs?: DocId[];
};

export type FlowDef = {
  id: FlowId;
  /** Card/Workspace eyebrow. */
  eyebrow: string;
  /** Workspace H1. */
  title: string;
  /** Card sub-line on the hub. */
  hubSub: string;
  /** Hub card detail line ("1 strategic recommendation flagged" etc.). */
  hubDetail: string;
  /** Workspace status pill. */
  statusPill: string;
  steps: FlowStep[];
};

// ─────────────────────────────────────────────────────────────────────────
// Flow A — Accounting (Oracle close cycle)
// ─────────────────────────────────────────────────────────────────────────

export const accountingFlow: FlowDef = {
  id: "accounting",
  eyebrow: "Month-end close",
  title: "Close Q2 books · Oracle GL",
  hubSub: "Oracle GL extract arrived 14 minutes ago",
  hubDetail: "247 journal lines · 4 variance flags · ready for review",
  statusPill: "AI prepared · awaiting your approval",
  steps: [
    {
      title: "Ingest Oracle GL extract",
      actor: "Agent",
      detail:
        "Drop a month-end GL export to start the close. AI parses the workbook locally and reads every sheet.",
      time: "08:14",
      liveScripts: [
        "Waiting for the month-end GL export",
        "We'll parse it locally · nothing leaves the browser",
        "Drop a file or use the seeded May extract",
      ],
      docs: ["oracle-gl-extract"],
    },
    {
      title: "Reconcile to last period",
      actor: "Agent",
      detail:
        "Matched against May trial balance · 91% line-level match · 12 cost-centre variances > 5%.",
      time: "08:15",
      liveScripts: [
        "Reading {filename} · {rows} rows across {sheets} sheets",
        "Matching against May TB · 91% line-level match",
        "Variance > 5% flagged on 12 cost centres",
        "Liquidation engine cost +18% MoM — investigating",
      ],
      docs: ["trial-balance-recon"],
    },
    {
      title: "AP aging review",
      actor: "Agent",
      detail:
        "247 vendor invoices · $24.7M open · 37 invoices > 60 days · AWS / Fireblocks / Chainalysis top 3.",
      time: "08:16",
      liveScripts: [
        "247 vendor invoices · $24.7M open",
        "37 invoices > 60d aging",
        "AWS · Fireblocks · Chainalysis: 3 largest",
      ],
      docs: ["ap-aging"],
    },
    {
      title: "AR aging review",
      actor: "Agent",
      detail:
        "Institutional client receivables · $12.4M open · 2 OTC clients > 30 days past due.",
      time: "08:17",
      liveScripts: [
        "Institutional client receivables · $12.4M open",
        "2 OTC clients > 30d past due",
        "Suggested collection action: Tier 1 reminder",
      ],
      docs: ["ar-aging"],
    },
    {
      title: "Journal entry proposals",
      actor: "Agent",
      detail:
        "4 adjusting entries drafted with policy citations and AI rationale per line.",
      time: "08:19",
      liveScripts: [
        "4 adjusting entries drafted",
        "JE-0429 · accrue funding rate revenue ($2.3M)",
        "Each entry annotated with policy citation",
      ],
      docs: ["journal-entry-proposal"],
    },
    {
      title: "Variance commentary draft",
      actor: "Agent",
      detail:
        "Drafted 380-word executive memo: derivatives margin compression, FY-Q1 board guidance context.",
      time: "08:21",
      liveScripts: [
        "Drafting executive variance memo · 380 words",
        "Highlighting derivatives margin compression",
        "Quoting Q1 board guidance for context",
      ],
      docs: ["variance-memo"],
    },
    {
      title: "Financial report assembly",
      actor: "Agent",
      detail:
        "14-page board report assembled · embeds YoY revenue, cost trend, cash bridge.",
      time: "08:24",
      liveScripts: [
        "Assembling 14-page board report PDF",
        "Embedding YoY revenue · cost trend · cash bridge",
        "Reviewer signatures: CFO + Audit Committee chair",
      ],
      docs: ["board-financial-report", "close-audit-trail"],
    },
    {
      title: "Approve & export",
      actor: "CFO",
      detail:
        "Sign off the entries, memo, and report. Artifacts route to Oracle + email + sharepoint.",
      time: "—",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Flow B — Treasury (cash flow + transaction automation)
// ─────────────────────────────────────────────────────────────────────────

export const treasuryFlow: FlowDef = {
  id: "treasury",
  eyebrow: "Daily treasury",
  title: "Treasury daily brief",
  hubSub: "Last sync 03:22 · all custody venues green",
  hubDetail: "23 wallets + 7 banks reconciled · 2 anomalies · 1 rebalancing",
  statusPill: "Anomalies pending acknowledgement",
  steps: [
    {
      title: "Pull balances",
      actor: "Agent",
      detail:
        "Synced 23 wallets (Fireblocks hot + Anchorage cold) and 7 bank accounts across 7 jurisdictions.",
      time: "03:22",
      liveScripts: [
        "Fireblocks · 14 hot wallets · last sync 03:22",
        "Anchorage cold custody · 9 wallets · last sync 02:48",
        "7 bank balances via Plaid / SWIFT",
      ],
      docs: ["wallet-balance-sheet", "bank-account-summary"],
    },
    {
      title: "Classify transactions (24h)",
      actor: "Agent",
      detail:
        "1,247 transactions auto-categorised across Operational / Customer / Hedging / Inter-co / Other.",
      time: "03:25",
      liveScripts: [
        "1,247 transactions · 94% auto-classified",
        "Operational · Customer · Hedging · Inter-co · Other",
        "73 transactions need human review",
      ],
      docs: ["transaction-ledger-24h"],
    },
    {
      title: "Anomaly detection",
      actor: "Agent",
      detail:
        "2 anomalies surfaced: large transfer to new whitelist address; off-hours wallet activity.",
      time: "03:28",
      liveScripts: [
        "2 anomalies surfaced",
        "Large transfer to new whitelist address · $42M USDT",
        "Off-hours wallet activity · Tue 03:17 SGT · Hot-04",
      ],
      docs: ["anomaly-brief"],
    },
    {
      title: "Liquidity position",
      actor: "Agent",
      detail:
        "Operating runway 47 months · hot-wallet float -8% vs target · cold custody 91% utilised.",
      time: "03:30",
      liveScripts: [
        "Operating runway: 47 months at current burn",
        "Hot wallet float vs target: -8% (light)",
        "Cold custody utilization: 91%",
      ],
    },
    {
      title: "Rebalancing proposal",
      actor: "Agent",
      detail:
        "Recommend moving $80M USDT from Anchorage to Fireblocks for OTC settlement; travel-rule passed.",
      time: "03:32",
      liveScripts: [
        "Recommending: move $80M USDT · Anchorage → Fireblocks",
        "Reduces cold custody utilization to 86%",
        "Travel rule + threshold checks passed",
      ],
      docs: ["rebalancing-plan"],
    },
    {
      title: "Daily treasury brief draft",
      actor: "Agent",
      detail:
        "240-word CFO brief drafted · embeds cash position table + 30-day trend + flagged anomalies.",
      time: "03:35",
      liveScripts: [
        "Drafting 1-page CFO brief · 240 words",
        "Embedding cash position table + 30d trend",
        "Flagging the 2 anomalies for ack",
      ],
      docs: ["daily-treasury-brief"],
    },
    {
      title: "Approve & file",
      actor: "CFO",
      detail:
        "Approve rebalancing · ack anomalies · file brief.",
      time: "—",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Flow C — Business Partner (4 business lines)
// ─────────────────────────────────────────────────────────────────────────

export const bpFlow: FlowDef = {
  id: "bp",
  eyebrow: "Quarterly BP review",
  title: "Q2 business-line review",
  hubSub: "Q2 BP packet drafted · 1 strategic ask flagged",
  hubDetail: "4 business lines · revenue $384M · net $237M",
  statusPill: "EXCO memo + board deck ready",
  steps: [
    {
      title: "Ingest business-line data",
      actor: "Agent",
      detail:
        "Loaded Q2 business-line packet · 4 lines · 3 months · revenue $384M / OpEx $147M / net $237M.",
      time: "Q2-W12",
      liveScripts: [
        "Loading Q2 business-line packet · 4 lines · 3 months",
        "Derivatives · Spot · Institutional · Legal/Compliance",
        "Revenue $384M · OpEx $147M · Net $237M",
      ],
      docs: ["business-line-pnl"],
    },
    {
      title: "Unit economics computation",
      actor: "Agent",
      detail:
        "Decomposed each line into its real unit economics. Derivatives margin compressed; Spot listing pipeline ROI 4.2x.",
      time: "Q2-W12",
      liveScripts: [
        "Derivatives: funding rate $89M + liquidation engine PnL $34M + MM net $52M",
        "Spot: maker-taker mix 31/69 · listing pipeline ROI 4.2x",
        "Institutional: RFQ spread net $41M · PB interest $7M",
      ],
      docs: ["revenue-waterfall", "cost-breakdown"],
    },
    {
      title: "Scenario analysis",
      actor: "Agent",
      detail:
        "Modelled 6 scenarios over 4 drivers. Perp-volume sensitivity dominates.",
      time: "Q2-W12",
      liveScripts: [
        "Modeling: -30% perp volume · effect $-41M net",
        "Modeling: +50 institutional onboards · effect $+18M annualized",
        "Sensitivity tornado: 6 drivers",
      ],
      docs: ["scenario-analysis"],
    },
    {
      title: "Cross-line synergy detection",
      actor: "Agent",
      detail:
        "Identified 2 cross-line revenue couplings; 1 strategic recommendation surfaced for EXCO.",
      time: "Q2-W12",
      liveScripts: [
        "Spot maker liquidity → derivatives MM rebate uplift · est $4.2M/q",
        "Institutional onboards → spot taker volume + 7%",
        "1 strategic recommendation flagged",
      ],
      docs: ["synergy-map"],
    },
    {
      title: "Strategic memo draft",
      actor: "Agent",
      detail:
        "Drafted 720-word EXCO memo with recommendation, supporting data, and risk callouts.",
      time: "Q2-W12",
      liveScripts: [
        "Drafting EXCO memo · 720 words",
        "Recommending Q3 institutional sales budget +$2M",
        "Citing 3 supporting datapoints + 1 risk",
      ],
      docs: ["bp-strategic-memo"],
    },
    {
      title: "Board deck assembly",
      actor: "Agent",
      detail:
        "Assembled 18-slide deck with cover, per-line P&L, scenario tornado, recommendation, appendix.",
      time: "Q2-W12",
      liveScripts: [
        "Assembling 18-slide board deck",
        "Per-line P&L slides · sensitivity tornado · recommendation",
        "Cover + appendix auto-generated",
      ],
      docs: ["bp-board-deck"],
    },
    {
      title: "Approve & route",
      actor: "CFO",
      detail:
        "Approve memo and deck · route to EXCO (CEO · COO · 2 Independent Directors).",
      time: "—",
    },
  ],
};

export const FLOWS: Record<FlowId, FlowDef> = {
  accounting: accountingFlow,
  treasury: treasuryFlow,
  bp: bpFlow,
};
