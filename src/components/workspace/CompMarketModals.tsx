import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PreviewModal } from "@/components/workspace/PreviewModal";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { peers, scenarios, marketRange, type ScenarioId } from "@/data/uc3";
import { TrendingDown, TrendingUp, Minus, AlertTriangle, Check, Sparkles } from "lucide-react";

/**
 * CompMarketEvidenceModal — answers "why is $148K cheap?" / "why is $168K
 * expensive?" with real chart-based evidence. Opens from the scenario picker
 * in DecisionCardUC3.
 */

type Verdict = "cheap" | "balanced" | "premium";

const verdictMeta: Record<
  Verdict,
  { Icon: typeof TrendingDown; tone: string; toneBg: string; label: string }
> = {
  cheap: {
    Icon: TrendingDown,
    tone: "text-mark-red",
    toneBg: "bg-mark-red/10",
    label: "Cheap · high attrition risk",
  },
  balanced: {
    Icon: Minus,
    tone: "text-surface-deep",
    toneBg: "bg-surface-mint",
    label: "Balanced · market median",
  },
  premium: {
    Icon: TrendingUp,
    tone: "text-[#92400E]",
    toneBg: "bg-[#FCD9A6]",
    label: "Premium · sets new band",
  },
};

type Evidence = {
  verdict: Verdict;
  percentile: number; // 0-100
  retentionPct: number; // 0-100
  budgetImpact: string;
  cascadeImpact: string;
  headlineWhy: string;
  bullets: string[];
  recommendation: string;
};

const evidenceByScenario: Record<ScenarioId, Evidence> = {
  conservative: {
    verdict: "cheap",
    percentile: 25,
    retentionPct: 38,
    budgetImpact: "+$2.5K / yr direct",
    cascadeImpact: "No peer pressure · zero cascade",
    headlineWhy: "Below SF market median by $10K — at the 25th percentile for Senior Engineers in the Bay area. Likely loses Marcus.",
    bullets: [
      "Three competing SF offers for L4 engineers in the last 90 days landed at $156K–$172K base.",
      "Marcus's last 1:1 mentioned ‘at-market questions’ — agent rates flight risk at 62%.",
      "Replacement cost for a Senior Engineer in SF averages $210K (recruiter + ramp + lost throughput).",
    ],
    recommendation:
      "$148K saves ~$20K vs the retention option in year-1, but the 62% departure probability flips it into an expected ~$130K loss when you factor in replacement cost.",
  },
  mid: {
    verdict: "balanced",
    percentile: 50,
    retentionPct: 78,
    budgetImpact: "+$12K / yr direct",
    cascadeImpact: "Within 5% of peers · no cascade",
    headlineWhy: "On the SF market median for Senior Engineers. Internal equity stays within 5% of every peer. Most defensible.",
    bullets: [
      "Sits exactly at the 50th-percentile market figure ($158K) for the role + level + location.",
      "11 teammates compared — all within ±5% of the new number; no triggered re-banding.",
      "78% retention probability over 12 months in similar comparable cases (47 priors).",
    ],
    recommendation:
      "Keep this default unless Marcus signals a competing offer above $165K — at that point switch to the retention scenario.",
  },
  retention: {
    verdict: "premium",
    percentile: 85,
    retentionPct: 92,
    budgetImpact: "+$22K / yr direct",
    cascadeImpact: "+$18K likely · 2 peers re-band",
    headlineWhy: "Above the SF market by $10K — at the 85th percentile. 92% retention but triggers a peer-equity cascade.",
    bullets: [
      "Sets a new internal band for L4 in SF — only Peer A ($162K) currently sits above this floor.",
      "Peers B ($159K) and C ($154K) are now within 6% of Marcus; agent flags both for likely re-band requests within 60 days.",
      "Total expected cost: +$22K direct + ~$18K cascade = $40K/yr; works out to retention insurance at $40K vs $210K replacement risk.",
    ],
    recommendation:
      "Use this only if you have evidence of an external offer — otherwise the cascade cost exceeds the marginal retention lift over the mid scenario.",
  },
};

