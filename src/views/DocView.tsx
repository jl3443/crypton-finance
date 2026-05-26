import { useApp, type DocId } from "@/state";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";

/**
 * Document-preview view. Day-1 placeholder — Day 2+ replaces the body
 * with per-doc hand-built React components (21 docs across 3 flows).
 */
export function DocView({ id }: { id: DocId }) {
  const { back } = useApp();
  return (
    <DocChrome
      title={`Document · ${id}`}
      primary={{ label: "Download", onClick: () => alert("Day-2 wires up real PDF export") }}
      secondary={{ label: "Back", onClick: back }}
    >
      <Paper>
        <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
          Crypton Finance · Document Preview
        </div>
        <h1 className="text-[40px] leading-[1.05] tracking-[-0.02em]">{id}</h1>
        <p className="text-[15px] text-ink leading-[24px]">
          This document is a Day-1 placeholder. The Day-2+ build replaces this body with the
          hand-built React doc component for <code>{id}</code> (see plan §6 / §7 / §8 for the
          21-document inventory).
        </p>
      </Paper>
      <SideRail>
        <div className="bg-white border border-divider rounded-md p-5">
          <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-2">
            Provenance
          </div>
          <dl className="space-y-1.5 text-[12px] leading-[18px]">
            <Row label="Source" value="Day-1 placeholder" />
            <Row label="Generated" value={new Date().toISOString().slice(0, 16).replace("T", " ")} />
            <Row label="Model" value="claude-opus-4-7 (1M ctx)" />
            <Row label="Audit trail" value="close-audit-trail" />
          </dl>
        </div>
      </SideRail>
    </DocChrome>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-mute">{label}</dt>
      <dd className="text-ink font-medium text-right">{value}</dd>
    </div>
  );
}
