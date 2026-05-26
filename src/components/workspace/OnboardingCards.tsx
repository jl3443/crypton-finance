import { AIDot } from "@/components/ai/AIDot";
import { SpringIn } from "@/components/ai/SpringIn";
import { StaggerList } from "@/components/ai/StaggerList";
import { CountUp } from "@/components/ai/CountUp";
import { cn } from "@/lib/utils";
import {
  Mail,
  Laptop,
  KeyRound,
  IdCard,
  CalendarDays,
  ShieldCheck,
  GraduationCap,
  FileText,
  AlertTriangle,
  Check,
  type LucideIcon,
} from "lucide-react";
import type { PreboardingKind } from "@/components/workspace/OnboardingModals";

/* ─────────────────────────────────────────────────────────────────────
 * STEP 0 — Signed offer parsed
 * ──────────────────────────────────────────────────────────────────────*/

export function SignedOfferCard() {
  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 space-y-4">
        <header className="flex items-center gap-2">
          <AIDot size={6} tone="deep" />
          <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Signed offer parsed
          </span>
        </header>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Candidate", value: "Aurélie L." },
            { label: "Role", value: "Marketing Manager" },
            { label: "Location", value: "🇨🇭 Basel" },
            { label: "Start date", value: "Mon 25 May" },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium mb-1">
                {f.label}
              </div>
              <div className="text-[14px] font-bold text-ink">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="text-[12px] text-mute pt-2 border-t border-divider/80">
          Role template loaded · 30/60/90 baseline available · hiring manager: Niklas K.
        </div>
      </article>
    </SpringIn>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * STEP 1 — Preboarding bundle (now with View buttons per row)
 * ──────────────────────────────────────────────────────────────────────*/

type BundleItem = {
  kind: PreboardingKind;
  Icon: LucideIcon;
  label: string;
  sub: string;
  source: string;
};

const bundleItems: BundleItem[] = [
  {
    kind: "welcome",
    Icon: Mail,
    label: "Welcome message",
    sub: "Bilingual · French + English · queued for 09:00 CET today",
    source: "Outlook",
  },
  {
    kind: "equipment",
    Icon: Laptop,
    label: "Equipment ticket",
    sub: "MacBook Pro 14 · Magic Mouse · 27\" display · delivered by Fri",
    source: "IT Service Desk",
  },
  {
    kind: "it",
    Icon: KeyRound,
    label: "IT account provisioning",
    sub: "Okta · Google Workspace · Slack · Confluence · Workday",
    source: "Identity provider",
  },
  {
    kind: "permit",
    Icon: IdCard,
    label: "Work permit check",
    sub: "EU/EEA · no permit required · cantonal registration reminder set",
    source: "Compliance agent",
  },
];

/** Items that are "in flight" (still awaiting approval / provisioning) while
 *  the parent flow has not reached step 4 yet. Welcome + permit complete
 *  instantly; equipment + IT take longer (carrier handoff + 12-app provisioning). */
const PENDING_KINDS: PreboardingKind[] = ["equipment", "it"];

export function PreboardingBundleCard({
  onView,
  parentStep,
}: {
  onView: (kind: PreboardingKind) => void;
  /** Current UC4 step — drives the per-row status:
   *  steps 2-3 → equipment + IT show amber pending; step 4 → all green. */
  parentStep: number;
}) {
  const allDone = parentStep >= 4;
  const doneCount = allDone ? bundleItems.length : bundleItems.length - PENDING_KINDS.length;

  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 space-y-3">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" pulse={!allDone} />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Preboarding bundle · {doneCount} of {bundleItems.length}{" "}
              {allDone ? "delivered" : "delivered · 2 in flight"}
            </span>
          </div>
          <span className="text-[11px] text-mute">Click View to open each artifact</span>
        </header>
        <StaggerList step={120} initialDelay={150}>
          {bundleItems.map((b) => {
            const pending = !allDone && PENDING_KINDS.includes(b.kind);
            return (
              <button
                key={b.kind}
                type="button"
                onClick={() => onView(b.kind)}
                className={cn(
                  "ui-pill w-full flex items-center gap-3 px-3 py-2.5 rounded-md border text-left transition-colors",
                  pending
                    ? "border-[#F59E0B]/40 bg-[#FFFBEB] hover:bg-[#FFF4D6]"
                    : "border-divider hover:bg-surface-mint/30 hover:border-surface-deep/30",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
                    pending
                      ? "bg-[#FCD9A6] text-[#92400E]"
                      : "bg-surface-mint text-surface-deep",
                  )}
                >
                  <b.Icon size={17} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-ink leading-[16px]">{b.label}</div>
                  <div
                    className={cn(
                      "text-[12px] leading-[16px] mt-0.5",
                      pending ? "text-[#92400E]" : "text-mute",
                    )}
                  >
                    {pending ? pendingDetail(b.kind, parentStep) : b.sub}
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] tracking-[0.06em] uppercase font-medium shrink-0",
                    pending
                      ? "bg-[#FCD9A6] text-[#92400E]"
                      : "bg-surface-fog text-surface-deep",
                  )}
                >
                  {b.source}
                </span>
                {pending ? (
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B]/15 text-[#92400E] flex items-center justify-center shrink-0 relative">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[#F59E0B]/30 animate-ping"
                    />
                    <div className="relative w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-accent-green text-ink-inverse flex items-center justify-center shrink-0">
                    <Check size={13} strokeWidth={2.4} />
                  </span>
                )}
                <span
                  className={cn(
                    "text-[12px] font-bold shrink-0 pl-1",
                    pending ? "text-[#92400E]" : "text-surface-deep",
                  )}
                >
                  View →
                </span>
              </button>
            );
          })}
        </StaggerList>
      </article>
    </SpringIn>
  );
}

