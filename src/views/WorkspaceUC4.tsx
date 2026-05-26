import { useState } from "react";
import { uc4Flow } from "@/data/scenarios";
import { useApp } from "@/state";
import { WorkspaceTopbar } from "@/components/workspace/WorkspaceTopbar";
import { Timeline } from "@/components/workspace/Timeline";
import { AlertBanner } from "@/components/workspace/AlertBanner";
import { AutoActions } from "@/components/workspace/AutoActions";
import { ActivityLog, type ActivityEntry } from "@/components/workspace/ActivityLog";
import {
  SignedOfferCard,
  PreboardingBundleCard,
  DayPlanReadyCard,
  CountryComplianceCard,
  type ComplianceSignId,
} from "@/components/workspace/OnboardingCards";
import {
  OfferLetterModal,
  PreboardingItemModal,
  type PreboardingKind,
  CalendarPlanModal,
  SignableContractModal,
  type SignableKind,
  BundleDispatchModal,
} from "@/components/workspace/OnboardingModals";
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
  { time: "Yest.", text: "Signed offer received from Aurélie L." },
  { time: "Yest.", text: "Role template loaded · Marketing Manager · EMEA" },
  { time: "Yest.", text: "Hiring manager calendar pulled · Niklas K." },
];

const activityExecuting: ActivityEntry[] = [
  { time: "now", text: "Welcome message scheduled for 09:00 CET" },
  { time: "now", text: "Equipment ticket filed · MacBook Pro 14, Fri delivery" },
  { time: "now", text: "Okta + Workspace accounts provisioned · pending Day 1 activation" },
  { time: "now", text: "Quellensteuer form filed · receipt expected from BS canton" },
  { time: "now", text: "Audit entry written · approver: HRBP" },
];

const stepLabels = ["Read offer", "File bundle", "Build Day-1 + 30/60/90", "Run compliance scan"];

// Per-step "what the agent is doing right now" status scripts. The strip cycles
// through these so the audience always sees fresh AI activity.
const liveScripts: Record<number, string[]> = {
  0: [
    "Parsing the signed offer letter…",
    "Extracting 14 fields: name, role, location, start date…",
    "Cross-checking the role template (Marketing Manager · EMEA)…",
    "Pulling Niklas K.'s calendar to seed Day-1 meetings…",
  ],
  1: [
    "Composing the bilingual welcome message…",
    "Filing the equipment ticket with IT service desk…",
    "Staging 12 Okta apps under the EMEA-Marketing group…",
    "Running the EU/EFTA work-permit check for Switzerland…",
  ],
  2: [
    "Reading Niklas K.'s open slots for Monday…",
    "Slotting 7 Day-1 meetings with the right people…",
    "Generating the 30/60/90 plan from the role template…",
    "Synchronizing the calendar to Aurélie's inbox…",
  ],
  3: [
    "Scanning Switzerland · 6 compliance items…",
    "Confirming Betriebsrat does not apply to CH…",
    "Drafting the Quellensteuer form for the Basel canton…",
    "Setting the cantonal residency reminder for Day 14…",
  ],
  4: [
    "Awaiting your two signatures…",
    "Once signed, the agent files with the canton + payroll…",
    "Audit log armed · every action will be recorded…",
  ],
};

const runningStatus: Record<number, string[]> = {
  0: [
    "Loading the signed PDF…",
    "Extracting candidate fields…",
    "Verifying signature blocks…",
    "Opening the letter for review…",
  ],
  1: [
    "Dispatching welcome message to Outlook…",
    "Filing equipment ticket DSK-44820…",
    "Provisioning Okta + 11 apps…",
    "Running permit check against AFMP…",
  ],
  2: [
    "Reading 4 weeks of manager calendar…",
    "Slotting 7 intro meetings…",
    "Building 30-day milestones…",
    "Building 60- and 90-day milestones…",
  ],
  3: [
    "Scanning Swiss labor requirements…",
    "Cross-checking training catalog…",
    "Drafting tax + residency forms…",
    "Compiling the compliance report…",
  ],
};

