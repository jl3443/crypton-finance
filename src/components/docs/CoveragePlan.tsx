import { DocChrome, SideRail } from "./DocChrome";
import { cn } from "@/lib/utils";

const week1: Array<{ d: string; kind: "off" | "weekend" }> = [
  { d: "1", kind: "off" },
  { d: "2", kind: "off" },
  { d: "3", kind: "off" },
  { d: "4", kind: "off" },
  { d: "5", kind: "off" },
  { d: "6", kind: "weekend" },
  { d: "7", kind: "weekend" },
];

const week2: Array<{ d: string; kind: "off" | "weekend" }> = [
  { d: "8", kind: "off" },
  { d: "9", kind: "off" },
  { d: "10", kind: "off" },
  { d: "11", kind: "off" },
  { d: "12", kind: "off" },
  { d: "13", kind: "weekend" },
  { d: "14", kind: "weekend" },
];

const teammates = [
  {
    initials: "AP",
    name: "Aisha Patel",
    role: "Platform team lead",
    tone: "bg-surface-sage",
    items: [
      "Run Monday standup + Wednesday planning",
      "Cover the on-call rotation for week of 8 Jun",
      "Review the search-relevance PR that's outstanding",
    ],
  },
  {
    initials: "DT",
    name: "Diego Torres",
    role: "Senior engineer · platform team",
    tone: "bg-surface-deep",
    items: [
      "Pair with intern on the deployment pipeline",
      "Approve any blocking PRs over 1 day old",
    ],
  },
  {
    initials: "LK",
    name: "Lena Kim",
    role: "Product manager",
    tone: "bg-surface-rose",
    items: [
      "Move the customer-import discovery doc forward",
      "Cover Marcus' input on the Q3 planning meeting",
    ],
  },
];

function Day({ d, kind }: { d: string; kind: "off" | "weekend" }) {
  return (
    <div
      className={cn(
        "rounded p-2 text-left h-[64px]",
        kind === "off" ? "bg-surface-mint" : "bg-surface-fog",
      )}
    >
      <div className="text-[13px] font-medium text-ink">{d}</div>
      {kind === "off" && (
        <div className="text-[10px] tracking-[0.06em] uppercase text-surface-deep font-medium mt-0.5">
          Off
        </div>
      )}
    </div>
  );
}

export function CoveragePlan() {
  return (
    <DocChrome
      title="Coverage plan · Marcus' time off · 10 days, 2 weeks"
      secondary={{ label: "Edit" }}
      primary={{ label: "Send to team and book time off" }}
    >
      <div className="space-y-5 col-span-1">
        {/* Calendar */}
        <section className="bg-white border border-divider rounded-md p-6 space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
                Calendar · proposed time off
              </div>
              <div className="text-[20px] font-bold text-ink mt-1">
                Mon 1 June → Fri 12 June 2026
              </div>
            </div>
            <div className="text-[13px] text-surface-deep">
              10 working days · uses 10 of 11 unused PTO
            </div>
          </header>

          <div className="grid grid-cols-7 gap-1.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="text-[11px] tracking-[0.06em] uppercase text-mute text-center"
              >
                {d}
              </div>
            ))}
            {week1.map((d) => (
              <Day key={`w1-${d.d}`} d={d.d} kind={d.kind} />
            ))}
            {week2.map((d) => (
              <Day key={`w2-${d.d}`} d={d.d} kind={d.kind} />
            ))}
          </div>
        </section>

        {/* Handoff */}
        <section className="bg-white border border-divider rounded-md p-6 space-y-4">
          <h3 className="text-[18px] font-bold text-ink">Coverage handoff</h3>
          <p className="text-[13px] text-mute">
            These items get covered while you're away. Drafted from your active calendar and
            project tracker.
          </p>
          <div className="space-y-4">
            {teammates.map((t) => (
              <div
                key={t.name}
                className="flex items-start gap-4 py-3 border-t border-divider first:border-t-0 first:pt-0"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-ink-inverse text-[11px] font-bold shrink-0",
                    t.tone,
                  )}
                >
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-ink">{t.name}</span>
                    <span className="text-mute">·</span>
                    <span className="text-[11px] tracking-[0.06em] text-mute">{t.role}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1.5">
                    {t.items.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-[13px] text-ink">
                        <span className="w-3.5 h-3.5 mt-0.5 rounded-sm border border-divider" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SideRail>
        <div className="bg-surface-mint rounded-md p-6 space-y-2.5">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            AI drafted this
          </div>
          <div className="text-[18px] font-bold text-ink">Everything in one place</div>
          <p className="text-[13px] text-ink leading-[20px]">
            Time off is booked. Calendar holds set. Teammates notified. Wellness benefit credits
            activated.
          </p>
        </div>

        <div className="bg-white border border-divider rounded-md p-5 space-y-2">
          <div className="text-[14px] font-bold text-ink">What happens when you accept</div>
          {[
            "Time off booked · Workday",
            "Calendar blocked Jun 1–12",
            "Out-of-office auto-reply set",
            "Slack status: \"On leave until 15 Jun\"",
            "Handoff messages sent to 3 teammates",
            "Wellness benefit credits applied",
          ].map((line) => (
            <div key={line} className="flex items-center gap-2.5 text-[13px]">
              <span className="text-surface-deep">✓</span>
              <span className="text-ink">{line}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-fog rounded-md p-5 space-y-2">
          <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
            Wellness benefits applied
          </div>
          {[
            "EUR 200 wellness credit",
            "Headspace 3-month subscription",
            "Family travel discount unlocked",
          ].map((line) => (
            <div key={line} className="flex items-center gap-2.5 text-[13px]">
              <span className="text-surface-deep">✦</span>
              <span className="text-ink">{line}</span>
            </div>
          ))}
        </div>
      </SideRail>
    </DocChrome>
  );
}
