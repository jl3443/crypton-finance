import { BouncingDots } from "@/components/ai/BouncingDots";

/**
 * Low-contrast inline banner that sits between the alert and the per-step
 * card during transitions, with a 3-dot bouncing loader and a streaming
 * sentence. Borrowed from Predictive-Risk-Agent's "AI is analyzing
 * scenarios…" pause-beat.
 */
export function AnalyzingBanner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-md bg-surface-fog border border-divider">
      <BouncingDots tone="deep" />
      <span className="text-[13px] text-ink">{text}</span>
    </div>
  );
}
