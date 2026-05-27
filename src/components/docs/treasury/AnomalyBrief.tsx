import { useApp } from "@/state";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { PillButton } from "@/components/blocks/PillButton";
import { ANOMALIES } from "@/components/docs/treasury/data";
import { cn } from "@/lib/utils";

/**
 * Anomaly brief — two surfaced events with trigger, evidence trail,
 * and per-event ack button. Side rail links to the underlying ledger.
 */

export function AnomalyBrief() {
  const { anomalies, clearAnomaly, cfo } = useApp();
  function isCleared(id: string) {
    return anomalies.find((a) => a.id === id)?.cleared ?? false;
  }
  const open = ANOMALIES.filter((a) => !isCleared(a.id)).length;

  return (
    <DocChrome
      title="Anomaly brief"
      primary={{
        label: "Ack all as one event",
        onClick: () => ANOMALIES.forEach((a) => clearAnomaly(a.id, cfo.name)),
      }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="2026-05-28 · Treasury anomalies"
          title="Anomaly brief"
          subtitle="Two events flagged in the overnight cycle. Both trace to the same Northstar OTC settlement — proposed single ack."
        />

        <StatRow
          items={[
            { label: "Anomalies surfaced", value: String(ANOMALIES.length), tone: "warn" },
            { label: "Open · awaiting ack", value: String(open), tone: open ? "warn" : "ok" },
            { label: "Largest event", value: fmtUSD(42_000_000, { compact: true }) },
            { label: "Severity", value: "Amber", tone: "warn" },
          ]}
        />

        <section className="pt-6 space-y-4">
          {ANOMALIES.map((a) => {
            const cleared = isCleared(a.id);
            return (
              <article
                key={a.id}
                className={cn(
                  "border rounded-md bg-white overflow-hidden",
                  cleared ? "border-surface-deep" : "border-mark-red/50",
                )}
              >
                <header
                  className={cn(
                    "px-5 py-4 flex items-start justify-between gap-4",
                    cleared ? "bg-surface-mint/30" : "bg-surface-rose",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-1">
                      <span className="font-mono text-ink">{a.id}</span>
                      <span>·</span>
                      <span>{new Date(a.detected).toISOString().slice(11, 19)} UTC</span>
                      <span>·</span>
                      <span className={cn("font-bold", a.severity === "red" ? "text-mark-red" : "text-mark-red/70")}>
                        {a.severity.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-[18px] font-bold text-ink tracking-[-0.01em]">{a.title}</h3>
                    <div className="text-[12px] text-mute mt-1">
                      {a.walletOrBank}
                      {a.amountUSD && <span> · {fmtUSD(a.amountUSD)}</span>}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] tracking-[0.08em] uppercase font-bold px-2 py-1 rounded-full whitespace-nowrap",
                      cleared ? "bg-surface-deep text-ink-inverse" : "bg-mark-red text-ink-inverse",
                    )}
                  >
                    {cleared ? `Ack'd by ${anomalies.find((x) => x.id === a.id)?.clearedBy ?? cfo.name}` : "Awaiting ack"}
                  </span>
                </header>
                <div className="px-5 py-4 border-t border-divider space-y-3">
                  <div>
                    <Eyebrow>Trigger rule</Eyebrow>
                    <p className="text-[12px] text-ink leading-[18px] pt-1">{a.trigger}</p>
                  </div>
                  <div>
                    <Eyebrow>Evidence trail</Eyebrow>
                    <ul className="text-[12px] text-ink leading-[18px] pt-1 list-disc pl-5 space-y-0.5">
                      {a.evidence.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Eyebrow>Recommended action</Eyebrow>
                    <p className="text-[12px] text-ink leading-[18px] pt-1">{a.recommended}</p>
                  </div>
                  <div className="pt-2">
                    <PillButton
                      variant={cleared ? "deep" : "primary"}
                      size="sm"
                      onClick={() => clearAnomaly(a.id, cfo.name)}
                    >
                      {cleared ? "✓ Acknowledged" : "Acknowledge"}
                    </PillButton>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Treasury anomaly detector · rules-engine v3.2"
          generatedAt="2026-05-28 03:28"
          notes="Both events fired within 33 seconds and trace to ETH-Hot-02 — root cause: prime OTC settlement breaching mm-strat-08 limit."
        />
        <CrossLinks
          links={[
            { id: "wallet-balance-sheet", label: "Wallet balance sheet" },
            { id: "transaction-ledger-24h", label: "Transaction ledger · 24h" },
            { id: "rebalancing-plan", label: "Rebalancing plan" },
            { id: "daily-treasury-brief", label: "Daily treasury brief" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}
