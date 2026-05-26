import { useState } from "react";
import { uc2Flow } from "@/data/scenarios";
import { useApp } from "@/state";
import { useAutoAdvance } from "@/components/workspace/useAutoAdvance";
import { WorkspaceTopbar } from "@/components/workspace/WorkspaceTopbar";
import { Timeline } from "@/components/workspace/Timeline";
import { AlertBanner } from "@/components/workspace/AlertBanner";
import { DecisionCardUC2 } from "@/components/workspace/DecisionCardUC2";
import { AutoActions } from "@/components/workspace/AutoActions";
import { ActivityLog, type ActivityEntry } from "@/components/workspace/ActivityLog";
import {
  FeedDetectorCard,
  ImpactBarsCard,
  DraftingArtifactsCard,
} from "@/components/workspace/StepCards";
import { RunProgressPanel, type RunStep } from "@/components/workspace/RunProgressPanel";
import { Toast } from "@/components/workspace/Toast";
import { AgentLiveStrip } from "@/components/ai/AgentLiveStrip";

// What the agent is doing right now, per step — rotates inside the live strip
// so the audience sees real activity even while UC2 auto-advances.
const liveScripts: Record<number, string[]> = {
  0: [
    "Reading the EU regulatory feed (23 jurisdictions)…",
    "Picked up Bundesgesetzblatt · ArbZG amendment · 13 min after publication…",
    "Confidence 99% · workweek 40h → 37.5h confirmed…",
  ],
  1: [
    "Querying Workday for all German contracts…",
    "Matching against 4 payroll cost centres…",
    "Computing per-region exposure · Heidelberg, Berlin, Frankfurt, Munich…",
    "147 employees · 12 contracts · 4 payroll systems impacted…",
  ],
  2: [
    "Pulling the relevant handbook sections (§4 Working hours)…",
    "Drafting the bilingual employee announcement (DE + EN)…",
    "Composing the §87 (1) Nr. 2 BetrVG notice for the works council…",
    "Building the Workday payroll-change request across 4 cost centres…",
  ],
  3: [
    "Awaiting your decision on the 90-day roll-out…",
    "Risk score: Medium · works-council acknowledgement window: 7 days…",
    "On approve, the agent files with all four systems in parallel…",
  ],
  4: [
    "Pushing the payroll change to Workday cost centres…",
    "Sending the bilingual announcement to 147 employees…",
    "Filing the works-council notice · awaiting acknowledgement…",
    "Writing the audit log entry…",
  ],
};

const activityIdle: ActivityEntry[] = [
  { time: "7:17", text: "Announcement drafted in German and English" },
  { time: "7:16", text: "Works council notice prepared" },
  { time: "7:15", text: "Impact calculated · 147 employees, 12 contracts" },
  { time: "7:14", text: "New German labor law detected from EU regulatory feed" },
];

const activityExecuting: ActivityEntry[] = [
  { time: "now", text: "Payroll change pushed to all 4 German cost centres" },
  { time: "now", text: "Announcement sent to 147 employees in German + English" },
  { time: "now", text: "Works council notification filed · receipt confirmed" },
  { time: "now", text: "Audit entry written · approver: HRBP" },
];

