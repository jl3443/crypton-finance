# Crypton Finance — CFO workspace demo

Enterprise AI demo for the **Crypton CFO org**: three flows on one
single-CFO workspace, with real Excel ingest, hand-built executive
documents, multi-chart dashboards, and audited export ceremonies.

- **Persona** · Wei Chen, Group CFO, Crypton
- **Voice** · Real Crypton unit economics (funding-rate revenue,
  auto-deleveraging fund contribution, liquidation engine cost, insurance
  fund, RFQ spread net, etc.) in neutral industry wording — no
  trader-floor jargon on surface copy.
- **Audience** · CFO + Audit Committee · Board · EXCO

## Run locally

```bash
npm install
npm run dev            # dev server on :5173
# or
npm run build && npm run preview   # production preview on :4173
```

Open the URL printed by Vite. Demo starts at the login screen — the
email auto-types in ~1.5s, then the Continue pill activates. One click
into the CFO Hub.

To regenerate sample XLSX fixtures used by the "Try sample" pill:

```bash
node scripts/seed-samples.mjs
```

This emits three workbooks into `public/samples/`:

| File | Sheets | Use |
| --- | --- | --- |
| `crypton-may-gl-extract.xlsx` | GL_Detail · TB_May · AP_Aging · AR_Aging | Accounting flow |
| `crypton-treasury-statements.xlsx` | Wallets · BankAccounts · Transactions_24h | Treasury flow |
| `crypton-q2-bp-packet.xlsx` | BusinessLines · MonthlyPnL · UnitEconomics | BP flow |

## Demo script

### Arc 1 · Accounting — Oracle close cycle (8 steps)

1. Hub → **"Close Q2 books · Oracle GL"** card.
2. Step 1 DropZone — click **"Try sample"** (loads `crypton-may-gl-extract.xlsx`
   via SheetJS) or drop a real XLSX. Preview modal shows sheets + first
   50 rows + parse time.
3. Click **"Continue with AI"** → step 2 begins; AgentLiveStrip narrates
   with the real filename / row count.
4. Continue through steps 3–7. Step 7 (Financial report assembly) mounts
   the 6-panel close dashboard (variance heat · AP/AR aging stacks ·
   GL completeness donut · YoY revenue trend · period-over-period
   waterfall).
5. Click any doc chip on each step — Oracle GL extract / TB recon / AP /
   AR aging / Journal entry proposals (JE-0429 to JE-0432) / Variance
   memo / 14-page board financial report / Close audit trail.
6. Step 8 → **"Approve & export"** → 4-row drafting animation → 4
   downloadable artifacts (memo HTML · board report HTML · audit trail
   JSON · Oracle journal XML).

### Arc 2 · Treasury — daily brief (7 steps)

1. Hub → **"Treasury daily brief"** card.
2. Try sample loads the 1,247-transaction overnight cycle.
3. Step 4 (Liquidity position) mounts the 6-panel treasury dashboard
   (cash by jurisdiction · wallets by chain · 30-day net flow · anomaly
   scatter · runway gauge · Anchorage utilisation).
4. Doc chips reach Wallet balance sheet ($6.35B) · Bank account summary
   ($210M across 7 jurisdictions) · Transaction ledger 24h with category
   filters · 2-event Anomaly brief with per-event ack · $80M USDT
   Rebalancing plan (Anchorage → Fireblocks) · 1-page Daily brief.
5. Step 7 ceremony: **"Travel-rule check · Fireblocks submission ·
   Anchorage withdrawal…"** → done state files the brief and posts the
   signed Fireblocks instruction.

### Arc 3 · Business Partner — Q2 4-line review (7 steps)

1. Hub → **"Q2 business-line review"** card.
2. Try sample loads BusinessLines / MonthlyPnL / UnitEconomics packet.
3. Step 4 (Cross-line synergy detection) mounts the 6-panel BP dashboard
   (revenue waterfall · margin radar · sensitivity tornado · synergy
   quadrant · quarterly trend · headcount mix).
4. Doc chips reach Business line P&L (Derivatives / Spot / Institutional
   / Compliance tabs with real unit economics) · Revenue waterfall ·
   Cost breakdown · 6-driver Scenario tornado · 5-candidate Synergy map ·
   720-word EXCO memo with single ask **"Increase Q3 institutional
   sales budget by +$2M"** · 18-slide Board deck.
