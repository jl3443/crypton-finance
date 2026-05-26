import { useState } from "react";
import { uc3Flow } from "@/data/scenarios";
import { useApp } from "@/state";
import { useAutoAdvance } from "@/components/workspace/useAutoAdvance";
import { WorkspaceTopbar } from "@/components/workspace/WorkspaceTopbar";
import { Timeline } from "@/components/workspace/Timeline";
import { AlertBanner } from "@/components/workspace/AlertBanner";
import { DecisionCardUC3 } from "@/components/workspace/DecisionCardUC3";
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

// Per-step rotating "what the agent is doing right now" status.
const liveScripts: Record<number, string[]> = {
  0: [
    "Pulling Radford · Levels.fyi · Comprehensive feeds…",
    "Filtering to Senior Engineer · San Francisco · L4…",
    "Building market range · P10 to P90 distribution…",
    "Median $158K · range $130K–$180K · 47 comparable cases…",
  ],
  1: [
    "Loading the team headcount · 11 Senior engineers in scope…",
    "Computing internal equity bands · ±5% of Marcus…",
    "Flagging adjacent peers who would re-band on a raise…",
    "Peers B + C identified as cascade candidates in the retention scenario…",
  ],
  2: [
    "Drafting Conservative · $148K · P25 · high attrition risk…",
    "Drafting Mid · $158K · P50 · balanced, no cascade…",
    "Drafting Retention · $168K · P85 · best retention, peer cascade…",
    "Building budget impact + one-line rationale per scenario…",
  ],
  3: [
    "Awaiting your scenario pick…",
    "Click ‘Why this number?’ on any card to see the evidence behind it…",
    "On confirm, the agent fills Workday + drafts manager talking points + Finance one-pager…",
  ],
  4: [
    "Filing the salary update form in Workday…",
    "Sending the manager talking points…",
    "Routing the Finance one-pager for Director review…",
    "Writing the audit log entry…",
  ],
};

const activityIdle: ActivityEntry[] = [
  { time: "11:05", text: "Three salary options drafted with budget impact" },
  { time: "11:04", text: "Internal equity computed across 11 teammates" },
  { time: "11:03", text: "Market data pulled · Senior Engineer · San Francisco" },
  { time: "11:02", text: "Retention request received from a manager" },
];

const activityExecuting: ActivityEntry[] = [
  { time: "now", text: "Salary update form filled · routed to Workday" },
  { time: "now", text: "Manager talking points sent to the requesting manager" },
  { time: "now", text: "Finance summary written · queued for Finance Director review" },
  { time: "now", text: "Audit entry written · approver: HRBP" },
];

export function WorkspaceUC3() {
  const { flowProgress, setFlowProgress } = useApp();
  const advance = useAutoAdvance({
    total: uc3Flow.steps.length,
    pauseAt: 3,
    external: {
      activeStep: flowProgress.uc3.activeStep,
      approved: flowProgress.uc3.approved,
      set: (next) => setFlowProgress("uc3", next),
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
      title: "Pull fresh market data",
      sub: "Senior Engineer · San Francisco · 3 providers",
      source: "Market data",
      time: "11:03",
      expanded: (
        <FeedDetectorCard
          source="Market data sources · 3 providers"
          detail="Pulling fresh benchmarks for Senior Engineer in San Francisco."
        />
      ),
    },
    {
      title: "Compare Marcus to the team",
      sub: "11 teammates · same level + region",
      source: "HR record",
      time: "11:04",
      expanded: (
        <ImpactBarsCard
          title="Comparing Marcus to the team"
          rows={[
            { label: "Teammates compared", value: 11 },
            { label: "Within ±5% of Marcus", value: 2 },
            { label: "Bay-area median", value: 158, suffix: "K" },
            { label: "Current gap", value: 8, suffix: "%" },
          ]}
        />
      ),
    },
    {
      title: "Draft three options",
      sub: "Conservative · Mid · Retention — each with budget impact",
      source: "Comp planning",
      time: "11:05",
      expanded: (
        <DraftingArtifactsCard
          rows={[
            { label: "Conservative scenario", sub: "$148K · budget +$2.5K", source: "Comp planning" },
            { label: "Mid scenario", sub: "$158K · budget +$12K", source: "Comp planning" },
            { label: "Retention scenario", sub: "$168K · budget +$22K", source: "Comp planning" },
            { label: "Internal equity preview", sub: "11 teammates compared", source: "HR record" },
          ]}
        />
      ),
    },
    {
      title: "Pick a scenario",
      sub: "Default mid · $158K · budget headroom $23K",
      time: advance.awaitingApproval ? "now" : "11:05",
    },
    {
      title: "Execute across systems",
      sub: "Workday · manager talking points · Finance summary · audit log",
      time: advance.finished ? "now" : "—",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <WorkspaceTopbar
        title={uc3Flow.contextTitle}
        sub={uc3Flow.contextSub + " · Compensation"}
        statusPill={advance.finished ? "Confirmed · audit logged" : uc3Flow.statusPill}
        statusKind={advance.finished ? "ready" : "critical"}
      />

      <div className="grid grid-cols-[380px_1fr] flex-1">
        <aside className="bg-white border-r border-divider px-6 py-7">
          <div className="mb-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
              Agent timeline
            </div>
            <div className="text-[13px] text-ink mt-1">
              {advance.finished
                ? "Complete · 5 of 5 done"
                : advance.awaitingApproval
                  ? "Pick a scenario"
                  : `Running · ${step + 1} of 5`}
            </div>
            <div className="mt-3 h-1 bg-divider/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-surface-deep transition-all duration-[600ms] ease-out"
                style={{ width: `${((advance.finished ? 5 : step + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
          <Timeline steps={uc3Flow.steps} activeStep={step} pauseAt={3} />
        </aside>

        <main className="px-6 py-5 space-y-3">
          <AlertBanner title={uc3Flow.alert.title} sub={uc3Flow.alert.sub} />

          {!advance.finished && (
            <AgentLiveStrip
              lines={
                liveScripts[advance.awaitingApproval ? 3 : Math.min(step, 4)] ??
                liveScripts[3]
              }
            />
          )}

          {step >= 3 && (
            <DecisionCardUC3 awaiting={advance.awaitingApproval} onApprove={handleApprove} />
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
                  { label: "File salary update form (Workday)" },
                  { label: "Send talking points to manager" },
                  { label: "Route Finance summary for review" },
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
        title="Compensation update confirmed"
        body="Workday form filled · talking points sent · Finance notified."
        cta={{ label: "View the deliverables", onClick: () => {} }}
      />
    </div>
  );
}
