import { useState } from "react";
import { useApp } from "@/state";
import { SpringIn } from "@/components/ai/SpringIn";
import { PillButton } from "@/components/blocks/PillButton";
import { EditDecisionModal } from "@/components/workspace/EditDecisionModal";
import { FinalSummaryBlocks } from "@/components/workspace/OffboardingCards";
import { cn } from "@/lib/utils";

export function DecisionCardUC1({
  awaiting,
  letterSigned,
  onApprove,
  onOpenKT,
  onOpenRevocation,
  onOpenExit,
  onOpenLetter,
}: {
  awaiting: boolean;
  letterSigned: boolean;
  onApprove: () => void;
  onOpenKT: () => void;
  onOpenRevocation: () => void;
  onOpenExit: () => void;
  onOpenLetter: () => void;
}) {
  const { showCompletion } = useApp();
  const [editing, setEditing] = useState(false);

  if (!awaiting) {
    return (
      <SpringIn>
        <section className="bg-surface-mint border-2 border-surface-deep rounded-md p-6 space-y-3">
          <div className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Approved · audit logged
          </div>
          <h3 className="text-[22px] font-bold text-ink leading-[28px]">
            Offboarding under way · Camila Souza
          </h3>
          <p className="text-[14px] text-ink">
            KT sessions scheduled with Rafael F. and Beatriz O. · 23 SaaS accesses armed for
            17:00 BRT on Friday 27 June · exit interview booked · offboarding letter filed with
            homologação. Everything is logged.
          </p>
          <PillButton
            variant="primary"
            size="md"
            arrow
            onClick={() => showCompletion("uc1")}
          >
            Back to dashboard
          </PillButton>
        </section>
      </SpringIn>
    );
  }

  return (
    <SpringIn>
      <section
        className={cn(
          "bg-white border-2 rounded-md p-6 space-y-5 transition-colors",
          letterSigned ? "border-surface-deep" : "border-ink",
        )}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <div
              className={cn(
                "text-[12px] tracking-[0.08em] uppercase font-medium",
                letterSigned ? "text-surface-deep" : "text-mark-red",
              )}
            >
              {letterSigned ? "Ready to approve" : "Decision card · 1 item to sign"}
            </div>
            <h3 className="text-[22px] font-bold text-ink leading-[28px] mt-1">
              Approve Camila Souza's offboarding package
            </h3>
            <p className="text-[13px] text-mute mt-1.5 max-w-[640px]">
              Four blocks below summarize what the agent built. Open any block to inspect or
              edit. The offboarding letter must be signed before final approval.
            </p>
          </div>
          <div className="text-right text-[11px] text-mute leading-tight shrink-0">
            <div>HR-0178 · Brazil</div>
            <div>Tenure 4y 3m · last day 27 Jun</div>
          </div>
        </header>

        <FinalSummaryBlocks
          onOpenKT={onOpenKT}
          onOpenRevocation={onOpenRevocation}
          onOpenExit={onOpenExit}
          onOpenLetter={onOpenLetter}
          letterSigned={letterSigned}
        />

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-divider">
          <span
            className={cn(
              "text-[12px]",
              letterSigned ? "text-surface-deep font-bold" : "text-mark-red font-bold",
            )}
          >
            {letterSigned
              ? "Offboarding letter signed · ready to file with payroll + union"
              : "Offboarding letter awaits your signature"}
          </span>
          <div className="flex items-center gap-3">
            <PillButton variant="secondary" size="lg" onClick={() => setEditing(true)}>
              Edit before approving
            </PillButton>
            <PillButton
              variant="primary"
              size="lg"
              arrow
              disabled={!letterSigned}
              onClick={onApprove}
            >
              {letterSigned ? "Approve offboarding" : "Sign letter to approve"}
            </PillButton>
          </div>
        </div>
      </section>
      <EditDecisionModal flow="uc1" open={editing} onClose={() => setEditing(false)} />
    </SpringIn>
  );
}
