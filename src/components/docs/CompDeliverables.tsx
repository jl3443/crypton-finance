import { DocChrome } from "./DocChrome";

function DocCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-white border border-divider rounded-md p-8 space-y-4">
      <header>
        <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
          {eyebrow}
        </div>
        <h2 className="text-[20px] font-bold text-ink leading-[26px] mt-1">{title}</h2>
      </header>
      {children}
    </article>
  );
}

export function CompDeliverables() {
  return (
    <DocChrome
      title="Deliverables · Senior Engineer compensation update · 3 documents"
      secondary={{ label: "Edit drafts" }}
      primary={{ label: "Send to manager + Finance" }}
    >
      <div className="grid grid-cols-3 gap-4 col-span-2">
        {/* Salary update form */}
        <DocCard eyebrow="Document 1 · Workday-ready" title="Salary update form">
          {[
            ["Employee", "Marcus L. · 8842-US"],
            ["Current salary", "USD 146,000"],
            ["Proposed salary", "USD 158,000"],
            ["Delta", "+8.2% · +USD 12,000"],
            ["Effective", "1 June 2026"],
            ["Reason code", "Market correction · retention"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between py-2.5 border-b border-divider text-[13px]"
            >
              <span className="text-[11px] uppercase tracking-[0.06em] text-mute font-medium">
                {k}
              </span>
              <span className="text-ink">{v}</span>
            </div>
          ))}
          <div className="bg-surface-mint rounded p-4 space-y-1">
            <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Budget impact
            </div>
            <div className="text-[14px] text-ink">USD 12,000 / year · within Q2 retention pool</div>
          </div>
          <div className="text-[12px] text-mute pt-2">
            <div className="font-medium text-ink mb-1">Approvers</div>
            <div>✓  HRBP · 19 May</div>
            <div className="text-mute">○  Engineering manager · pending</div>
            <div className="text-mute">○  Finance Director · pending</div>
          </div>
        </DocCard>

        {/* Talking points */}
        <DocCard
          eyebrow="Document 2 · 5-minute conversation"
          title="Talking points for the manager"
        >
          <p className="text-[13px] text-mute">
            Use this to walk Marcus through the change.
          </p>
          {[
            [
              "Open with the why",
              "“We've heard your concerns about pay. We pulled fresh market data and you were 8% below the market median. We're fixing that.”",
            ],
            [
              "State the change clearly",
              "“Effective 1 June, your base salary moves from USD 146,000 to USD 158,000. That's an 8.2% increase.”",
            ],
            [
              "Tie it to performance",
              "“This reflects your strong delivery last quarter and your contribution to the platform team.”",
            ],
            [
              "Set expectations",
              "“This is a market correction, not your annual cycle. Your normal review still happens in October.”",
            ],
            [
              "Close with what's next",
              "“You'll see the update on your June paycheck. Any questions, reach out to me or the HR concierge.”",
            ],
          ].map(([head, body]) => (
            <div key={head} className="py-2.5 border-b border-divider space-y-1">
              <div className="text-[13px] text-surface-deep font-medium">{head}</div>
              <div className="text-[13px] text-ink leading-[20px]">{body}</div>
            </div>
          ))}
          <div className="bg-surface-fog rounded p-4 space-y-1.5">
            <div className="text-[11px] tracking-[0.06em] uppercase text-mute font-medium">
              If he asks…
            </div>
            <div className="text-[13px] text-ink leading-[20px]">
              “What about my peers?” — Don't share other people's pay. Acknowledge the question and
              pivot to: “We routinely review the whole team, and we'd reach out to anyone in the
              same situation.”
            </div>
          </div>
        </DocCard>

        {/* Finance rationale */}
        <DocCard eyebrow="Document 3 · Budget defense" title="One-page rationale for Finance">
          <div className="flex items-baseline gap-5 pb-3 border-b border-divider">
            <div>
              <div className="text-[28px] font-bold text-ink leading-none">+$12K</div>
              <div className="text-[11px] tracking-[0.06em] uppercase text-mute mt-1">Annual cost</div>
            </div>
            <div className="w-px h-9 bg-divider" />
            <div>
              <div className="text-[28px] font-bold text-ink leading-none">8.2%</div>
              <div className="text-[11px] tracking-[0.06em] uppercase text-mute mt-1">Salary delta</div>
            </div>
            <div className="w-px h-9 bg-divider" />
            <div>
              <div className="text-[28px] font-bold text-ink leading-none">$48K</div>
              <div className="text-[11px] tracking-[0.06em] uppercase text-mute mt-1">
                Replacement cost
              </div>
            </div>
          </div>
          <p className="text-[14px] text-ink font-bold mt-2">Why this is worth $12K</p>
          <p className="text-[13px] text-ink leading-[20px]">
            Marcus is a Senior Engineer on the platform team. He was 8.2% below market median
            (San Francisco · Senior). Two of his peers know he's underpaid.
          </p>
          <p className="text-[13px] text-ink leading-[20px]">
            If we don't act, the conservative scenario is a resignation within 3–6 months. Hiring a
            replacement costs 4× this raise (recruiting and ramp time).
          </p>
          <p className="text-[13px] text-ink leading-[20px]">
            Recommended option (Mid) keeps internal equity intact and stays within the Q2 retention
            pool. Two adjacent peers will be flagged for review in their next cycle.
          </p>
          <div className="bg-surface-mint rounded p-4 space-y-1">
            <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Evidence the AI used
            </div>
            <div className="text-[13px] text-ink leading-[20px]">
              Market data: 3 sources (May 2026 snapshot)
              <br />
              Internal equity scan: 11 teammates
              <br />
              Flight risk model: medium → high
              <br />
              Retention pool: 38% used this quarter
            </div>
          </div>
        </DocCard>
      </div>
    </DocChrome>
  );
}
