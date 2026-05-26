import { useApp } from "@/state";
import { TopRow } from "@/components/blocks/TopRow";
import { PillButton } from "@/components/blocks/PillButton";
import { SpringIn } from "@/components/ai/SpringIn";
import { CountUp } from "@/components/ai/CountUp";
import { AIDot } from "@/components/ai/AIDot";
import { StaggerList } from "@/components/ai/StaggerList";

export function ComplianceRadar() {
  const { go } = useApp();

  return (
    <div className="pl-5 pr-6 pt-4 pb-8 space-y-3 min-h-screen bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <TopRow breadcrumb={{ label: "Compliance radar", chip: "Live" }} />

      {/* ACTIVE — needs your decision */}
      <section className="bg-white border border-divider rounded-md overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" pulse />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Active · needs your decision
            </span>
          </div>
          <span className="text-[11px] text-mute">Monitoring 23 countries · synced 2 min ago</span>
        </header>

        <SpringIn>
          <article className="bg-surface-mint m-3 rounded-md px-4 py-3 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-black text-ink-inverse text-[10px] tracking-[0.08em] uppercase font-medium">
                    Germany
                  </span>
                  <span className="text-[12px] text-ink">Working Hours Act amendment</span>
                </div>
                <h2 className="text-[18px] leading-[22px] font-bold text-ink">
                  Standard workweek moving from 40 hours to 37.5 hours
                </h2>
                <div className="text-[12px] text-mute">
                  Effective in 90 days · detected at 7:14 AM today
                </div>
              </div>
              <div className="bg-surface-deep text-ink-inverse text-center px-3 py-1.5 rounded shrink-0">
                <div className="text-[18px] leading-none font-bold">90</div>
                <div className="text-[9px] tracking-[0.08em] uppercase mt-0.5">Days</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-2 items-center">
              <p className="text-[13px] text-ink leading-[19px]">
                <span className="inline-flex items-center gap-1.5 align-middle mr-1.5">
                  <AIDot size={5} tone="deep" />
                  <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-surface-deep">
                    AI rec
                  </span>
                </span>
                Move all Germany employees to the 37.5-hour workweek. Roll out in three phases
                over 90 days so payroll and contract updates land smoothly.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <PillButton
                  variant="primary"
                  size="sm"
                  arrow
                  onClick={() => go({ kind: "workspace", flow: "uc2" })}
                >
                  Review in workspace
                </PillButton>
                <PillButton
                  variant="secondary"
                  size="sm"
                  onClick={() => go({ kind: "doc", id: "working-hours-act" })}
                >
                  Source law
                </PillButton>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-surface-deep/15">
              {[
                { label: "Impact", value: <><CountUp to={147} delay={200} /> employees</> },
                { label: "Contracts", value: <><CountUp to={12} delay={280} /> to update</> },
                { label: "Risk", value: "Medium" },
                { label: "Cost", value: "€420K/yr" },
              ].map((m) => (
                <div key={m.label} className="flex items-baseline gap-1.5">
                  <span className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                    {m.label}
                  </span>
                  <span className="text-[14px] font-bold text-ink">{m.value}</span>
                </div>
              ))}
            </div>
          </article>
        </SpringIn>
      </section>

      {/* RECENT — handled silently */}
      <section className="bg-white border border-divider rounded-md overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Recent · handled silently by the agent
            </span>
          </div>
          <span className="text-[11px] text-mute">2 items this week</span>
        </header>
        <div className="grid grid-cols-2 divide-x divide-divider">
          {[
            {
              country: "Germany",
              title: "Works council guidance updated",
              note: "No change needed — your AI policy already meets the new quarterly review rule.",
            },
            {
              country: "France",
              title: "Q2 pay transparency report",
              note: "Audit ran 12 May. All bands within tolerance. Filed for you on 15 May.",
            },
          ].map((r) => (
            <article
              key={r.country + r.title}
              className="px-4 py-3 space-y-2 hover:bg-surface-mint/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-accent-green text-ink-inverse text-[10px] font-medium uppercase tracking-[0.06em]">
                  {r.country}
                </span>
                <span className="text-[13px] text-ink">{r.title}</span>
              </div>
              <div className="flex items-start gap-2">
                <AIDot size={6} tone="deep" className="mt-1.5" />
                <p className="text-[13px] text-ink leading-[19px]">{r.note}</p>
              </div>
              <button className="ui-pill text-[12px] text-surface-deep font-medium hover:underline">
                View →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* UPCOMING */}
      <section className="bg-white border border-divider rounded-md overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Upcoming · scheduled audits
            </span>
          </div>
          <span className="text-[11px] text-mute">3 in the next 90 days</span>
        </header>
        <StaggerList step={70}>
          {[
            { title: "EU AI Act compliance audit", due: "Due Aug 2, 2026", days: "75 days", country: "🇪🇺 EU" },
            { title: "EU pay transparency annual report", due: "Due Jul 1, 2026", days: "43 days", country: "🇪🇺 EU" },
            { title: "California pay disclosure update", due: "Due Jun 15, 2026", days: "27 days", country: "🇺🇸 USA" },
          ].map((u) => (
            <div
              key={u.title}
              className="grid grid-cols-[60px_1fr_auto_auto] items-center gap-4 px-4 py-2.5 border-t border-divider first:border-t-0 hover:bg-surface-mint/40 transition-colors"
            >
              <span className="text-[14px]">{u.country}</span>
              <span className="text-[14px] text-ink">{u.title}</span>
              <span className="text-[12px] text-mute">{u.due}</span>
              <span className="text-[12px] font-bold text-surface-deep w-16 text-right">{u.days}</span>
            </div>
          ))}
        </StaggerList>
      </section>
    </div>
  );
}
