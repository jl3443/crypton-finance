import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PreviewModal } from "@/components/workspace/PreviewModal";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { StaggerList } from "@/components/ai/StaggerList";
import {
  Check,
  Mail,
  Laptop,
  KeyRound,
  IdCard,
  Eraser,
  FileSignature,
  Calendar,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
 * ApprovalChainStepper — small animated horizontal stepper used inside
 * the equipment + IT-provisioning modals so the audience sees the
 * approval chain advance as the parent flow progresses.
 * ──────────────────────────────────────────────────────────────────────*/

export type StepperNode = {
  label: string;
  Icon?: LucideIcon;
};

export function ApprovalChainStepper({
  nodes,
  /** index of the currently-active node (0..nodes.length). Higher than
   *  nodes.length-1 means "all done". Nodes < activeIndex are done,
   *  node === activeIndex is active (amber pulse), nodes > activeIndex are pending. */
  activeIndex,
  /** When true, every node is rendered as done — overrides activeIndex. */
  allDone = false,
}: {
  nodes: StepperNode[];
  activeIndex: number;
  allDone?: boolean;
}) {
  return (
    <div className="flex items-center gap-0 w-full">
      {nodes.map((n, i) => {
        const done = allDone || i < activeIndex;
        const active = !allDone && i === activeIndex;
        const Icon = n.Icon;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 relative",
                  done
                    ? "bg-surface-deep text-ink-inverse"
                    : active
                      ? "bg-[#FCD9A6] text-[#92400E]"
                      : "bg-surface-fog text-mute border border-divider",
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[#F59E0B]/40 animate-ping"
                  />
                )}
                {done ? (
                  <Check size={14} strokeWidth={2.4} />
                ) : Icon ? (
                  <Icon size={14} strokeWidth={1.8} />
                ) : (
                  <span className="text-[11px] font-bold">{i + 1}</span>
                )}
              </div>
              <div
                className={cn(
                  "text-[10px] leading-[12px] text-center tracking-[0.02em] font-medium max-w-[110px] transition-colors",
                  done
                    ? "text-surface-deep"
                    : active
                      ? "text-[#92400E]"
                      : "text-mute",
                )}
              >
                {n.label}
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex-1 h-px mx-1 relative top-[-12px]">
                <div
                  className={cn(
                    "h-full transition-all duration-700",
                    done ? "bg-surface-deep" : "bg-divider",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Offer letter modal
 * Centered DSM-style countersigned offer letter the agent ingests.
 * ──────────────────────────────────────────────────────────────────────*/

export function OfferLetterModal({
  open,
  onClose,
  onAdvance,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };
  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="Signed offer · ingested by the agent"
      title="Offer of employment · Marketing Manager"
      sub="DSM-Firmenich AG · Basel · countersigned 24 May 2026"
      width={720}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            Parsed in 2.1 s · 14 fields extracted · 0 ambiguities
          </span>
          <PillButton variant="primary" size="md" arrow onClick={finish}>
            Close and continue
          </PillButton>
        </div>
      }
    >
      <div className="px-7 py-6 space-y-5 text-ink">
        {/* Letterhead */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-divider">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-deep flex items-center justify-center">
              <span className="text-ink-inverse text-[15px] font-bold">✦</span>
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-bold">DSM-Firmenich AG</div>
              <div className="text-[11px] text-mute">
                Wurmisweg 576 · CH-4303 Kaiseraugst · Switzerland
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] text-mute leading-tight">
            <div>Ref · DSMF-HR-26-0175</div>
            <div>24 May 2026</div>
          </div>
        </div>

        {/* Recipient + intro */}
        <div className="space-y-1 text-[13px]">
          <div className="font-bold">Aurélie Laurent</div>
          <div className="text-mute">12 rue de la Synagogue · 68100 Mulhouse · France</div>
        </div>

        <p className="text-[13px] leading-[20px]">
          Dear Aurélie, we are pleased to confirm our offer of employment with DSM-Firmenich AG
          in Basel, Switzerland, on the terms set out below. Please countersign to accept.
        </p>

        {/* Key terms grid */}
        <div className="grid grid-cols-2 gap-3 bg-surface-fog rounded-md p-4">
          {[
            ["Position", "Marketing Manager"],
            ["Business unit", "Perfumery & Beauty · EMEA"],
            ["Reporting line", "Niklas K. · Head of Marketing"],
            ["Work location", "Basel office · 60% on-site"],
            ["Start date", "Monday, 25 May 2026"],
            ["Employment type", "Permanent · 100%"],
            ["Probation", "3 months"],
            ["Notice period", "3 months after probation"],
          ].map(([k, v]) => (
            <div key={k} className="text-[12px]">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                {k}
              </div>
              <div className="font-medium text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        {/* Compensation */}
        <section className="space-y-2">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
            Compensation
          </div>
          <div className="grid grid-cols-3 gap-3 text-[13px]">
            <div>
              <div className="text-[11px] text-mute">Annual base</div>
              <div className="font-bold text-ink">CHF 142,000</div>
            </div>
            <div>
              <div className="text-[11px] text-mute">Variable target</div>
              <div className="font-bold text-ink">15% · CHF 21,300</div>
            </div>
            <div>
              <div className="text-[11px] text-mute">Sign-on bonus</div>
              <div className="font-bold text-ink">CHF 8,000</div>
            </div>
          </div>
          <p className="text-[12px] text-mute leading-[18px]">
            Paid in 13 instalments per Swiss practice. Variable settled at year-end against
            DSM-F MBO scorecard. Sign-on payable on day 30, recoverable pro-rata if you leave
            inside 24 months.
          </p>
        </section>

        {/* Benefits */}
        <section className="space-y-2">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
            Benefits
          </div>
          <ul className="text-[12px] leading-[20px] list-disc pl-5 space-y-0.5">
            <li>25 working days paid leave + Swiss public holidays</li>
            <li>Pension contribution per BVG · employer 2/3, employee 1/3</li>
            <li>Comprehensive health + accident coverage (KTG)</li>
            <li>Relocation allowance up to CHF 7,500 against actuals</li>
            <li>Hybrid working — up to 2 days remote per week</li>
          </ul>
        </section>

        {/* Signatures */}
        <section className="grid grid-cols-2 gap-6 pt-3 border-t border-divider">
          <div>
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium mb-2">
              For DSM-Firmenich AG
            </div>
            <div className="font-['Segoe_Script',cursive] text-[20px] text-ink leading-none">
              S. Khan
            </div>
            <div className="text-[11px] text-mute mt-1">
              Sara Khan · HR Business Partner · 24 May 2026
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium mb-2">
              Accepted by
            </div>
            <div className="font-['Segoe_Script',cursive] text-[20px] text-ink leading-none">
              Aurélie Laurent
            </div>
            <div className="text-[11px] text-mute mt-1">
              Aurélie Laurent · 24 May 2026
            </div>
          </div>
        </section>
      </div>
    </PreviewModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Preboarding item modal — one component, content switches by `kind`.
 * ──────────────────────────────────────────────────────────────────────*/

export type PreboardingKind = "welcome" | "equipment" | "it" | "permit";

const preboardingMeta: Record<
  PreboardingKind,
  { eyebrow: string; title: string; sub: string; icon: typeof Mail }
> = {
  welcome: {
    eyebrow: "Outlook · scheduled send",
    title: "Welcome message · bilingual",
    sub: "Queued for 09:00 CET today · open delivery report after send",
    icon: Mail,
  },
  equipment: {
    eyebrow: "IT service desk · ticket #DSK-44820",
    title: "Equipment ticket · MacBook Pro 14",
    sub: "Approved by Niklas K. · delivery before Day 1",
    icon: Laptop,
  },
  it: {
    eyebrow: "Identity provider · auto-provisioning",
    title: "IT account provisioning · 12 apps",
    sub: "Accounts staged · activate on Day 1 08:30 CET",
    icon: KeyRound,
  },
  permit: {
    eyebrow: "Compliance agent · permit check",
    title: "Work permit · EU/EEA assessment",
    sub: "No permit required for French citizen working in CH",
    icon: IdCard,
  },
};

export function PreboardingItemModal({
  open,
  onClose,
  kind,
  parentStep = 2,
}: {
  open: boolean;
  onClose: () => void;
  kind: PreboardingKind;
  /** Current UC4 step — drives the approval-chain stepper progress inside
   *  the equipment + IT bodies. 2 = just dispatched, 3 = calendar built,
   *  4 = compliance scan / done. */
  parentStep?: number;
}) {
  const m = preboardingMeta[kind];
  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow={m.eyebrow}
      title={m.title}
      sub={m.sub}
      width={680}
      footer={
        <div className="flex items-center justify-end gap-3">
          <PillButton variant="secondary" size="md" onClick={onClose}>
            Close
          </PillButton>
        </div>
      }
    >
      <div className="px-7 py-6">
        {kind === "welcome" && <WelcomeBody />}
        {kind === "equipment" && <EquipmentBody parentStep={parentStep} />}
        {kind === "it" && <ITBody parentStep={parentStep} />}
        {kind === "permit" && <PermitBody />}
      </div>
    </PreviewModal>
  );
}

function WelcomeBody() {
  return (
    <div className="space-y-4">
      <div className="bg-surface-fog rounded-md p-4 space-y-2 text-[12px]">
        <Row k="From" v="Sara Khan <sara.khan@dsm-firmenich.com>" />
        <Row k="To" v="Aurélie Laurent <aurelie.laurent@dsm-firmenich.com>" />
        <Row k="Cc" v="Niklas Keller · Léa Müller (buddy)" />
        <Row k="Subject" v="Bienvenue chez DSM-Firmenich · Welcome to the team" />
        <Row k="Send" v="Today · 09:00 CET" />
      </div>
      <div className="space-y-3 text-[13px] leading-[20px] text-ink">
        <p className="font-bold">Bonjour Aurélie,</p>
        <p>
          We're delighted you're joining the Basel marketing team next Monday. This note
          covers your first day so nothing surprises you.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Arrive at the Basel office at 08:00. Reception will hand you your badge.</li>
          <li>Your laptop, monitor and Magic Mouse will already be on your desk.</li>
          <li>Léa M., your onboarding buddy, will meet you at the coffee point at 09:00.</li>
          <li>Your full Day-1 calendar is attached. Wear comfortable shoes — there is a tour.</li>
        </ul>
        <p>If anything looks off, just reply to this email. À lundi !</p>
        <p className="text-mute text-[12px]">Sara · HR Business Partner</p>
      </div>
    </div>
  );
}

function EquipmentBody({ parentStep }: { parentStep: number }) {
  const items = [
    ["Device", "MacBook Pro 14\" · M3 Pro · 36 GB · 1 TB"],
    ["Display", "Studio Display 27\" · standard glass"],
    ["Peripherals", "Magic Mouse · Magic Keyboard with Touch ID"],
    ["Accessories", "USB-C dock · 2 × cables · headset (Jabra 75)"],
    ["Delivery", "Friday 22 May · before 16:00 · Basel office"],
    ["Recipient", "Reception desk · held for Aurélie L."],
  ];
  // 4-node chain: ticket raised → manager approval → IT desk → carrier
  // parent step 2 → at node 1 (Niklas approving)
  // parent step 3 → at node 2 (IT desk processing)
  // parent step 4 → all done
  const allDone = parentStep >= 4;
  const activeIndex = parentStep <= 2 ? 1 : parentStep === 3 ? 2 : 3;
  const equipmentNodes: StepperNode[] = [
    { label: "Ticket raised", Icon: Sparkles },
    { label: "Manager approval", Icon: IdCard },
    { label: "IT service desk", Icon: KeyRound },
    { label: "Carrier handoff", Icon: Mail },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface-fog rounded-md px-4 py-3">
        <div className="text-[12px] text-mute">
          Ticket <span className="text-ink font-bold">DSK-44820</span> · raised by Onboarding agent
        </div>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] tracking-[0.08em] uppercase font-bold",
            allDone
              ? "bg-accent-green text-ink-inverse"
              : "bg-[#FCD9A6] text-[#92400E]",
          )}
        >
          {allDone ? "Approved" : "In approval"}
        </span>
      </div>

      {/* Approval chain stepper */}
      <div className="border border-divider rounded-md px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
            Approval chain
          </div>
          <div className="text-[10px] text-mute">
            {allDone
              ? "Tracking issued · auto-forwarded to Aurélie"
              : `${activeIndex} of ${equipmentNodes.length} cleared · agent watching`}
          </div>
        </div>
        <ApprovalChainStepper
          nodes={equipmentNodes}
          activeIndex={activeIndex}
          allDone={allDone}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(([k, v]) => (
          <div key={k} className="border border-divider rounded p-3">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
              {k}
            </div>
            <div className="text-[13px] font-medium text-ink mt-1">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ITBody({ parentStep }: { parentStep: number }) {
  const apps = [
    "Okta SSO",
    "Google Workspace",
    "Slack",
    "Confluence",
    "Jira",
    "Workday",
    "Salesforce",
    "Office365",
    "1Password",
    "Zoom",
    "Tableau",
    "Figma",
  ];
  // 3-node chain: stage accounts → provision apps → activate Day 1
  // parent step 2 → node 1 active (staging)
  // parent step 3 → node 2 active (provisioning)
  // parent step 4 → all done
  const allDone = parentStep >= 4;
  const activeIndex = parentStep <= 2 ? 1 : parentStep === 3 ? 2 : 2;
  const itNodes: StepperNode[] = [
    { label: "Stage accounts", Icon: Sparkles },
    { label: "Provision apps", Icon: KeyRound },
    { label: "Activate Day 1", Icon: Check },
  ];

  // Apps "ready" count tracks provisioning progress
  const provisionedCount = allDone ? apps.length : parentStep === 3 ? 8 : 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface-fog rounded-md px-4 py-3">
        <div className="text-[12px] text-mute">
          Identity provider · <span className="text-ink font-bold">Okta</span> · group:{" "}
          <span className="text-ink font-bold">EMEA-Marketing-L4</span>
        </div>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] tracking-[0.08em] uppercase font-bold",
            allDone
              ? "bg-accent-green text-ink-inverse"
              : "bg-[#FCD9A6] text-[#92400E]",
          )}
        >
          {allDone ? "Activated" : "Provisioning…"}
        </span>
      </div>

      {/* Approval / provisioning chain */}
      <div className="border border-divider rounded-md px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
            Provisioning chain
          </div>
          <div className="text-[10px] text-mute">
            {allDone
              ? "All 12 apps active · passkey enrolment sent"
              : `${activeIndex} of ${itNodes.length} stages cleared · agent watching`}
          </div>
        </div>
        <ApprovalChainStepper
          nodes={itNodes}
          activeIndex={activeIndex}
          allDone={allDone}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
            Apps · {provisionedCount} of {apps.length} ready
          </div>
          {!allDone && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#92400E]">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              In flight
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {apps.map((a, i) => {
            const ready = i < provisionedCount;
            return (
              <div
                key={a}
                className={cn(
                  "ai-stream flex items-center gap-2 rounded px-2.5 py-2 transition-colors",
                  ready
                    ? "border border-divider bg-white"
                    : "border border-[#F59E0B]/30 bg-[#FFFBEB]",
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {ready ? (
                  <span className="w-5 h-5 rounded-full bg-accent-green text-ink-inverse flex items-center justify-center shrink-0">
                    <Check size={11} strokeWidth={2.4} />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-[#F59E0B]/15 text-[#92400E] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  </span>
                )}
                <span
                  className={cn(
                    "text-[12px]",
                    ready ? "text-ink" : "text-[#92400E]",
                  )}
                >
                  {a}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PermitBody() {
  return (
    <div className="space-y-4">
      <div className="bg-surface-mint/50 border border-surface-deep/30 rounded-md p-4 space-y-1">
        <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-bold">
          Result · no permit required
        </div>
        <div className="text-[13px] text-ink">
          Aurélie is a French citizen taking up employment in Switzerland. Under the
          EU/EFTA bilateral agreements (AFMP), no work permit is required.
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Row k="Nationality" v="🇫🇷 French (EU)" block />
        <Row k="Country of work" v="🇨🇭 Switzerland" block />
        <Row k="Permit type" v="Not required (AFMP)" block />
        <Row k="Cantonal registration" v="Within 14 days · reminder set" block />
      </div>
      <div className="text-[12px] text-mute leading-[18px]">
        Once registered with the Basel canton, Aurélie receives a residency confirmation (no
        L/B/C permit). Source taxation (Quellensteuer) applies until she takes Swiss
        residence — payroll has been pre-configured.
      </div>
    </div>
  );
}

function Row({ k, v, block }: { k: string; v: string; block?: boolean }) {
  if (block) {
    return (
      <div className="border border-divider rounded p-3">
        <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
          {k}
        </div>
        <div className="text-[13px] font-medium text-ink mt-0.5">{v}</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      <span className="text-mute">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Calendar modal — 3-month onboarding plan (May / Jun / Jul)
 * ──────────────────────────────────────────────────────────────────────*/

type CalEvent = {
  day: number; // day of month
  label: string;
  tone: "intro" | "milestone" | "review" | "training";
};

type CalMonth = {
  label: string;
  monthName: string;
  daysInMonth: number;
  startWeekday: number; // 0 = Mon
  events: CalEvent[];
};

const calData: CalMonth[] = [
  {
    label: "First 30 days",
    monthName: "May 2026",
    daysInMonth: 31,
    startWeekday: 4, // May 1 is Fri
    events: [
      { day: 25, label: "Day 1 · welcome + meetings", tone: "intro" },
      { day: 26, label: "Onboarding training · Swiss FADP", tone: "training" },
      { day: 27, label: "Team intros · marketing pod", tone: "intro" },
      { day: 28, label: "Brand audit read-out", tone: "review" },
      { day: 29, label: "Cantonal residency registration", tone: "milestone" },
    ],
  },
  {
    label: "First 60 days",
    monthName: "June 2026",
    daysInMonth: 30,
    startWeekday: 0, // June 1 is Mon
    events: [
      { day: 3, label: "Campaign shadow · Q2 launch", tone: "training" },
      { day: 10, label: "Cross-functional review", tone: "review" },
      { day: 16, label: "Pricing brief presentation", tone: "milestone" },
      { day: 22, label: "Take ownership · Q3 fragrance launch", tone: "milestone" },
      { day: 26, label: "Manager 1:1 · 30-day review", tone: "review" },
    ],
  },
  {
    label: "First 90 days",
    monthName: "July 2026",
    daysInMonth: 31,
    startWeekday: 2, // July 1 is Wed
    events: [
      { day: 6, label: "Basel hub regional plan kick-off", tone: "milestone" },
      { day: 14, label: "Direct report kickoff (interview slate)", tone: "milestone" },
      { day: 21, label: "Tableau Q3 KPI dashboard live", tone: "milestone" },
      { day: 28, label: "90-day review with leadership", tone: "review" },
    ],
  },
];

const toneCls: Record<CalEvent["tone"], string> = {
  intro: "bg-surface-mint border-surface-deep/30 text-surface-deep",
  milestone: "bg-surface-deep text-ink-inverse",
  review: "bg-surface-fog text-ink border-divider",
  training: "bg-accent-green/15 text-surface-deep",
};

export function CalendarPlanModal({
  open,
  onClose,
  onAdvance,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const [active, setActive] = useState<{ m: number; e: CalEvent } | null>(null);
  // Reveal each month with a small stagger
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!open) {
      setPhase(0);
      setActive(null);
      return;
    }
    const timers = [200, 500, 800].map((d, i) =>
      window.setTimeout(() => setPhase(i + 1), d),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [open]);

  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="Onboarding plan · generated from role template"
      title="Day 1 + 30 / 60 / 90 calendar"
      sub="Three months, every day mapped · click any event to inspect"
      width={1040}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            14 milestone events · 7 Day-1 meetings · auto-synced to Aurélie's inbox
          </span>
          <PillButton variant="primary" size="md" arrow onClick={finish}>
            Close and continue
          </PillButton>
        </div>
      }
    >
      <div className="px-6 py-5 grid grid-cols-3 gap-4">
        {calData.map((m, mi) => (
          <CalMonthCard
            key={m.monthName}
            month={m}
            index={mi}
            visible={phase > mi}
            active={active?.m === mi ? active.e : null}
            onSelect={(e) => setActive({ m: mi, e })}
          />
        ))}
      </div>
      {active && (
        <div className="px-6 pb-5 -mt-2">
          <div className="bg-surface-fog border border-divider rounded p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-surface-deep text-ink-inverse flex items-center justify-center shrink-0">
              <Calendar size={16} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                {calData[active.m].monthName} · day {active.e.day}
              </div>
              <div className="text-[13px] font-bold text-ink">{active.e.label}</div>
            </div>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] tracking-[0.06em] uppercase font-bold",
                active.e.tone === "intro" && "bg-surface-mint text-surface-deep",
                active.e.tone === "milestone" && "bg-surface-deep text-ink-inverse",
                active.e.tone === "review" && "bg-surface-fog text-ink border border-divider",
                active.e.tone === "training" && "bg-accent-green/15 text-surface-deep",
              )}
            >
              {active.e.tone}
            </span>
          </div>
        </div>
      )}
    </PreviewModal>
  );
}

function CalMonthCard({
  month,
  index,
  visible,
  active,
  onSelect,
}: {
  month: CalMonth;
  index: number;
  visible: boolean;
  active: CalEvent | null;
  onSelect: (e: CalEvent) => void;
}) {
  const eventByDay = new Map<number, CalEvent>();
  month.events.forEach((e) => eventByDay.set(e.day, e));
  // Build 6-row grid: leading blanks + days
  const cells: Array<{ day?: number; e?: CalEvent }> = [];
  for (let i = 0; i < month.startWeekday; i++) cells.push({});
  for (let d = 1; d <= month.daysInMonth; d++) {
    const e = eventByDay.get(d);
    cells.push({ day: d, e });
  }
  while (cells.length % 7 !== 0) cells.push({});

  return (
    <article
      className="border border-divider rounded-md overflow-hidden transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <header className="px-3 py-2 bg-surface-fog border-b border-divider">
        <div className="text-[10px] tracking-[0.08em] uppercase text-surface-deep font-bold">
          {month.label}
        </div>
        <div className="text-[14px] font-bold text-ink">{month.monthName}</div>
      </header>
      <div className="px-3 pt-2 pb-3">
        <div className="grid grid-cols-7 gap-1 mb-1 text-center text-[10px] tracking-[0.05em] uppercase text-mute font-medium">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            if (!c.day)
              return <div key={i} className="aspect-square" />;
            const isActive = active && c.e && active === c.e;
            const isWeekend = i % 7 === 5 || i % 7 === 6;
            return (
              <button
                key={i}
                type="button"
                disabled={!c.e}
                onClick={() => c.e && onSelect(c.e)}
                title={c.e?.label}
                className={cn(
                  "ui-pill aspect-square rounded-sm flex items-center justify-center text-[11px] font-medium transition-all cursor-default",
                  c.e
                    ? cn(toneCls[c.e.tone], "hover:scale-[1.08] cursor-pointer border")
                    : isWeekend
                      ? "bg-surface-fog/40 text-mute/60"
                      : "bg-surface-fog/70 text-mute hover:bg-surface-fog",
                  isActive && "ring-2 ring-surface-deep ring-offset-1",
                )}
              >
                {c.day}
              </button>
            );
          })}
        </div>
      </div>
      <ul className="px-3 pb-3 space-y-1">
        {month.events.map((e, ei) => (
          <li
            key={ei}
            className="ai-stream text-[11px] flex items-start gap-2 leading-[14px]"
            style={{ animationDelay: `${index * 80 + ei * 60}ms` }}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full mt-1 shrink-0",
                e.tone === "milestone" ? "bg-surface-deep" : "bg-surface-sage",
              )}
            />
            <span className="text-ink">
              <span className="font-bold tabular-nums">{e.day}</span> · {e.label}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Signable contract modal — DSM-style document + canvas signature pad
 * ──────────────────────────────────────────────────────────────────────*/

export type SignableKind = "residency" | "quellensteuer";

type SignableMeta = {
  eyebrow: string;
  title: string;
  sub: string;
  authority: string;
  refNum: string;
  body: () => React.ReactNode;
  acknowledgement: string;
  signedBy: string;
};

const signableMeta: Record<SignableKind, SignableMeta> = {
  residency: {
    eyebrow: "Cantonal authority · Basel-Stadt",
    title: "Residency registration · Anmeldebestätigung",
    sub: "Form Nr. EWA-3 · Einwohneramt Basel-Stadt",
    authority: "Einwohneramt Basel-Stadt · Spiegelgasse 12",
    refNum: "EWA-3 · DSMF-26-0175",
    body: () => (
      <div className="space-y-3 text-[12px] leading-[18px] text-ink">
        <p>
          The undersigned, on behalf of <span className="font-bold">Aurélie Laurent</span>, an
          incoming employee of DSM-Firmenich AG, acknowledges that the employee is required
          under Art. 11 of the Swiss Federal Act on Foreign Nationals and Integration (FNIA)
          to register her residence with the Einwohneramt Basel-Stadt within fourteen (14)
          days of taking up residence in the canton.
        </p>
        <p>
          DSM-Firmenich AG confirms that it has informed the employee of this requirement on
          24 May 2026, provided the address of the local registration office, and set a
          reminder in the agent's task log. The employee remains personally responsible for
          appearing in person with the required documents (passport, employment contract,
          rental agreement or letter of accommodation).
        </p>
        <p>
          By countersigning below, the HR Business Partner of DSM-Firmenich AG acknowledges
          that the registration reminder is active and that any non-compliance will be
          flagged to the employee within seven (7) days of the registration deadline.
        </p>
      </div>
    ),
    acknowledgement: "I confirm the cantonal residency reminder is active for Aurélie L.",
    signedBy: "HR Business Partner · DSM-Firmenich AG",
  },
  quellensteuer: {
    eyebrow: "Federal tax authority · Basel-Stadt",
    title: "Source taxation · Quellensteuer declaration",
    sub: "Form Q-SBS-2026 · routes to payroll on signature",
    authority: "Steuerverwaltung Basel-Stadt · Fischmarkt 10",
    refNum: "Q-SBS-2026 · DSMF-26-0175",
    body: () => (
      <div className="space-y-3 text-[12px] leading-[18px] text-ink">
        <p>
          This declaration confirms that <span className="font-bold">Aurélie Laurent</span>,
          starting employment on 25 May 2026 with DSM-Firmenich AG, will be subject to
          source taxation (Quellensteuer) under cantonal rate{" "}
          <span className="font-bold">A-0 (single, no children, no church)</span> for the
          canton of Basel-Stadt, until such time as she takes up Swiss residence and the
          authority confirms a switch to ordinary assessment.
        </p>
        <p>
          The employer hereby instructs the payroll department to withhold the applicable
          Quellensteuer from each pay period in 2026 and to remit the withheld amounts
          monthly to the Steuerverwaltung Basel-Stadt by the 15th day of the following
          month. The first remittance covers payroll period May 2026 and is due 15 June 2026.
        </p>
        <p>
          The employer acknowledges that any change in the employee's marital status,
          dependants, religious affiliation or place of residence must be reported to the tax
          authority within thirty (30) days, and that the agent will re-run the rate
          calculation on every change event.
        </p>
      </div>
    ),
    acknowledgement: "I authorise source taxation withholding under rate A-0 from 25 May 2026.",
    signedBy: "HR Business Partner · DSM-Firmenich AG",
  },
};

export function SignableContractModal({
  open,
  onClose,
  kind,
  onSigned,
}: {
  open: boolean;
  onClose: () => void;
  kind: SignableKind;
  onSigned: () => void;
}) {
  const m = signableMeta[kind];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!open) {
      setHasInk(false);
      setSubmitted(false);
      setAcknowledged(false);
    }
  }, [open]);

  // Set up canvas drawing
  useEffect(() => {
    if (!open || submitted) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // Use device pixel ratio for crisp ink
    const ratio = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * ratio;
    c.height = h * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#084337";

    let drawing = false;
    let last: { x: number; y: number } | null = null;

    const pos = (ev: PointerEvent) => {
      const rect = c.getBoundingClientRect();
      return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    };
    const down = (ev: PointerEvent) => {
      drawing = true;
      last = pos(ev);
      c.setPointerCapture(ev.pointerId);
    };
    const move = (ev: PointerEvent) => {
      if (!drawing) return;
      const p = pos(ev);
      if (last) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        setHasInk(true);
      }
      last = p;
    };
    const up = () => {
      drawing = false;
      last = null;
    };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, [open, submitted]);

  const clearSig = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };

  const sign = () => {
    if (!hasInk || !acknowledged) return;
    setSubmitted(true);
    window.setTimeout(() => {
      onSigned();
      onClose();
    }, 900);
  };

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow={m.eyebrow}
      title={m.title}
      sub={m.sub}
      width={780}
      footer={
        submitted ? (
          <div className="flex items-center justify-end gap-3 text-[12px] text-surface-deep font-bold">
            <Check size={14} strokeWidth={2.4} />
            Signed · routed to {kind === "residency" ? "audit log" : "payroll + tax authority"}.
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[12px] text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-3.5 h-3.5 accent-[var(--accent-green-deep)]"
              />
              {m.acknowledgement}
            </label>
            <div className="flex items-center gap-2">
              <PillButton variant="secondary" size="md" onClick={onClose}>
                Cancel
              </PillButton>
              <button
                type="button"
                onClick={sign}
                disabled={!hasInk || !acknowledged}
                className={cn(
                  "ui-pill inline-flex items-center gap-2 rounded-full font-bold text-[14px] px-5 py-2.5 transition-colors",
                  hasInk && acknowledged
                    ? "bg-ink text-ink-inverse hover:bg-surface-deep"
                    : "bg-divider text-mute cursor-not-allowed",
                )}
              >
                <FileSignature size={15} strokeWidth={2} />
                Sign + file
              </button>
            </div>
          </div>
        )
      }
    >
      <div className="px-7 py-5 space-y-4 text-ink">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b border-divider pb-3">
          <div>
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              {m.authority}
            </div>
            <div className="text-[15px] font-bold mt-0.5">{m.title}</div>
          </div>
          <div className="text-right text-[11px] text-mute leading-tight">
            <div>Ref · {m.refNum}</div>
            <div>24 May 2026</div>
          </div>
        </div>

        {/* Subject summary */}
        <div className="grid grid-cols-3 gap-3 bg-surface-fog rounded-md p-3">
          {[
            ["Subject", "Aurélie Laurent"],
            ["Employer", "DSM-Firmenich AG · Basel"],
            ["Start of obligation", "25 May 2026"],
          ].map(([k, v]) => (
            <div key={k} className="text-[12px]">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                {k}
              </div>
              <div className="font-medium text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        {m.body()}

        {/* Signature area */}
        <section className="border-t border-divider pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Signature · {m.signedBy}
            </div>
            {!submitted && (
              <button
                type="button"
                onClick={clearSig}
                disabled={!hasInk}
                className={cn(
                  "ui-pill inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded",
                  hasInk ? "text-mute hover:text-ink" : "text-divider cursor-not-allowed",
                )}
              >
                <Eraser size={12} strokeWidth={1.8} />
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={cn(
                "block w-full h-[130px] rounded-md bg-white border border-dashed",
                submitted
                  ? "border-surface-deep"
                  : hasInk
                    ? "border-surface-deep"
                    : "border-divider",
                "touch-none",
              )}
              style={{ cursor: submitted ? "default" : "crosshair" }}
            />
            {!hasInk && !submitted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[12px] text-mute">
                Sign with mouse or finger
              </div>
            )}
            {submitted && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-mint/30 rounded-md">
                <div className="flex items-center gap-2 text-surface-deep font-bold text-[13px]">
                  <Check size={14} strokeWidth={2.4} />
                  Capturing signature · filing with authority…
                </div>
              </div>
            )}
            <div
              aria-hidden
              className="absolute left-3 right-3 bottom-3 border-t border-divider"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] text-mute">
            <div>
              <div className="text-[10px] tracking-[0.08em] uppercase font-medium">
                Witness
              </div>
              <div className="text-ink">DSM-F Compliance agent</div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.08em] uppercase font-medium">Date</div>
              <div className="text-ink">24 May 2026 · 14:32 CET</div>
            </div>
          </div>
        </section>
      </div>
    </PreviewModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Dispatch toast — small inline status used by Step 2 RunGate
 * ──────────────────────────────────────────────────────────────────────*/

export function BundleDispatchModal({
  open,
  onClose,
  onAdvance,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const [done, setDone] = useState(0);
  const total = 4;

  useEffect(() => {
    if (!open) {
      setDone(0);
      return;
    }
    const t = window.setInterval(() => {
      setDone((d) => {
        if (d >= total) {
          window.clearInterval(t);
          return d;
        }
        return d + 1;
      });
    }, 380);
    return () => window.clearInterval(t);
  }, [open]);

  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="Preboarding bundle · dispatching"
      title="Filed together"
      sub="4 systems · agent runs in parallel"
      width={520}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            {done < total ? `${done} of ${total} dispatched…` : "All dispatched in 1.4s"}
          </span>
          <PillButton
            variant="primary"
            size="md"
            arrow
            disabled={done < total}
            onClick={finish}
          >
            {done < total ? "Working…" : "Close and continue"}
          </PillButton>
        </div>
      }
    >
      <div className="px-6 py-5">
        <StaggerList step={120}>
          {(["welcome", "equipment", "it", "permit"] as PreboardingKind[]).map((k, i) => {
            const m = preboardingMeta[k];
            const Icon = m.icon;
            const fired = i < done;
            // After all four are dispatched, equipment + IT stay "in flight"
            // until the parent flow advances. Welcome + permit complete instantly.
            const isInFlightKind = k === "equipment" || k === "it";
            const allDispatched = done >= total;
            const isInFlight = allDispatched && isInFlightKind;
            const isCompleted = fired && !isInFlight;
            return (
              <div
                key={k}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md border transition-colors",
                  isInFlight
                    ? "border-[#F59E0B]/40 bg-[#FFFBEB]"
                    : "border-divider",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
                    isInFlight
                      ? "bg-[#FCD9A6] text-[#92400E]"
                      : "bg-surface-mint text-surface-deep",
                  )}
                >
                  <Icon size={17} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-ink leading-[16px]">
                    {m.title.split("·")[0]}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] leading-[14px] mt-0.5",
                      isInFlight ? "text-[#92400E]" : "text-mute",
                    )}
                  >
                    {isInFlight
                      ? k === "equipment"
                        ? "Pending Niklas K. approval · 1 of 4 cleared"
                        : "Provisioning · 3 of 12 apps ready"
                      : fired
                        ? "Dispatched · receipt logged"
                        : "Queued · waiting on agent…"}
                  </div>
                </div>
                {isInFlight ? (
                  <div className="w-6 h-6 rounded-full bg-[#F59E0B]/15 text-[#92400E] flex items-center justify-center shrink-0 relative">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[#F59E0B]/30 animate-ping"
                    />
                    <div className="relative w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  </div>
                ) : isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-accent-green text-ink-inverse flex items-center justify-center shrink-0">
                    <Check size={13} strokeWidth={2.4} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-divider border-t-surface-deep animate-spin shrink-0" />
                )}
              </div>
            );
          })}
        </StaggerList>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-divider text-[11px] text-mute">
          <AIDot size={5} tone="deep" pulse={done < total} />
          {done < total
            ? "Agent dispatching in parallel · receipts auto-collected."
            : "Welcome + permit complete · equipment + IT provisioning continues in the background."}
        </div>
      </div>
    </PreviewModal>
  );
}