export function WorkspaceUC2() {
  const { flowProgress, setFlowProgress } = useApp();
  const advance = useAutoAdvance({
    total: uc2Flow.steps.length,
    pauseAt: 3,
    external: {
      activeStep: flowProgress.uc2.activeStep,
      approved: flowProgress.uc2.approved,
      set: (next) => setFlowProgress("uc2", next),
    },
  });
  const step = advance.activeStep;

  const [toast, setToast] = useState(0);
  const handleApprove = () => {
    advance.approve();
    setToast((n) => n + 1);
  };

  const runSteps: RunStep[] = [
    {
      title: "Detect law change",
      sub: "Picked up the German Working Hours Act amendment 13 minutes after publication",
      source: "EU regulatory feed",
      time: "7:14 AM",
      expanded: (
        <FeedDetectorCard
          source="EU regulatory feed"
          detail="Reading Bundesgesetzblatt · DE · confidence 99% · workweek 40h → 37.5h."
        />
      ),
    },
    {
      title: "Calculate impact",
      sub: "147 employees affected across 4 cost centres",
      source: "HR record",
      time: "7:15 AM",
      expanded: (
        <ImpactBarsCard
          title="147 employees affected across Germany"
          rows={[
            { label: "Employees affected", value: 147 },
            { label: "Contracts to update", value: 12 },
            { label: "Payroll systems", value: 4 },
            { label: "Cost centres", value: 4 },
          ]}
        />
      ),
    },
    {
      title: "Draft all required documents",
      sub: "Handbook · announcement · works council notice · payroll",
      source: "Policy library",
      time: "7:16 AM",
      expanded: (
        <DraftingArtifactsCard
          rows={[
            { label: "Handbook redline", sub: "Section 4. Working hours", source: "Policy library" },
            { label: "Employee announcement", sub: "German + English", source: "Templates" },
            { label: "Works council notice", sub: "§87 (1) Nr. 2 BetrVG", source: "Legal templates" },
            { label: "Payroll change request", sub: "4 cost centres", source: "Workday" },
          ]}
        />
      ),
    },
    {
      title: "Ready for your decision",
      sub: "Risk score medium · 90-day roll-out, 3 phases",
      time: advance.awaitingApproval ? "now" : "7:17 AM",
    },
    {
      title: "Execute across systems",
      sub: "Payroll · employee comms · works council · audit log",
      time: advance.finished ? "now" : "—",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <WorkspaceTopbar
        title={uc2Flow.contextTitle}
        sub={uc2Flow.contextSub + " · Compliance"}
        statusPill={advance.finished ? "Approved · audit logged" : uc2Flow.statusPill}
        statusKind={advance.finished ? "ready" : "critical"}
      />

      <div className="grid grid-cols-[380px_1fr] flex-1">
        {/* LEFT — Timeline rail */}
        <aside className="bg-white border-r border-divider px-6 py-7">
          <div className="mb-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
              Agent timeline
            </div>
            <div className="text-[13px] text-ink mt-1">
              {advance.finished
                ? "Complete · 5 of 5 done"
                : advance.awaitingApproval
                  ? "Awaiting your decision"
                  : `Running · ${step + 1} of 5`}
            </div>
            <div className="mt-3 h-1 bg-divider/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-surface-deep transition-all duration-[600ms] ease-out"
                style={{ width: `${((advance.finished ? 5 : step + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
          <Timeline steps={uc2Flow.steps} activeStep={step} pauseAt={3} />
        </aside>

        {/* RIGHT — Run progress + decision + auto actions */}
        <main className="px-6 py-5 space-y-3">
          <AlertBanner title={uc2Flow.alert.title} sub={uc2Flow.alert.sub} />

          {!advance.finished && (
            <AgentLiveStrip
              lines={
                liveScripts[advance.awaitingApproval ? 3 : Math.min(step, 4)] ??
                liveScripts[3]
              }
            />
          )}

          {step >= 3 && (
            <DecisionCardUC2 awaiting={advance.awaitingApproval} onApprove={handleApprove} />
          )}

          <RunProgressPanel
            steps={runSteps}
            activeStep={step}
            pauseAt={3}
            awaitingApproval={advance.awaitingApproval}
            finished={advance.finished}
          />

          {step >= 3 && (
            <div className="grid grid-cols-2 gap-3 items-stretch">
              <AutoActions
                items={[
                  { label: "Update payroll in Germany" },
                  { label: "Send employee announcement (German + English)" },
                  { label: "Notify works council" },
                  { label: "Log the decision" },
                ]}
                executing={!advance.awaitingApproval && step > 3}
              />
              <ActivityLog
                entries={step > 3 ? activityExecuting : activityIdle}
                live
              />
            </div>
          )}
        </main>
      </div>

      <Toast
        show={toast > 0}
        title="Decision approved"
        body="Audit logged · agent is rolling out the change."
        cta={{ label: "View audit entry", onClick: () => {} }}
      />
    </div>
  );
}
