import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { PNL, lineTotals } from "@/components/docs/bp/data";

export function RevenueWaterfall() {
  // Build waterfall: Q1 baseline → +/- per line → Q2 result
  // For demo: prior-period revenue starts at $74.56M, lines contribute to delta.
  const priorQ = 74_560_000;
  const contributions = PNL.map((l) => {
    const delta = lineTotals(l, "may").revenue - lineTotals(l, "apr").revenue;
    return { label: l.id, value: delta };
  });
  const currentQ = priorQ + contributions.reduce((s, c) => s + c.value, 0);
  const series = [
    { label: "April revenue", value: priorQ, kind: "anchor" as const },
    ...contributions.map((c) => ({
      label: `${c.value >= 0 ? "+" : "−"} ${c.label}`,
      value: c.value,
      kind: (c.value >= 0 ? "up" : "down") as "up" | "down",
    })),
    { label: "May revenue", value: currentQ, kind: "anchor" as const },
  ];

  // Floating bars
  let running = 0;
  const bars = series.map((d) => {
    if (d.kind === "anchor") {
      running = d.value;
      return { ...d, start: 0, height: d.value };
    }
    const start = d.value >= 0 ? running : running + d.value;
    const height = Math.abs(d.value);
    running += d.value;
    return { ...d, start, height };
  });

  return (
    <DocChrome
      title="Revenue waterfall"
      primary={{ label: "Approve", onClick: () => alert("Day-5 ceremony.") }}
      secondary={{ label: "Export PNG", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Q2 · April → May"
          title="Revenue waterfall by business line"
          subtitle="What carried Crypton's $5.5M MoM revenue uplift. Derivatives drove ~60% on its own."
        />

        <StatRow
          items={[
            { label: "April revenue", value: fmtUSD(priorQ, { compact: true }) },
            { label: "May revenue", value: fmtUSD(currentQ, { compact: true }) },
            { label: "Net Δ", value: fmtUSD(currentQ - priorQ, { compact: true }), tone: "ok" },
            { label: "Lines contributing", value: `${contributions.filter((c) => c.value >= 0).length} / ${contributions.length}` },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Movement</Eyebrow>
          <div className="h-[320px] mt-2 bg-white border border-divider rounded-md p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ top: 16, right: 16, bottom: 40, left: 8 }}>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" stroke="var(--mute)" interval={0} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--mute)" tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(_v, _n, p) => {
                    const v = (p as { payload?: { value?: number } } | undefined)?.payload?.value ?? 0;
                    return [`${v >= 0 ? "+" : "−"}$${Math.abs(v / 1_000_000).toFixed(2)}M`, "Δ"];
                  }}
                />
                <Bar dataKey="start" stackId="w" fill="transparent" />
                <Bar dataKey="height" stackId="w" radius={[3, 3, 0, 0]}>
                  {bars.map((b, i) => (
                    <Cell
                      key={i}
                      fill={
                        b.kind === "anchor"
                          ? "var(--ink)"
                          : b.kind === "up"
                            ? "var(--accent-green)"
                            : "var(--mark-red)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Per-line contribution</Eyebrow>
          <table className="w-full text-[12px] leading-[18px] mt-2">
            <thead className="text-mute text-[10px] tracking-[0.08em] uppercase">
              <tr><th className="text-left py-2">Line</th><th className="text-right py-2">April</th><th className="text-right py-2">May</th><th className="text-right py-2">Δ</th><th className="text-right py-2">Share of uplift</th></tr>
            </thead>
            <tbody>
              {PNL.map((l) => {
                const delta = lineTotals(l, "may").revenue - lineTotals(l, "apr").revenue;
                const share = delta / (currentQ - priorQ);
                return (
                  <tr key={l.id} className="border-t border-divider/60">
                    <td className="py-2 text-ink">{l.id}</td>
                    <td className="py-2 text-right tabular-nums text-ink/85">{fmtUSD(lineTotals(l, "apr").revenue, { compact: true })}</td>
                    <td className="py-2 text-right tabular-nums text-ink">{fmtUSD(lineTotals(l, "may").revenue, { compact: true })}</td>
                    <td className={`py-2 text-right tabular-nums ${delta >= 0 ? "text-[var(--ok)]" : "text-mark-red"}`}>{delta >= 0 ? "+" : "−"}{fmtUSD(Math.abs(delta), { compact: true })}</td>
                    <td className="py-2 text-right tabular-nums text-mute">{(share * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </Paper>
      <SideRail>
        <Provenance source="Q2 BP packet" generatedAt="2026-05-28 12:00" />
        <CrossLinks
          links={[
            { id: "business-line-pnl", label: "Business line P&L" },
            { id: "cost-breakdown", label: "Cost breakdown" },
            { id: "scenario-analysis", label: "Scenario analysis" },
            { id: "bp-strategic-memo", label: "Strategic memo" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
