import { cn } from "@/lib/utils";
import { peers, marketRange, scenarios, type ScenarioId } from "@/data/uc3";

const FILL_W = 360; // px equivalent shown for max value
const range = marketRange.max - marketRange.min;

function pctOf(value: number) {
  return ((value - marketRange.min) / range) * 100;
}

export function EquityChart({ selectedScenarioId }: { selectedScenarioId: ScenarioId }) {
  const selected = scenarios.find((s) => s.id === selectedScenarioId)!;

  return (
    <div className="bg-surface-fog rounded-md p-5 space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Team salaries
          </span>
          <span className="text-[11px] text-mute">with {selected.label} option applied</span>
        </div>
        <span className="text-[11px] text-mute">Market range $148K – $180K</span>
      </header>

      <div className="space-y-3">
        {peers.map((p) => {
          const isMarcus = p.id === "marcus";
          const flagged = !isMarcus && p.flagWhenSelected?.includes(selectedScenarioId);
          const base = isMarcus ? selected.amount : p.base;
          const pct = pctOf(base);
          return (
            <div key={p.id} className="grid grid-cols-[180px_1fr_120px] items-center gap-3">
              <div
                className={cn(
                  "text-[12px]",
                  isMarcus ? "text-ink font-medium" : "text-ink",
                )}
              >
                {p.name} · {p.level} · {p.tenure}
              </div>
              <div className="relative h-2.5 rounded-full bg-divider/70">
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 rounded-full transition-all duration-[600ms] ease-out",
                    isMarcus ? "bg-surface-deep" : flagged ? "bg-surface-rose" : "bg-divider",
                  )}
                  style={{ width: `${Math.max(8, Math.min(100, pct))}%`, maxWidth: FILL_W }}
                />
              </div>
              <div className="text-[12px] text-ink text-right">
                ${(base / 1000).toFixed(0)}K
                {isMarcus && (
                  <span className="ml-1.5 text-[11px] text-surface-deep">· proposed</span>
                )}
                {flagged && (
                  <span className="ml-1.5 text-[11px] text-mark-red">· close to Marcus</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
