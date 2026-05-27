/**
 * Shared treasury seed data — used by every treasury doc + the
 * treasury dashboard so numbers tie out across surfaces.
 * Values picked to reflect a realistic mid-cap crypto exchange book.
 */

export type Wallet = {
  id: string;
  chain: string;
  cls: "Hot" | "Warm" | "Cold";
  custody: "Fireblocks" | "Anchorage Digital";
  balanceUSD: number;
  lastSync: string; // UTC HH:MM
  whitelistMembers: number;
};

export type BankAccount = {
  name: string;
  jurisdiction: string; // ISO-2
  currency: string;
  balanceUSDEquiv: number;
  status: string;
};

export type Txn = {
  ts: string; // ISO
  counterparty: string;
  category: "Operational" | "Customer flow" | "Hedging" | "Inter-co" | "Other";
  amountUSD: number;
  direction: "in" | "out";
  walletOrBank: string;
  classifiedBy: "AI auto" | "Human review";
  anomaly?: AnomalyTag;
};

export type AnomalyTag = "large-new-whitelist" | "off-hours-hot";

export type Anomaly = {
  id: string;
  title: string;
  detected: string; // ISO
  severity: "amber" | "red";
  walletOrBank: string;
  amountUSD?: number;
  trigger: string;
  evidence: string[];
  recommended: string;
};

// ─────────────────────────────────────────────────────────────────────
// Wallets — 23 across 6 chains
// ─────────────────────────────────────────────────────────────────────
export const WALLETS: Wallet[] = [
  // Bitcoin
  { id: "BTC-Hot-01", chain: "Bitcoin", cls: "Hot", custody: "Fireblocks", balanceUSD: 4_120_500, lastSync: "03:22", whitelistMembers: 18 },
  { id: "BTC-Hot-02", chain: "Bitcoin", cls: "Hot", custody: "Fireblocks", balanceUSD: 3_280_400, lastSync: "03:22", whitelistMembers: 12 },
  { id: "BTC-Warm-01", chain: "Bitcoin", cls: "Warm", custody: "Fireblocks", balanceUSD: 48_900_000, lastSync: "03:14", whitelistMembers: 9 },
  { id: "BTC-Cold-01", chain: "Bitcoin", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 1_840_000_000, lastSync: "02:48", whitelistMembers: 6 },
  { id: "BTC-Cold-02", chain: "Bitcoin", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 1_120_000_000, lastSync: "02:48", whitelistMembers: 6 },
  // Ethereum
  { id: "ETH-Hot-01", chain: "Ethereum", cls: "Hot", custody: "Fireblocks", balanceUSD: 5_240_700, lastSync: "03:22", whitelistMembers: 21 },
  { id: "ETH-Hot-02", chain: "Ethereum", cls: "Hot", custody: "Fireblocks", balanceUSD: 4_180_300, lastSync: "03:22", whitelistMembers: 15 },
  { id: "ETH-Warm-01", chain: "Ethereum", cls: "Warm", custody: "Fireblocks", balanceUSD: 76_400_000, lastSync: "03:14", whitelistMembers: 11 },
  { id: "ETH-Cold-01", chain: "Ethereum", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 1_240_000_000, lastSync: "02:48", whitelistMembers: 6 },
  { id: "ETH-Cold-02", chain: "Ethereum", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 860_000_000, lastSync: "02:48", whitelistMembers: 6 },
  // Solana
  { id: "SOL-Hot-01", chain: "Solana", cls: "Hot", custody: "Fireblocks", balanceUSD: 2_840_100, lastSync: "03:22", whitelistMembers: 14 },
  { id: "SOL-Warm-01", chain: "Solana", cls: "Warm", custody: "Fireblocks", balanceUSD: 22_400_000, lastSync: "03:14", whitelistMembers: 9 },
  { id: "SOL-Cold-01", chain: "Solana", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 380_000_000, lastSync: "02:48", whitelistMembers: 6 },
  // Tron (mostly USDT)
  { id: "TRX-Hot-01", chain: "Tron", cls: "Hot", custody: "Fireblocks", balanceUSD: 8_120_400, lastSync: "03:22", whitelistMembers: 22 },
  { id: "TRX-Warm-01", chain: "Tron", cls: "Warm", custody: "Fireblocks", balanceUSD: 142_000_000, lastSync: "03:14", whitelistMembers: 9 },
  // Polygon
  { id: "MATIC-Hot-01", chain: "Polygon", cls: "Hot", custody: "Fireblocks", balanceUSD: 1_240_800, lastSync: "03:22", whitelistMembers: 11 },
  { id: "MATIC-Warm-01", chain: "Polygon", cls: "Warm", custody: "Fireblocks", balanceUSD: 18_400_000, lastSync: "03:14", whitelistMembers: 7 },
  { id: "MATIC-Cold-01", chain: "Polygon", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 240_000_000, lastSync: "02:48", whitelistMembers: 6 },
  // Arbitrum
  { id: "ARB-Hot-01", chain: "Arbitrum", cls: "Hot", custody: "Fireblocks", balanceUSD: 1_870_200, lastSync: "03:22", whitelistMembers: 9 },
  { id: "ARB-Warm-01", chain: "Arbitrum", cls: "Warm", custody: "Fireblocks", balanceUSD: 24_800_000, lastSync: "03:14", whitelistMembers: 7 },
  { id: "ARB-Cold-01", chain: "Arbitrum", cls: "Cold", custody: "Anchorage Digital", balanceUSD: 310_000_000, lastSync: "02:48", whitelistMembers: 6 },
];

