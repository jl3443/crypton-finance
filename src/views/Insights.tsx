import { TopRow } from "@/components/blocks/TopRow";
import { HeroBanner } from "@/components/blocks/HeroBanner";
import { KPIStrip, type KPI } from "@/components/blocks/KPIStrip";
import { PillButton } from "@/components/blocks/PillButton";
import { CountUp } from "@/components/ai/CountUp";
import { SpringIn } from "@/components/ai/SpringIn";
import { StaggerList } from "@/components/ai/StaggerList";
import { AIDot } from "@/components/ai/AIDot";
import { StreamingText } from "@/components/ai/StreamingText";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const kpis: KPI[] = [
  {
    label: "Hours saved by AI",
    value: 412,
    suffix: "h",
    trend: { delta: "18%", direction: "up" },
    spark: [180, 215, 240, 268, 300, 340, 378, 412],
  },
  {
    label: "Cases resolved",
    value: 247,
    trend: { delta: "12%", direction: "up" },
    spark: [120, 145, 168, 180, 200, 218, 230, 247],
  },
  {
    label: "Avg decision time",
    value: 26,
    suffix: "m",
    trend: { delta: "42%", direction: "down" },
    spark: [60, 55, 50, 44, 40, 34, 30, 26],
  },
  {
    label: "Employee satisfaction",
    value: 87,
    suffix: "%",
    trend: { delta: "1.8", direction: "up" },
    spark: [82, 83, 84, 84, 85, 86, 86, 87],
  },
];

const trendSeries = [
  { month: "Nov", agent: 28, human: 14 },
  { month: "Dec", agent: 34, human: 12 },
  { month: "Jan", agent: 41, human: 11 },
  { month: "Feb", agent: 47, human: 10 },
  { month: "Mar", agent: 52, human: 9 },
  { month: "Apr", agent: 58, human: 8 },
];

const aiActions = [
  { type: "Compliance scan", country: "🇩🇪 Germany", count: 47, hours: 92, trend: "up" },
  { type: "Offboarding plan", country: "🇩🇪 Germany", count: 32, hours: 78, trend: "up" },
  { type: "Compensation model", country: "🇺🇸 USA", count: 28, hours: 64, trend: "flat" },
  { type: "Onboarding plan", country: "🇨🇭 Switzerland", count: 24, hours: 56, trend: "up" },
  { type: "Employment letter", country: "🇫🇷 France", count: 64, hours: 38, trend: "up" },
  { type: "Pay equity audit", country: "🇫🇷 France", count: 8, hours: 28, trend: "flat" },
];

const heatmap = {
  countries: ["🇩🇪 Germany", "🇨🇭 Switzerland", "🇺🇸 USA", "🇫🇷 France", "🇧🇷 Brazil", "🇪🇸 Spain"],
  types: ["Compliance", "Lifecycle", "Comp & ben", "Letters"],
  cells: [
    [12, 5, 3, 21],
    [3, 8, 2, 14],
    [2, 4, 11, 18],
    [4, 2, 1, 64],
    [1, 3, 0, 9],
    [0, 2, 1, 7],
  ],
};

const aiInsights = [
  {
    tag: "Pattern",
    text: "Germany compliance load is up 38% this quarter — the agent absorbed 92 hours of manual scanning. Suggest adding a dedicated EU regulatory feed.",
  },
  {
    tag: "Anomaly",
    text: "France letter volume jumped 4× in April — driven by a single benefits change. The agent auto-handled 62 of 64 with zero escalations.",
  },
  {
    tag: "Risk",
    text: "Switzerland onboarding flows averaged 2.1 days vs 1.4 days for Germany. Manager response time is the main delta — flag for People-Ops review.",
  },
  {
    tag: "Opportunity",
    text: "Compensation decisions still take 38 min on average. Bringing market data into the workspace pre-load could cut another ~30%.",
  },
];

