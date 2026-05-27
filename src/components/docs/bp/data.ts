/**
 * Shared BP seed data — keeps numbers consistent across the 7 BP docs
 * and the BPDashboard. All values are Crypton-realistic.
 */

export type BusinessLine = "Derivatives" | "Spot" | "Institutional" | "Compliance";

export type PnLLine = {
  code: string;
  name: string;
  apr: number;
  may: number;
  jun: number; // forecast
  kind: "revenue" | "cost";
};

export type LinePnL = {
  id: BusinessLine;
  owner: string;
  headcount: number;
  lines: PnLLine[];
  unitEconomics: { label: string; value: string }[];
};

// All amounts in USD.
export const PNL: LinePnL[] = [
  {
    id: "Derivatives",
    owner: "Sara Lim",
    headcount: 38,
    lines: [
      { code: "4020", name: "Funding rate revenue", apr: 27_440_000, may: 31_142_211, jun: 30_500_000, kind: "revenue" },
      { code: "4022", name: "Auto-deleveraging fund contribution", apr: 9_120_000, may: 11_504_780, jun: 10_800_000, kind: "revenue" },
      { code: "4030", name: "Principal trading PnL", apr: 4_780_000, may: 4_412_330, jun: 4_600_000, kind: "revenue" },
      { code: "4040", name: "Market-maker rebate net", apr: 5_220_000, may: 5_018_117, jun: 5_100_000, kind: "revenue" },
      { code: "5000", name: "Liquidation engine operational cost", apr: 720_000, may: 851_212, jun: 800_000, kind: "cost" },
      { code: "5020", name: "Insurance fund top-up", apr: 1_200_000, may: 1_410_500, jun: 1_300_000, kind: "cost" },
      { code: "5300", name: "People · Engineering & desk", apr: 3_200_000, may: 3_240_000, jun: 3_280_000, kind: "cost" },
      { code: "5100", name: "Cloud & infra (attribution)", apr: 920_000, may: 940_000, jun: 950_000, kind: "cost" },
    ],
    unitEconomics: [
      { label: "Funding rate days positive (Q2)", value: "53 / 63 days" },
      { label: "Avg daily liquidation revenue", value: "$540K" },
      { label: "Insurance fund coverage ratio", value: "1.62×" },
      { label: "Market-maker rebate · % of taker fees", value: "31%" },
    ],
  },
  {
    id: "Spot",
    owner: "Marcus Chen",
    headcount: 22,
    lines: [
      { code: "4010", name: "Trading fee revenue · maker", apr: 3_120_000, may: 3_437_947, jun: 3_500_000, kind: "revenue" },
      { code: "4011", name: "Trading fee revenue · taker", apr: 7_840_000, may: 8_217_503, jun: 8_400_000, kind: "revenue" },
      { code: "4080", name: "Withdrawal fee income", apr: 240_000, may: 264_000, jun: 280_000, kind: "revenue" },
      { code: "5200", name: "Marketing & growth", apr: 1_240_000, may: 980_500, jun: 1_100_000, kind: "cost" },
      { code: "5300", name: "People · BU", apr: 1_800_000, may: 1_810_000, jun: 1_820_000, kind: "cost" },
      { code: "5100", name: "Cloud & infra (attribution)", apr: 440_000, may: 448_000, jun: 455_000, kind: "cost" },
    ],
    unitEconomics: [
      { label: "Maker / taker mix", value: "31 / 69" },
      { label: "Listing pipeline ROI (TTM)", value: "4.2×" },
      { label: "New token onboards Q2", value: "5 tokens" },
      { label: "Avg per-user fee yield", value: "$2.18 / mo" },
    ],
  },
  {
    id: "Institutional",
    owner: "James Park",
    headcount: 17,
    lines: [
      { code: "4050", name: "RFQ spread net", apr: 13_770_000, may: 13_932_504, jun: 14_100_000, kind: "revenue" },
      { code: "4060", name: "Prime brokerage interest income", apr: 2_310_000, may: 2_417_905, jun: 2_450_000, kind: "revenue" },
      { code: "4070", name: "Custodial fee income", apr: 600_000, may: 612_000, jun: 620_000, kind: "revenue" },
      { code: "5300", name: "People · sales & ops", apr: 2_000_000, may: 2_040_000, jun: 2_080_000, kind: "cost" },
      { code: "5100", name: "Cloud & infra (attribution)", apr: 140_000, may: 142_000, jun: 144_000, kind: "cost" },
    ],
    unitEconomics: [
      { label: "RFQ avg spread", value: "7.2 bps" },
      { label: "Active Tier-1 OTC clients", value: "12" },
      { label: "Prime brokerage utilisation", value: "68%" },
      { label: "Pipeline · onboarding within 90d", value: "+50" },
    ],
  },
  {
    id: "Compliance",
    owner: "Priya Iyer",
    headcount: 24,
    lines: [
      { code: "4500", name: "Sanction-screen pass-through fee", apr: 240_000, may: 248_000, jun: 250_000, kind: "revenue" },
      { code: "5320", name: "People · Compliance & Legal", apr: 1_640_000, may: 1_780_300, jun: 1_900_000, kind: "cost" },
      { code: "5410", name: "Legal · external counsel", apr: 410_000, may: 612_400, jun: 650_000, kind: "cost" },
      { code: "5500", name: "Sanction screening per-K-tx cost", apr: 88_000, may: 102_300, jun: 105_000, kind: "cost" },
      { code: "5400", name: "Licensing & regulatory fees", apr: 420_000, may: 440_000, jun: 460_000, kind: "cost" },
    ],
    unitEconomics: [
      { label: "License runway", value: "47 mo at burn" },
      { label: "Sanction screen cost / K-tx", value: "$0.40" },
      { label: "KYC throughput / onboard", value: "$18.40" },
      { label: "Active MAS MPI application", value: "yes" },
    ],
  },
];

