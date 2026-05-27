import { useState } from "react";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD, fmtPct } from "@/components/docs/shared";
import { PNL, lineTotals, type BusinessLine } from "@/components/docs/bp/data";
import { cn } from "@/lib/utils";

const LINE_TONE: Record<BusinessLine, string> = {
  Derivatives: "bg-surface-deep text-ink-inverse",
  Spot: "bg-surface-mint text-surface-deep border border-surface-deep/30",
  Institutional: "bg-accent-green/20 text-surface-deep border border-surface-deep/30",
  Compliance: "bg-surface-rose text-mark-red border border-mark-red/30",
};

export function BusinessLinePnL() {
  const [active, setActive] = useState<BusinessLine>("Derivatives");
  const totalRev = PNL.reduce((s, l) => s + lineTotals(l, "may").revenue, 0);
  const totalNet = PNL.reduce((s, l) => s + lineTotals(l, "may").net, 0);

  return (
    <DocChrome
      title="Business line P&L"
      primary={{ label: "Approve as drafted", onClick: () => alert("Day-5 ceremony locks it in.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Q2 2026 · per-line breakdown"
          title="Business line P&L"
          subtitle="4 lines · 3 months · real Crypton unit economics per line. Switch tabs to inspect each line's drivers."
        />

        <StatRow
          items={[
            { label: "Q2 Revenue", value: fmtUSD(totalRev * 3, { compact: true }) },
            { label: "Q2 Net", value: fmtUSD(totalNet * 3, { compact: true }), tone: "ok" },
            { label: "Net margin (May)", value: fmtPct(totalNet / totalRev), tone: "ok" },
            { label: "Largest line", value: "Derivatives" },
          ]}
        />

        <section className="pt-6">
          <div className="flex items-center gap-1 flex-wrap border-b border-divider">
            {PNL.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setActive(l.id)}
                className={cn(
                  "ui-pill px-4 py-2 text-[12px] font-medium border-b-2 transition-colors",
                  active === l.id ? "border-surface-deep text-ink" : "border-transparent text-mute hover:text-ink",
                )}
              >
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-[0.04em] uppercase font-bold mr-2", LINE_TONE[l.id])}>
                  {l.id}
                </span>
                {l.owner}
              </button>
            ))}
          </div>

          {PNL.filter((l) => l.id === active).map((l) => {
            const m = lineTotals(l, "may");
            const a = lineTotals(l, "apr");
            return (
              <div key={l.id} className="pt-5 space-y-5">
                <StatRow
                  items={[
                    { label: "May revenue", value: fmtUSD(m.revenue, { compact: true }) },
                    { label: "May OpEx", value: fmtUSD(m.cost, { compact: true }) },
                    { label: "May net", value: fmtUSD(m.net, { compact: true }), tone: m.net >= 0 ? "ok" : "warn" },
                    { label: "Margin", value: fmtPct(m.margin), tone: m.margin >= 0 ? "ok" : "warn" },
                  ]}
                />

                <div>
                  <Eyebrow>Real unit economics</Eyebrow>
                  <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {l.unitEconomics.map((u) => (
                      <div key={u.label} className="flex justify-between gap-3 text-[12px] leading-[18px] border-b border-divider/60 py-1">
                        <span className="text-mute">{u.label}</span>
                        <span className="text-ink font-medium tabular-nums">{u.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Eyebrow>P&L lines · April → May → June (forecast)</Eyebrow>
                  <table className="w-full text-[12px] leading-[18px] mt-2">
                    <thead className="bg-surface-fog text-mute text-[10px] tracking-[0.08em] uppercase">
                      <tr>
                        <th className="text-left px-3 py-2 w-16">Acct</th>
                        <th className="text-left px-3 py-2">Line</th>
                        <th className="text-right px-3 py-2 w-28">Apr</th>
                        <th className="text-right px-3 py-2 w-28">May</th>
                        <th className="text-right px-3 py-2 w-28">Jun (fcst)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {l.lines.map((ln) => (
                        <tr key={ln.code} className="border-t border-divider/60">
                          <td className="px-3 py-1.5 font-mono text-mute">{ln.code}</td>
                          <td className="px-3 py-1.5 text-ink">{ln.name}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-ink/85">
                            {ln.kind === "cost" ? "−" : ""}
                            {fmtUSD(ln.apr)}
                          </td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-ink font-medium">
                            {ln.kind === "cost" ? "−" : ""}
                            {fmtUSD(ln.may)}
                          </td>
                          <td className="px-3 py-1.5 text-right tabular-nums text-mute italic">
                            {ln.kind === "cost" ? "−" : ""}
                            {fmtUSD(ln.jun)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-ink/30 bg-surface-fog/40 font-bold">
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2 text-ink uppercase text-[10px] tracking-[0.08em]">Net</td>
                        <td className="px-3 py-2 text-right tabular-nums">{fmtUSD(a.net, { compact: true })}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{fmtUSD(m.net, { compact: true })}</td>
                        <td className="px-3 py-2 text-right tabular-nums italic text-mute">{fmtUSD(lineTotals(l, "jun").net, { compact: true })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[12px] text-mute">
                  <Eyebrow>Owner</Eyebrow>
                  <p className="pt-1">{l.owner} · {l.headcount} FTE</p>
                </div>
              </div>
            );
          })}
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Q2 BP packet · Oracle GL roll · NetSuite FP&A"
          generatedAt="2026-05-28 12:00"
          notes="All figures USD · forecast based on May run-rate plus committed pipeline."
        />
        <CrossLinks
          links={[
            { id: "revenue-waterfall", label: "Revenue waterfall" },
            { id: "cost-breakdown", label: "Cost breakdown by line" },
            { id: "scenario-analysis", label: "Scenario analysis" },
            { id: "synergy-map", label: "Cross-line synergy map" },
            { id: "bp-strategic-memo", label: "Strategic memo" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
