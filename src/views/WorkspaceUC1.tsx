import { useState } from "react";
import { uc1Flow } from "@/data/scenarios";
import { useApp } from "@/state";
import { WorkspaceTopbar } from "@/components/workspace/WorkspaceTopbar";
import { Timeline } from "@/components/workspace/Timeline";
import { AlertBanner } from "@/components/workspace/AlertBanner";
import { DecisionCardUC1 } from "@/components/workspace/DecisionCardUC1";
import { AutoActions } from "@/components/workspace/AutoActions";
import { ActivityLog, type ActivityEntry } from "@/components/workspace/ActivityLog";
import {
  ResignationParsedCard,
  KTPlanReadyCard,
  RevocationListReadyCard,
  ExitPackageReadyCard,
} from "@/components/workspace/OffboardingCards";
import {
  ResignationLetterModal,
  KTPlanModal,
  AccessRevocationModal,
  ExitPackageModal,
  TerminationLetterSignableModal,
} from "@/components/workspace/OffboardingModals";
import {
  RunProgressPanel,
  type RunStep,
} from "@/components/workspace/RunProgressPanel";
import { Toast } from "@/components/workspace/Toast";
import { AgentLiveStrip } from "@/components/ai/AgentLiveStrip";
import { StreamingText } from "@/components/ai/StreamingText";
import { Play, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const activityIdle: ActivityEntry[] = [
  { time: "Yest.", text: "Resignation parsed · 30-day notice detected" },
  { time: "Yest.", text: "Knowledge-transfer plan drafted · 14 single-owner areas" },
  { time: "Yest.", text: "Access revocation queue assembled · 23 SaaS systems" },
  { time: "Yest.", text: "Exit package drafted · TRCT-format · PT + EN" },
];

const activityExecuting: ActivityEntry[] = [
  { time: "now", text: "Transfer sessions auto-scheduled · Rafael F. + Beatriz O. notified" },
  { time: "now", text: "All 23 system accesses queued · revoke at 17:00 BRT on 27 Jun" },
  { time: "now", text: "Exit interview booked · Thu 26 Jun 15:00 BRT" },
  { time: "now", text: "Offboarding letter filed with homologação · receipt logged" },
  { time: "now", text: "Audit entry written · approver: HRBP" },
];

const stepLabels = ["Read resignation", "Build KT plan", "Compile revocation", "Draft exit package"];

const liveScripts: Record<number, string[]> = {
  0: [
    "Parsing the resignation email from Camila…",
    "Detecting CLT aviso prévio · 30-day default…",
    "Computing the statutory last working day (Fri 27 Jun)…",
    "Cross-checking tenure + 13th-month progress in Workday…",
  ],
  1: [
    "Walking Camila's GitHub footprint · 4 repos owned…",
    "Reading Confluence spaces she edits…",
    "Mapping Jira projects + sole-owner stories…",
    "Picking successors from same-pod headcount…",
  ],
  2: [
    "Listing every SaaS she has access to…",
    "Computing per-system revocation timer…",
    "Front-loading high-risk surfaces (AWS, PagerDuty, Lever)…",
    "Scheduling Okta cascade for cutoff + 5 min…",
  ],
  3: [
    "Pricing salary balance + 13th-month proration…",
    "Computing vacation + 1/3 constitutional bonus…",
    "Drafting bilingual offboarding letter (PT + EN)…",
    "Routing to homologação queue (union)…",
  ],
  4: [
    "Awaiting your single approval…",
    "Offboarding letter ready for signature…",
    "On approve, agent files with payroll + union and starts the 30-day arming…",
  ],
};

const runningStatus: Record<number, string[]> = {
  0: [
    "Loading the resignation email…",
    "Extracting candidate facts…",
    "Verifying tenure + base salary…",
    "Opening the letter for review…",
  ],
  1: [
    "Reading 4 weeks of GitHub commits…",
    "Indexing 47 Confluence pages…",
    "Parsing 9 Jira projects…",
    "Building the successor map…",
  ],
  2: [
    "Reading Okta · 23 entitlements…",
    "Computing per-system risk scores…",
    "Setting timers vs the 17:00 BRT cutoff…",
    "Compiling the revocation schedule…",
  ],
  3: [
    "Pricing CLT severance line items…",
    "Localising the offboarding letter…",
    "Generating bilingual PT + EN drafts…",
    "Routing for HRBP signature…",
  ],
};

export function WorkspaceUC1() {
  const { flowProgress, setFlowProgress, showCompletion } = useApp();
  const progress = flowProgress.uc1;
  const step = progress.activeStep;
  const approved = progress.approved;

  // Modal state
  const [showResignation, setShowResignation] = useState(false);
  const [showKT, setShowKT] = useState(false);
  const [showRevocation, setShowRevocation] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  // Offboarding letter signed state — gates the final approve button
  const [letterSigned, setLetterSigned] = useState(false);

  const [toast, setToast] = useState(0);

  const advanceTo = (next: number) => setFlowProgress("uc1", { activeStep: next });

  const handleApprove = () => {
    if (!letterSigned) return;
    setFlowProgress("uc1", { approved: true });
    setToast((n) => n + 1);
    window.setTimeout(() => showCompletion("uc1"), 600);
  };

  const runStep = (s: number) => {
    if (s === 0) setShowResignation(true);
    else if (s === 1) setShowKT(true);
    else if (s === 2) setShowRevocation(true);
    else if (s === 3) setShowExit(true);
  };

  const awaitingApproval = step === 4 && !approved;
  const finished = approved;

  const runSteps: RunStep[] = uc1Flow.steps.map((s) => ({
    title: s.title,
    sub: s.detail,
    source: "Offboarding agent",
    time: s.time,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <WorkspaceTopbar
        title={uc1Flow.contextTitle}
        sub={uc1Flow.contextSub + " · Offboarding"}
        statusPill={
          finished
            ? "Approved · audit logged"
            : awaitingApproval
              ? letterSigned
                ? "Ready to approve"
                : "Sign the offboarding letter to finish"
              : `Step ${step + 1} of 5 · click to run`
        }
        statusKind={finished ? "ready" : awaitingApproval ? "critical" : "progress"}
      />

      <div className="grid grid-cols-[380px_1fr] flex-1">
        <aside className="bg-white border-r border-divider px-6 py-7">
          <div className="mb-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
              Agent timeline
            </div>
            <div className="text-[13px] text-ink mt-1">
              {finished
                ? "Complete · 5 of 5 done"
                : awaitingApproval
                  ? letterSigned
                    ? "Ready to approve"
                    : "Sign the offboarding letter"
                  : `Step ${step + 1} of 5 · ready to run`}
            </div>
            <div className="mt-3 h-1 bg-divider/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-surface-deep transition-all duration-[600ms] ease-out"
                style={{
                  width: `${((finished ? 5 : awaitingApproval ? 4 : step) / 5) * 100}%`,
                }}
              />
            </div>
          </div>
          <Timeline steps={uc1Flow.steps} activeStep={step} pauseAt={4} />
        </aside>

        <main className="px-6 py-5 space-y-3">
          <AlertBanner title={uc1Flow.alert.title} sub={uc1Flow.alert.sub} />

          {!finished && (
            <AgentLiveStrip lines={liveScripts[step] ?? liveScripts[4]} />
          )}

          {step < 4 && (
            <RunGate
              stepIndex={step}
              label={uc1Flow.steps[step].title}
              detail={uc1Flow.steps[step].detail}
              runLabel={stepLabels[step]}
              statusLines={runningStatus[step]}
              onRun={() => runStep(step)}
            />
          )}

          {/* Decision card slot at step 4 (sits on top, newest-first) */}
          {step >= 4 && (
            <DecisionCardUC1
              awaiting={awaitingApproval}
              letterSigned={letterSigned}
              onApprove={handleApprove}
              onOpenKT={() => setShowKT(true)}
              onOpenRevocation={() => setShowRevocation(true)}
              onOpenExit={() => setShowExit(true)}
              onOpenLetter={() => setShowLetter(true)}
            />
          )}

          {/* Result cards revealed for completed steps — newest on top */}
          {step >= 4 && <ExitPackageReadyCard onView={() => setShowExit(true)} />}
          {step >= 3 && step < 4 && <ExitPackageReadyCard onView={() => setShowExit(true)} />}
          {step >= 3 && <RevocationListReadyCard onView={() => setShowRevocation(true)} />}
          {step >= 2 && <KTPlanReadyCard onView={() => setShowKT(true)} />}
          {step >= 1 && <ResignationParsedCard />}

          <RunProgressPanel
            steps={runSteps}
            activeStep={step}
            pauseAt={4}
            awaitingApproval={awaitingApproval}
            finished={finished}
          />

          {step >= 4 && (
            <div className="grid grid-cols-2 gap-3 items-stretch">
              <AutoActions
                items={[
                  { label: "Schedule transfer sessions · Rafael + Beatriz" },
                  { label: "Arm access revocation timers · 27 Jun 17:00" },
                  { label: "Book exit interview · Thu 26 Jun" },
                  { label: "File offboarding letter with homologação" },
                  { label: "Log the decision" },
                ]}
                executing={finished}
              />
              <ActivityLog
                entries={finished ? activityExecuting : activityIdle}
                live
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ResignationLetterModal
        open={showResignation}
        onClose={() => setShowResignation(false)}
        onAdvance={() => advanceTo(Math.max(step + 1, 1))}
      />
      <KTPlanModal
        open={showKT}
        onClose={() => setShowKT(false)}
        onAdvance={() => {
          if (step === 1) advanceTo(2);
        }}
      />
      <AccessRevocationModal
        open={showRevocation}
        onClose={() => setShowRevocation(false)}
        onAdvance={() => {
          if (step === 2) advanceTo(3);
        }}
      />
      <ExitPackageModal
        open={showExit}
        onClose={() => setShowExit(false)}
        onAdvance={() => {
          if (step === 3) advanceTo(4);
        }}
        onOpenLetter={() => {
          setShowExit(false);
          window.setTimeout(() => setShowLetter(true), 200);
        }}
        letterSigned={letterSigned}
      />
      <TerminationLetterSignableModal
        open={showLetter}
        onClose={() => setShowLetter(false)}
        onSigned={() => setLetterSigned(true)}
        alreadySigned={letterSigned}
      />

      <Toast
        show={toast > 0}
        title="Offboarding approved"
        body="KT sessions scheduled · access timers armed · exit interview booked · homologação filed."
        cta={{ label: "View the offboarding letter", onClick: () => setShowLetter(true) }}
      />
    </div>
  );
}

function RunGate({
  stepIndex,
  label,
  detail,
  runLabel,
  statusLines = [],
  onRun,
}: {
  stepIndex: number;
  label: string;
  detail: string;
  runLabel: string;
  statusLines?: string[];
  onRun: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  const handle = () => {
    if (running) return;
    setRunning(true);
    setStatusIdx(0);
    if (statusLines.length > 0) {
      let i = 0;
      const tick = window.setInterval(() => {
        i += 1;
        if (i >= statusLines.length) {
          window.clearInterval(tick);
        } else {
          setStatusIdx(i);
        }
      }, 420);
    }
    const duration = Math.max(700, statusLines.length * 420);
    window.setTimeout(() => {
      onRun();
      setRunning(false);
    }, duration);
  };

  return (
    <section
      className={cn(
        "bg-white border-2 rounded-md p-5 transition-colors",
        running ? "border-surface-deep" : "border-ink",
      )}
    >
      <div className="flex items-center justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.08em] uppercase font-bold text-mute">
              Step {stepIndex + 1} of 5
            </span>
            <span className="w-1 h-1 rounded-full bg-mute" />
            <span
              className={cn(
                "text-[10px] tracking-[0.08em] uppercase font-bold",
                running ? "text-surface-deep" : "text-mark-red",
              )}
            >
              {running ? "Agent running" : "Manual gate"}
            </span>
          </div>
          <h3 className="text-[20px] leading-[24px] font-bold text-ink">{label}</h3>
          <p className="text-[13px] text-mute mt-1 max-w-[640px]">{detail}</p>
        </div>
        <button
          type="button"
          onClick={handle}
          disabled={running}
          className={cn(
            "ui-pill inline-flex items-center gap-2 rounded-full font-bold text-[14px] px-5 py-3 whitespace-nowrap transition-colors",
            running
              ? "bg-surface-deep text-ink-inverse"
              : "bg-ink text-ink-inverse hover:bg-surface-deep",
          )}
        >
          {running ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-ink-inverse/40 border-t-ink-inverse rounded-full animate-spin" />
              Working…
            </>
          ) : (
            <>
              <Play size={14} strokeWidth={2.2} fill="currentColor" />
              {runLabel}
            </>
          )}
        </button>
      </div>

      {running && statusLines.length > 0 && (
        <div className="mt-3 pt-3 border-t border-surface-deep/15 space-y-1.5">
          {statusLines.slice(0, statusIdx + 1).map((line, i) => {
            const isLatest = i === statusIdx;
            return (
              <div key={i} className="ai-stream flex items-center gap-2 text-[12px]">
                {isLatest ? (
                  <Sparkles
                    size={12}
                    strokeWidth={1.8}
                    className="text-surface-deep shrink-0"
                  />
                ) : (
                  <Check
                    size={12}
                    strokeWidth={2.4}
                    className="text-accent-green shrink-0"
                  />
                )}
                <span className={cn(isLatest ? "text-ink" : "text-mute line-through")}>
                  {isLatest ? <StreamingText text={line} cps={120} /> : line}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
