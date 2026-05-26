import { useState } from "react";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { cn } from "@/lib/utils";

/**
 * AP aging — 4 buckets with top vendors per bucket; rows expand inline
 * to show invoice-level detail. Realistic Crypton vendor mix.
 */

type Invoice = { id: string; vendor: string; date: string; amount: number; status?: string };
type Bucket = {
  label: "Current" | "1-30" | "31-60" | "61-90" | "90+";
  invoices: Invoice[];
  category?: string;
};

const BUCKETS: Bucket[] = [
  {
    label: "Current",
    invoices: [
      { id: "INV-AWS-1042", vendor: "Amazon Web Services", date: "2026-05-19", amount: 487_220, status: "Approved" },
      { id: "INV-FIR-1051", vendor: "Fireblocks", date: "2026-05-21", amount: 312_550, status: "Approved" },
      { id: "INV-ANC-1058", vendor: "Anchorage Digital", date: "2026-05-22", amount: 220_400 },
      { id: "INV-DDG-1063", vendor: "Datadog", date: "2026-05-23", amount: 84_220 },
      { id: "INV-CLF-1064", vendor: "Cloudflare", date: "2026-05-24", amount: 32_207 },
    ],
  },
  {
    label: "1-30",
    invoices: [
      { id: "INV-CHN-0998", vendor: "Chainalysis", date: "2026-04-21", amount: 168_900, status: "Awaiting PO" },
      { id: "INV-ELL-1001", vendor: "Elliptic", date: "2026-04-23", amount: 94_500 },
      { id: "INV-BLM-1004", vendor: "Bloomberg LP", date: "2026-04-28", amount: 142_000 },
      { id: "INV-SUM-1006", vendor: "Sumsub (KYC)", date: "2026-04-30", amount: 71_200 },
    ],
  },
  {
    label: "31-60",
    invoices: [
      { id: "INV-LIN-0951", vendor: "Linklaters LLP", date: "2026-03-29", amount: 286_400, status: "Disputed · adjustment requested" },
      { id: "INV-REF-0948", vendor: "Refinitiv (LSEG)", date: "2026-03-25", amount: 184_700 },
      { id: "INV-SNW-0952", vendor: "Snowflake", date: "2026-03-30", amount: 96_300, status: "Awaiting cost-centre allocation" },
    ],
  },
  {
    label: "61-90",
    invoices: [
      { id: "INV-PWC-0911", vendor: "PwC (audit)", date: "2026-02-28", amount: 410_200, status: "Awaiting audit committee sign-off" },
      { id: "INV-SUL-0918", vendor: "Sullivan & Cromwell", date: "2026-03-03", amount: 122_500, status: "Long-tail engagement · multi-month" },
    ],
  },
  {
    label: "90+",
    invoices: [
      { id: "INV-TRM-0850", vendor: "TRM Labs", date: "2026-01-21", amount: 64_800, status: "Vendor in churn cycle · escalated" },
    ],
  },
];

const BUCKET_TONE: Record<Bucket["label"], string> = {
  Current: "bg-surface-fog text-ink",
  "1-30": "bg-surface-mint text-surface-deep",
  "31-60": "bg-surface-mint/70 text-surface-deep",
  "61-90": "bg-surface-rose text-mark-red",
  "90+": "bg-mark-red text-ink-inverse",
};

export function APAgingReport() {
  const [expanded, setExpanded] = useState<string | null>("31-60");

  const bucketTotals = BUCKETS.map((b) => ({
    label: b.label,
    total: b.invoices.reduce((s, i) => s + i.amount, 0),
    count: b.invoices.length,
  }));
  const grandTotal = bucketTotals.reduce((s, b) => s + b.total, 0);
  const beyond30 = bucketTotals.filter((b) => b.label === "31-60" || b.label === "61-90" || b.label === "90+");
  const beyond30Total = beyond30.reduce((s, b) => s + b.total, 0);

  return (
    <DocChrome
      title="Accounts payable aging"
      primary={{ label: "Approve as drafted", onClick: () => alert("Day-5 wires approval ceremony.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="May 2026 · Vendor obligations"
          title="Accounts payable aging"
          subtitle="247 open invoices · 5 aging buckets. Expand a bucket to see the top exposures and AI status notes."
        />

        <StatRow
          items={[
            { label: "Total open", value: fmtUSD(grandTotal, { compact: true }) },
            { label: "Past due (> 30d)", value: fmtUSD(beyond30Total, { compact: true }), tone: "warn" },
            { label: "Aged > 60d", value: fmtUSD(bucketTotals.find((b) => b.label === "61-90")!.total + bucketTotals.find((b) => b.label === "90+")!.total, { compact: true }), tone: "warn" },
            { label: "Vendors with overdue", value: String(new Set(BUCKETS.flatMap((b) => b.label !== "Current" ? b.invoices.map((i) => i.vendor) : [])).size) },
          ]}
        />

        <section className="pt-6 space-y-2">
          {BUCKETS.map((b) => {
            const totals = bucketTotals.find((t) => t.label === b.label)!;
            const isOpen = expanded === b.label;
            return (
              <div key={b.label} className="border border-divider rounded-md overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : b.label)}
                  className="ui-pill w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface-fog/60"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] tracking-[0.08em] uppercase font-bold",
                        BUCKET_TONE[b.label],
                      )}
                    >
                      {b.label === "Current" ? "Current" : `${b.label} days`}
                    </span>
                    <span className="text-[13px] text-ink font-medium">
                      {totals.count} invoices
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[14px] font-bold tabular-nums text-ink">{fmtUSD(totals.total)}</span>
                    <span aria-hidden className={cn("text-mute transition-transform", isOpen && "rotate-90")}>›</span>
                  </div>
                </button>
                {isOpen && (
                  <table className="w-full text-[12px] leading-[18px] border-t border-divider">
                    <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left w-40">Invoice</th>
                        <th className="px-3 py-2 text-left">Vendor</th>
                        <th className="px-3 py-2 text-left w-32">Invoice date</th>
                        <th className="px-3 py-2 text-right w-28">Amount</th>
                        <th className="px-3 py-2 text-left w-72">Status / AI note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b.invoices.map((inv) => (
                        <tr key={inv.id} className="border-t border-divider/60 hover:bg-surface-mint/30">
                          <td className="px-3 py-2 font-mono text-mute">{inv.id}</td>
                          <td className="px-3 py-2 text-ink">{inv.vendor}</td>
                          <td className="px-3 py-2 text-ink/85 tabular-nums">{inv.date}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-ink">{fmtUSD(inv.amount)}</td>
                          <td className="px-3 py-2 text-[11px] text-mute italic">{inv.status ?? "Open"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>AI commentary</Eyebrow>
          <p className="text-[14px] text-ink leading-[24px] pt-2 max-w-[760px]">
            Material exposure is concentrated in two engagements past 60 days: the PwC audit invoice
            ($410K) awaiting audit-committee sign-off, and the Linklaters MAS counsel matter ($286K)
            with a vendor-side adjustment in flight. TRM Labs $64K sits in the 90+ bucket pending
            vendor-relationship escalation. Recommend: ack PwC for sign-off this week, reach out to
            the Linklaters billing contact today, and close out TRM Labs by 2026-06-15.
          </p>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Oracle Cloud GL · AP_Aging sheet"
          generatedAt="2026-05-28 08:16"
          notes="Filtered to open invoices · sorted by aging bucket then amount descending."
        />
        <CrossLinks
          links={[
            { id: "oracle-gl-extract", label: "Oracle GL extract (source)" },
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "variance-memo", label: "Variance commentary memo" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
