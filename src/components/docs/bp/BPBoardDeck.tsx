import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { Provenance, CrossLinks, Eyebrow, fmtUSD, fmtPct } from "@/components/docs/shared";
import { PNL, lineTotals, SCENARIOS, SYNERGIES, FLAG_RECOMMENDATION } from "@/components/docs/bp/data";
import { cn } from "@/lib/utils";

/**
 * 18-slide BP board deck rendered as a vertical stack of slide-cards.
 * Each "slide" is a full-bleed card with consistent header chrome.
 */

const SLIDES = [
  "01 · Cover",
  "02 · Agenda",
  "03 · Q2 headline",
  "04 · Derivatives line",
  "05 · Spot line",
  "06 · Institutional line",
  "07 · Compliance line",
  "08 · Revenue waterfall",
  "09 · Cost mix",
  "10 · Unit economics call-outs",
  "11 · Scenario tornado",
  "12 · Synergy map",
  "13 · Strategic recommendation",
  "14 · Risks & mitigants",
  "15 · The ask",
  "16 · Timeline",
  "17 · Appendix · methodology",
  "18 · Sign-off",
];

export function BPBoardDeck() {
  return (
    <DocChrome
      title="BP board deck · Q2"
      primary={{ label: "Route to EXCO", onClick: () => alert("Route via step 7 ceremony.") }}
      secondary={{ label: "Export PPTX", onClick: () => window.print() }}
    >
      <Paper>
        <header className="space-y-2 pb-6 border-b border-divider">
          <Eyebrow>Crypton · Group · Confidential · EXCO board pack</Eyebrow>
          <h1 className="text-[40px] leading-[1.05] tracking-[-0.02em]">Q2 BP review · 18 slides</h1>
          <p className="text-[13px] text-mute max-w-[640px] leading-[20px]">
            Each slide rendered as a card; in PPTX export each becomes one true slide. Click any to
            fullscreen.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 pt-6">
          <Slide n={1} title="Q2 BP review" subtitle="Wei Chen · Group CFO · 2026-05-28">
            <div className="text-center py-8">
              <div className="text-[12px] tracking-[0.18em] uppercase text-mute mb-2">Crypton · Confidential</div>
              <h2 className="text-[48px] tracking-[-0.02em] leading-[1.0]">Q2 BP review</h2>
              <div className="text-[14px] text-mute pt-2">Prepared for the Executive Committee · June 2026</div>
            </div>
          </Slide>
          <Slide n={2} title="Agenda">
            <ol className="list-decimal pl-5 columns-2 gap-6 text-[13px] leading-[22px] text-ink">
              {SLIDES.slice(2).map((s) => (<li key={s}>{s.split(" · ")[1] ?? s}</li>))}
            </ol>
          </Slide>
          <Slide n={3} title="Q2 headline">
            <div className="grid grid-cols-4 gap-4">
              {PNL.map((l) => {
                const t = lineTotals(l, "may");
                return (
                  <div key={l.id} className="rounded-md bg-surface-fog border border-divider p-4">
                    <Eyebrow>{l.id}</Eyebrow>
                    <div className="text-[24px] font-bold tabular-nums">{fmtUSD(t.revenue, { compact: true })}</div>
                    <div className={cn("text-[12px]", t.margin >= 0 ? "text-[var(--ok)]" : "text-mark-red")}>
                      {fmtPct(t.margin)} margin
                    </div>
                  </div>
                );
              })}
            </div>
          </Slide>
          {PNL.map((l, i) => {
            const t = lineTotals(l, "may");
            return (
              <Slide key={l.id} n={4 + i} title={`${l.id} · ${l.owner}`}>
                <div className="grid grid-cols-2 gap-6 items-start">
                  <div>
                    <div className="text-[40px] font-bold leading-[1.05] tabular-nums">{fmtUSD(t.revenue, { compact: true })}</div>
                    <div className="text-[14px] text-mute">May revenue · {fmtPct(t.margin)} margin · {l.headcount} FTE</div>
                    <ul className="text-[12px] leading-[20px] pt-4 space-y-1.5">
                      {l.unitEconomics.map((u) => (
                        <li key={u.label} className="flex justify-between border-b border-divider/60 pb-1">
                          <span className="text-mute">{u.label}</span>
                          <span className="text-ink font-medium">{u.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[12px] leading-[20px]">
                    <Eyebrow>Top accounts (May)</Eyebrow>
                    <ul className="pt-1 space-y-1">
                      {l.lines.slice(0, 5).map((ln) => (
                        <li key={ln.code} className="flex justify-between border-b border-divider/60 pb-1">
                          <span className="text-ink">{ln.name}</span>
                          <span className={cn("tabular-nums", ln.kind === "cost" ? "text-mark-red" : "text-[var(--ok)]")}>
                            {ln.kind === "cost" ? "−" : "+"}{fmtUSD(ln.may, { compact: true })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Slide>
            );
          })}
          <Slide n={8} title="Revenue waterfall · April → May">
            <p className="text-[14px] leading-[24px] text-ink">See <em>Revenue waterfall</em> doc for full chart. Headline: derivatives drove ~60% of the MoM uplift; spot contributed 7%, institutional 3%.</p>
          </Slide>
          <Slide n={9} title="Cost mix">
            <p className="text-[14px] leading-[24px] text-ink">People dominates every line; Compliance is the only line where Legal &amp; regulatory cost exceeds People — driven by ongoing MAS MPI counsel.</p>
          </Slide>
          <Slide n={10} title="Unit economics call-outs">
            <ul className="text-[13px] leading-[22px] list-disc pl-5">
              <li>Funding-rate days positive in Q2: 53 / 63 — the structural tailwind has not normalised.</li>
              <li>Spot maker / taker mix 31 / 69 — healthy taker dominance keeps net fee yield high.</li>
              <li>Institutional pipeline: +50 onboards within 90 days — current staffing inadequate.</li>
              <li>Compliance license runway: 47 months — sufficient for MAS pacing.</li>
            </ul>
          </Slide>
          <Slide n={11} title="Scenario tornado · Q3 sensitivity">
            <ul className="text-[13px] leading-[22px]">
              {SCENARIOS.slice(0, 3).map((s) => (
                <li key={s.driver} className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-divider/60 py-1">
                  <span className="text-ink">{s.driver}</span>
                  <span className="tabular-nums text-mark-red">{fmtUSD(s.downsideUSD, { compact: true })}</span>
                  <span className="tabular-nums text-[var(--ok)]">+{fmtUSD(s.upsideUSD, { compact: true })}</span>
                </li>
              ))}
            </ul>
          </Slide>
          <Slide n={12} title="Synergy map · top 3">
            <ul className="text-[13px] leading-[22px]">
              {SYNERGIES.slice(0, 3).map((s) => (
                <li key={s.pair} className="grid grid-cols-[1fr_auto] gap-2 border-b border-divider/60 py-1">
                  <span className="text-ink">{s.pair}</span>
                  <span className="tabular-nums text-mute">{fmtUSD(s.impactUSDQ, { compact: true })} / Q · {(s.confidence * 100).toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </Slide>
          <Slide n={13} title="Strategic recommendation">
            <h2 className="text-[28px] font-bold leading-[34px] mb-3">{FLAG_RECOMMENDATION.ask}</h2>
            <p className="text-[13px] leading-[20px] text-mute">{FLAG_RECOMMENDATION.rationale}</p>
          </Slide>
          <Slide n={14} title="Risks & mitigants">
            <p className="text-[13px] leading-[20px] text-ink">{FLAG_RECOMMENDATION.risk}</p>
            <p className="text-[13px] leading-[20px] text-mute pt-2">Mitigation: tranche the $2M against MAS milestones; first $500K on application acknowledgement.</p>
          </Slide>
          <Slide n={15} title="The ask">
            <div className="text-center py-6">
              <Eyebrow>EXCO decision</Eyebrow>
              <div className="text-[36px] font-bold pt-2">{FLAG_RECOMMENDATION.ask}</div>
              <div className="text-[14px] text-mute pt-1">Decision by June 12 · expected annualised net {fmtUSD(FLAG_RECOMMENDATION.expectedNet, { compact: true })}</div>
            </div>
          </Slide>
          <Slide n={16} title="Timeline">
            <ol className="text-[13px] leading-[22px] list-decimal pl-5">
              <li>Jun 5 · EXCO sign-off</li>
              <li>Jun 12 · Approval communicated to Institutional team</li>
              <li>Jul 1 · First $500K tranche released on MAS application acknowledgement</li>
              <li>Q4 · Onboarding milestones reviewed; remaining $1.5M released against signed clients</li>
            </ol>
          </Slide>
          <Slide n={17} title="Appendix · methodology">
            <p className="text-[13px] leading-[20px] text-mute">P&L from Q2 BP packet · scenario engine FP&A v3.1 · synergy correlations from 180-day cross-line correlation analysis · confidence intervals are 1-sigma posterior.</p>
          </Slide>
          <Slide n={18} title="Sign-off">
            <div className="grid grid-cols-2 gap-6 max-w-[520px] text-[13px] leading-[22px] pt-2">
              <SignBlock role="CFO (BP hat)" name="Wei Chen" date="2026-05-28" />
              <SignBlock role="EXCO chair" name="—" date="—" />
            </div>
          </Slide>
        </div>
      </Paper>
      <SideRail>
        <Provenance source="Q2 BP packet · all supporting docs" generatedAt="2026-05-28 12:40" notes="18 slides · vertical scroll preview · PPTX export emits one slide per card." />
        <CrossLinks
          links={[
            { id: "bp-strategic-memo", label: "Strategic memo (text)" },
            { id: "business-line-pnl", label: "Business line P&L" },
            { id: "scenario-analysis", label: "Scenario analysis" },
            { id: "synergy-map", label: "Cross-line synergy map" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function Slide({ n, title, subtitle, children }: { n: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <article className="bg-white border border-divider rounded-md p-6 min-h-[260px]">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Slide {String(n).padStart(2, "0")}</Eyebrow>
        <span className="text-[10px] tracking-[0.08em] uppercase text-mute">Crypton · Q2 BP</span>
      </div>
      <h3 className="text-[18px] font-bold text-ink mb-1">{title}</h3>
      {subtitle && <div className="text-[12px] text-mute mb-3">{subtitle}</div>}
      <div className="pt-2">{children}</div>
    </article>
  );
}

function SignBlock({ role, name, date }: { role: string; name: string; date: string }) {
  return (
    <div>
      <Eyebrow>{role}</Eyebrow>
      <div className="h-12 border-b border-ink/40 mb-1.5"></div>
      <div className="text-ink">{name}</div>
      <div className="text-mute text-[11px]">{date}</div>
    </div>
  );
}