export const BANKS: BankAccount[] = [
  { name: "JPMorgan Chase · USD", jurisdiction: "US", currency: "USD", balanceUSDEquiv: 88_400_000, status: "Active" },
  { name: "HSBC · GBP / EUR multi-ccy", jurisdiction: "UK", currency: "GBP", balanceUSDEquiv: 24_600_000, status: "Active" },
  { name: "DBS Singapore · SGD", jurisdiction: "SG", currency: "SGD", balanceUSDEquiv: 42_100_000, status: "Active" },
  { name: "Standard Chartered HK · HKD", jurisdiction: "HK", currency: "HKD", balanceUSDEquiv: 18_800_000, status: "Active" },
  { name: "Emirates NBD · AED", jurisdiction: "AE", currency: "AED", balanceUSDEquiv: 9_400_000, status: "Active" },
  { name: "Butterfield Cayman · USD", jurisdiction: "KY", currency: "USD", balanceUSDEquiv: 14_900_000, status: "Active" },
  { name: "Sygnum Bank · CHF / USD", jurisdiction: "CH", currency: "CHF", balanceUSDEquiv: 12_200_000, status: "Active" },
];

export const ANOMALIES: Anomaly[] = [
  {
    id: "ANM-2026-05-28-001",
    title: "Large transfer to new whitelist address",
    detected: "2026-05-28T03:17:42Z",
    severity: "amber",
    walletOrBank: "ETH-Hot-02 → 0xNEWa…3c2f1",
    amountUSD: 42_000_000,
    trigger: "Single transfer > $25M to an address added to whitelist within 24h",
    evidence: [
      "Whitelist member 0xNEWa…3c2f1 added by ops-2 at 03:14:11 UTC (3 min before transfer)",
      "Chainalysis risk score: 12/100 (low) · address has 6-month clean history",
      "Travel-rule originator/beneficiary tags submitted to chain analytics partner",
    ],
    recommended:
      "Hold for CFO ack. Counterparty appears to be an institutional client onboarding their new prime address; OTC desk confirmed verbally at 03:18 UTC.",
  },
  {
    id: "ANM-2026-05-28-002",
    title: "Off-hours hot-wallet activity",
    detected: "2026-05-28T03:17:09Z",
    severity: "amber",
    walletOrBank: "ETH-Hot-02",
    trigger: "Hot wallet outbound transfer between 22:00 and 06:00 local (SGT) without paged-ops approval",
    evidence: [
      "SGT 11:17 local → falls in off-hours window per ops-policy SEC-OPS-2026-02 §4.2",
      "Initiator: api-key 'mm-strat-08' (market-maker strategy)",
      "MM-strat-08 has standing off-hours allowance for size < $5M; this txn is $42M (over limit)",
    ],
    recommended:
      "Tied to anomaly ANM-2026-05-28-001 — same wallet, same minute. Single explanation: prime-client OTC settlement that breached the size cap. Recommend amending mm-strat-08 limit to $50M for verified primes, and ack both as a single event.",
  },
];

// ─────────────────────────────────────────────────────────────────────
// Roll-ups used by dashboard and docs
// ─────────────────────────────────────────────────────────────────────

export function totalUSDByCustody() {
  const fire = WALLETS.filter((w) => w.custody === "Fireblocks").reduce((s, w) => s + w.balanceUSD, 0);
  const anch = WALLETS.filter((w) => w.custody === "Anchorage Digital").reduce((s, w) => s + w.balanceUSD, 0);
  return { fireblocks: fire, anchorage: anch };
}

export function totalUSDByChain() {
  const out: Record<string, number> = {};
  for (const w of WALLETS) out[w.chain] = (out[w.chain] ?? 0) + w.balanceUSD;
  return out;
}

export function totalUSDByJurisdiction() {
  const out: Record<string, number> = {};
  for (const b of BANKS) out[b.jurisdiction] = (out[b.jurisdiction] ?? 0) + b.balanceUSDEquiv;
  return out;
}

export function grandTotalUSD() {
  const wallets = WALLETS.reduce((s, w) => s + w.balanceUSD, 0);
  const banks = BANKS.reduce((s, b) => s + b.balanceUSDEquiv, 0);
  return wallets + banks;
}
