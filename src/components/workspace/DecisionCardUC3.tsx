import { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/state";
import { SpringIn } from "@/components/ai/SpringIn";
import { PillButton } from "@/components/blocks/PillButton";
import { EditDecisionModal } from "@/components/workspace/EditDecisionModal";
import { EquityChart } from "@/components/workspace/EquityChart";
import { CompMarketEvidenceModal } from "@/components/workspace/CompMarketModals";
import { scenarios, type ScenarioId } from "@/data/uc3";
import { Sparkles } from "lucide-react";

export function DecisionCardUC3({
  awaiting,
  onApprove,
}: {
  awaiting: boolean;
  onApprove: () => void;
}) {
  const { go, showCompletion } = useApp();
  const [selected, setSelected] = useState<ScenarioId>("mid");
  const [editing, setEditing] = useState(false);
  const [evidenceFor, setEvidenceFor] = useState<ScenarioId | null>(null);
  const picked = scenarios.find((s) => s.id === selected)!;

  if (!awaiting) {
    return (
      <SpringIn>
        <section className="bg-surface-mint border-2 border-surface-deep rounded-md p-7 space-y-2">
          <div className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Confirmed · deliverables generating
          </div>
          <h3 className="text-[22px] font-bold text-ink leading-[28px]">
            {picked.label} option locked in at ${(picked.amount / 1000).toFixed(0)}K
          </h3>
          <p className="text-[14px] text-ink">
            Salary update form, manager talking points, and Finance summary are ready in the
            deliverables document.
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <PillButton
              variant="primary"
              size="md"
              arrow
              onClick={() => go({ kind: "doc", id: "comp-deliverables" })}
            >
              View deliverables
            </PillButton>
            <PillButton
              variant="secondary"
              size="md"
              onClick={() => showCompletion("uc3")}
            >
              Back to dashboard
            </PillButton>
          </div>
        </section>
      </SpringIn>
    );
  }

  return (
    <SpringIn>
      <section className="bg-white border-2 border-ink rounded-md p-7 space-y-5">
        <header>
          <div className="text-[12px] tracking-[0.08em] uppercase text-mark-red font-medium">
            Decision card
          </div>
          <h3 className="text-[20px] font-bold text-ink leading-[26px] mt-1">
            Three defensible options · click to preview internal equity
          </h3>
        </header>

        {/* Picker */}
        <div className="grid grid-cols-3 gap-3">
          {scenarios.map((s) => {
            const isPicked = s.id === selected;
            return (
              <div
                key={s.id}
                className={cn(
                  "rounded-md transition-all duration-[200ms] flex flex-col",
                  isPicked
                    ? "bg-surface-mint border-2 border-surface-deep"
                    : "bg-white border-2 border-divider hover:border-ink",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelected(s.id)}
                  className="ui-pill text-left p-4 flex-1"
                >
                  <div className="flex items-center justify-between text-[10px] tracking-[0.08em] uppercase font-medium text-mute mb-1">
                    <span>{s.label}</span>
                    {isPicked && <span className="text-surface-deep">Selected</span>}
                  </div>
                  <div className="text-[22px] font-bold text-ink leading-none">
                    ${(s.amount / 1000).toFixed(0)}K
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[13px] text-ink font-medium">{s.delta}</span>
                    <span className="text-[11px] text-mute">vs current</span>
                  </div>
                  <div className="border-t border-divider/70 my-3" />
                  <div className="text-[11px] tracking-[0.06em] uppercase text-mute">Budget</div>
                  <div className="text-[13px] text-ink">{s.budget}</div>
                  <div className="text-[11px] tracking-[0.06em] uppercase text-mute mt-2">Risk</div>
                  <div className="text-[13px] text-ink">{s.riskLine}</div>
                  <div className="text-[11px] text-mute leading-[15px] mt-2">{s.rationale}</div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEvidenceFor(s.id);
                  }}
                  className={cn(
                    "ui-pill mx-3 mb-3 mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors",
                    isPicked
                      ? "bg-white text-surface-deep hover:bg-surface-deep hover:text-ink-inverse"
                      : "bg-surface-fog text-surface-deep hover:bg-surface-mint",
                  )}
                >
                  <Sparkles size={11} strokeWidth={2} />
                  Why this number?
                </button>
              </div>
            );
          })}
        </div>

        <EquityChart selectedScenarioId={selected} />

        <div className="flex items-center justify-end gap-3 pt-2">
          <PillButton variant="secondary" size="lg" onClick={() => setEditing(true)}>
            Customize
          </PillButton>
          <PillButton variant="primary" size="lg" arrow onClick={onApprove}>
            Confirm {picked.label} · generate deliverables
          </PillButton>
        </div>
      </section>
      <EditDecisionModal flow="uc3" open={editing} onClose={() => setEditing(false)} />
      <CompMarketEvidenceModal
        open={evidenceFor !== null}
        scenarioId={evidenceFor}
        onClose={() => setEvidenceFor(null)}
      />
    </SpringIn>
  );
}
