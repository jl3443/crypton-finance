import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { SCENARIOS } from "@/components/docs/bp/data";

export function ScenarioAnalysisTable() {
  // Sort by |downside| + |upside| descending (impact range)
  const sorted = [...SCENARIOS].sort((a, b) => (Math.abs(b.downsideUSD) + Math.abs(b.upsideUSD)) - (Math.abs(a.downsideUSD) + Math.abs(a.upsideUSD)));
  const total = sorted.reduce((s, x) => s + Math.abs(x.downsideUSD) + Math.abs(x.upsideUSD), 0);
  const downsideTotal = sorted.reduce((s, x) => s + x.downsideUSD, 0);
  const upsideTotal = sorted.reduce((s, x) => s + x.upsideUSD, 0);

  // Tornado data: positive bars to right, negative to left.
  const tornado = sorted.map((s) => ({
    label: s.driver,
    downside: s.downsideUSD / 1_000_000,
    upside: s.upsideUSD / 1_000_000,
  }));

  return (
    <DocChrome
      title="Scenario analysis"
      primary={{ label: "Approve", onClick: () => alert("Day-5 ceremony.") }}
      secondary={{ label: "Export PNG", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Q3 outlook · 6 drivers"
          title="Scenario analysis · sensitivity tornado"
          subtitle="6 drivers tested against the Q3 base case. Width of each bar = ±$M impact on net."
        />

        <StatRow
          items={[
            { label: "Drivers tested", value: String(SCENARIOS.length) },
            { label: "Downside range", value: fmtUSD(downsideTotal, { compact: true }), tone: "warn" },
            { label: "Upside range", value: fmtUSD(upsideTotal, { compact: true }), tone: "ok" },
            { label: "Largest driver", value: sorted[0].driver.split(" ").slice(0, 3).join(" ") + "…" },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Tornado · sorted by total impact</Eyebrow>
          <div className="h-[300px] mt-2 bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={tornado} margin={{ top: 8, right: 16, bottom: 8, left: 0 }} stackOffset="sign">
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `${v >= 0 ? "+" : ""}$${v}M`} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} stroke="var(--mute)" width={210} />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(v, n) => [`${Number(v ?? 0) >= 0 ? "+" : ""}$${Math.abs(Number(v ?? 0)).toFixed(1)}M`, n]}
                />
                <Bar dataKey="downside" stackId="t" fill="var(--mark-red)" />
                <Bar dataKey="upside" stackId="t" fill="var(--accent-green-deep)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Driver assumptions</Eyebrow>
          <table className="w-full text-[12px] leading-[18px] mt-2">
            <thead className="text-mute text-[10px] tracking-[0.08em] uppercase">
              <tr><th className="text-left py-2">Driver</th><th className="text-left py-2">Base assumption</th><th className="text-right py-2">Downside</th><th className="text-right py-2">Upside</th></tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.driver} className="border-t border-divider/60">
                  <td className="py-2 text-ink">{s.driver}</td>
                  <td className="py-2 text-mute">{s.baseAssumption}</td>
                  <td className="py-2 text-right tabular-nums text-mark-red">{fmtUSD(s.downsideUSD, { compact: true })}</td>
                  <td className="py-2 text-right tabular-nums text-[var(--ok)]">+{fmtUSD(s.upsideUSD, { compact: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[12px] text-mute pt-2 italic">Range covers {(((downsideTotal + upsideTotal) / total) * 100).toFixed(0)}% of identified Q3 sensitivity envelope.</p>
        </section>
      </Paper>
      <SideRail>
        <Provenance source="Q2 BP packet + FP&A scenario tool" generatedAt="2026-05-28 12:00" />
        <CrossLinks
          links={[
            { id: "business-line-pnl", label: "Business line P&L" },
            { id: "synergy-map", label: "Cross-line synergy map" },
            { id: "bp-strategic-memo", label: "Strategic memo" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
