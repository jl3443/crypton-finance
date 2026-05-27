import { useEffect, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { useApp, type DocId, type FlowId } from "@/state";
import { PillButton } from "@/components/blocks/PillButton";
import { Eyebrow } from "@/components/docs/shared";

/**
 * ExportCeremony — final step of every flow. Starts in idle ("Approve & export").
 * On confirm: animates a 4-row drafting progress card (filling left→right,
 * 900ms per row, staggered). When all complete, reveals 4 artifact chips
 * each triggering a real Blob download.
 */

export type Artifact = {
  label: string;
  filename: string;
  /** Generator function — called when the user clicks the chip. */
  generate: () => Blob;
  /** Doc ID the chip links to (for jumping to the rendered doc). */
  docId?: DocId;
};

type Phase = "idle" | "running" | "done";

export type CeremonyCopy = {
  /** Eyebrow shown on idle state ("Final step · CFO sign-off"). */
  introEyebrow: string;
  /** Body paragraph on idle state. */
  introBlurb: string;
  /** Running-phase headline ("Routing approved entries · …"). */
  runningHeadline: string;
  /** Done-phase headline ("Close approved · routed to …"). */
  doneHeadline: string;
  /** Done-phase sub-line. */
  doneSubline: string;
};

export function ExportCeremony({
  flow,
  artifacts,
  copy,
}: {
  flow: FlowId;
  artifacts: Artifact[];
  copy: CeremonyCopy;
}) {
  const { recordApproval, setFlowProgress, flowProgress, go } = useApp();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState<number[]>(artifacts.map(() => 0));
  const currentStep = flowProgress[flow].activeStep;

  useEffect(() => {
    if (phase !== "running") return;
    const totalMs = 900;
    const startTimes = artifacts.map((_, i) => i * 220); // 220ms stagger
    const ids: number[] = [];
    artifacts.forEach((_, i) => {
      ids.push(
        window.setTimeout(() => {
          const startedAt = performance.now();
          const tick = () => {
            const elapsed = performance.now() - startedAt;
            const p = Math.min(1, elapsed / totalMs);
            setProgress((arr) => {
              const next = [...arr];
              next[i] = p;
              return next;
            });
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, startTimes[i]),
      );
    });
    const totalRun = (artifacts.length - 1) * 220 + totalMs + 200;
    ids.push(
      window.setTimeout(() => {
        recordApproval(flow, currentStep);
        setPhase("done");
      }, totalRun),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [phase, artifacts, currentStep, flow, recordApproval]);

  function handleApprove() {
    setPhase("running");
  }

  function handleDownload(a: Artifact) {
    const blob = a.generate();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = a.filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (phase === "idle") {
    return (
      <article className="bg-white border border-divider rounded-md p-8 ai-spring">
        <Eyebrow>{copy.introEyebrow}</Eyebrow>
        <h2 className="text-[28px] font-bold text-ink leading-[32px] tracking-[-0.01em] pt-2 mb-3">
          Approve & export
        </h2>
        <p className="text-[15px] text-ink leading-[24px] max-w-[680px] mb-5">{copy.introBlurb}</p>
        <div className="space-y-2 mb-6">
          {artifacts.map((a) => (
            <div key={a.label} className="flex items-center gap-3 text-[13px]">
              <span className="grid w-5 h-5 place-items-center rounded-full border border-divider text-mute">·</span>
              <span className="text-ink font-medium">{a.label}</span>
              <span className="text-mute font-mono text-[11px] ml-auto">{a.filename}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <PillButton variant="primary" arrow onClick={handleApprove}>
            Approve & export
          </PillButton>
          <span className="text-[11px] tracking-[0.08em] uppercase font-medium text-mute">
            Drafts route to Oracle / sharepoint / audit log on approval
          </span>
        </div>
      </article>
    );
  }

  if (phase === "running") {
    return (
      <article className="bg-white border border-divider rounded-md p-8 ai-spring">
        <Eyebrow>Drafting artifacts</Eyebrow>
        <h2 className="text-[24px] font-bold text-ink leading-[28px] tracking-[-0.01em] pt-2 mb-5">
          {copy.runningHeadline}
        </h2>
        <div className="space-y-3">
          {artifacts.map((a, i) => (
            <div key={a.label}>
              <div className="flex items-center gap-3 text-[13px] mb-1">
                <span className="text-ink font-medium">{a.label}</span>
                <span className="text-mute font-mono text-[11px] ml-auto">{a.filename}</span>
                <span className="text-mute tabular-nums w-12 text-right">{Math.round(progress[i] * 100)}%</span>
              </div>
              <div className="h-1.5 bg-divider/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-surface-deep transition-[width] duration-150 ease-out"
                  style={{ width: `${progress[i] * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  // phase === "done"
  return (
    <article className="bg-white border border-surface-deep rounded-md p-8 ai-spring">
      <div className="flex items-start gap-3">
        <span className="grid w-10 h-10 place-items-center rounded-full bg-surface-mint text-surface-deep">
          <CheckCircle2 size={20} />
        </span>
        <div>
          <Eyebrow>All artifacts ready</Eyebrow>
          <h2 className="text-[24px] font-bold text-ink leading-[28px] tracking-[-0.01em] pt-1">
            {copy.doneHeadline}
          </h2>
          <p className="text-[13px] text-mute leading-[20px] pt-1">{copy.doneSubline}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-6">
        {artifacts.map((a) => (
          <div
            key={a.label}
            className="flex items-center gap-3 px-4 py-3 rounded-md border border-divider bg-surface-fog hover:bg-surface-mint/40 transition-colors"
          >
            <span className="grid w-8 h-8 place-items-center rounded-md bg-surface-deep text-ink-inverse">
              <Download size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-ink truncate">{a.label}</div>
              <div className="text-[11px] text-mute font-mono truncate">{a.filename}</div>
            </div>
            <button
              type="button"
              onClick={() => handleDownload(a)}
              className="ui-pill text-[12px] font-bold text-surface-deep hover:underline"
            >
              Download
            </button>
            {a.docId && (
              <button
                type="button"
                onClick={() => go({ kind: "doc", id: a.docId! })}
                className="ui-pill text-[12px] font-medium text-mute hover:text-ink"
              >
                Open ↗
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-6">
        <PillButton variant="primary" onClick={() => go({ kind: "hub" })}>
          Back to hub
        </PillButton>
        <PillButton
          variant="secondary"
          onClick={() => {
            // Reset flow back to step 0 so user can re-run
            setFlowProgress(flow, { activeStep: 0, approved: false });
            setPhase("idle");
            setProgress(artifacts.map(() => 0));
          }}
        >
          Re-run the close
        </PillButton>
      </div>
    </article>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Builder helpers — make the 4 artifacts for the Accounting flow.
// ────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────
// Treasury artifacts — emitted when the treasury flow is approved.
// ────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────
// BP artifacts — emitted when the BP flow is approved.
// ────────────────────────────────────────────────────────────────────────

export function bpArtifacts(): Artifact[] {
  return [
    {
      label: "EXCO strategic memo · PDF",
      filename: "crypton-q2-bp-strategic-memo.html",
      docId: "bp-strategic-memo",
      generate: () => new Blob([buildBPMemoHTML()], { type: "text/html;charset=utf-8" }),
    },
    {
      label: "Board deck · PPTX-ready HTML",
      filename: "crypton-q2-bp-board-deck.html",
      docId: "bp-board-deck",
      generate: () => new Blob([buildBPDeckHTML()], { type: "text/html;charset=utf-8" }),
    },
    {
      label: "Scenario analysis · JSON",
      filename: "crypton-q3-scenarios.json",
      docId: "scenario-analysis",
      generate: () =>
        new Blob(
          [
            JSON.stringify(
              {
                generatedAt: new Date().toISOString(),
                drivers: [
                  { name: "Perp funding mean-reversion", downside: -41_000_000, upside: 14_000_000 },
                  { name: "+50 institutional onboards", downside: -4_000_000, upside: 18_000_000 },
                  { name: "Spot listing pipeline", downside: -2_000_000, upside: 9_400_000 },
                  { name: "Liquidation engine cost", downside: -3_200_000, upside: 1_100_000 },
                  { name: "Compliance headcount", downside: -2_400_000, upside: 600_000 },
                  { name: "FX hedge slippage", downside: -1_800_000, upside: 900_000 },
                ],
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
    },
    {
      label: "EXCO routing log · JSON",
      filename: "exco-routing-2026-05-28.json",
      generate: () =>
        new Blob(
          [
            JSON.stringify(
              {
                routedAt: new Date().toISOString(),
                routedBy: "Wei Chen",
                recipients: ["CEO", "COO", "Independent Director · A", "Independent Director · B"],
                artifacts: ["bp-strategic-memo", "bp-board-deck", "scenario-analysis"],
                decisionDeadline: "2026-06-12",
                ask: "Approve $2M Q3 institutional sales budget tranche",
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
    },
  ];
}

function buildBPMemoHTML() {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Crypton · Q2 BP strategic memo</title>
<style>
body { font: 14px/1.6 -apple-system, BlinkMacSystemFont, "DM Sans", sans-serif; color: #0b0b0e; max-width: 720px; margin: 60px auto; padding: 0 24px; }
.eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6660; }
h1 { font-size: 30px; letter-spacing: -0.5px; margin: 0 0 8px; }
h3 { margin: 28px 0 6px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #1f1b16; }
strong { color: #0b0b0e; }
</style>
</head><body>
<div class="eyebrow">Executive Committee · Q3 ask</div>
<h1>Q2 BP review · strategic memo</h1>
<h3>Headline ask</h3>
<p><strong>Increase Q3 institutional sales budget by +$2M.</strong> Expected annualised net contribution <strong>$18.4M</strong>. Single largest controllable lever available to Q3.</p>
<h3>Rationale</h3>
<p>Tier-1 OTC onboards drive both RFQ revenue and a +7% lift in spot taker volume. Pipeline of +50 onboards within 90 days is conservatively staffed at 17 FTE; expanding capacity unlocks the synergy.</p>
<h3>Risks</h3>
<p>MAS MPI timing — if approval slips to Q4, $6.5M of synergy compresses. Mitigation: tranche the $2M against MAS milestones.</p>
<h3>Recommendation</h3>
<p>Approve $2M tranche for Q3 institutional sales. Decision needed by <strong>June 12</strong>.</p>
<p style="color:#6b6660; font-style:italic; margin-top:32px">Drafted by AI · reviewed by Wei Chen.</p>
</body></html>`;
}

function buildBPDeckHTML() {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Crypton · Q2 BP board deck</title>
<style>
body { font: 14px/1.6 -apple-system, BlinkMacSystemFont, "DM Sans", sans-serif; color: #0b0b0e; max-width: 820px; margin: 40px auto; padding: 0 24px; }
.slide { border: 1px solid #ecead9; border-radius: 6px; padding: 32px; margin-bottom: 16px; min-height: 280px; }
.eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #c8a24b; font-weight: bold; }
h2 { font-size: 22px; margin: 4px 0 12px; }
</style>
</head><body>
<div class="slide"><div class="eyebrow">Slide 01</div><h2>Q2 BP review</h2><p>Crypton · Confidential · Wei Chen · 2026-05-28</p></div>
<div class="slide"><div class="eyebrow">Slide 03</div><h2>Q2 headline</h2><p>Revenue $230M · Net $187M · Net margin 81% · Pipeline +50 institutional onboards.</p></div>
<div class="slide"><div class="eyebrow">Slide 13</div><h2>Strategic recommendation</h2><p><strong>Increase Q3 institutional sales budget by +$2M.</strong></p></div>
<div class="slide"><div class="eyebrow">Slide 15</div><h2>The ask</h2><p>Decision by June 12 · expected annualised net $18.4M.</p></div>
<div class="slide"><div class="eyebrow">Slide 18</div><h2>Sign-off</h2><p>CFO (BP hat): Wei Chen · 2026-05-28</p><p>EXCO chair: ___________________</p></div>
</body></html>`;
}

export function treasuryArtifacts(): Artifact[] {
  return [
    {
      label: "Daily treasury brief · PDF",
      filename: "crypton-treasury-brief-2026-05-28.html",
      docId: "daily-treasury-brief",
      generate: () =>
        new Blob([buildTreasuryBriefHTML()], { type: "text/html;charset=utf-8" }),
    },
    {
      label: "Rebalancing plan · JSON",
      filename: "crypton-rebalancing-2026-05-28.json",
      docId: "rebalancing-plan",
      generate: () =>
        new Blob(
          [
            JSON.stringify(
              {
                date: "2026-05-28",
                move: { asset: "USDT", chain: "Ethereum", amountUSD: 80_000_000 },
                source: { custody: "Anchorage Digital", wallet: "USDT-Cold-01" },
                destination: { custody: "Fireblocks", wallet: "USDT-Hot-01" },
                travelRule: { originator: "verified", beneficiary: "verified" },
                approvedBy: "Wei Chen",
                approvedAt: new Date().toISOString(),
                etaHours: 4,
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
    },
    {
      label: "Anomaly ack log · JSON",
      filename: "crypton-anomaly-ack-2026-05-28.json",
      docId: "anomaly-brief",
      generate: () =>
        new Blob(
          [
            JSON.stringify(
              {
                date: "2026-05-28",
                ackBy: "Wei Chen",
                ackAt: new Date().toISOString(),
                anomalies: [
                  { id: "ANM-2026-05-28-001", title: "Large transfer to new whitelist", note: "Tied to Northstar OTC prime settlement." },
                  { id: "ANM-2026-05-28-002", title: "Off-hours hot-wallet activity", note: "Same root cause as -001 · ack as single event." },
                ],
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
    },
    {
      label: "Travel-rule audit · XML",
      filename: "travel-rule-2026-05-28.xml",
      generate: () =>
        new Blob([buildTravelRuleXML()], { type: "application/xml;charset=utf-8" }),
    },
  ];
}

function buildTreasuryBriefHTML() {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Crypton · Daily treasury brief 2026-05-28</title>
<style>
body { font: 14px/1.6 -apple-system, BlinkMacSystemFont, "DM Sans", sans-serif; color: #0b0b0e; max-width: 720px; margin: 60px auto; padding: 0 24px; }
.eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6660; }
h1 { font-size: 30px; letter-spacing: -0.5px; margin: 0 0 8px; }
h3 { margin: 24px 0 6px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #1f1b16; }
strong { color: #0b0b0e; }
table { width: 100%; border-collapse: collapse; margin: 6px 0; }
td { padding: 6px 8px; border-bottom: 1px solid #ecead9; }
</style>
</head><body>
<div class="eyebrow">Internal · CFO desk · daily</div>
<h1>Treasury daily brief · 2026-05-28</h1>
<p>Group treasury closed the overnight at <strong>$8.41B</strong> USD-equivalent. Cold custody utilisation at 91%; hot float 8% below target. Recommended tonight: $80M USDT Anchorage → Fireblocks.</p>
<h3>Position</h3>
<table>
  <tr><td>Crypto · Fireblocks (hot + warm)</td><td>$348M</td></tr>
  <tr><td>Crypto · Anchorage (cold)</td><td>$5.99B</td></tr>
  <tr><td>Fiat · banks (7 jurisdictions)</td><td>$210M</td></tr>
</table>
<h3>Approvals requested</h3>
<ul>
  <li>Rebalancing plan: $80M USDT Anchorage → Fireblocks · ETA T+4h</li>
  <li>Anomaly ack: 2 events on ETH-Hot-02 (single root cause)</li>
</ul>
<p style="color:#6b6660; font-style:italic; margin-top:32px">Drafted by AI · reviewed by Wei Chen.</p>
</body></html>`;
}

function buildTravelRuleXML() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<travelRule batch="2026-05-28" partner="chain-analytics-msb">
  <transfer id="REB-2026-05-28-001">
    <amountUSD>80000000</amountUSD>
    <asset>USDT</asset>
    <chain>Ethereum</chain>
    <originator institution="Anchorage Digital" verifiedAt="2026-05-28T03:30:11Z" />
    <beneficiary institution="Crypton Operational (Fireblocks)" verifiedAt="2026-05-28T03:30:11Z" />
    <sanctionScreen ofac="0-match" eu="0-match" uk="0-match" sg="0-match" />
    <approvedBy>Wei Chen</approvedBy>
  </transfer>
</travelRule>`;
}

export function accountingArtifacts(): Artifact[] {
  return [
    {
      label: "Variance commentary memo · PDF",
      filename: "crypton-may-2026-variance-memo.html",
      docId: "variance-memo",
      generate: () =>
        new Blob([buildMemoHTML()], { type: "text/html;charset=utf-8" }),
    },
    {
      label: "Board financial report · PDF",
      filename: "crypton-may-2026-board-report.html",
      docId: "board-financial-report",
      generate: () =>
        new Blob([buildReportHTML()], { type: "text/html;charset=utf-8" }),
    },
    {
      label: "Close audit trail · JSON",
      filename: "crypton-close-audit-2026-05.json",
      docId: "close-audit-trail",
      generate: () =>
        new Blob(
          [
            JSON.stringify(
              {
                close: "2026-05",
                approvedBy: "Wei Chen",
                approvedAt: new Date().toISOString(),
                actions: 9,
                model: "claude-opus-4-7",
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
    },
    {
      label: "Oracle journal entries · XML",
      filename: "JE-0429-to-0432-oracle.xml",
      docId: "journal-entry-proposal",
      generate: () =>
        new Blob([buildOracleJEXML()], { type: "application/xml;charset=utf-8" }),
    },
  ];
}

function buildMemoHTML() {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Crypton · May 2026 variance memo</title>
<style>
body { font: 14px/1.6 -apple-system, BlinkMacSystemFont, "DM Sans", sans-serif; color: #0b0b0e; max-width: 720px; margin: 60px auto; padding: 0 24px; }
h1 { font-size: 30px; letter-spacing: -0.5px; margin: 0 0 8px; }
.eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6660; }
h3 { margin: 28px 0 6px; font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: #1f1b16; }
strong { color: #0b0b0e; }
</style>
</head><body>
<div class="eyebrow">Internal · Finance to Audit Committee</div>
<h1>May 2026 close · variance commentary</h1>

<h3>Headline</h3>
<p>May delivered total revenue of <strong>$80.08M</strong> (<strong>+7.4%</strong> MoM) against operating expense of <strong>$14.57M</strong> (<strong>+2.6%</strong> MoM). Net margin held at <strong>66.0%</strong>, broadly in line with the FY-Q1 board guidance band (<strong>63–68%</strong>). Ten accounts crossed the 5% variance threshold; all are understood and policy-substantiated below.</p>

<h3>Revenue drivers</h3>
<p>Derivatives carried the quarter. Funding-rate revenue rose to <strong>$31.14M</strong> on a persistent positive-skew funding regime (<strong>18 of 21 days positive</strong>), and the auto-deleveraging fund contribution lifted <strong>+26%</strong> MoM on the May 14 liquidation cascade. Spot maker revenue ticked up <strong>+10.2%</strong> on a maker volume uplift the listings desk attributes to two tokens onboarded in late April.</p>

<h3>Cost drivers</h3>
<p>Liquidation engine operational cost rose <strong>+18.2%</strong> on settlement-gas pressure; per policy ACCT-POL-2026-02 §1.7 we are reclassifying <strong>50%</strong> of the increase to Wallet &amp; custody runtime (entry <strong>JE-0430</strong>). Singapore compliance headcount lifted People · Compliance <strong>+8.6%</strong> and external counsel by <strong>+49.4%</strong> — both pre-committed for the MAS MPI application.</p>

<h3>Sign-off recommendation</h3>
<p>Sign the May close with the four adjusting entries proposed (<strong>JE-0429 to JE-0432</strong>) in tonight's Oracle nightly. Book is otherwise ready for the Audit Committee review on June 2.</p>

<p style="color:#6b6660; font-style:italic; margin-top:32px">Drafted by AI · reviewed by Wei Chen.</p>
</body></html>`;
}

function buildReportHTML() {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Crypton · May 2026 board report</title>
<style>
body { font: 14px/1.6 -apple-system, BlinkMacSystemFont, "DM Sans", sans-serif; color: #0b0b0e; max-width: 820px; margin: 40px auto; padding: 0 24px; }
.cover { padding: 80px 0; }
.eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #c8a24b; font-weight: bold; }
h1 { font-size: 56px; letter-spacing: -1.2px; margin: 12px 0; line-height: 1.0; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; }
td, th { padding: 6px 8px; border-bottom: 1px solid #ecead9; text-align: left; }
th { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b6660; }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
section { border-top: 1px solid #ecead9; padding: 28px 0; }
section h2 { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #1f1b16; }
</style>
</head><body>

<div class="cover">
  <div class="eyebrow">Crypton · Group · Confidential · Board pack</div>
  <h1>May 2026<br>Financial report</h1>
  <p>Prepared by Group Finance for the June 2026 Board of Directors meeting.</p>
</div>

<section>
  <h2>03 · Executive summary</h2>
  <p>May delivered <strong>$80.1M</strong> revenue (+7.4% MoM), with derivatives the primary contributor. Net margin held at <strong>66.0%</strong>. Four adjusting entries queued for Oracle posting.</p>
</section>

<section>
  <h2>04 · P&L by business line</h2>
  <table>
    <thead><tr><th>Line</th><th>Revenue ($K)</th><th>OpEx ($K)</th><th>Net ($K)</th><th>Margin</th></tr></thead>
    <tbody>
      <tr><td>Derivatives</td><td class="num">51,098</td><td class="num">6,840</td><td class="num">44,258</td><td class="num">86.6%</td></tr>
      <tr><td>Spot</td><td class="num">11,655</td><td class="num">2,310</td><td class="num">9,345</td><td class="num">80.2%</td></tr>
      <tr><td>Institutional</td><td class="num">16,350</td><td class="num">2,120</td><td class="num">14,230</td><td class="num">87.0%</td></tr>
      <tr><td>Legal / Compliance</td><td class="num">977</td><td class="num">3,300</td><td class="num">−2,323</td><td class="num">—</td></tr>
      <tr><td><strong>Total</strong></td><td class="num"><strong>80,080</strong></td><td class="num"><strong>14,570</strong></td><td class="num"><strong>65,510</strong></td><td class="num"><strong>81.8%</strong></td></tr>
    </tbody>
  </table>
</section>

<section>
  <h2>13 · Appendix · adjusting entries</h2>
  <ul>
    <li>JE-0429 · Accrue May funding-rate revenue · $2.32M</li>
    <li>JE-0430 · Liquidation engine cost · settlement-gas reclass · $425.6K</li>
    <li>JE-0431 · Insurance fund top-up · $210.5K</li>
    <li>JE-0432 · Marketing & growth · listing campaign deferral · $259.5K</li>
  </ul>
</section>

<section>
  <h2>14 · Sign-off</h2>
  <p>CFO: Wei Chen · 2026-05-28</p>
  <p>Audit Committee chair: ___________________</p>
</section>

</body></html>`;
}

function buildOracleJEXML() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<oracleGL period="2026-05" client="Crypton">
  <entry id="JE-0429" date="2026-05-31" costCenter="CC-2000">
    <line side="Dr" account="1230" name="Funding rate receivable" amount="2321400" />
    <line side="Cr" account="4020" name="Funding rate revenue (Perpetuals)" amount="2321400" />
  </entry>
  <entry id="JE-0430" date="2026-05-31" costCenter="CC-2000 -> CC-3200">
    <line side="Dr" account="5010" name="Hot-wallet sweep &amp; gas (CC-3200)" amount="425606" />
    <line side="Cr" account="5000" name="Liquidation engine operational cost (CC-2000)" amount="425606" />
  </entry>
  <entry id="JE-0431" date="2026-05-31" costCenter="CC-2000">
    <line side="Dr" account="5020" name="Insurance fund top-up" amount="210500" />
    <line side="Cr" account="1110" name="Operating cash (Fireblocks · USD)" amount="210500" />
  </entry>
  <entry id="JE-0432" date="2026-05-31" costCenter="CC-6000">
    <line side="Dr" account="1820" name="Prepaid marketing" amount="259500" />
    <line side="Cr" account="5200" name="Marketing &amp; growth" amount="259500" />
  </entry>
</oracleGL>`;
}