export function Insights() {
  return (
    <div className="pl-5 pr-6 pt-4 pb-8 space-y-3 min-h-screen bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <TopRow breadcrumb={{ label: "AI insights", chip: "HR Ops" }} />

      <HeroBanner
        eyebrow="What the agents learned this quarter"
        summary="Across 4 countries and 247 cases, AI saved 412 HRBP hours · biggest win in Germany compliance · 4 patterns worth your attention."
        cta={<PillButton variant="deep" size="sm">Export brief</PillButton>}
        meta="Refreshed 4 min ago"
      />

      <KPIStrip items={kpis} />

      <div className="grid grid-cols-[2fr_1fr] gap-3 items-stretch">
        <TrendChart />
        <DecisionMix />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-3 items-stretch">
        <ActionsTable />
        <HeatmapPanel />
      </div>

      <AIInsightFeed />
    </div>
  );
}

function TrendChart() {
  const max = Math.max(...trendSeries.flatMap((m) => [m.agent, m.human]));
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState<number | null>(trendSeries.length - 1);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 250);
    return () => window.clearTimeout(t);
  }, []);
  const w = 100;
  const h = 100;
  // Position each data point at the centre of its month column so the dots,
  // the dashed hover line and the month labels below all line up.
  const px = (i: number) => ((i + 0.5) / trendSeries.length) * w;
  const py = (v: number) => h - (v / max) * h * 0.85 - 8;
  const firstAgentY = py(trendSeries[0].agent);
  const lastAgentY = py(trendSeries[trendSeries.length - 1].agent);
  const firstHumanY = py(trendSeries[0].human);
  const lastHumanY = py(trendSeries[trendSeries.length - 1].human);
  const agentPath =
    `M0,${firstAgentY} ` +
    trendSeries.map((m, i) => `L${px(i)},${py(m.agent)}`).join(" ") +
    ` L${w},${lastAgentY}`;
  const humanPath =
    `M0,${firstHumanY} ` +
    trendSeries.map((m, i) => `L${px(i)},${py(m.human)}`).join(" ") +
    ` L${w},${lastHumanY}`;
  const agentArea = `${agentPath} L${w},${h} L0,${h} Z`;
  const focus = hover != null ? trendSeries[hover] : null;
  const lift = focus ? (focus.agent - focus.human) : null;

  return (
    <SpringIn className="h-full">
      <article className="bg-white border border-divider rounded-md p-4 h-full flex flex-col">
        <header className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Cases resolved per month
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-mute">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-surface-deep" /> Agent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-mute/40" /> HRBP
            </span>
          </div>
        </header>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[28px] leading-none font-bold text-ink tabular-nums">
            {focus ? focus.agent : trendSeries[trendSeries.length - 1].agent}
          </span>
          <span className="text-[12px] text-mute">
            cases by agent · {focus?.month ?? "latest"}
          </span>
          {lift != null && (
            <span className="ml-auto text-[12px] font-medium text-surface-deep">
              ↑ {lift} more than HRBP
            </span>
          )}
        </div>

        <div className="relative flex-1 min-h-[200px]">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{
              transition: "clip-path 1100ms ease-out, opacity 600ms ease-out",
              clipPath: show ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              opacity: show ? 1 : 0,
            }}
          >
            <path d={agentArea} fill="var(--surface-mint)" opacity="0.55" />
            <path d={humanPath} fill="none" stroke="#9a9a9a" strokeWidth="0.8" vectorEffect="non-scaling-stroke" strokeDasharray="3 2" />
            <path d={agentPath} fill="none" stroke="var(--accent-green-deep)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            {hover != null && (
              <line
                x1={px(hover)}
                x2={px(hover)}
                y1="0"
                y2={h}
                stroke="var(--accent-green-deep)"
                strokeWidth="0.4"
                strokeDasharray="1.5 1.5"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          {/* Hover hit-targets — rendered on top so they capture pointer events */}
          <div
            className="absolute inset-0 flex"
            onMouseLeave={() => setHover(null)}
          >
            {trendSeries.map((m, i) => (
              <button
                key={m.month}
                type="button"
                title={`${m.month} · agent ${m.agent} · HRBP ${m.human}`}
                aria-label={`${m.month}: agent resolved ${m.agent}, HRBP resolved ${m.human}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="flex-1 group h-full relative cursor-default"
              >
                <span
                  className="absolute rounded-full bg-surface-deep transition-transform"
                  style={{
                    left: "50%",
                    top: `${py(m.agent)}%`,
                    width: 8,
                    height: 8,
                    transform: `translate(-50%, -50%) scale(${hover === i ? 1.3 : 0.7})`,
                  }}
                />
              </button>
            ))}
          </div>
          {/* Floating tooltip pinned to the hovered month */}
          {hover != null && (
            <div
              className="absolute pointer-events-none z-10 -translate-x-1/2 transition-[left] duration-200"
              style={{
                left: `${((hover + 0.5) / trendSeries.length) * 100}%`,
                top: `${py(trendSeries[hover].agent)}%`,
              }}
            >
              <div className="-translate-y-[calc(100%+10px)] bg-surface-deep text-ink-inverse text-[11px] rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-md">
                <div className="font-bold tracking-[0.06em] uppercase text-[10px] opacity-70">
                  {trendSeries[hover].month}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  Agent · <span className="font-bold tabular-nums">{trendSeries[hover].agent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  HRBP · <span className="font-bold tabular-nums">{trendSeries[hover].human}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-6 mt-1 text-[11px] text-mute">
          {trendSeries.map((m, i) => (
            <div
              key={m.month}
              className={cn(
                "text-center transition-colors",
                hover === i && "text-surface-deep font-bold",
              )}
            >
              {m.month}
            </div>
          ))}
        </div>
      </article>
    </SpringIn>
  );
}

function DecisionMix() {
  const rows = [
    { label: "Auto-handled by agent", value: 184, color: "bg-surface-deep", sub: "no human touch" },
    { label: "Approved with one click", value: 49, color: "bg-surface-sage", sub: "single tap" },
    { label: "Routed for review", value: 14, color: "bg-surface-mint", sub: "needed your call" },
  ];
  const total = rows.reduce((a, b) => a + b.value, 0);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? 0;
  return (
    <SpringIn delay={120} className="h-full">
      <article className="bg-white border border-divider rounded-md p-4 h-full flex flex-col">
        <header className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Decision mix
            </span>
          </div>
          <span className="text-[11px] text-mute">last 90 days</span>
        </header>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[28px] leading-none font-bold text-ink tabular-nums">
            <CountUp to={Math.round((rows[active].value / total) * 100)} duration={600} key={active} />
            <span className="text-[16px] font-medium text-mute ml-0.5">%</span>
          </span>
          <span className="text-[12px] text-mute">{rows[active].sub}</span>
        </div>

        <div
          className="flex h-3 rounded-full overflow-hidden mb-4"
          onMouseLeave={() => setHover(null)}
        >
          {rows.map((r, i) => (
            <button
              type="button"
              key={r.label}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className={cn(
                r.color,
                "transition-[flex-basis,filter] duration-[900ms] ease-out cursor-default",
                hover != null && hover !== i && "opacity-50",
              )}
              style={{ flexBasis: `${(r.value / total) * 100}%`, transitionDelay: `${i * 120}ms` }}
              aria-label={`${r.label}: ${r.value}`}
            />
          ))}
        </div>

        <ul className="space-y-2" onMouseLeave={() => setHover(null)}>
          {rows.map((r, i) => (
            <li
              key={r.label}
              onMouseEnter={() => setHover(i)}
              className={cn(
                "flex items-center gap-3 rounded-md px-1.5 py-1 -mx-1.5 cursor-default transition-colors",
                hover === i && "bg-surface-mint/40",
              )}
            >
              <span className={cn("w-2.5 h-2.5 rounded-sm shrink-0", r.color)} />
              <span className="text-[13px] text-ink flex-1">{r.label}</span>
              <span className="text-[13px] font-bold tabular-nums text-ink">
                <CountUp to={r.value} duration={900} delay={i * 90} />
              </span>
              <span className="text-[11px] text-mute w-10 text-right tabular-nums">
                {Math.round((r.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-3 border-t border-divider/80 flex items-center gap-2 text-[12px]">
          <AIDot size={5} tone="green" pulse />
          <span className="text-mute">
            Agent autonomy is <span className="text-surface-deep font-bold">+11 pts</span>{" "}
            vs last quarter
          </span>
        </div>
      </article>
    </SpringIn>
  );
}

function ActionsTable() {
  const max = Math.max(...aiActions.map((a) => a.hours));
  const totalRuns = aiActions.reduce((a, b) => a + b.count, 0);
  const totalHours = aiActions.reduce((a, b) => a + b.hours, 0);
  return (
    <SpringIn className="h-full">
      <article className="bg-white border border-divider rounded-md overflow-hidden h-full flex flex-col">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Top AI actions · last 90 days
            </span>
          </div>
          <span className="text-[11px] text-mute">{aiActions.length} action types</span>
        </header>
        <div className="grid grid-cols-[1.5fr_1fr_0.7fr_1.4fr] bg-surface-deep text-ink-inverse">
          {["Action", "Country", "Runs", "Hours saved"].map((h) => (
            <div key={h} className="px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium">
              {h}
            </div>
          ))}
        </div>
        <StaggerList step={60} initialDelay={200}>
          {aiActions.map((a, i) => (
            <div
              key={a.type}
              title={`${a.type} in ${a.country.replace(/^[^\w]+/, "")} · ${a.count} runs · ${a.hours}h saved`}
              className="grid grid-cols-[1.5fr_1fr_0.7fr_1.4fr] items-center border-t border-divider first:border-t-0 hover:bg-surface-mint/40 transition-colors"
            >
              <div className="px-4 py-2.5 text-[14px] text-ink font-medium">{a.type}</div>
              <div className="px-4 py-2.5 text-[13px] text-mute">{a.country}</div>
              <div className="px-4 py-2.5 text-[14px] font-bold tabular-nums">
                <CountUp to={a.count} duration={800} delay={i * 70} />
              </div>
              <div className="px-4 py-2.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-divider/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-surface-deep transition-all duration-[900ms] ease-out"
                    style={{ width: `${(a.hours / max) * 100}%`, transitionDelay: `${i * 70 + 200}ms` }}
                  />
                </div>
                <span className="text-[13px] font-bold tabular-nums w-12 text-right">
                  <CountUp to={a.hours} duration={800} delay={i * 70} />h
                </span>
              </div>
            </div>
          ))}
        </StaggerList>
        <footer className="mt-auto flex items-center justify-between px-4 py-2.5 border-t border-divider text-[12px]">
          <span className="text-mute">Totals across action types</span>
          <span className="flex items-center gap-4">
            <span className="text-mute">
              Runs <span className="font-bold text-ink ml-1 tabular-nums">{totalRuns}</span>
            </span>
            <span className="text-mute">
              Hours saved <span className="font-bold text-surface-deep ml-1 tabular-nums">{totalHours}h</span>
            </span>
          </span>
        </footer>
      </article>
    </SpringIn>
  );
}

function HeatmapPanel() {
  const max = Math.max(...heatmap.cells.flat());
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  // Default focus = the peak cell
  let peakR = 0;
  let peakC = 0;
  heatmap.cells.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v > heatmap.cells[peakR][peakC]) {
        peakR = r;
        peakC = c;
      }
    }),
  );
  const focusR = hover?.r ?? peakR;
  const focusC = hover?.c ?? peakC;
  const focusValue = heatmap.cells[focusR][focusC];
  return (
    <SpringIn delay={150} className="h-full">
      <article className="bg-white border border-divider rounded-md overflow-hidden h-full flex flex-col">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Cases by country × type
            </span>
          </div>
          <span className="text-[11px] text-mute">90 days</span>
        </header>
        <div className="p-4 flex-1 flex flex-col" onMouseLeave={() => setHover(null)}>
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `auto repeat(${heatmap.types.length}, 1fr)` }}
          >
            <div />
            {heatmap.types.map((t, c) => (
              <div
                key={t}
                className={cn(
                  "text-[10px] tracking-[0.08em] uppercase font-medium text-center whitespace-nowrap transition-colors",
                  focusC === c ? "text-surface-deep" : "text-mute",
                )}
              >
                {t}
              </div>
            ))}
            {heatmap.countries.map((c, ri) => (
              <RowFragment
                key={c}
                rowIndex={ri}
                country={c}
                cells={heatmap.cells[ri]}
                types={heatmap.types}
                max={max}
                delay={ri * 80}
                hover={hover}
                setHover={setHover}
                focusR={focusR}
              />
            ))}
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between gap-3">
            <div className="text-[12px] leading-tight">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                {hover ? "Hovering" : "Peak this quarter"}
              </div>
              <div className="text-ink mt-0.5">
                <span className="font-bold">{heatmap.countries[focusR]}</span>
                <span className="text-mute"> · {heatmap.types[focusC]}</span>
                <span className="text-surface-deep font-bold ml-2 tabular-nums">{focusValue} cases</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-mute">
              <span>Less</span>
              {[0.1, 0.25, 0.45, 0.7, 1].map((o) => (
                <div
                  key={o}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: `rgba(8, 67, 55, ${o})` }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </article>
    </SpringIn>
  );
}

function RowFragment({
  rowIndex,
  country,
  cells,
  types,
  max,
  delay,
  hover,
  setHover,
  focusR,
}: {
  rowIndex: number;
  country: string;
  cells: number[];
  types: string[];
  max: number;
  delay: number;
  hover: { r: number; c: number } | null;
  setHover: (h: { r: number; c: number } | null) => void;
  focusR: number;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 200 + delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return (
    <>
      <div
        className={cn(
          "text-[12px] py-1.5 pr-2 whitespace-nowrap transition-colors",
          focusR === rowIndex ? "text-surface-deep font-bold" : "text-ink",
        )}
      >
        {country}
      </div>
      {cells.map((v, ci) => {
        const intensity = max === 0 ? 0 : Math.max(0.06, v / max);
        const isHover = hover?.r === rowIndex && hover?.c === ci;
        const dim =
          hover != null && !isHover && hover.r !== rowIndex && hover.c !== ci;
        return (
          <button
            type="button"
            key={ci}
            title={`${country} · ${types[ci]}: ${v} cases`}
            onMouseEnter={() => setHover({ r: rowIndex, c: ci })}
            onFocus={() => setHover({ r: rowIndex, c: ci })}
            className={cn(
              "h-7 rounded-sm flex items-center justify-center text-[11px] font-medium transition-all duration-[300ms] ease-out cursor-default",
              isHover && "ring-2 ring-surface-deep ring-offset-1 scale-[1.06]",
            )}
            style={{
              backgroundColor: show
                ? `rgba(8, 67, 55, ${dim ? intensity * 0.4 : intensity})`
                : "rgba(8, 67, 55, 0)",
              color: intensity > 0.5 ? "white" : "#084337",
              transitionDelay: show ? "0ms" : `${ci * 60}ms`,
            }}
          >
            {v > 0 ? v : ""}
          </button>
        );
      })}
    </>
  );
}

function AIInsightFeed() {
  return (
    <article className="bg-white border border-divider rounded-md overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
        <div className="flex items-center gap-2">
          <AIDot size={6} tone="deep" pulse />
          <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            What the agent noticed
          </span>
        </div>
        <span className="text-[11px] text-mute">4 patterns</span>
      </header>
      <StaggerList step={140} initialDelay={400}>
        {aiInsights.map((ins, i) => (
          <div
            key={ins.text}
            className="px-4 py-3 border-t border-divider first:border-t-0 flex gap-3 hover:bg-surface-mint/40 transition-colors"
          >
            <span className="px-2 py-0.5 h-fit rounded-full bg-surface-mint text-surface-deep text-[10px] tracking-[0.08em] uppercase font-bold shrink-0">
              {ins.tag}
            </span>
            <p className="text-[13px] leading-[19px] text-ink">
              {i === 0 ? <StreamingText text={ins.text} cps={120} caret={false} /> : ins.text}
            </p>
          </div>
        ))}
      </StaggerList>
    </article>
  );
}
