import { useApp, type FlowId } from "@/state";
import { KPIStrip, type KPI } from "@/components/blocks/KPIStrip";
import { ActivityLog } from "@/components/workspace/ActivityLog";
import { FLOWS } from "@/data/flows";
import { AIDot } from "@/components/ai/AIDot";
import { cn } from "@/lib/utils";

/**
 * Crypton CFO hub. Top: 4-tile KPIStrip. Middle: 3 flow cards
 * (Accounting · Treasury · BP) each clickable to a workspace. Bottom:
 * slim Activity Log of cross-flow events.
 */

const KPIS: KPI[] = [
  {
    label: "Days to close",
    value: 4.2,
    decimals: 1,
    trend: { delta: "1.8d MoM", direction: "down" },
    spark: [6, 5.8, 5.5, 5.1, 4.7, 4.5, 4.3, 4.2],
  },
  {
    label: "Open variances",
    value: 12,
    trend: { delta: "3 flagged", direction: "flat" },
    spark: [9, 14, 11, 15, 13, 12, 14, 12],
  },
  {
    label: "Treasury position",
    value: 8.41,
    prefix: "$",
    suffix: "B",
    decimals: 2,
    trend: { delta: "2.1% w/w", direction: "up" },
    spark: [7.9, 8.0, 8.1, 8.2, 8.1, 8.25, 8.35, 8.41],
  },
  {
    label: "Approval queue",
    value: 7,
    trend: { delta: "2 SLA amber", direction: "up" },
    spark: [3, 5, 4, 6, 8, 6, 7, 7],
  },
];

const ACTIVITY = [
  { time: "08:24", text: "Accounting · Board financial report assembled (14 pages)" },
  { time: "08:21", text: "Accounting · Variance commentary memo drafted (380 words)" },
  { time: "08:19", text: "Accounting · 4 journal entry proposals queued (incl. JE-0429)" },
  { time: "08:14", text: "Accounting · Oracle GL extract ingested · 247 lines" },
  { time: "03:35", text: "Treasury · Daily brief drafted · 2 anomalies for ack" },
  { time: "03:32", text: "Treasury · Rebalancing proposed · $80M USDT Anchorage → Fireblocks" },
  { time: "03:28", text: "Treasury · 2 anomalies surfaced (large transfer, off-hours wallet)" },
  { time: "—", text: "BP · Q2 review packet finalised · EXCO memo + 18-slide deck ready" },
];

export function Hub() {
  const { cfo, go, approvals } = useApp();

  return (
    <div className="min-h-screen px-10 py-10">
      <div className="mx-auto max-w-[1240px]">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="grid w-9 h-9 place-items-center rounded-md bg-surface-deep text-ink-inverse text-[14px] font-bold tracking-[-0.02em]">
              CX
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-ink tracking-[-0.01em]">
                Crypton Finance · CFO Hub
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
                {cfo.name} · {cfo.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="green" pulse />
            <span className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
              All agents nominal
            </span>
          </div>
        </header>

        {/* Eyebrow */}
        <div className="mb-3">
          <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
            Tuesday morning · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-ink leading-[1.05] mb-9" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Three flows<br />ready for you.
        </h1>

        {/* KPIs */}
        <section className="mb-10">
          <SectionHeader title="Today's signal" />
          <KPIStrip items={KPIS} />
        </section>

        {/* Flow cards */}
        <section className="mb-10">
          <SectionHeader title="Decisions waiting" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {(Object.keys(FLOWS) as FlowId[]).map((id, i) => (
              <FlowCard
                key={id}
                flow={id}
                index={i}
                approved={approvals.some((a) => a.flow === id && a.step === FLOWS[id].steps.length - 1)}
                onOpen={() => go({ kind: "workspace", flow: id })}
              />
            ))}
          </div>
        </section>

        {/* Activity log */}
        <section>
          <SectionHeader title="Recent activity" />
          <ActivityLog entries={ACTIVITY} live />
        </section>

        <footer className="mt-16 text-[10px] tracking-[0.18em] uppercase font-medium text-mute text-center">
          Confidential · CFO Org · Local demo build · No data leaves this browser
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[11px] tracking-[0.18em] uppercase font-medium text-mute mb-3">
      {title}
    </h2>
  );
}

function FlowCard({
  flow,
  index,
  approved,
  onOpen,
}: {
  flow: FlowId;
  index: number;
  approved: boolean;
  onOpen: () => void;
}) {
  const f = FLOWS[flow];
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "ui-pill ai-spring group text-left w-full rounded-md border bg-white p-6",
        "border-divider hover:border-surface-deep transition-colors duration-200",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
          {f.eyebrow}
        </span>
        {approved ? (
          <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.08em] uppercase font-bold text-surface-deep">
            <span className="grid w-4 h-4 place-items-center rounded-full bg-surface-deep text-ink-inverse text-[9px]">
              ✓
            </span>
            Approved
          </span>
        ) : (
          <AIDot size={6} tone="green" pulse />
        )}
      </div>
      <div className="text-[18px] font-bold text-ink leading-[22px] tracking-[-0.01em] mb-2">
        {f.title}
      </div>
      <div className="text-[12px] text-mute leading-[18px] mb-5">
        {f.hubSub}
      </div>
      <div className="text-[13px] text-ink leading-[20px] mb-6 min-h-[40px]">
        {f.hubDetail}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-divider">
        <span className="text-[11px] tracking-[0.08em] uppercase font-medium text-mute">
          {f.statusPill}
        </span>
        <span className="text-[13px] font-bold text-surface-deep group-hover:translate-x-0.5 transition-transform">
          Open →
        </span>
      </div>
    </button>
  );
}
