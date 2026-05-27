import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, StatRow, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { cn } from "@/lib/utils";

/**
 * Rebalancing plan — source → destination diagram + travel-rule
 * checklist + execution time estimate. The plan the CFO approves
 * in the execution ceremony.
 */

const CHECKS = [
  { label: "Travel-rule originator (Anchorage)", status: "ok", note: "Beneficial owner verified · Tier-1 institutional" },
  { label: "Travel-rule beneficiary (Fireblocks)", status: "ok", note: "Wallet labelled · counterparty Tier-1 institutional" },
  { label: "Sanction screening · OFAC + EU + UK + SG", status: "ok", note: "0 matches · Chainalysis + Elliptic + TRM" },
  { label: "Aggregated daily threshold ($150M)", status: "ok", note: "$80M of $150M (53% of cap)" },
  { label: "Cold-custody withdrawal SLA", status: "ok", note: "Anchorage T+0 confirmed · ETA 4h" },
  { label: "Fireblocks receipt confirmation", status: "ok", note: "Whitelist verified · 21 members · MFA cosign required" },
  { label: "Inter-co compliance memo (if > $50M)", status: "ok", note: "Memo COMP-2026-05-28-T01 logged" },
] as const;

const ALT_OPTIONS = [
  "Move $40M USDT · same source / destination · cuts cold-utilisation drop to 4%",
  "Convert $80M USDT to USDC at Fireblocks before moving · reduces single-asset concentration",
  "Stage the move across 2 days · ETA pushes to T+1 but settlement risk halves",
];

export function RebalancingPlan() {
  return (
    <DocChrome
      title="Rebalancing plan"
      primary={{ label: "Approve plan", onClick: () => alert("Approve via step 7 ceremony — that's the auditable path.") }}
      secondary={{ label: "Export plan PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="2026-05-28 · Tonight's recommended move"
          title="Rebalancing plan · $80M USDT"
          subtitle="Anchorage cold custody → Fireblocks operational. Restores hot float; reduces cold utilisation by 4 points."
        />

        <StatRow
          items={[
            { label: "Move", value: fmtUSD(80_000_000, { compact: true }) },
            { label: "ETA", value: "T+4h" },
            { label: "Travel-rule checks", value: `${CHECKS.length} / ${CHECKS.length}`, tone: "ok" },
            { label: "Daily cap used", value: "53%", tone: "ok" },
          ]}
        />

        <section className="pt-6">
          <Eyebrow>Movement</Eyebrow>
          <div className="mt-2 bg-surface-fog/40 border border-divider rounded-md p-5">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <Node label="Source" name="Anchorage Digital · Cold custody" detail="USDT-Cold-01 (Ethereum)" balance={fmtUSD(420_000_000, { compact: true })} />
              <div className="flex-1 min-w-[120px] relative h-1.5 bg-surface-deep rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-full bg-accent-green animate-pulse" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.08em] uppercase font-bold text-surface-deep whitespace-nowrap">
                  $80,000,000 USDT · ETH chain
                </span>
              </div>
              <Node label="Destination" name="Fireblocks · Operational" detail="USDT-Hot-01 (Ethereum)" balance={fmtUSD(8_120_400, { compact: true })} />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-6 text-[12px] leading-[18px]">
              <Field label="Asset" value="USDT (ERC-20)" />
              <Field label="Chain" value="Ethereum mainnet" />
              <Field label="Gas estimate" value="~0.024 ETH" />
              <Field label="Pre-move hot float" value={fmtUSD(33_120_000)} />
              <Field label="Post-move hot float" value={fmtUSD(113_120_000)} tone="ok" />
              <Field label="Pre / post cold utilisation" value="91% → 87%" tone="ok" />
            </div>
          </div>
        </section>

        <section className="pt-6">
          <Eyebrow>Travel-rule + compliance checklist</Eyebrow>
          <ul className="mt-2 space-y-1.5">
            {CHECKS.map((c) => (
              <li key={c.label} className="flex items-start gap-2 text-[12px] leading-[18px]">
                <span className="grid w-5 h-5 place-items-center rounded-full bg-surface-mint text-surface-deep text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                <div className="min-w-0">
                  <div className="text-ink font-medium">{c.label}</div>
                  <div className="text-mute text-[11px]">{c.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-6 border-t border-divider">
          <Eyebrow>Alternatives considered</Eyebrow>
          <ul className="text-[14px] text-ink leading-[24px] pt-2 list-disc pl-5 space-y-1 max-w-[760px]">
            {ALT_OPTIONS.map((alt, i) => (
              <li key={i}>{alt}</li>
            ))}
          </ul>
          <p className="text-[13px] text-mute leading-[20px] pt-3 max-w-[760px] italic">
            AI recommendation: primary plan. Alternative #3 (staged move) is worth running if the prime client
            confirms additional inflows within 24h.
          </p>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Treasury rebalancing engine · v2.4"
          generatedAt="2026-05-28 03:32"
          notes="ETA modelled on last 30d Anchorage T+0 cold withdrawal latencies (P95 = 4h 12m)."
        />
        <CrossLinks
          links={[
            { id: "wallet-balance-sheet", label: "Wallet balance sheet" },
            { id: "anomaly-brief", label: "Anomaly brief" },
            { id: "daily-treasury-brief", label: "Daily treasury brief" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function Node({ label, name, detail, balance }: { label: string; name: string; detail: string; balance: string }) {
  return (
    <div className="bg-white border border-divider rounded-md px-4 py-3 min-w-[220px]">
      <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">{label}</div>
      <div className="text-[14px] font-bold text-ink mt-1 leading-[18px]">{name}</div>
      <div className="text-[12px] text-mute">{detail}</div>
      <div className="text-[12px] text-ink/85 tabular-nums pt-1">Currently {balance}</div>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">{label}</div>
      <div
        className={cn(
          "text-[13px] font-medium tabular-nums mt-0.5",
          tone === "ok" ? "text-[var(--ok)]" : tone === "warn" ? "text-mark-red" : "text-ink",
        )}
      >
        {value}
      </div>
    </div>
  );
}
