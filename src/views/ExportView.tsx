import { useApp, type FlowId } from "@/state";
import { FLOWS } from "@/data/flows";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";

/**
 * Export-ceremony view — Day-1 placeholder. Day 5+ builds the real
 * 4-progress-row drafting card from the plan, with real artifact downloads.
 */
export function ExportView({ flow }: { flow: FlowId }) {
  const { go } = useApp();
  const f = FLOWS[flow];
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[520px] w-full text-center">
        <div className="inline-flex items-center gap-2 mb-6 text-[11px] tracking-[0.18em] uppercase font-medium text-mute">
          <AIDot size={6} tone="green" pulse /> Approved · artifacts ready
        </div>
        <h1 className="text-[40px] leading-[1.05] tracking-[-0.02em] mb-4">
          {f.title} · sent.
        </h1>
        <p className="text-[14px] text-mute mb-8">
          Day-1 placeholder for the export ceremony. Day 5+ wires up the 4-progress-row
          drafting card and real Blob downloads per artifact.
        </p>
        <PillButton variant="primary" arrow onClick={() => go({ kind: "hub" })}>
          Back to hub
        </PillButton>
      </div>
    </div>
  );
}
