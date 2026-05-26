import { useState } from "react";
import { useApp } from "@/state";
import { SpringIn } from "@/components/ai/SpringIn";
import { CountUp } from "@/components/ai/CountUp";
import { PillButton } from "@/components/blocks/PillButton";
import { EditDecisionModal } from "@/components/workspace/EditDecisionModal";
import { cn } from "@/lib/utils";

export function DecisionCardUC2({
  awaiting,
  onApprove,
}: {
  awaiting: boolean;
  onApprove: () => void;
}) {
  const { go, showCompletion } = useApp();
  const [editing, setEditing] = useState(false);

  if (!awaiting) {
    return (
      <SpringIn>
        <section className="bg-surface-mint border-2 border-surface-deep rounded-md p-7 space-y-3">
          <div className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Approved · audit logged
          </div>
          <h3 className="text-[22px] font-bold text-ink leading-[28px]">
            Roll-out under way
          </h3>
          <p className="text-[14px] text-ink">
            Payroll updated, announcements sent, works council notified. We'll
            keep tracking until the 17 August go-live.
          </p>
          <PillButton
            variant="primary"
            size="md"
            arrow
            onClick={() => showCompletion("uc2")}
          >
            Back to dashboard
          </PillButton>
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
          <h3 className="text-[22px] font-bold text-ink leading-[28px] mt-1">
            Approve the 90-day Germany workweek roll-out
          </h3>
        </header>

        <div className="grid grid-cols-4 gap-0 divide-x divide-divider">
          {[
            { label: "Affected", value: 147, decimals: 0 },
            { label: "Contracts", value: 12, decimals: 0 },
            { label: "Payroll", value: 4, decimals: 0 },
            { label: "Risk", display: "Medium" },
          ].map((m, i) => (
            <div key={m.label} className={cn("px-4 first:pl-0 last:pr-0")}>
              <div className="text-[11px] uppercase tracking-[0.08em] text-mute font-medium mb-1">
                {m.label}
              </div>
              <div className="text-[24px] font-bold leading-none text-ink">
                {"value" in m && m.value !== undefined ? (
                  <CountUp to={m.value} decimals={m.decimals ?? 0} delay={i * 80} duration={900} />
                ) : (
                  m.display
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-mute font-medium mb-2">
            90-day roll-out
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Notify and file", when: "D0–D14", current: true },
              { label: "Update contracts", when: "D15–D60", current: false },
              { label: "Go live · payroll", when: "D61–D90", current: false },
            ].map((p) => (
              <div
                key={p.label}
                className={cn(
                  "p-3 rounded",
                  p.current ? "bg-surface-mint" : "bg-surface-fog",
                )}
              >
                <div className="text-[13px] font-medium text-ink">{p.label}</div>
                <div className="text-[11px] text-mute mt-0.5">{p.when}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-mute font-medium mb-2">
            Documents we'll send
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "working-hours-act" as const, label: "Source law" },
              { id: "handbook-redline" as const, label: "Handbook redline" },
              { id: "employee-announcement" as const, label: "Employee announcement" },
              { id: "works-council-notice" as const, label: "Works council notice" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => go({ kind: "doc", id: d.id })}
                className="ui-pill text-[13px] px-3 py-1.5 rounded-full bg-surface-fog text-ink hover:bg-surface-mint inline-flex items-center gap-1.5"
              >
                {d.label}
                <span aria-hidden>↗</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <PillButton variant="secondary" size="lg" onClick={() => setEditing(true)}>
            Edit before approving
          </PillButton>
          <PillButton variant="primary" size="lg" arrow onClick={onApprove}>
            Approve and execute
          </PillButton>
        </div>
      </section>
      <EditDecisionModal flow="uc2" open={editing} onClose={() => setEditing(false)} />
    </SpringIn>
  );
}
