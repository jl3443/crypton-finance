import { cn } from "@/lib/utils";

type Outcome = { label: string; value: string; sub: string };

export function AgentOutcomesStrip({
  outcomes,
  className,
}: {
  outcomes: Outcome[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-surface-deep text-ink-inverse rounded-md p-6 flex items-center gap-8",
        className,
      )}
    >
      <div className="leading-tight">
        <div className="text-[12px] tracking-[0.08em] uppercase text-surface-mint">
          Agent outcomes
        </div>
        <div className="text-[14px] text-ink-inverse mt-0.5">This quarter</div>
      </div>
      <div className="grid grid-cols-3 gap-6 flex-1">
        {outcomes.map((o) => (
          <div key={o.label}>
            <div className="text-[11px] tracking-[0.08em] uppercase text-surface-mint">
              {o.label}
            </div>
            <div className="text-[28px] leading-[34px] font-bold text-ink-inverse">{o.value}</div>
            <div className="text-[13px] text-surface-mint">{o.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
