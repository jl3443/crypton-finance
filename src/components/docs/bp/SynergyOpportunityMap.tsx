import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis, ReferenceLine } from "recharts";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { SYNERGIES } from "@/components/docs/bp/data";

export function SynergyOpportunityMap() {
  const data = SYNERGIES.map((s, i) => ({
    x: s.confidence,
    y: s.impactUSDQ / 1_000_000,
    z: s.impactUSDQ / 100_000,
    label: s.pair,
    note: s.note,
    rank: i + 1,
  }));
  const totalImpact = SYNERGIES.reduce((s, x) => s + x.impactUSDQ, 0);
  const avgConfidence = SYNERGIES.reduce((s, x) => s + x.confidence, 0) / SYNERGIES.length;

  return (
    <DocChrome
      title="Synergy opportunity map"
      primary={{ label: "Approve", onClick: () => alert("Day-5 ceremony.") }}
      secondary={{ label: "Export PNG", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Cross-line opportunities · Q3"
          title="Cross-line synergy map"
          subtitle="5 candidate synergies plotted by quarterly revenue impact × confidence. Top-right = priority targets."
        />

        <StatRow
          items={[
            { label: "Candidates", value: String(SYNERGIES.length) },
            { label: "Total ann. impact", value: fmtUSD(totalImpact * 4, { compact: true }), tone: "ok" },
            { label: "Avg confidence", value: `${(avgConfidence * 100).toFixed(0)}%` },
            { label: "Top synergy", value: "Spot → Derivatives" },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Quadrant · impact × confidence</Eyebrow>
          <div className="h-[340px] mt-2 bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" />
                <XAxis type="number" dataKey="x" name="Confidence" domain={[0, 1]} tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <YAxis type="number" dataKey="y" name="Impact / Q ($M)" tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${v}M`} />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <ReferenceLine x={0.6} stroke="var(--divider)" strokeDasharray="3 3" />
                <ReferenceLine y={3} stroke="var(--divider)" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(_v, _n, p) => {
                    const pl = (p as { payload?: { label?: string; y?: number; x?: number } }).payload;
                    if (!pl) return ["—", "—"];
                    return [`$${pl.y}M @ ${(pl.x! * 100).toFixed(0)}%`, pl.label!];
                  }}
                />
                <Scatter data={data} fill="var(--accent-green-deep)" fillOpacity={0.85} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Candidate detail · ranked by impact × confidence</Eyebrow>
          <ol className="mt-2 space-y-3">
            {data.map((d) => (
              <li key={d.rank} className="border-l-2 border-surface-deep pl-4">
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <span className="text-[13px] font-bold text-ink">{d.label}</span>
                  <span className="text-[12px] tabular-nums text-mute">${d.y.toFixed(1)}M / Q · {(d.x * 100).toFixed(0)}%</span>
                </div>
                <p className="text-[12px] text-mute leading-[18px]">{d.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </Paper>
      <SideRail>
        <Provenance source="Q2 BP packet · cross-line correlation analysis" generatedAt="2026-05-28 12:00" />
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