export function CompMarketEvidenceModal({
  open,
  scenarioId,
  onClose,
}: {
  open: boolean;
  scenarioId: ScenarioId | null;
  onClose: () => void;
}) {
  // Reveal the chart bars after the modal lands so the audience reads the
  // analysis sequentially.
  const [chartsIn, setChartsIn] = useState(false);
  useEffect(() => {
    if (!open) {
      setChartsIn(false);
      return;
    }
    const t = window.setTimeout(() => setChartsIn(true), 250);
    return () => window.clearTimeout(t);
  }, [open, scenarioId]);

  if (!scenarioId) return null;
  const scenario = scenarios.find((s) => s.id === scenarioId)!;
  const ev = evidenceByScenario[scenarioId];
  const vMeta = verdictMeta[ev.verdict];

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow={`Market evidence · ${scenario.label} scenario`}
      title={`$${(scenario.amount / 1000).toFixed(0)}K · ${vMeta.label}`}
      sub="Why this number? Side-by-side market data, internal equity, and retention probability"
      width={820}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute flex items-center gap-1.5">
            <Sparkles size={11} strokeWidth={1.8} className="text-surface-deep" />
            Sources: Radford · Levels.fyi · Comprehensive · 47 comparable cases
          </span>
          <PillButton variant="primary" size="md" arrow onClick={onClose}>
            Back to flow
          </PillButton>
        </div>
      }
    >
      <div className="px-7 py-6 space-y-5">
        {/* Verdict headline */}
        <section
          className={cn(
            "rounded-md p-4 flex items-start gap-3",
            vMeta.toneBg,
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-white",
              vMeta.tone,
            )}
          >
            <vMeta.Icon size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div
              className={cn(
                "text-[10px] tracking-[0.08em] uppercase font-bold",
                vMeta.tone,
              )}
            >
              {vMeta.label}
            </div>
            <p className="text-[13px] text-ink leading-[18px] mt-1">
              {ev.headlineWhy}
            </p>
          </div>
        </section>

        {/* Chart 1 — Market position */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Market position · SF Senior Engineer
            </div>
            <div className="text-[11px] text-mute">
              ${(marketRange.min / 1000).toFixed(0)}K – $
              {(marketRange.max / 1000).toFixed(0)}K market range
            </div>
          </div>
          <MarketBar amount={scenario.amount} chartsIn={chartsIn} />
        </section>

        {/* Two-up: retention probability + budget */}
        <section className="grid grid-cols-2 gap-3">
          {/* Retention probability bars */}
          <div className="border border-divider rounded-md p-4 space-y-2">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Retention probability · 12 months
            </div>
            <div className="space-y-2 mt-2">
              {(["conservative", "mid", "retention"] as ScenarioId[]).map((id) => {
                const sc = scenarios.find((s) => s.id === id)!;
                const pct = evidenceByScenario[id].retentionPct;
                const isActive = id === scenarioId;
                return (
                  <div key={id} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] w-20 shrink-0",
                        isActive ? "text-ink font-bold" : "text-mute",
                      )}
                    >
                      {sc.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-divider/70 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-[900ms] ease-out",
                          isActive ? "bg-surface-deep" : "bg-mute/40",
                        )}
                        style={{ width: chartsIn ? `${pct}%` : "0%" }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[12px] w-10 text-right tabular-nums",
                        isActive
                          ? "text-surface-deep font-bold"
                          : "text-mute",
                      )}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget impact */}
          <div className="border border-divider rounded-md p-4 space-y-2">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Budget impact
            </div>
            <div className="space-y-1.5 text-[12px]">
              <Row k="Direct" v={ev.budgetImpact} />
              <Row k="Cascade" v={ev.cascadeImpact} />
              <Row k="Headroom" v="$23K remaining in Q2 retention pool" />
              <Row k="Replacement cost" v="$210K avg (recruiter + ramp + lost throughput)" />
            </div>
          </div>
        </section>

        {/* Chart 2 — Internal equity */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Internal equity · with this scenario applied
            </div>
            <div className="text-[11px] text-mute">11 teammates · ±5% band</div>
          </div>
          <EquityBars amount={scenario.amount} chartsIn={chartsIn} scenarioId={scenarioId} />
        </section>

        {/* Bullets */}
        <section className="space-y-2">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
            Evidence
          </div>
          <ul className="space-y-1.5">
            {ev.bullets.map((b, i) => (
              <li
                key={b}
                className="ai-stream flex items-start gap-2 text-[12px] leading-[18px] text-ink"
                style={{ animationDelay: `${300 + i * 120}ms` }}
              >
                <Check
                  size={12}
                  strokeWidth={2.4}
                  className="text-surface-deep mt-1 shrink-0"
                />
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Agent recommendation */}
        <section className="bg-surface-mint/40 border border-surface-deep/15 rounded-md p-3 text-[12px] text-ink space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] tracking-[0.08em] uppercase text-surface-deep font-bold">
            <AIDot size={5} tone="deep" pulse />
            Agent recommendation
          </div>
          <p className="leading-[18px]">{ev.recommendation}</p>
        </section>
      </div>
    </PreviewModal>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2">
      <span className="text-mute">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * MarketBar — horizontal market range with percentile ticks + marker
 * ──────────────────────────────────────────────────────────────────────*/

function MarketBar({ amount, chartsIn }: { amount: number; chartsIn: boolean }) {
  const min = marketRange.min;
  const max = marketRange.max;
  const range = max - min;
  const pct = (v: number) => ((v - min) / range) * 100;
  const ticks = [
    { label: "P10", value: 142000 },
    { label: "P25", value: 150000 },
    { label: "P50", value: marketRange.median },
    { label: "P75", value: 166000 },
    { label: "P90", value: 174000 },
  ];
  return (
    <div className="bg-surface-fog rounded-md p-4 space-y-3">
      {/* Bar */}
      <div className="relative h-10">
        {/* Gradient backdrop */}
        <div
          className="absolute inset-x-0 top-3 h-4 rounded-full overflow-hidden"
          style={{
            background:
              "linear-gradient(to right, rgba(166,25,46,0.18), rgba(195,230,225,1) 30%, rgba(195,230,225,1) 70%, rgba(252,217,166,0.5))",
          }}
        />
        {/* Tick markers */}
        {ticks.map((t) => (
          <div
            key={t.label}
            className="absolute top-3 h-4 w-px bg-surface-deep/30"
            style={{ left: `${pct(t.value)}%` }}
          />
        ))}
        {/* Marker for scenario */}
        <div
          className="absolute top-1 transition-all duration-[900ms] ease-out"
          style={{
            left: chartsIn ? `${pct(amount)}%` : "0%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-surface-deep ring-4 ring-surface-mint relative">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-surface-deep/40 animate-ping"
            />
          </div>
          <div className="absolute left-1/2 top-4 -translate-x-1/2 mt-3 whitespace-nowrap">
            <div className="text-[11px] font-bold text-surface-deep tabular-nums">
              ${(amount / 1000).toFixed(0)}K
            </div>
            <div className="text-[10px] text-mute">scenario</div>
          </div>
        </div>
      </div>
      {/* Tick labels */}
      <div className="relative h-9 mt-6">
        {ticks.map((t) => (
          <div
            key={t.label}
            className="absolute top-0 -translate-x-1/2 text-center"
            style={{ left: `${pct(t.value)}%` }}
          >
            <div className="text-[10px] tracking-[0.06em] uppercase text-mute font-bold">
              {t.label}
            </div>
            <div className="text-[10px] text-ink tabular-nums">
              ${(t.value / 1000).toFixed(0)}K
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * EquityBars — peer salary bars with Marcus highlighted
 * ──────────────────────────────────────────────────────────────────────*/

function EquityBars({
  amount,
  chartsIn,
  scenarioId,
}: {
  amount: number;
  chartsIn: boolean;
  scenarioId: ScenarioId;
}) {
  const min = 130000;
  const max = 180000;
  const range = max - min;
  // Marcus's "base" gets replaced with the scenario amount
  const visible = peers.map((p) =>
    p.id === "marcus" ? { ...p, base: amount } : p,
  );
  return (
    <div className="bg-surface-fog rounded-md p-4 space-y-2">
      {visible.map((p, i) => {
        const isMarcus = p.id === "marcus";
        const flagged = !isMarcus && p.flagWhenSelected?.includes(scenarioId);
        const widthPct = ((p.base - min) / range) * 100;
        return (
          <div
            key={p.id}
            className="grid grid-cols-[110px_1fr_80px] items-center gap-3"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={cn(
                  "text-[11px] truncate",
                  isMarcus
                    ? "font-bold text-surface-deep"
                    : flagged
                      ? "font-medium text-[#92400E]"
                      : "text-ink",
                )}
              >
                {p.name}
              </span>
              {flagged && (
                <AlertTriangle
                  size={10}
                  strokeWidth={2}
                  className="text-[#92400E] shrink-0"
                />
              )}
            </div>
            <div className="h-2 rounded-full bg-divider/60 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-[900ms] ease-out",
                  isMarcus
                    ? "bg-surface-deep"
                    : flagged
                      ? "bg-[#F59E0B]"
                      : "bg-mute/40",
                )}
                style={{
                  width: chartsIn ? `${widthPct}%` : "0%",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
            <span
              className={cn(
                "text-[11px] text-right tabular-nums",
                isMarcus ? "font-bold text-surface-deep" : "text-mute",
              )}
            >
              ${(p.base / 1000).toFixed(0)}K
            </span>
          </div>
        );
      })}
    </div>
  );
}
