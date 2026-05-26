import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ai/Spinner";

type Row = { label: string; value: string };

type Props = {
  /** Used as a render key — when this changes, the overlay re-shows. */
  stepKey: string | number;
  title: string;
  /** Short subtitle, e.g. "STEP 2 OF 5" */
  meta?: string;
  /** Evidence rows displayed under the title. */
  rows: Row[];
  /** How long the overlay stays visible before fading out. Default 1600ms. */
  durationMs?: number;
};

/**
 * Translucent step-intro overlay — fades in centered over the workspace,
 * shows a spinner + step name + 3-4 evidence rows ("Reading from… Notifying…
 * Source record…"), then fades out and dissolves to the underlying content.
 *
 * Inspired by Predictive-Risk-Agent's per-step modal that gives every
 * transition a "the agent just kicked off real work" beat.
 */
export function StepIntroOverlay({
  stepKey,
  title,
  meta,
  rows,
  durationMs = 1600,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setVisible(true);
    // Fade in
    const fadeIn = window.setTimeout(() => setOpacity(1), 30);
    // Fade out before unmount
    const fadeOut = window.setTimeout(() => setOpacity(0), durationMs - 250);
    const unmount = window.setTimeout(() => setVisible(false), durationMs);
    return () => {
      window.clearTimeout(fadeIn);
      window.clearTimeout(fadeOut);
      window.clearTimeout(unmount);
    };
  }, [stepKey, durationMs]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex items-center justify-center pointer-events-none",
        "transition-opacity duration-[250ms] ease-out",
      )}
      style={{ opacity }}
    >
      <div className="absolute inset-0 bg-surface-fog/70 backdrop-blur-[1px]" />
      <div className="relative bg-white rounded-md border border-divider shadow-lg px-7 py-6 min-w-[360px] max-w-[440px] space-y-4">
        <header className="flex items-center gap-3">
          <Spinner size={20} />
          <div className="leading-tight">
            {meta && (
              <div className="text-[10px] tracking-[0.1em] uppercase text-surface-deep font-medium">
                {meta}
              </div>
            )}
            <div className="text-[15px] font-bold text-ink mt-0.5">{title}</div>
          </div>
        </header>
        <div className="divide-y divide-divider border-t border-divider pt-3">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[110px_1fr] gap-3 py-1.5">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium pt-0.5">
                {r.label}
              </div>
              <div className="text-[13px] text-ink">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