export function WorkspaceUC4() {
  const { flowProgress, setFlowProgress, showCompletion } = useApp();
  const progress = flowProgress.uc4;
  const step = progress.activeStep;
  const approved = progress.approved;

  // Modal state — one boolean / variant per modal type
  const [showOffer, setShowOffer] = useState(false);
  const [showBundle, setShowBundle] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [previewKind, setPreviewKind] = useState<PreboardingKind | null>(null);
  const [signKind, setSignKind] = useState<SignableKind | null>(null);

  // Signed state for the two compliance contracts
  const [signed, setSigned] = useState<Record<ComplianceSignId, boolean>>({
    residency: false,
    quellensteuer: false,
  });

  const [toast, setToast] = useState(0);

  const advanceTo = (next: number) => setFlowProgress("uc4", { activeStep: next });

  const handleSigned = (id: ComplianceSignId) => {
    setSigned((s) => {
      const next = { ...s, [id]: true };
      // When both signed, mark flow approved + fire completion
      if (next.residency && next.quellensteuer && !approved) {
        setFlowProgress("uc4", { approved: true });
        setToast((n) => n + 1);
        // Auto-pop completion modal after the second sign
        window.setTimeout(() => showCompletion("uc4"), 900);
      }
      return next;
    });
  };

  // Run gate handlers per step — clicking opens the right modal
  const runStep = (s: number) => {
    if (s === 0) setShowOffer(true);
    else if (s === 1) setShowBundle(true);
    else if (s === 2) setShowCalendar(true);
    else if (s === 3) advanceTo(4); // step 3 just reveals the compliance card
  };

  const awaitingApproval = step === 4 && !approved;
  const finished = approved;

  const runSteps: RunStep[] = uc4Flow.steps.map((s) => ({
    title: s.title,
    sub: s.detail,
    source: "Onboarding agent",
    time: s.time,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <WorkspaceTopbar
        title={uc4Flow.contextTitle}
        sub={uc4Flow.contextSub + " · Onboarding"}
        statusPill={
          finished
            ? "Approved · onboarding live"
            : awaitingApproval
              ? "Sign both contracts to finish"
              : `Step ${step + 1} of 5 · click to run`
        }
        statusKind={finished ? "ready" : awaitingApproval ? "critical" : "progress"}
      />

      <div className="grid grid-cols-[380px_1fr] flex-1">
        {/* LEFT — Timeline */}
        <aside className="bg-white border-r border-divider px-6 py-7">
          <div className="mb-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
              Agent timeline
            </div>
            <div className="text-[13px] text-ink mt-1">
              {finished
                ? "Complete · 5 of 5 done"
                : awaitingApproval
                  ? "Sign both contracts to finish"
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
          <Timeline steps={uc4Flow.steps} activeStep={step} pauseAt={4} />
        </aside>

        {/* RIGHT — click-to-advance stack */}
        <main className="px-6 py-5 space-y-3">
          <AlertBanner title={uc4Flow.alert.title} sub={uc4Flow.alert.sub} />

          {/* Live agent status — visible at every step until completion */}
          {!finished && (
            <AgentLiveStrip
              lines={
                liveScripts[step] ?? liveScripts[4]
              }
            />
          )}

          {/* Active gate — only when not yet at final compliance card */}
          {step < 4 && (
            <RunGate
              stepIndex={step}
              label={uc4Flow.steps[step].title}
              detail={uc4Flow.steps[step].detail}
              runLabel={stepLabels[step]}
              statusLines={runningStatus[step]}
              onRun={() => runStep(step)}
            />
          )}

          {/* Cards revealed for each completed step — NEWEST on top so the
              latest agent output is always right under the run gate. */}
          {step >= 4 && (
            <CountryComplianceCard
              signed={signed}
              onOpenContract={(id) => setSignKind(id)}
            />
          )}
          {step >= 3 && <DayPlanReadyCard onReopen={() => setShowCalendar(true)} />}
          {step >= 2 && <PreboardingBundleCard onView={setPreviewKind} parentStep={step} />}
          {step >= 1 && <SignedOfferCard />}

          {/* Run-progress recap panel — sticks to the bottom */}
          <RunProgressPanel
            steps={runSteps}
            activeStep={step}
            pauseAt={4}
            awaitingApproval={awaitingApproval}
            finished={finished}
          />

          {/* Auto-actions + activity log appear once we're at the compliance step */}
          {step >= 4 && (
            <div className="grid grid-cols-2 gap-3 items-stretch">
              <AutoActions
                items={[
                  { label: "Dispatch preboarding bundle" },
                  { label: "Confirm Day-1 calendar with manager" },
                  { label: "File Quellensteuer + residency reminder" },
                  { label: "Assign buddy + send 30/60/90 plan" },
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
      <OfferLetterModal
        open={showOffer}
        onClose={() => setShowOffer(false)}
        onAdvance={() => advanceTo(1)}
      />
      <BundleDispatchModal
        open={showBundle}
        onClose={() => setShowBundle(false)}
        onAdvance={() => advanceTo(2)}
      />
      <CalendarPlanModal
        open={showCalendar}
        onClose={() => setShowCalendar(false)}
        onAdvance={() => {
          // Only advance from step 2 → 3. Re-opens after step 3 don't re-advance.
          if (step === 2) advanceTo(3);
        }}
      />
      <PreboardingItemModal
        open={previewKind !== null}
        onClose={() => setPreviewKind(null)}
        kind={previewKind ?? "welcome"}
        parentStep={step}
      />
      <SignableContractModal
        open={signKind !== null}
        onClose={() => setSignKind(null)}
        kind={signKind ?? "residency"}
        onSigned={() => signKind && handleSigned(signKind)}
      />

      <Toast
        show={toast > 0}
        title="Onboarding approved"
        body="Bundle dispatched · Day-1 calendar booked · 30/60/90 plan in inbox · contracts signed."
        cta={{ label: "View the 30/60/90 plan", onClick: () => setShowCalendar(true) }}
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
    // Cycle through agent status lines so the audience sees real work
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

      {/* Live "working" lane that reveals while the agent runs */}
      {running && statusLines.length > 0 && (
        <div className="mt-3 pt-3 border-t border-surface-deep/15 space-y-1.5">
          {statusLines.slice(0, statusIdx + 1).map((line, i) => {
            const isLatest = i === statusIdx;
            return (
              <div
                key={i}
                className="ai-stream flex items-center gap-2 text-[12px]"
                style={{ animationDelay: "0ms" }}
              >
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
