import { useApp, type FlowId } from "@/state";
import { FLOWS } from "@/data/flows";
import { Timeline } from "@/components/workspace/Timeline";
import { AgentLiveStrip } from "@/components/ai/AgentLiveStrip";
import { PillButton } from "@/components/blocks/PillButton";
import { cn } from "@/lib/utils";

/**
 * Workspace shell — [380px Timeline | flex-1 content] with a slim top
 * progress bar and AgentLiveStrip overhead. Day-1 placeholder content
 * area; later days fill in per-step content + dashboard + ExportCeremony.
 */
export function Workspace({ flow }: { flow: FlowId }) {
  const { flowProgress, setFlowProgress, go } = useApp();
  const f = FLOWS[flow];
  const activeStep = flowProgress[flow].activeStep;
  const totalSteps = f.steps.length;
  const progress = Math.min(activeStep / Math.max(totalSteps - 1, 1), 1);
  const currentStep = f.steps[activeStep];
  const liveLines = currentStep?.liveScripts ?? [`${currentStep.title}…`];

  const goNext = () =>
    setFlowProgress(flow, { activeStep: Math.min(activeStep + 1, totalSteps - 1) });
  const goPrev = () =>
    setFlowProgress(flow, { activeStep: Math.max(activeStep - 1, 0) });

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

          {/* Placeholder card — Day 2 will replace with per-step content */}
          <article className={cn("bg-white border border-divider rounded-md p-8 ai-spring")}>
            <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-2">
              Step {activeStep + 1} of {totalSteps}
            </div>
            <h2 className="text-[28px] font-bold text-ink leading-[32px] tracking-[-0.01em] mb-4">
              {currentStep.title}
            </h2>
            <p className="text-[15px] text-ink leading-[24px] max-w-[680px] mb-6">
              {currentStep.detail}
            </p>
            {currentStep.docs && currentStep.docs.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-2">
                  Documents this step produced
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentStep.docs.map((id) => (
                    <span
                      key={id}
                      className="ui-pill inline-flex items-center gap-1.5 rounded-full bg-surface-fog text-ink hover:bg-surface-mint px-3 py-1.5 text-[12px] font-medium border border-divider"
                    >
                      {id} <span aria-hidden>↗</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <PillButton variant="secondary" size="md" onClick={goPrev} disabled={activeStep === 0}>
                Back
              </PillButton>
              <PillButton
                variant="primary"
                size="md"
                arrow
                onClick={goNext}
                disabled={activeStep >= totalSteps - 1}
              >
                {activeStep >= totalSteps - 1 ? "End of preview" : "Continue"}
              </PillButton>
              <span className="ml-auto text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
                Day-1 shell · per-step content lands Day 2+
              </span>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
