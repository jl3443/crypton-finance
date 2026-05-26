import { cn } from "@/lib/utils";
import { useApp, type FlowId } from "@/state";
import { cases, type CaseRow } from "@/data/cases";
import { StatusPill } from "@/components/blocks/StatusPill";
import { StaggerList } from "@/components/ai/StaggerList";
import { AIDot } from "@/components/ai/AIDot";

const showCount = 4; // dashboard shows first 4 then "View all 12"

function applyFlowStatus(
  row: CaseRow,
  flowProgress: Record<FlowId, { approved: boolean }>,
): CaseRow {
  if (row.target.kind !== "workspace") return row;
  const flow = row.target.flow as FlowId;
  if (!flowProgress[flow]?.approved) return row;
  return {
    ...row,
    status: "Approved · executing",
    statusKind: "resolved",
    sub: row.sub.replace(/(needs decision|proposal ready|pick one|ready to approve)/i, "audit logged"),
    dueUrgent: false,
  };
}

export function CasesPanel({ className }: { className?: string }) {
  const { go, flowProgress } = useApp();
  const visible = cases.slice(0, showCount).map((c) => applyFlowStatus(c, flowProgress));

  return (
    <section
      className={cn(
        "bg-white border border-divider rounded-md overflow-hidden",
        className,
      )}
    >
      <header className="px-4 py-2.5 border-b border-divider flex items-center gap-3">
        <AIDot size={6} tone="deep" />
        <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
          Active AI HR cases
        </span>
        <span className="text-[12px] text-mute">Open the workspace from any row</span>
      </header>
      <StaggerList step={70}>
        {visible.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => go(c.target)}
            className="ui-pill w-full px-4 py-3 border-b border-divider last:border-b-0 flex items-center justify-between gap-4 text-left hover:bg-surface-mint/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-full bg-surface-fog flex items-center justify-center text-[16px] shrink-0"
                aria-hidden
              >
                {c.flag}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-ink truncate">{c.title}</div>
                <div className="text-[12px] text-mute truncate">{c.sub}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusPill label={c.status} kind={c.statusKind} />
              <span className="text-ink" aria-hidden>→</span>
            </div>
          </button>
        ))}
      </StaggerList>
      <button
        type="button"
        onClick={() => go({ kind: "compliance-radar" })}
        className="ui-pill w-full px-4 py-2.5 flex items-center justify-between text-[13px] text-surface-deep font-medium hover:bg-surface-mint/40"
      >
        <span>View all 12 cases</span>
        <span aria-hidden>→</span>
      </button>
    </section>
  );
}
