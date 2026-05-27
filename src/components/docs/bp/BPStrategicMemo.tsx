import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, Eyebrow, fmtUSD } from "@/components/docs/shared";
import { FLAG_RECOMMENDATION } from "@/components/docs/bp/data";

export function BPStrategicMemo() {
  return (
    <DocChrome
      title="BP strategic memo"
      primary={{ label: "Sign & route to EXCO", onClick: () => alert("Route via step 7 ceremony.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Executive Committee · Q3 ask"
          title="Q2 BP review · strategic memo"
          subtitle="One-ask memo for the EXCO inbox — backed by the waterfall, synergy map, and scenario tornado."
        />

        <section className="pt-6 space-y-5 max-w-[700px]">
          <div>
            <Eyebrow>To / From / Date</Eyebrow>
            <ul className="text-[13px] leading-[20px] pt-1.5 space-y-0.5 text-ink">
              <li><span className="text-mute">To:</span> CEO · COO · 2 Independent Directors</li>
              <li><span className="text-mute">From:</span> Wei Chen · Group CFO, Crypton (BP hat)</li>
              <li><span className="text-mute">Re:</span> Q3 strategic ask · institutional sales investment</li>
              <li><span className="text-mute">Date:</span> 2026-05-28</li>
            </ul>
          </div>

          <Section title="Headline ask">
            <strong className="font-bold">{FLAG_RECOMMENDATION.ask}</strong>. Expected annualised net contribution{" "}
            <strong className="font-bold">{fmtUSD(FLAG_RECOMMENDATION.expectedNet, { compact: true })}</strong>. Single largest lever
            available to Q3.
          </Section>

          <Section title="Rationale">{FLAG_RECOMMENDATION.rationale}</Section>

          <Section title="What Q2 told us">
            Derivatives delivered the bulk of the May uplift on funding-rate strength — that is a
            macro tailwind, not a Crypton-controllable lever. The next largest controllable lever is{" "}
            <strong className="font-bold">Institutional</strong>, where every Tier-1 OTC onboard
            drives both RFQ revenue and a +7% lift in spot taker volume (see synergy map). Q2 closed
            12 active Tier-1 OTC clients with a 50-name pipeline (per James Park's onboarding tracker)
            — we are leaving money on the table on staffing.
          </Section>

          <Section title="Supporting data">
            <ul className="list-disc pl-5">
              <li>Revenue waterfall: Derivatives + Institutional combined accounted for 73% of MoM uplift.</li>
              <li>Synergy map: Spot maker liquidity → Derivatives MM rebate uplift @ 82% confidence ($4.2M/q).</li>
              <li>Scenario tornado: institutional onboards is the second-largest upside lever (+$18M).</li>
            </ul>
          </Section>

          <Section title="Risks">
            <strong className="font-bold">{FLAG_RECOMMENDATION.risk}</strong>. Mitigation: tie the
            $2M tranche release to MAS approval milestones; first $500K unlocks on application
            acknowledgement.
          </Section>

          <Section title="Recommendation">
            Approve the $2M tranche for Q3 institutional sales. Owner: James Park, in partnership
            with Priya Iyer (Compliance) on MAS pacing. Decision needed by{" "}
            <strong className="font-bold">June 12</strong>; CFO to bring the gated budget to next
            week's CEO 1:1.
          </Section>

          <div className="pt-2 text-[12px] text-mute italic">
            Drafted by AI · reviewed by Wei Chen · 720 words · supporting analysis attached
            (business-line P&L, revenue waterfall, scenario tornado, synergy map).
          </div>
        </section>
      </Paper>
      <SideRail>
        <Provenance source="Q2 BP packet" generatedAt="2026-05-28 12:30" notes="720 words · 6 sections · 1 ask · 1 risk · routed to EXCO inbox at step 7." />
        <CrossLinks
          links={[
            { id: "business-line-pnl", label: "Business line P&L" },
            { id: "revenue-waterfall", label: "Revenue waterfall" },
            { id: "scenario-analysis", label: "Scenario analysis" },
            { id: "synergy-map", label: "Cross-line synergy map" },
            { id: "bp-board-deck", label: "Board deck (visual)" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] tracking-[0.18em] uppercase font-bold text-surface-deep mb-1.5">{title}</h3>
      <div className="text-[14px] text-ink leading-[24px] space-y-2">{children}</div>
    </div>
  );
}
