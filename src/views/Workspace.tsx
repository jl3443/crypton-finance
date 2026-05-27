import { useApp, type FlowId } from "@/state";
import { FLOWS } from "@/data/flows";
import { Timeline } from "@/components/workspace/Timeline";
import { AgentLiveStrip } from "@/components/ai/AgentLiveStrip";
import { PillButton } from "@/components/blocks/PillButton";
import { DropZone, type DropZoneCopy } from "@/components/upload/DropZone";
import { rememberUpload } from "@/lib/uploadCache";
import { MultiChartDashboard } from "@/components/dashboard/MultiChartDashboard";
import { TreasuryDashboard } from "@/components/dashboard/TreasuryDashboard";
import { ExportCeremony, accountingArtifacts, treasuryArtifacts, type Artifact, type CeremonyCopy } from "@/components/workspace/ExportCeremony";
import { cn } from "@/lib/utils";

/**
 * Workspace shell — [380px Timeline | flex-1 content] with a slim top
 * progress bar and AgentLiveStrip overhead. Step 0 of accounting renders
 * the DropZone for Excel ingest; other steps render per-step content
 * (Day 2 has placeholder for steps 1-7 of accounting; later days fill in).
 */

const DROPZONE_COPY: Partial<Record<FlowId, DropZoneCopy>> = {
  accounting: {
    eyebrow: "Step 1 · Ingest GL extract",
    title: "Drop an Oracle GL export to begin",
    sheetsHint: "Expected sheets: GL_Detail · TB_May · AP_Aging · AR_Aging.",
    sampleFile: "/samples/crypton-may-gl-extract.xlsx",
    sampleDisplayName: "crypton-may-gl-extract.xlsx",
  },
  treasury: {
    eyebrow: "Step 1 · Pull balances",
    title: "Drop a treasury statement to begin",
    sheetsHint: "Expected sheets: Wallets · BankAccounts · Transactions_24h.",
    sampleFile: "/samples/crypton-treasury-statements.xlsx",
    sampleDisplayName: "crypton-treasury-statements.xlsx",
  },
};

