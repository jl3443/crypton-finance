import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { PNL, lineTotals } from "@/components/docs/bp/data";

const CATEGORY_FOR_CODE = (code: string): string => {
  if (code.startsWith("53")) return "People";
  if (code.startsWith("51")) return "Infra & cloud";
  if (code.startsWith("50")) return "Trading ops";
  if (code.startsWith("52")) return "Marketing";
  if (code.startsWith("54")) return "Legal & regulatory";
  if (code.startsWith("55")) return "Compliance ops";
  return "Other";
};

export function CostBreakdownByLine() {
  // Aggregate May costs by line × category
  const data: Record<string, number | string>[] = PNL.map((line) => {
    const buckets: Record<string, number> = {};
    line.lines.filter((l) => l.kind === "cost").forEach((l) => {
      const cat = CATEGORY_FOR_CODE(l.code);
      buckets[cat] = (buckets[cat] ?? 0) + l.may;
    });
    return { line: line.id, ...buckets };
  });
  const allBuckets = Array.from(new Set(data.flatMap((d) => Object.keys(d).filter((k) => k !== "line"))));
  const totalCost = PNL.reduce((s, l) => s + lineTotals(l, "may").cost, 0);
  const peopleTotal = data.reduce((s, d) => s + (typeof d.People === "number" ? d.People : 0), 0);

  const COLORS = ["var(--accent-green-deep)", "var(--accent-green)", "var(--surface-mint)", "var(--mark-red)", "var(--surface-rose)", "var(--mute)"];

  return (
    <DocChrome
      title="Cost breakdown by line"
      primary={{ label: "Approve", onClick: () => alert("Day-5 ceremony.") }}
      secondary={{ label: "Export PNG", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="May 2026 · cost attribution"
          title="Cost breakdown by line"
          subtitle="Per-line OpEx split into People / Infra / Trading ops / Marketing / Legal / Compliance."
        />

        <StatRow
          items={[
            { label: "Total OpEx", value: fmtUSD(totalCost, { compact: true }) },
            { label: "Highest line cost", value: PNL.map((l) => ({ id: l.id, c: lineTotals(l, "may").cost })).sort((a, b) => b.c - a.c)[0].id },
            { label: "People share", value: `${((peopleTotal / totalCost) * 100).toFixed(0)}%` },
            { label: "Cost categories", value: String(allBuckets.length) },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Stacked by category</Eyebrow>
          <div className="h-[300px] mt-2 bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="line" tick={{ fontSize: 11 }} stroke="var(--mute)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`$${(Number(v ?? 0) / 1_000_000).toFixed(2)}M`, ""]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {allBuckets.map((b, i) => (
                  <Bar key={b} dataKey={b} stackId="c" fill={COLORS[i % COLORS.length]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>AI commentary</Eyebrow>
          <p className="text-[14px] text-ink leading-[24px] pt-2 max-w-[760px]">
            People dominates every line — expected for a tech-led exchange. The notable
            exception is Compliance where Legal & regulatory cost outpaces People due to the
            ongoing MAS MPI engagement. Recommend continuing the MAS engagement: even at the
            current run-rate, expected institutional unlock more than covers the spend within 2 quarters.
          </p>
        </section>
      </Paper>
      <SideRail>
        <Provenance source="Q2 BP packet" generatedAt="2026-05-28 12:00" />
        <CrossLinks
          links={[
            { id: "business-line-pnl", label: "Business line P&L" },
            { id: "revenue-waterfall", label: "Revenue waterfall" },
            { id: "scenario-analysis", label: "Scenario analysis" },
            { id: "bp-strategic-memo", label: "Strategic memo" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
