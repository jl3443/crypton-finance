import { DocChrome, Paper, SideRail } from "./DocChrome";
import { AIDot } from "@/components/ai/AIDot";

export function HandbookRedline() {
  return (
    <DocChrome
      title="Document · Employee handbook · Germany section · proposed update"
      secondary={{ label: "Reject" }}
      primary={{ label: "Accept all changes" }}
    >
      <Paper>
        <header className="space-y-1 pb-5 border-b border-divider">
          <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
            Employee handbook · v2.4 → v2.5 proposed
          </div>
          <h1 className="text-[28px] font-bold tracking-[-0.01em]">Section 4. Working hours</h1>
          <p className="text-[13px] text-mute">
            Germany · applies to all employees on German contracts
          </p>
        </header>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">4.1  Standard working hours</h3>
          <p className="text-[14px] leading-[22px]">
            Full-time employees are expected to work a standard week as defined by the German
            Arbeitszeitgesetz and the applicable collective bargaining agreement.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">4.2  Maximum weekly hours</h3>
          <div className="bg-surface-fog rounded p-4 space-y-3">
            <p className="text-[14px] leading-[22px] text-mark-red line-through">
              The standard working week for full-time employees in Germany is 40 hours per week,
              distributed Monday through Friday.
            </p>
            <div className="bg-surface-mint rounded px-4 py-3">
              <p className="text-[14px] leading-[22px] text-ink">
                The standard working week for full-time employees in Germany is 37 hours and 30 minutes
                per week, distributed Monday through Friday. This applies from 17 August 2026 in
                accordance with the new German Working Hours Act amendment.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AIDot size={6} tone="deep" />
              <span className="text-[12px] tracking-[0.04em] text-surface-deep">
                AI drafted change · reason: new German labor law · effective 17 Aug 2026
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">4.3  Overtime</h3>
          <p className="text-[14px] leading-[22px]">
            Any hours worked beyond the standard weekly hours defined in 4.2 are considered overtime
            and compensated according to the applicable collective bargaining agreement.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">4.4  Annual averaging</h3>
          <p className="text-[14px] leading-[22px]">
            Weekly hours may be averaged over the calendar year as long as the annual total does
            not exceed the equivalent of 37.5 hours per week.
          </p>
        </section>
      </Paper>

      <SideRail>
        <div className="bg-white border border-divider rounded-md p-5 space-y-3">
          <div className="text-[14px] font-bold text-ink">Changes in this update</div>
          {[
            { lbl: "4.2  Weekly hours", badge: "Major change", bg: "bg-mark-red" },
            { lbl: "4.4  Annual averaging", badge: "Cross-ref update", bg: "bg-surface-deep" },
            { lbl: "Sections 4.1, 4.3", badge: "No change", bg: "bg-mute" },
          ].map((r) => (
            <div key={r.lbl} className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-ink">{r.lbl}</span>
              <span
                className={`text-[11px] font-medium text-ink-inverse px-2 py-0.5 rounded-full ${r.bg}`}
              >
                {r.badge}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-surface-mint rounded-md p-5 space-y-2.5">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Approval flow
          </div>
          {[
            { ic: "✓", lbl: "AI drafted change", who: "Done" },
            { ic: "○", lbl: "HRBP review", who: "You" },
            { ic: "○", lbl: "Legal review", who: "auto-routed" },
            { ic: "○", lbl: "Publish to handbook", who: "after legal" },
          ].map((r) => (
            <div key={r.lbl} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[13px] text-ink">
                <span className="text-surface-deep">{r.ic}</span>
                {r.lbl}
              </span>
              <span className="text-[11px] text-mute">{r.who}</span>
            </div>
          ))}
        </div>
      </SideRail>
    </DocChrome>
  );
}
