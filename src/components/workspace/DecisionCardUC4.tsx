import { useState } from "react";
import { useApp } from "@/state";
import { SpringIn } from "@/components/ai/SpringIn";
import { PillButton } from "@/components/blocks/PillButton";
import { EditDecisionModal } from "@/components/workspace/EditDecisionModal";
import { CountUp } from "@/components/ai/CountUp";
import { Mail, Laptop, KeyRound, CalendarDays, ShieldCheck, Users } from "lucide-react";

export function DecisionCardUC4({
  awaiting,
  onApprove,
}: {
  awaiting: boolean;
  onApprove: () => void;
}) {
  const { showCompletion } = useApp();
  const [editing, setEditing] = useState(false);

  if (!awaiting) {
    return (
      <SpringIn>
        <section className="bg-surface-mint border-2 border-surface-deep rounded-md p-6 space-y-3">
          <div className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Approved · onboarding live
          </div>
          <h3 className="text-[22px] font-bold text-ink leading-[28px]">
            Aurélie arrives to a working laptop
          </h3>
          <p className="text-[14px] text-ink">
            Preboarding bundle dispatched, Day-1 calendar booked, 30/60/90 plan in her inbox,
            Swiss compliance items scheduled. Buddy assigned. Audit logged.
          </p>
          <PillButton
            variant="primary"
            size="md"
            arrow
            onClick={() => showCompletion("uc4")}
          >
            Back to dashboard
          </PillButton>
        </section>
      </SpringIn>
    );
  }

  return (
    <SpringIn>
      <section className="bg-white border-2 border-ink rounded-md p-6 space-y-5">
        <header>
          <div className="text-[12px] tracking-[0.08em] uppercase text-mark-red font-medium">
            Decision card
          </div>
          <h3 className="text-[22px] font-bold text-ink leading-[28px] mt-1">
            Approve Aurélie L.'s onboarding package
          </h3>
          <p className="text-[13px] text-mute mt-1.5">
            Everything the agent set up · review the four blocks below or open Edit to tune any field.
          </p>
        </header>

        {/* Preboarding summary */}
        <section className="bg-surface-fog rounded p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold text-ink">Preboarding bundle</h4>
            <span className="px-2 py-0.5 rounded-full bg-surface-deep text-ink-inverse text-[11px] font-medium">
              4 of 4 filed
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { Icon: Mail, label: "Welcome message", sub: "Bilingual · 09:00 CET" },
              { Icon: Laptop, label: "Equipment", sub: "MacBook Pro 14 · Fri" },
              { Icon: KeyRound, label: "IT accounts", sub: "Okta · Workspace · Slack" },
              { Icon: ShieldCheck, label: "Work permit", sub: "EU/EEA · not required" },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-2 min-w-0">
                <div className="w-7 h-7 rounded bg-surface-mint flex items-center justify-center text-surface-deep shrink-0">
                  <b.Icon size={14} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-ink leading-[15px] truncate">
                    {b.label}
                  </div>
                  <div className="text-[11px] text-mute leading-[14px] truncate">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Day-1 + 30/60/90 summary */}
        <section className="bg-surface-fog rounded p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold text-ink">Day 1 + first 90 days</h4>
            <span className="px-2 py-0.5 rounded-full bg-surface-deep text-ink-inverse text-[11px] font-medium">
              7 meetings · 9 milestones
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} strokeWidth={1.8} className="text-surface-deep" />
              <span className="text-ink">
                <CountUp to={7} duration={500} /> meetings on Day 1
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} strokeWidth={1.8} className="text-surface-deep" />
              <span className="text-ink">Buddy · Léa M.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-surface-deep font-bold tabular-nums">30 · 60 · 90</span>
              <span className="text-ink">milestone plan ready</span>
            </div>
          </div>
        </section>

        {/* Compliance summary */}
        <section className="bg-surface-fog rounded p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold text-ink">Switzerland compliance</h4>
            <span className="px-2 py-0.5 rounded-full bg-mark-red text-ink-inverse text-[11px] font-medium">
              2 items need your signature
            </span>
          </div>
          <ul className="text-[12px] space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-deep mt-1.5 shrink-0" />
              <span className="text-ink">
                Cantonal residency registration · Aurélie has 14 days from arrival
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-deep mt-1.5 shrink-0" />
              <span className="text-ink">
                Quellensteuer form drafted · routes to BS canton on your sign-off
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mute/60 mt-1.5 shrink-0" />
              <span className="text-mute">3 other items already met or auto-scheduled</span>
            </li>
          </ul>
        </section>

        <div className="flex items-center justify-end gap-3 pt-1">
          <PillButton variant="secondary" size="lg" onClick={() => setEditing(true)}>
            Edit before approving
          </PillButton>
          <PillButton variant="primary" size="lg" arrow onClick={onApprove}>
            Approve onboarding
          </PillButton>
        </div>
      </section>
      <EditDecisionModal flow="uc4" open={editing} onClose={() => setEditing(false)} />
    </SpringIn>
  );
}
