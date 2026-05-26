import { AIDot } from "@/components/ai/AIDot";
import { SpringIn } from "@/components/ai/SpringIn";
import { StaggerList } from "@/components/ai/StaggerList";
import { CountUp } from "@/components/ai/CountUp";
import { cn } from "@/lib/utils";
import {
  Mail,
  GitBranch,
  FileText,
  Layers,
  ShieldOff,
  Wallet,
  Sparkles,
  AlertTriangle,
  Brain,
  Heart,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
 * Step 0 result — Resignation parsed
 * ──────────────────────────────────────────────────────────────────────*/

type AnalysisLine = {
  Icon: LucideIcon;
  tone: "risk" | "insight" | "tone";
  label: string;
  body: string;
};

const analysisLines: AnalysisLine[] = [
  {
    Icon: AlertTriangle,
    tone: "risk",
    label: "Retention risk",
    body:
      "4 yrs tenure · top-2 performance rating last cycle · 14 single-owner areas. Loss is high-impact. Consider a counter-offer review before HRBP approval.",
  },
  {
    Icon: Brain,
    tone: "insight",
    label: "Probable trigger",
    body:
      "Glassdoor mentions + 11 internal #careers Slack visits in the past 30 days suggest external offer rather than internal dissatisfaction. Confidence 78%.",
  },
  {
    Icon: Heart,
    tone: "tone",
    label: "Letter tone",
    body:
      "Warm + professional · zero grievance signals · 4 expressions of gratitude. Departure is amicable — keep alumni Slack access enabled.",
  },
];

const toneStyle: Record<AnalysisLine["tone"], string> = {
  risk: "bg-mark-red/10 text-mark-red",
  insight: "bg-surface-mint text-surface-deep",
  tone: "bg-surface-fog text-surface-deep",
};

export function ResignationParsedCard() {
  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 space-y-4">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Resignation parsed · 10 fields captured
            </span>
          </div>
          <span className="text-[11px] text-mute">Received yesterday · 14:42 BRT</span>
        </header>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Employee", value: "Camila Souza" },
            { label: "Role", value: "Senior R&D · São Paulo" },
            { label: "Tenure", value: "4 yrs 3 mo" },
            { label: "Last working day", value: "Fri 27 Jun" },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium mb-1">
                {f.label}
              </div>
              <div className="text-[14px] font-bold text-ink">{f.value}</div>
            </div>
          ))}
        </div>

        {/* AI analysis */}
        <section className="pt-3 border-t border-divider/80 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={13} strokeWidth={1.8} className="text-surface-deep" />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-bold">
              Agent analysis
            </span>
            <span className="text-[11px] text-mute">3 signals · run on resignation parse</span>
          </div>
          <div className="space-y-2">
            {analysisLines.map((a) => (
              <div
                key={a.label}
                className="flex items-start gap-3 px-3 py-2.5 rounded-md border border-divider"
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                    toneStyle[a.tone],
                  )}
                >
                  <a.Icon size={14} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-ink leading-[15px]">{a.label}</div>
                  <div className="text-[12px] text-mute leading-[17px] mt-0.5">{a.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-mute pt-1">
            Aviso prévio CLT detected · 30 days · base BRL 24,800/mo · manager Rafael F. notified.
          </div>
        </section>
      </article>
    </SpringIn>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Step 1 result — KT plan ready
 * ──────────────────────────────────────────────────────────────────────*/

type SourceLine = {
  Icon: LucideIcon;
  source: string;
  detail: string;
  count: number;
};

const ktSources: SourceLine[] = [
  { Icon: GitBranch, source: "GitHub", detail: "4 repos · 2 as sole maintainer", count: 4 },
  { Icon: FileText, source: "Confluence", detail: "47 pages · sole editor on 23", count: 23 },
  { Icon: Layers, source: "Jira", detail: "3 boards admin · 12 stories owned", count: 12 },
];

export function KTPlanReadyCard({ onView }: { onView: () => void }) {
  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 space-y-3">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" pulse />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              KT plan ready · 14 single-owner areas · 2 successors
            </span>
          </div>
          <button
            type="button"
            onClick={onView}
            className="ui-pill text-[12px] font-bold text-surface-deep border border-surface-deep/30 rounded-full px-3 py-1.5 hover:bg-surface-mint/40 shrink-0"
          >
            View plan →
          </button>
        </header>
        <StaggerList step={90} initialDelay={120}>
          {ktSources.map((s) => (
            <div
              key={s.source}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-divider"
            >
              <div className="w-9 h-9 rounded-md bg-surface-fog flex items-center justify-center text-surface-deep shrink-0">
                <s.Icon size={16} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-ink leading-[16px]">{s.source}</div>
                <div className="text-[12px] text-mute leading-[16px] mt-0.5">{s.detail}</div>
              </div>
              <span className="text-[14px] font-bold text-surface-deep tabular-nums">
                <CountUp to={s.count} duration={700} />
              </span>
            </div>
          ))}
        </StaggerList>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-divider/80">
          <SuccessorPill
            initials="RF"
            name="Rafael F."
            role="Senior Engineer · same pod"
            areas={8}
            color="bg-surface-deep text-ink-inverse"
          />
          <SuccessorPill
            initials="BO"
            name="Beatriz O."
            role="Scientist II · 2 yrs"
            areas={4}
            color="bg-surface-sage text-ink-inverse"
          />
        </div>
      </article>
    </SpringIn>
  );
}

function SuccessorPill({
  initials,
  name,
  role,
  areas,
  color,
}: {
  initials: string;
  name: string;
  role: string;
  areas: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-surface-fog rounded-md px-3 py-2">
      <span
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0",
          color,
        )}
      >
        {initials}
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-bold text-ink leading-[16px]">{name}</div>
        <div className="text-[11px] text-mute leading-[14px]">{role}</div>
        <div className="text-[11px] text-surface-deep font-medium mt-0.5">
          {areas} areas · 4 transfer sessions
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Step 2 result — Access revocation list ready
 * ──────────────────────────────────────────────────────────────────────*/

export function RevocationListReadyCard({ onView }: { onView: () => void }) {
  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-surface-mint flex items-center justify-center text-surface-deep shrink-0">
          <ShieldOff size={18} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Access revocation · 23 SaaS systems scheduled
            </span>
          </div>
          <div className="text-[14px] text-ink mt-1.5">
            <span className="font-bold tabular-nums">
              <CountUp to={23} duration={700} />
            </span>{" "}
            systems · all timed to Friday 27 Jun 17:00 BRT ·{" "}
            <span className="font-bold">6 revoked early</span> for high-risk surfaces.
          </div>
        </div>
        <button
          type="button"
          onClick={onView}
          className="ui-pill text-[12px] font-bold text-surface-deep border border-surface-deep/30 rounded-full px-3 py-1.5 hover:bg-surface-mint/40 shrink-0"
        >
          View schedule →
        </button>
      </article>
    </SpringIn>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Step 3 result — Exit package ready
 * ──────────────────────────────────────────────────────────────────────*/

export function ExitPackageReadyCard({ onView }: { onView: () => void }) {
  return (
    <SpringIn>
      <article className="bg-white border border-divider rounded-md p-5 space-y-3">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Exit package ready · BRL 119,033.33 gross
            </span>
          </div>
          <button
            type="button"
            onClick={onView}
            className="ui-pill text-[12px] font-bold text-surface-deep border border-surface-deep/30 rounded-full px-3 py-1.5 hover:bg-surface-mint/40 shrink-0"
          >
            View breakdown →
          </button>
        </header>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Base + prorata", value: "22.3K" },
            { label: "13th-month 6/12", value: "12.4K" },
            { label: "Vacation + 1/3", value: "19.8K" },
            { label: "FGTS + 40%", value: "39.7K" },
          ].map((f) => (
            <div key={f.label} className="bg-surface-fog rounded p-2.5">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                {f.label}
              </div>
              <div className="text-[14px] font-bold text-ink mt-0.5 tabular-nums">
                BRL {f.value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-mute pt-2 border-t border-divider/80">
          <Wallet size={13} strokeWidth={1.8} className="text-surface-deep" />
          Offboarding letter (PT + EN) drafted · awaits HRBP signature at approval step.
        </div>
      </article>
    </SpringIn>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Helper — the four-block final approval card body
 * (rendered by DecisionCardUC1 — exported here for reuse if needed)
 * ──────────────────────────────────────────────────────────────────────*/

export function FinalSummaryBlocks({
  onOpenKT,
  onOpenRevocation,
  onOpenExit,
  onOpenLetter,
  letterSigned,
}: {
  onOpenKT: () => void;
  onOpenRevocation: () => void;
  onOpenExit: () => void;
  onOpenLetter: () => void;
  letterSigned: boolean;
}) {
  return (
    <div className="space-y-3">
      <Block
        Icon={GitBranch}
        title="Knowledge transfer plan"
        meta="14 areas · 2 successors · 8 sessions"
        onClick={onOpenKT}
      />
      <Block
        Icon={ShieldOff}
        title="Access revocation"
        meta="23 SaaS systems · timed to Fri 17:00 BRT"
        onClick={onOpenRevocation}
      />
      <Block
        Icon={Wallet}
        title="Exit package"
        meta="BRL 119,033.33 gross · TRCT-compliant"
        onClick={onOpenExit}
      />
      <Block
        Icon={Mail}
        title="Offboarding letter · PT + EN"
        meta={letterSigned ? "Signed · routed to homologação" : "Awaiting signature"}
        onClick={onOpenLetter}
        accent={!letterSigned}
        signed={letterSigned}
      />
    </div>
  );
}

function Block({
  Icon,
  title,
  meta,
  onClick,
  accent,
  signed,
}: {
  Icon: LucideIcon;
  title: string;
  meta: string;
  onClick: () => void;
  accent?: boolean;
  signed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "ui-pill w-full flex items-center gap-3 px-3.5 py-3 rounded-md border text-left transition-colors",
        signed
          ? "border-surface-deep/40 bg-surface-mint/30"
          : accent
            ? "border-mark-red/30 bg-mark-red/[0.04] hover:bg-mark-red/10"
            : "border-divider hover:bg-surface-mint/30",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
          signed
            ? "bg-accent-green/15 text-accent-green"
            : accent
              ? "bg-mark-red/10 text-mark-red"
              : "bg-surface-fog text-surface-deep",
        )}
      >
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-ink leading-[16px]">{title}</div>
        <div className="text-[12px] text-mute leading-[16px] mt-0.5">{meta}</div>
      </div>
      <span
        className={cn(
          "text-[12px] font-bold shrink-0",
          accent ? "text-mark-red" : "text-surface-deep",
        )}
      >
        {signed ? "View →" : accent ? "Open + sign →" : "View →"}
      </span>
    </button>
  );
}
