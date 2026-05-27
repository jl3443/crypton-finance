import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, Eyebrow, fmtUSD } from "@/components/docs/shared";

/**
 * Variance Commentary Memo — 380-word executive memo addressed from
 * Finance to the Audit Committee, walking the May variances vs. April
 * with referenced cost centres and pinpointed drivers. Real names of
 * Crypton-style accounts, no Lorem Ipsum.
 */

export function VarianceCommentaryMemo() {
  return (
    <DocChrome
      title="Variance commentary memo"
      primary={{ label: "Sign & route to AC", onClick: () => alert("Day-5 wires the routing ceremony.") }}
      secondary={{ label: "Export PDF", onClick: () => window.print() }}
    >
      <Paper>
        <DocHeader
          eyebrow="Internal · Finance to Audit Committee"
          title="May 2026 close · variance commentary"
          subtitle="One-page executive summary of the line-level deltas above tolerance. Numbers tie to the Trial Balance reconciliation."
        />

        <section className="pt-6 space-y-5 max-w-[680px]">
          <div>
            <Eyebrow>To / From / Date</Eyebrow>
            <ul className="text-[13px] leading-[20px] pt-1.5 space-y-0.5 text-ink">
              <li><span className="text-mute">To:</span> Audit Committee chair · CFO · External auditor (PwC)</li>
              <li><span className="text-mute">From:</span> Wei Chen · Group CFO, Crypton</li>
              <li><span className="text-mute">Re:</span> May 2026 month-end close variance commentary</li>
              <li><span className="text-mute">Date:</span> 2026-05-28</li>
            </ul>
          </div>

          <Section title="Headline">
            May delivered total revenue of {bold("$80.08M")} ({bold("+7.4%")} MoM) against operating expense of
            {bold(" $14.57M")} ({bold("+2.6%")} MoM). Net margin held at {bold("66.0%")}, broadly in line with the FY-Q1
            board guidance band ({bold("63-68%")}). Ten accounts crossed the {bold("5%")} variance threshold; all are
            understood and policy-substantiated below.
          </Section>

          <Section title="Revenue drivers">
            Derivatives carried the quarter. Funding-rate revenue rose to {bold(fmtUSD(31_142_211))} on a
            persistent positive-skew funding regime ({bold("18 of 21 days positive")}), and the auto-deleveraging
            fund contribution lifted {bold("+26%")} MoM on the {bold("May 14")} liquidation cascade. Spot maker
            revenue ticked up {bold("+10.2%")} on a maker volume uplift the listings desk attributes to two
            tokens onboarded in late April. Institutional revenue is flat, in line with the soft RFQ window
            we communicated to the board in February.
          </Section>

          <Section title="Cost drivers">
            Liquidation engine operational cost rose {bold("+18.2%")} on settlement-gas pressure; per policy
            ACCT-POL-2026-02 §1.7 we are reclassifying {bold("50%")} of the increase to Wallet & custody runtime
            (entry {bold("JE-0430")}). Singapore compliance headcount lifted People · Compliance {bold("+8.6%")}
            and external counsel by {bold("+49.4%")} — both pre-committed line items for the {bold("MAS MPI")}
            application timeline. Marketing & growth is {bold("-21.0%")} on a deliberate Q3 deferral of the
            listing campaign (entry {bold("JE-0432")}).
          </Section>

          <Section title="Sign-off recommendation">
            We propose signing the May close with the four adjusting entries proposed (
            {bold("JE-0429 to JE-0432")}) in tonight's Oracle nightly. The remaining open item is the
            cost-centre allocation between Compliance ({bold("CC-4000")}) and Institutional ({bold("CC-2200")})
            for the four new Singapore hires; HRBP confirmation expected by {bold("2026-05-30")}. The book is
            otherwise ready for the Audit Committee review on {bold("June 2")}.
          </Section>

          <div className="pt-2 text-[12px] text-mute italic">
            Drafted by AI · reviewed by Wei Chen · all numbers traceable to the Oracle Cloud GL extract referenced
            in the audit trail.
          </div>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source="Trial Balance reconciliation · Journal entry proposals"
          generatedAt="2026-05-28 08:21"
          notes="380 words · final-pass copy edit applied. Will route to AC chair after CFO sign-off."
        />
        <CrossLinks
          links={[
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "journal-entry-proposal", label: "Journal entry proposals (JE-0429 to 0432)" },
            { id: "board-financial-report", label: "Board financial report" },
            { id: "close-audit-trail", label: "Close audit trail" },
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
      <p className="text-[14px] text-ink leading-[24px]">{children}</p>
    </div>
  );
}

function bold(s: string | number) {
  return <strong className="font-bold text-ink">{s}</strong>;
}