export function Workspace({ flow }: { flow: FlowId }) {
  const { flowProgress, setFlowProgress, recordUpload, uploads, go } = useApp();
  const f = FLOWS[flow];
  const activeStep = flowProgress[flow].activeStep;
  const totalSteps = f.steps.length;
  const progress = Math.min(activeStep / Math.max(totalSteps - 1, 1), 1);
  const currentStep = f.steps[activeStep];

  // Latest upload for this flow, used to interpolate {filename}/{rows}/{sheets}
  // tokens in liveScripts so the AgentLiveStrip references the real file.
  const latestUpload = [...uploads].reverse().find((u) => u.flow === flow);

  const rawLines = currentStep?.liveScripts ?? [`${currentStep.title}…`];
  const liveLines = rawLines.map((line) =>
    line
      .replaceAll("{filename}", latestUpload?.filename ?? "your workbook")
      .replaceAll("{rows}", latestUpload?.rowCount?.toLocaleString() ?? "—")
      .replaceAll("{sheets}", String(latestUpload?.sheetCount ?? "—")),
  );

  const goNext = () =>
    setFlowProgress(flow, { activeStep: Math.min(activeStep + 1, totalSteps - 1) });
  const goPrev = () =>
    setFlowProgress(flow, { activeStep: Math.max(activeStep - 1, 0) });

  const showDropZone =
    activeStep === 0 && DROPZONE_COPY[flow] !== undefined;

  // Dashboards mount alongside step content. Accounting: step 6 (Financial
  // report assembly). Treasury: step 3 (Liquidity position).
  const showAccountingDashboard = flow === "accounting" && activeStep === 6;
  const showTreasuryDashboard = flow === "treasury" && activeStep === 3;

  // Export ceremony replaces the placeholder card on the final step.
  const showExport = activeStep === totalSteps - 1 && exportArtifactsFor(flow).length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top chrome */}
      <header className="bg-white border-b border-divider px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5 min-w-0">
          <button
            type="button"
            onClick={() => go({ kind: "hub" })}
            className="ui-pill text-[13px] text-ink hover:text-surface-deep flex items-center gap-1.5"
          >
            <span aria-hidden>←</span>
            Back to hub
          </button>
          <span className="w-px h-5 bg-divider" />
          <div className="leading-tight min-w-0">
            <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
              {f.eyebrow}
            </div>
            <div className="text-[15px] font-bold text-ink truncate">{f.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.08em] uppercase font-medium text-mute">
            Step {activeStep + 1} / {totalSteps} · {f.statusPill}
          </span>
        </div>
      </header>

      {/* Slim progress bar */}
      <div className="h-px bg-divider/70 relative shrink-0">
        <div
          className="absolute inset-y-0 left-0 bg-surface-deep transition-[width] duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Body: [timeline | content] */}
      <div className="flex flex-1 min-h-0">
        <aside className="w-[380px] shrink-0 border-r border-divider bg-white/40 px-7 py-8 overflow-y-auto">
          <Timeline steps={f.steps} activeStep={activeStep} pauseAt={activeStep} />
        </aside>

        <main className="flex-1 min-w-0 px-10 py-8 overflow-y-auto">
          <AgentLiveStrip lines={liveLines} className="mb-6" />

          {showDropZone ? (
            <DropZone
              copy={DROPZONE_COPY[flow]!}
              onConfirm={(parsed) => {
                rememberUpload(flow, parsed);
                recordUpload({
                  flow,
                  filename: parsed.filename,
                  sheetCount: parsed.sheets.length,
                  rowCount: parsed.sheets.reduce((s, sh) => s + sh.totalRows, 0),
                });
                setFlowProgress(flow, { activeStep: 1 });
              }}
            />
          ) : showExport ? (
            <ExportCeremony
              flow={flow}
              artifacts={exportArtifactsFor(flow)}
              copy={ceremonyCopyFor(flow)}
            />
          ) : (
            <>
              <StepPlaceholderCard
                step={currentStep}
                activeStep={activeStep}
                totalSteps={totalSteps}
                onPrev={goPrev}
                onNext={goNext}
                onDocClick={(id) => go({ kind: "doc", id })}
              />
              {showAccountingDashboard && (
                <section className="pt-8">
                  <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-3">
                    Close dashboard · embedded in the board pack
                  </div>
                  <MultiChartDashboard />
                </section>
              )}
              {showTreasuryDashboard && (
                <section className="pt-8">
                  <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-3">
                    Liquidity dashboard · live position
                  </div>
                  <TreasuryDashboard />
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function exportArtifactsFor(flow: FlowId): Artifact[] {
  if (flow === "accounting") return accountingArtifacts();
  if (flow === "treasury") return treasuryArtifacts();
  return [];
}

function ceremonyCopyFor(flow: FlowId): CeremonyCopy {
  if (flow === "accounting") {
    return {
      introEyebrow: "Final step · CFO sign-off",
      introBlurb:
        "Sign off the four adjusting entries (JE-0429 to 0432), the variance memo, the board financial report, and the close audit trail. On approval, AI routes entries to Oracle's nightly batch, files the memo + report to Sharepoint, and locks the audit trail.",
      runningHeadline: "Routing approved entries · assembling exports…",
      doneHeadline: "Close approved · routed to Oracle, Sharepoint and audit log",
      doneSubline: "Download a copy below, or jump back into a doc to inspect what was sent.",
    };
  }
  if (flow === "treasury") {
    return {
      introEyebrow: "Final step · CFO sign-off",
      introBlurb:
        "Approve the $80M USDT rebalancing (Anchorage → Fireblocks) and ack the two anomalies as one event. On approval, the travel-rule + sanction checks lock, the brief files with morning ops, and the Fireblocks API receives the signed instruction.",
      runningHeadline: "Travel-rule check · Fireblocks submission · Anchorage withdrawal…",
      doneHeadline: "Rebalancing initiated · ETA 4h · brief filed with morning ops",
      doneSubline: "Fireblocks signed instruction posted. Anchorage withdrawal cleared.",
    };
  }
  return {
    introEyebrow: "Final step · CFO sign-off",
    introBlurb: "Approve to route the artifacts and lock the audit trail.",
    runningHeadline: "Routing artifacts…",
    doneHeadline: "Approved · artifacts routed",
    doneSubline: "Download or open any artifact below.",
  };
}

function StepPlaceholderCard({
  step,
  activeStep,
  totalSteps,
  onPrev,
  onNext,
  onDocClick,
}: {
  step: import("@/data/flows").FlowStep;
  activeStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onDocClick: (id: import("@/state").DocId) => void;
}) {
  return (
    <article className={cn("bg-white border border-divider rounded-md p-8 ai-spring")}>
      <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-2">
        Step {activeStep + 1} of {totalSteps}
      </div>
      <h2 className="text-[28px] font-bold text-ink leading-[32px] tracking-[-0.01em] mb-4">
        {step.title}
      </h2>
      <p className="text-[15px] text-ink leading-[24px] max-w-[680px] mb-6">{step.detail}</p>
      {step.docs && step.docs.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-2">
            Documents this step produced
          </div>
          <div className="flex flex-wrap gap-2">
            {step.docs.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onDocClick(id)}
                className="ui-pill inline-flex items-center gap-1.5 rounded-full bg-surface-fog text-ink hover:bg-surface-mint px-3 py-1.5 text-[12px] font-medium border border-divider"
              >
                {id} <span aria-hidden>↗</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 pt-2">
        <PillButton variant="secondary" size="md" onClick={onPrev} disabled={activeStep === 0}>
          Back
        </PillButton>
        <PillButton
          variant="primary"
          size="md"
          arrow
          onClick={onNext}
          disabled={activeStep >= totalSteps - 1}
        >
          {activeStep >= totalSteps - 1 ? "End of preview" : "Continue"}
        </PillButton>
      </div>
    </article>
  );
}
