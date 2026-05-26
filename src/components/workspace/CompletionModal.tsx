import { useEffect, useMemo, useState } from "react";
import { useApp, type FlowId } from "@/state";
import {
  Check,
  Users,
  CalendarDays,
  ShieldCheck,
  ScrollText,
  FileText,
  TrendingUp,
  Mail,
  type LucideIcon,
} from "lucide-react";

type Row = {
  Icon: LucideIcon;
  label: string;
  value: string;
};

type FlowCopy = {
  title: string;
  sub: string;
  pill: string;
  rows: Row[];
};

const copy: Record<FlowId, FlowCopy> = {
  uc1: {
    title: "Offboarding queued",
    sub: "Approval logged · homologação filed",
    pill: "HR-0178 · Camila S.",
    rows: [
      {
        Icon: Users,
        label: "KT plan",
        value: "Rafael F. + Beatriz O. · 8 sessions auto-booked",
      },
      {
        Icon: CalendarDays,
        label: "Last working day",
        value: "Fri 27 Jun · access armed for 17:00 BRT",
      },
      {
        Icon: ShieldCheck,
        label: "Exit package filed",
        value: "BRL 119,033 gross · TRCT homologated · audit logged",
      },
    ],
  },
  uc2: {
    title: "Compliance live",
    sub: "Roll-out under way · risk cleared",
    pill: "HR-0184 · Germany",
    rows: [
      {
        Icon: ScrollText,
        label: "Workweek update",
        value: "40h → 37.5h · 3 phases over 90 days",
      },
      {
        Icon: FileText,
        label: "Works council",
        value: "Notice filed · acknowledgement pending",
      },
      {
        Icon: ShieldCheck,
        label: "Confidence restored",
        value: "147 employees notified · audit logged",
      },
    ],
  },
  uc4: {
    title: "Onboarding live",
    sub: "Bundle dispatched · Day 1 booked",
    pill: "HR-0175 · Aurélie L.",
    rows: [
      {
        Icon: Mail,
        label: "Preboarding bundle",
        value: "Welcome · equipment · IT · permit — 4 of 4 dispatched",
      },
      {
        Icon: CalendarDays,
        label: "Day 1 + 30/60/90",
        value: "7 meetings booked · 9 milestones in inbox",
      },
      {
        Icon: ShieldCheck,
        label: "Confidence restored",
        value: "Swiss compliance scheduled · audit logged",
      },
    ],
  },
  uc3: {
    title: "Retention locked",
    sub: "Decision filed · stakeholders notified",
    pill: "HR-0182 · Marcus C.",
    rows: [
      {
        Icon: TrendingUp,
        label: "Retention offer",
        value: "Mid · $158K · sign-on $12K",
      },
      {
        Icon: CalendarDays,
        label: "Effective date",
        value: "Jun 1, 2026 · 12-month clawback",
      },
      {
        Icon: ShieldCheck,
        label: "Confidence restored",
        value: "Marcus retained · audit logged",
      },
    ],
  },
};

const CONFETTI_COLORS = [
  "#C3E6E1", // surface-mint
  "#44B4A1", // surface-sage
  "#084337", // accent-green-deep
  "#277E6E", // accent-green
  "#F4B400", // warm gold for contrast
  "#FFFFFF",
];

type Particle = {
  left: number;
  delay: number;
  duration: number;
  xDrift: number;
  rotation: number;
  width: number;
  height: number;
  color: string;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const tall = Math.random() > 0.5;
    return {
      // Bias particles toward the top of the card so they burst from above
      // the check mark and fall through the body, never the full viewport.
      left: Math.random() * 100,
      delay: Math.random() * 220,
      duration: 1400 + Math.random() * 1100,
      xDrift: (Math.random() - 0.5) * 160,
      rotation: 360 + Math.random() * 540,
      width: tall ? 5 + Math.random() * 3 : 8 + Math.random() * 4,
      height: tall ? 10 + Math.random() * 4 : 5 + Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    };
  });
}