function pendingDetail(kind: PreboardingKind, parentStep: number): string {
  if (kind === "equipment") {
    if (parentStep <= 2) return "Awaiting Niklas K. one-tap approval…";
    if (parentStep === 3) return "Cleared by manager · with IT service desk now";
    return "Carrier confirmed · delivery by Fri 16:00";
  }
  if (kind === "it") {
    if (parentStep <= 2) return "Staging account · 3 of 12 apps ready";
    if (parentStep === 3) return "Provisioning · 8 of 12 apps ready";
    return "Active · passkey enrolment sent";
  }
  return "";
}

/* ─────────────────────────────────────────────────────────────────────
 * STEP 2 — Day-1 + 30/60/90 summary (after the calendar modal closes)
 * The full grid is in the modal; this card is just the recap.
 * ──────────────────────────────────────────────────────────────────────*/

export function DayPlanReadyCard({ onReopen }: { onReopen: () => void }) {
  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-surface-mint flex items-center justify-center text-surface-deep shrink-0">
          <CalendarDays size={18} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Day-1 calendar + 30/60/90 plan ready
            </span>
          </div>
          <div className="text-[14px] text-ink mt-1.5">
            <span className="font-bold">7 meetings</span> on Day 1 ·{" "}
            <span className="font-bold">14 milestones</span> across May, June, July · auto-synced
            to Aurélie's inbox and Niklas's calendar.
          </div>
        </div>
        <button
          type="button"
          onClick={onReopen}
          className="ui-pill text-[12px] font-bold text-surface-deep border border-surface-deep/30 rounded-full px-3 py-1.5 hover:bg-surface-mint/40 shrink-0"
        >
          Re-open plan
        </button>
      </article>
    </SpringIn>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * STEP 3 — Country compliance scan
 * - 2 "needs sign-off" rows are clickable
 * - Card accepts `signed` set; signed items flip to "Signed · audit logged"
 * - The card itself becomes the approval surface
 * ──────────────────────────────────────────────────────────────────────*/

export type ComplianceSignId = "residency" | "quellensteuer";

type ComplianceItem = {
  Icon: LucideIcon;
  label: string;
  sub: string;
  baseState: "satisfied" | "queued";
  signId?: ComplianceSignId;
};

const complianceItems: ComplianceItem[] = [
  {
    Icon: ShieldCheck,
    label: "Works council notification",
    sub: "Switzerland has no Betriebsrat equivalent · not required",
    baseState: "satisfied",
  },
  {
    Icon: GraduationCap,
    label: "Mandatory training · workplace safety",
    sub: "ART · scheduled for Day 3 morning · 45 min e-learning",
    baseState: "queued",
  },
  {
    Icon: GraduationCap,
    label: "Mandatory training · data protection (DSG)",
    sub: "Swiss FADP module · enrolled · Day 1 afternoon",
    baseState: "queued",
  },
  {
    Icon: FileText,
    label: "AHV/IV social insurance registration",
    sub: "Auto-filed with cantonal office · receipt expected Tue",
    baseState: "queued",
  },
  {
    Icon: AlertTriangle,
    label: "Cantonal residency registration",
    sub: "Aurélie must register within 14 days · sign reminder file",
    baseState: "queued",
    signId: "residency",
  },
  {
    Icon: AlertTriangle,
    label: "Source taxation form",
    sub: "Quellensteuer · payroll routes to BS canton · drafted, awaiting signature",
    baseState: "queued",
    signId: "quellensteuer",
  },
];

export function CountryComplianceCard({
  signed,
  onOpenContract,
}: {
  signed: Record<ComplianceSignId, boolean>;
  onOpenContract: (id: ComplianceSignId) => void;
}) {
  const needsSignoff = complianceItems.filter(
    (i) => i.signId && !signed[i.signId],
  ).length;
  const satisfied = complianceItems.filter((c) => c.baseState === "satisfied").length;
  const queued = complianceItems.filter(
    (c) => c.baseState === "queued" && !c.signId,
  ).length;
  const signedCount = complianceItems.filter(
    (i) => i.signId && signed[i.signId],
  ).length;
  const allSigned = needsSignoff === 0;

  return (
    <SpringIn>
      <article
        className={cn(
          "bg-white border rounded-md p-5 space-y-3 transition-colors",
          allSigned
            ? "border-2 border-surface-deep bg-surface-mint/20"
            : "border-divider",
        )}
      >
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" pulse={!allSigned} />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Switzerland · compliance scan
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-mute">
              <CountUp to={satisfied} duration={500} /> met ·{" "}
              <CountUp to={queued} duration={500} delay={120} /> scheduled
              {signedCount > 0 && (
                <>
                  {" "}
                  · <span className="text-surface-deep font-bold">{signedCount} signed</span>
                </>
              )}
            </span>
            {needsSignoff > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-mark-red text-ink-inverse font-bold">
                {needsSignoff} need sign-off
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-surface-deep text-ink-inverse font-bold">
                Cleared
              </span>
            )}
          </div>
        </header>

        <div className="space-y-2">
          {complianceItems.map((c, i) => {
            const isSigned = c.signId ? signed[c.signId] : false;
            const isClickable = !!c.signId && !isSigned;
            const isSatisfied = c.baseState === "satisfied" || isSigned;
            const chipText = isSigned
              ? "Signed · filed"
              : c.signId
                ? "Needs sign-off"
                : isSatisfied
                  ? "Already met"
                  : "Scheduled";
            const chipCls = isSigned
              ? "bg-accent-green text-ink-inverse"
              : c.signId
                ? "bg-mark-red/15 text-mark-red"
                : isSatisfied
                  ? "bg-surface-mint text-surface-deep"
                  : "bg-surface-fog text-ink";

            const Row = (
              <>
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                    isSigned
                      ? "bg-accent-green/15 text-accent-green"
                      : isSatisfied
                        ? "bg-surface-mint text-surface-deep"
                        : c.signId
                          ? "bg-mark-red/10 text-mark-red"
                          : "bg-surface-fog text-surface-deep",
                  )}
                >
                  {isSigned ? (
                    <Check size={15} strokeWidth={2.4} />
                  ) : (
                    <c.Icon size={15} strokeWidth={1.8} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-ink leading-[16px]">
                    {c.label}
                  </div>
                  <div className="text-[12px] text-mute leading-[16px] mt-0.5">
                    {isSigned ? "Signed · routed to authority · audit logged" : c.sub}
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] tracking-[0.06em] uppercase font-bold shrink-0",
                    chipCls,
                  )}
                >
                  {chipText}
                </span>
                {isClickable && (
                  <span className="text-[12px] font-bold text-surface-deep shrink-0 pl-1">
                    Open + sign →
                  </span>
                )}
              </>
            );

            return isClickable ? (
              <button
                key={c.label}
                type="button"
                onClick={() => c.signId && onOpenContract(c.signId)}
                className="ai-stream ui-pill w-full flex items-start gap-3 px-3 py-2.5 rounded-md border border-mark-red/30 bg-mark-red/[0.04] text-left hover:bg-mark-red/10 transition-colors"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {Row}
              </button>
            ) : (
              <div
                key={c.label}
                className="ai-stream flex items-start gap-3 px-3 py-2.5 rounded-md border border-divider"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {Row}
              </div>
            );
          })}
        </div>

        {allSigned && (
          <div className="pt-2 border-t border-surface-deep/15 flex items-center gap-2 text-[12px] text-surface-deep">
            <Check size={14} strokeWidth={2.4} />
            <span className="font-bold">
              All sign-offs complete · onboarding ready to go live.
            </span>
          </div>
        )}
      </article>
    </SpringIn>
  );
}