5. Step 7 ceremony: **"Routed to EXCO · 4 recipients · decision by
   June 12"** → 4 artifacts (strategic memo · board deck · scenarios
   JSON · EXCO routing log).

## Architecture

```
src/
  state.tsx                       View-state machine + Context
                                  ({ kind: login | hub | workspace | doc | export })
  index.css                       Warm-gold Bloomberg tokens + 4 AI motion keyframes
  data/flows.ts                   3 FlowDefs · steps · liveScripts · doc chips
  lib/parseExcel.ts               Lazy-import SheetJS reader (xlsx)
  lib/uploadCache.ts              Module-level Map<FlowId, ParsedFile>
  components/
    ai/                           AIDot · AgentLiveStrip · StreamingText ·
                                  CountUp · Sparkline · SpringIn · Spinner
    blocks/                       KPIStrip · PillButton · SectionEyebrow
    docs/                         DocChrome (1100px paper + 320px side rail) ·
                                  shared.tsx (DocHeader · Provenance · CrossLinks)
    docs/accounting/              8 hand-built docs
    docs/treasury/                6 hand-built docs + shared data.ts
    docs/bp/                      7 hand-built docs + shared data.ts
    dashboard/                    MultiChartDashboard (accounting) ·
                                  TreasuryDashboard · BPDashboard (6 panels each)
    upload/                       DropZone · UploadPreviewModal (frozen-header preview)
    workspace/                    Timeline · ActivityLog · ExportCeremony
  views/                          Login · Hub · Workspace · DocView · ExportView
```

## Tech stack

- **Vite 8** + **React 19** + **TypeScript 6** — discriminated-union view
  state, no router.
- **Tailwind v4** via `@tailwindcss/vite`; tokens in `src/index.css` with
  `@theme inline`.
- **Recharts 2** for embedded charts; **xlsx (SheetJS)** for Excel parse
  (lazy-imported behind the DropZone).
- `lucide-react` icons, `clsx` + `tailwind-merge` for class composition.
- All AI motion via 4 CSS keyframes (`cx-pulse` · `cx-stream-in` ·
  `cx-spring-in` · `cx-caret`) — `motion` is installed but unused; the
  cost stays at-rest.

## Visual system

Warm-gold Bloomberg-Terminal-meets-Linear light mode.

```
--ink             #0b0b0e   near-black ink
--surface-deep    #1f1b16   espresso "AI agreed" emphasis
--accent-green    #c8a24b   warm gold (renamed in CSS for back-compat)
--surface-mint    #f5edda   warm-gold soft (renamed)
--mark-red        #a6192e   down / flagged
--surface-fog     #faf9f5   warm off-white page bg
```

`.ui-pill` carries the same hover language across every CTA — 180ms
`translateY(-1px)` on hover, `scale(0.96)` on active.

## Out of scope (deliberate)

- **No real backend.** All numbers are seeded; AI commentary is
  hand-written. The agent panel narrates what an AI *would* be doing.
- **No real Oracle / Fireblocks / Anchorage connectors.** "Routed to
  Oracle nightly" is theatrical.
- **No real auth.** Login is a ceremony.
- **Dark mode** is not supported — calm finance-ops light surface only.
- **Mobile** is not supported — desktop-first design (1440×900 is the
  target rendering size).
- **Expense reimbursement** and the **helpdesk-with-KG** flow are
  separate demos, not in this 3-flow demo.

## Standing rules

1. **Real Crypton unit economics, neutral wording.** Funding rate
   revenue / Auto-deleveraging fund contribution / Principal trading
   PnL / Liquidation engine cost / Insurance fund — yes. "对手盘" /
   "爆仓收入" — no.
2. **One eyebrow per card.** Sentence case in body, ALL-CAPS-TRACKED
   only for the 11px eyebrows.
3. **Restraint over neon.** No gradients, no crypto-bro tropes; a
   Bloomberg-terminal user should respect this.
4. **CXO audience.** Editorial whitespace, story-first, every doc has
   provenance + cross-links + a real downloadable artifact.