export function CompletionModal() {
  const { completionFlow, clearCompletion, go } = useApp();
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Particles regenerate every open so each completion gets a fresh burst.
  const particles = useMemo(
    () => (completionFlow ? generateParticles(60) : []),
    [completionFlow],
  );

  useEffect(() => {
    if (completionFlow) {
      const t1 = window.setTimeout(() => setOpen(true), 20);
      // Fire confetti slightly after the modal lands so it bursts FROM the modal.
      const t2 = window.setTimeout(() => setShowConfetti(true), 220);
      const t3 = window.setTimeout(() => setShowConfetti(false), 3800);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }
    setOpen(false);
    setShowConfetti(false);
  }, [completionFlow]);

  if (!completionFlow) return null;
  const c = copy[completionFlow];

  const finish = () => {
    setOpen(false);
    window.setTimeout(() => {
      clearCompletion();
      go({ kind: "dashboard" });
    }, 240);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-200"
        style={{ opacity: open ? 1 : 0 }}
        onClick={finish}
      />

      {/* Card */}
      <article
        className="relative w-full max-w-[520px] bg-white rounded-[20px] overflow-hidden shadow-[0_30px_80px_rgba(8,67,55,0.45)] transition-all duration-300"
        style={{
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(0.96)",
        }}
      >
        {/* Confetti layer — clipped to the card, sits above the hero/body */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {particles.map((p, i) => (
              <span
                key={i}
                className="hr-confetti-piece"
                style={{
                  left: `${p.left}%`,
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  backgroundColor: p.color,
                  animationDelay: `${p.delay}ms`,
                  animationDuration: `${p.duration}ms`,
                  ["--hr-confetti-x" as never]: `${p.xDrift}px`,
                  ["--hr-confetti-rot" as never]: `${p.rotation}deg`,
                }}
              />
            ))}
          </div>
        )}

        {/* Top hero · vivid sage gradient matching the reference */}
        <div
          className="px-7 pt-9 pb-8 text-center text-white relative"
          style={{
            backgroundImage:
              "linear-gradient(155deg, #2F9E6C 0%, #4AAE83 50%, #5DB892 100%)",
          }}
        >
          {/* Soft shimmer dot behind the check */}
          <div className="flex justify-center mb-4">
            <div className="relative w-[88px] h-[88px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/15" />
              <div className="absolute inset-[10px] rounded-full bg-white/20" />
              <Check size={40} strokeWidth={2.4} className="relative text-white" />
            </div>
          </div>
          <h2 className="text-[28px] leading-[32px] font-bold tracking-[-0.01em]">
            {c.title}
          </h2>
          <p className="text-[14px] text-white/85 mt-2">{c.sub}</p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] tracking-[0.08em] uppercase font-bold bg-white/15 border border-white/25 text-white">
              {c.pill}
            </span>
          </div>
        </div>

        {/* Body · 3 icon rows */}
        <div className="px-5 pt-5 pb-4 space-y-2.5">
          {c.rows.map((r, i) => (
            <div
              key={r.label}
              className="ai-stream flex items-center gap-3 px-3.5 py-3 rounded-[12px] border border-divider bg-surface-fog/40"
              style={{ animationDelay: `${300 + i * 90}ms` }}
            >
              <div className="w-9 h-9 rounded-md bg-white border border-divider flex items-center justify-center text-surface-deep shrink-0">
                <r.Icon size={18} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-mute">
                  {r.label}
                </div>
                <div className="text-[14px] font-bold text-ink leading-[18px] mt-0.5">
                  {r.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Done · full-width black CTA */}
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={finish}
            className="ui-pill w-full bg-ink text-ink-inverse rounded-[14px] py-4 text-[15px] font-bold hover:bg-surface-deep transition-colors"
          >
            Done
          </button>
        </div>
      </article>
    </div>
  );
}