export function lineTotals(line: LinePnL, month: "apr" | "may" | "jun") {
  const revenue = line.lines.filter((l) => l.kind === "revenue").reduce((s, l) => s + l[month], 0);
  const cost = line.lines.filter((l) => l.kind === "cost").reduce((s, l) => s + l[month], 0);
  return { revenue, cost, net: revenue - cost, margin: revenue > 0 ? (revenue - cost) / revenue : 0 };
}

// ─────────────────────────────────────────────────────────────────────
// Scenarios — 6 drivers tornado'd against Q3 base
// ─────────────────────────────────────────────────────────────────────
export type Scenario = {
  driver: string;
  downsideUSD: number; // negative impact under downside
  upsideUSD: number; // positive impact under upside
  baseAssumption: string;
};

export const SCENARIOS: Scenario[] = [
  { driver: "Perp funding mean-reversion", downsideUSD: -41_000_000, upsideUSD: 14_000_000, baseAssumption: "Days-positive holds at Q2 levels" },
  { driver: "+50 institutional onboards", downsideUSD: -4_000_000, upsideUSD: 18_000_000, baseAssumption: "Linear ramp over 90 days" },
  { driver: "Spot listing pipeline (2 tokens)", downsideUSD: -2_000_000, upsideUSD: 9_400_000, baseAssumption: "Both launch on-schedule" },
  { driver: "Liquidation engine cost", downsideUSD: -3_200_000, upsideUSD: 1_100_000, baseAssumption: "Gas at May average" },
  { driver: "Compliance headcount", downsideUSD: -2_400_000, upsideUSD: 600_000, baseAssumption: "MAS approval lands in Q3" },
  { driver: "FX hedge slippage", downsideUSD: -1_800_000, upsideUSD: 900_000, baseAssumption: "Vol regime at trailing 30d" },
];

// ─────────────────────────────────────────────────────────────────────
// Synergies — 5 candidates plotted on revenue impact × confidence
// ─────────────────────────────────────────────────────────────────────
export type Synergy = {
  pair: string;
  impactUSDQ: number; // quarterly $ impact
  confidence: number; // 0..1
  note: string;
};

export const SYNERGIES: Synergy[] = [
  { pair: "Spot maker liquidity → Derivatives MM rebate uplift", impactUSDQ: 4_200_000, confidence: 0.82, note: "Confirmed by MM desk run-rate; 2 weeks of observation." },
  { pair: "Institutional onboards → Spot taker volume", impactUSDQ: 3_100_000, confidence: 0.74, note: "Top-10 institutional clients drove +7% spot in last 90d." },
  { pair: "Derivatives funding rates → Spot rotation flow", impactUSDQ: 2_400_000, confidence: 0.61, note: "Correlation only when funding > 0.05% daily." },
  { pair: "Compliance MAS license → Institutional Singapore pipeline", impactUSDQ: 6_500_000, confidence: 0.45, note: "Conditional on MAS MPI approval (Q3 estimate)." },
  { pair: "Spot listing scale-up → Derivatives MM warehouse", impactUSDQ: 1_200_000, confidence: 0.58, note: "Materialises only after 3 listings clear seasoning." },
];

export const FLAG_RECOMMENDATION = {
  ask: "Increase Q3 institutional sales budget by +$2M",
  rationale:
    "Highest-ROI lever: Tier-1 institutional onboards drive both RFQ revenue and spot taker volume; current pipeline (+50 in 90 days) is conservatively staffed.",
  expectedNet: 18_400_000,
  risk: "MAS MPI timing — if approval slips to Q4, $6.5M of the synergy compresses.",
};
