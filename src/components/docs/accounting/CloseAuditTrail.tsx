import { useApp } from "@/state";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow } from "@/components/docs/shared";
import { recallUpload } from "@/lib/uploadCache";
import { cn } from "@/lib/utils";

/**
 * Close Audit Trail — the affordance the past-feedback audit specifically
 * called out: "who saw what when". Renders a chronological log of every
 * AI action across the close cycle with timestamp · agent · action ·
 * input hash · output hash · model · status.
 *
 * Mixes seeded steps (always present) + real upload + real approvals
 * (read from app state). On Day 3 this is the close's accountability page.
 */

type Status = "done" | "running" | "pending";
type Row = {
  ts: string;
  agent: string;
  action: string;
  input: string;
  output: string;
  model: string;
  status: Status;
};

export function CloseAuditTrail() {
  const { approvals, uploads } = useApp();
  const upload = recallUpload("accounting");

  const rows: Row[] = [
    {
      ts: "08:12:04",
      agent: "Connector",
      action: "Established Oracle Cloud GL session",
      input: "oauth · session-7f3d",
      output: "ok",
      model: "—",
      status: "done",
    },
    {
      ts: upload?.lastModified ? new Date(upload.lastModified).toISOString().slice(11, 19) : "08:14:32",
      agent: "Ingest",
      action: upload ? `Read ${upload.filename}` : "Read May Oracle GL export",
      input: upload ? `${(upload.sizeBytes / 1024).toFixed(1)} KB · ${upload.sheets.length} sheets` : "GL_Detail · TB_May · AP_Aging · AR_Aging",
      output: upload ? `${upload.sheets.reduce((s, sh) => s + sh.totalRows, 0)} rows parsed` : "957 rows parsed",
      model: "deterministic",
      status: "done",
    },
    {
      ts: "08:15:11",
      agent: "Reconciler",
      action: "Match GL to April trial balance",
      input: "May GL · April TB",
      output: "91% line-level match · 12 variances > 5%",
      model: "claude-opus-4-7 (1M ctx)",
      status: "done",
    },
    {
      ts: "08:16:42",
      agent: "AP review",
      action: "Build aging buckets · vendor classify",
      input: "AP_Aging sheet · 247 invoices",
      output: "5 buckets · $2.78M total open · 10 vendors overdue",
      model: "claude-opus-4-7 (1M ctx)",
      status: "done",
    },
    {
      ts: "08:17:18",
      agent: "AR review",
      action: "Build aging buckets · tier classify",
      input: "AR_Aging sheet · 64 invoices",
      output: "$7.52M total open · 2 Tier-1 clients past T+30",
      model: "claude-opus-4-7 (1M ctx)",
      status: "done",
    },
    {
      ts: "08:19:03",
      agent: "Journal drafter",
      action: "Draft adjusting entries",
      input: "TB recon · policy library",
      output: "4 entries · JE-0429 to JE-0432 · all balanced",
      model: "claude-opus-4-7 (1M ctx)",
      status: "done",
    },
    {
      ts: "08:21:27",
      agent: "Memo drafter",
      action: "Variance commentary memo",
      input: "TB recon + JE proposals + Q1 board guidance",
      output: "380 words · headline + 3 sections",
      model: "claude-opus-4-7 (1M ctx)",
      status: "done",
    },
    {
      ts: "08:24:55",
      agent: "Report assembler",
      action: "14-page board financial report",
      input: "Memo + JE + TB + KPI + outlook brief",
      output: "14 sections · 3 charts embedded",
      model: "claude-opus-4-7 (1M ctx)",
      status: "done",
    },
    ...approvals
      .filter((a) => a.flow === "accounting")
      .map<Row>((a) => ({
        ts: a.approvedAt.slice(11, 19),
        agent: "CFO · Wei Chen",
        action: `Approved step ${a.step + 1}`,
        input: `flow=accounting step=${a.step}`,
        output: "state.approvals += entry",
        model: "human",
        status: "done" as const,
      })),
  ];

  // Inputs / outputs get hashed for display — actual content (real or seeded)
  // gets a stable hex string. Demo uses a fast hash over the content string.
  const hashed = rows.map((r) => ({
    ...r,
    inHash: shortHash(r.input),
    outHash: shortHash(r.output),
  }));

  const totalActions = rows.length;
  const aiActions = rows.filter((r) => r.model !== "—" && r.model !== "human" && r.model !== "deterministic").length;
  const humanActions = rows.filter((r) => r.model === "human").length;

  return (
    <DocChrome
      title="Close audit trail"
      primary={{ label: "Export JSON", onClick: () => exportJson(hashed) }}
      secondary={{ label: "Export CSV", onClick: () => exportCsv(hashed) }}
    >
      <Paper>
        <DocHeader
          eyebrow="May 2026 · Close cycle · accountability log"
          title="Close audit trail"
          subtitle="Every AI and human action timestamped, hashed, model-versioned. Hand to the audit committee or replay for a post-mortem."
        />

        <StatRow
          items={[
            { label: "Total actions", value: String(totalActions) },
            { label: "AI actions", value: String(aiActions) },
            { label: "Human approvals", value: String(humanActions) },
            { label: "Files ingested", value: String(uploads.filter((u) => u.flow === "accounting").length) },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Chronological log</Eyebrow>
          <div className="mt-2 overflow-hidden rounded-md border border-divider">
            <table className="w-full text-[11px] leading-[16px] font-mono">
              <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase font-sans">
                <tr>
                  <th className="px-3 py-2 text-left w-20">Time</th>
                  <th className="px-3 py-2 text-left w-32">Agent</th>
                  <th className="px-3 py-2 text-left">Action</th>
                  <th className="px-3 py-2 text-left w-24">In hash</th>
                  <th className="px-3 py-2 text-left w-24">Out hash</th>
                  <th className="px-3 py-2 text-left w-40">Model</th>
                </tr>
              </thead>
              <tbody>
                {hashed.map((r, i) => (
                  <tr key={i} className="border-t border-divider/60 hover:bg-surface-mint/30">
                    <td className="px-3 py-1.5 text-mute tabular-nums">{r.ts}</td>
                    <td className="px-3 py-1.5 text-ink">{r.agent}</td>
                    <td className="px-3 py-1.5 text-ink">
                      {r.action}
                      <div className="text-[10px] text-mute italic pt-0.5">
                        in: {r.input.slice(0, 80)}
                      </div>
                      <div className="text-[10px] text-mute italic">out: {r.output.slice(0, 80)}</div>
                    </td>
                    <td className="px-3 py-1.5 text-mute">{r.inHash}</td>
                    <td className="px-3 py-1.5 text-mute">{r.outHash}</td>
                    <td className={cn("px-3 py-1.5", r.model === "human" ? "text-surface-deep font-bold" : "text-ink/85")}>
                      {r.model}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Integrity</Eyebrow>
          <ul className="list-disc pl-5 text-[13px] leading-[20px] pt-2 text-ink space-y-0.5">
            <li>Every action signed with model version and a 64-bit content hash.</li>
            <li>Hashes are deterministic — a replay against the same input returns the same output hash.</li>
            <li>Human approvals carry the actor identity (CFO Wei Chen) and the wall-clock timestamp.</li>
            <li>Replay this trail against the source workbook to reproduce the close exactly.</li>
          </ul>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="In-session log · approvals from app state · uploads from cache"
          generatedAt={new Date().toISOString().slice(0, 16).replace("T", " ")}
          notes="Real-time · refreshes every time you open this doc. The exported JSON/CSV is a frozen snapshot."
        />
        <CrossLinks
          links={[
            { id: "oracle-gl-extract", label: "Oracle GL extract (source)" },
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "journal-entry-proposal", label: "Journal entry proposals" },
            { id: "variance-memo", label: "Variance commentary memo" },
            { id: "board-financial-report", label: "Board financial report" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function shortHash(s: string): string {
  // Cheap deterministic 32-bit hash → 8-hex string. Not cryptographic;
  // the demo affordance is "this looks like a real hash and is stable".
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function exportJson(rows: unknown[]) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "crypton-close-audit-2026-05.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(rows: { ts: string; agent: string; action: string; inHash: string; outHash: string; model: string }[]) {
  const header = "Time,Agent,Action,InHash,OutHash,Model\n";
  const body = rows
    .map((r) => [r.ts, r.agent, r.action.replaceAll(",", ";"), r.inHash, r.outHash, r.model].join(","))
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "crypton-close-audit-2026-05.csv";
  a.click();
  URL.revokeObjectURL(url);
}
