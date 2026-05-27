/**
 * Seed realistic Crypton finance sample XLSX files into public/samples/.
 * Run with: node scripts/seed-samples.mjs
 *
 * Produces (Day 2):
 *   - crypton-may-gl-extract.xlsx  (sheets: GL_Detail, TB_May, AP_Aging, AR_Aging)
 *
 * Day 4/5 will add:
 *   - crypton-treasury-statements.xlsx
 *   - crypton-q2-bp-packet.xlsx
 *
 * Voice: real Crypton unit economics, neutral technical wording (see plan §2).
 * No "对手盘" / "爆仓" surface text — but the underlying line items
 * (Funding rate revenue, Auto-deleveraging fund contribution, Principal
 * trading PnL, Liquidation engine cost, Insurance fund top-up, etc.)
 * are the real shape of a derivatives exchange GL.
 */
import * as XLSX from "xlsx";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "samples");
mkdirSync(OUT_DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────────────
// Deterministic PRNG so the sample is identical across runs (every demo
// shows the same numbers, every screenshot is reproducible).
// ─────────────────────────────────────────────────────────────────────
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (lo, hi) => lo + rnd() * (hi - lo);
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

// ─────────────────────────────────────────────────────────────────────
// Crypton chart of accounts (no edgy labels — neutral industry wording)
// ─────────────────────────────────────────────────────────────────────
const ACCOUNTS = [
  // Revenue (4000-4999)
  { code: "4010", name: "Trading fee revenue · maker (Spot)" },
  { code: "4011", name: "Trading fee revenue · taker (Spot)" },
  { code: "4020", name: "Funding rate revenue (Perpetuals)" },
  { code: "4022", name: "Auto-deleveraging fund contribution (Perpetuals)" },
  { code: "4030", name: "Principal trading PnL (Derivatives)" },
  { code: "4040", name: "Market-maker rebate net (Derivatives)" },
  { code: "4050", name: "RFQ spread net (Institutional)" },
  { code: "4060", name: "Prime brokerage interest income (Institutional)" },
  { code: "4070", name: "Custodial fee income" },
  { code: "4080", name: "Withdrawal fee income" },
  // Operating cost (5000-5999)
  { code: "5000", name: "Liquidation engine operational cost" },
  { code: "5010", name: "Hot-wallet sweep & gas" },
  { code: "5020", name: "Insurance fund top-up" },
  { code: "5100", name: "AWS infrastructure" },
  { code: "5110", name: "Chainalysis (compliance screening)" },
  { code: "5120", name: "Fireblocks custody fee" },
  { code: "5130", name: "Anchorage custody fee" },
  { code: "5200", name: "Marketing & growth" },
  { code: "5300", name: "People · Engineering" },
  { code: "5310", name: "People · Treasury & Finance" },
  { code: "5320", name: "People · Compliance & Legal" },
  { code: "5330", name: "People · Sales & BD" },
  { code: "5400", name: "Licensing & regulatory fees" },
  { code: "5410", name: "Legal · external counsel" },
  { code: "5500", name: "Sanction screening per-K-transaction" },
  { code: "5600", name: "Office & admin" },
];

const COST_CENTRES = [
  "CC-1000 · Group Treasury",
  "CC-2000 · Derivatives BU",
  "CC-2100 · Spot BU",
  "CC-2200 · Institutional / OTC",
  "CC-3000 · Engineering",
  "CC-3100 · Trading systems",
  "CC-3200 · Wallet & custody",
  "CC-4000 · Compliance",
  "CC-4100 · Legal",
  "CC-5000 · Finance Ops",
  "CC-6000 · Marketing",
  "CC-9000 · Corporate",
];

const SOURCES = ["Oracle Cloud GL", "NetSuite import", "Manual entry", "API · trading-engine", "API · custody-bridge"];

// ─────────────────────────────────────────────────────────────────────
// GL_Detail — ~600 rows of May 2026 journal lines
// ─────────────────────────────────────────────────────────────────────
function buildGLDetail() {
  const rows = [];
  // Header row
  rows.push([
    "Date",
    "JournalID",
    "Account",
    "AccountName",
    "CostCenter",
    "Description",
    "DebitUSD",
    "CreditUSD",
    "Source",
  ]);

  // Distribute journals across the month, weighted toward business days
  const DAYS = 31;
  for (let i = 1; i <= 620; i++) {
    const day = Math.max(1, Math.min(DAYS, Math.floor(between(1, DAYS + 1))));
    const acct = pick(ACCOUNTS);
    const isRevenue = acct.code.startsWith("4");
    // Revenue postings: credit. Cost postings: debit.
    const magnitude = Math.exp(between(7, 14.5)); // ~$1K - $2M
    const amount = round(magnitude, 2);
    const cc = pick(COST_CENTRES);
    const desc = isRevenue
      ? pick([
          "Daily settlement · trading engine",
          "EOD funding cycle · perpetuals",
          "OTC trade settled · RFQ",
          "Spot maker rebate net · daily",
          "Listing-pipeline fee · token onboarded",
        ])
      : pick([
          "Vendor invoice · monthly",
          "Payroll accrual",
          "Cloud spend · daily attribution",
          "Custody fee · monthly",
          "Compliance scan · weekly batch",
          "Insurance fund replenishment",
        ]);
    rows.push([
      `2026-05-${String(day).padStart(2, "0")}`,
      `JE-${String(420 + i).padStart(5, "0")}`,
      acct.code,
      acct.name,
      cc,
      desc,
      isRevenue ? 0 : amount,
      isRevenue ? amount : 0,
      pick(SOURCES),
    ]);
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────
// TB_May — trial balance summary by account
// ─────────────────────────────────────────────────────────────────────
function buildTrialBalance(glRows) {
  const summary = new Map();
  for (let i = 1; i < glRows.length; i++) {
    const r = glRows[i];
    const code = r[2];
    const name = r[3];
    const debit = Number(r[6]) || 0;
    const credit = Number(r[7]) || 0;
    const cur = summary.get(code) ?? { name, debit: 0, credit: 0 };
    cur.debit += debit;
    cur.credit += credit;
    summary.set(code, cur);
  }

  const rows = [["Account", "AccountName", "OpeningBalUSD", "DebitsUSD", "CreditsUSD", "ClosingBalUSD"]];
  // Seed deterministic opening balances per account
  let i = 0;
  for (const [code, agg] of [...summary.entries()].sort()) {
    i += 1;
    const opening = round(Math.exp(between(8, 13)) * (code.startsWith("4") ? -1 : 1), 2);
    const debits = round(agg.debit, 2);
    const credits = round(agg.credit, 2);
    const closing = round(opening + debits - credits, 2);
    rows.push([code, agg.name, opening, debits, credits, closing]);
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────
// AP_Aging — vendor invoices outstanding
// ─────────────────────────────────────────────────────────────────────
const VENDORS = [
  { name: "Amazon Web Services", category: "Cloud" },
  { name: "Fireblocks", category: "Custody" },
  { name: "Anchorage Digital", category: "Custody" },
  { name: "Chainalysis", category: "Compliance" },
  { name: "Elliptic", category: "Compliance" },
  { name: "TRM Labs", category: "Compliance" },
  { name: "Refinitiv (LSEG)", category: "Data" },
  { name: "Bloomberg LP", category: "Data" },
  { name: "CoinGecko", category: "Data" },
  { name: "Linklaters LLP", category: "Legal" },
  { name: "Sullivan & Cromwell", category: "Legal" },
  { name: "PwC (audit)", category: "Audit" },
  { name: "Cloudflare", category: "Cloud" },
  { name: "Datadog", category: "Cloud" },
  { name: "Snowflake", category: "Cloud" },
  { name: "Securitize", category: "RegTech" },
  { name: "Sumsub (KYC)", category: "Compliance" },
  { name: "Onfido", category: "Compliance" },
  { name: "Hummingbot Foundation", category: "Software" },
  { name: "Notion Labs", category: "Software" },
];

function buildAPAging() {
  const rows = [["Vendor", "InvoiceID", "InvoiceDate", "DueDate", "AmountUSD", "AgingBucket", "Status", "Category"]];
  const today = new Date("2026-05-28");
  for (let i = 0; i < 247; i++) {
    const v = pick(VENDORS);
    const inv = `INV-${v.name.slice(0, 3).toUpperCase()}-${String(1000 + i).padStart(4, "0")}`;
    const daysOld = Math.floor(between(0, 120));
    const invoiceDate = new Date(today.getTime() - daysOld * 86400000);
    const dueDate = new Date(invoiceDate.getTime() + 30 * 86400000);
    const daysPastDue = Math.max(0, Math.floor((today - dueDate) / 86400000));
    const bucket =
      daysPastDue === 0 ? "Current"
        : daysPastDue <= 30 ? "1-30"
        : daysPastDue <= 60 ? "31-60"
        : daysPastDue <= 90 ? "61-90"
        : "90+";
    const status = daysPastDue > 0 ? "Open · Overdue" : rnd() < 0.7 ? "Open" : "Open · Approved";
    const amount = round(Math.exp(between(7, 13)), 2);
    rows.push([
      v.name,
      inv,
      invoiceDate.toISOString().slice(0, 10),
      dueDate.toISOString().slice(0, 10),
      amount,
      bucket,
      status,
      v.category,
    ]);
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────
// AR_Aging — institutional client receivables
// ─────────────────────────────────────────────────────────────────────
const CLIENTS = [
  { name: "Northstar Capital Partners", tier: "Tier-1 · OTC" },
  { name: "Aurora Trading", tier: "Tier-1 · OTC" },
  { name: "Helios Fund Management", tier: "Tier-2 · Prime" },
  { name: "Pelagic Strategies", tier: "Tier-2 · Prime" },
  { name: "Meridian Quant", tier: "Tier-1 · OTC" },
  { name: "Equinox Digital Assets", tier: "Tier-2 · Prime" },
  { name: "Coastal Block Securities", tier: "Tier-3 · API" },
  { name: "Vector Quantitative", tier: "Tier-2 · Prime" },
  { name: "Ironwood Treasury Services", tier: "Tier-1 · OTC" },
  { name: "Cipher Lakes Capital", tier: "Tier-2 · Prime" },
  { name: "Brightline Liquidity", tier: "Tier-1 · OTC" },
  { name: "Sterling Bridge Markets", tier: "Tier-3 · API" },
];

function buildARAging() {
  const rows = [["Client", "InvoiceID", "InvoiceDate", "DueDate", "AmountUSD", "AgingBucket", "Status", "Tier"]];
  const today = new Date("2026-05-28");
  for (let i = 0; i < 64; i++) {
    const c = pick(CLIENTS);
    const inv = `AR-${c.name.slice(0, 3).toUpperCase()}-${String(2026000 + i).padStart(7, "0")}`;
    const daysOld = Math.floor(between(0, 60));
    const invoiceDate = new Date(today.getTime() - daysOld * 86400000);
    const dueDate = new Date(invoiceDate.getTime() + 14 * 86400000);
    const daysPastDue = Math.max(0, Math.floor((today - dueDate) / 86400000));
    const bucket =
      daysPastDue === 0 ? "Current"
        : daysPastDue <= 15 ? "1-15"
        : daysPastDue <= 30 ? "16-30"
        : "30+";
    const status = daysPastDue > 30 ? "Open · Collection" : daysPastDue > 0 ? "Open · Past Due" : "Open";
    const amount = round(Math.exp(between(10, 14.5)), 2);
    rows.push([c.name, inv, invoiceDate.toISOString().slice(0, 10), dueDate.toISOString().slice(0, 10), amount, bucket, status, c.tier]);
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────
// Compose workbook and write XLSX
// ─────────────────────────────────────────────────────────────────────
function aoaToSheet(rows) {
  return XLSX.utils.aoa_to_sheet(rows);
}

function makeWorkbookGL() {
  const wb = XLSX.utils.book_new();
  const gl = buildGLDetail();
  const tb = buildTrialBalance(gl);
  const ap = buildAPAging();
  const ar = buildARAging();

  XLSX.utils.book_append_sheet(wb, aoaToSheet(gl), "GL_Detail");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(tb), "TB_May");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(ap), "AP_Aging");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(ar), "AR_Aging");
  return wb;
}

// ─────────────────────────────────────────────────────────────────────
// Treasury workbook — wallets · banks · 24h transactions
// ─────────────────────────────────────────────────────────────────────

const CHAINS = ["Bitcoin", "Ethereum", "Solana", "Tron", "Polygon", "Arbitrum"];
const WALLET_LABELS = {
  Bitcoin: ["BTC-Hot-01", "BTC-Hot-02", "BTC-Warm-01", "BTC-Cold-01", "BTC-Cold-02"],
  Ethereum: ["ETH-Hot-01", "ETH-Hot-02", "ETH-Warm-01", "ETH-Cold-01", "ETH-Cold-02"],
  Solana: ["SOL-Hot-01", "SOL-Warm-01", "SOL-Cold-01"],
  Tron: ["TRX-Hot-01", "TRX-Warm-01"],
  Polygon: ["MATIC-Hot-01", "MATIC-Warm-01", "MATIC-Cold-01"],
  Arbitrum: ["ARB-Hot-01", "ARB-Warm-01", "ARB-Cold-01"],
};
const CUSTODY_FOR_CLASS = {
  Hot: "Fireblocks",
  Warm: "Fireblocks",
  Cold: "Anchorage Digital",
};

function buildWallets() {
  const rows = [["WalletID", "Chain", "Class", "Custody", "BalanceUSD", "LastSyncUTC", "WhitelistMembers"]];
  for (const chain of CHAINS) {
    for (const label of WALLET_LABELS[chain] ?? []) {
      const cls = label.includes("Hot") ? "Hot" : label.includes("Warm") ? "Warm" : "Cold";
      const balance =
        cls === "Cold"
          ? Math.exp(between(19, 21.5))   // ~150M-3B in cold
          : cls === "Warm"
            ? Math.exp(between(16, 18.5)) // ~10M-100M in warm
            : Math.exp(between(13.5, 16)); // ~700K-9M in hot
      rows.push([
        label,
        chain,
        cls,
        CUSTODY_FOR_CLASS[cls],
        round(balance, 0),
        `2026-05-28T03:${pick(["12", "22", "34", "48"])}:${pick(["09", "21", "33", "47"])}Z`,
        Math.floor(between(6, 24)),
      ]);
    }
  }
  return rows;
}

const BANKS = [
  { name: "JPMorgan Chase · USD", jurisdiction: "US", ccy: "USD" },
  { name: "HSBC · GBP / EUR multi-ccy", jurisdiction: "UK", ccy: "GBP" },
  { name: "DBS Singapore · SGD", jurisdiction: "SG", ccy: "SGD" },
  { name: "Standard Chartered HK · HKD", jurisdiction: "HK", ccy: "HKD" },
  { name: "Emirates NBD · AED", jurisdiction: "AE", ccy: "AED" },
  { name: "Butterfield Cayman · USD", jurisdiction: "KY", ccy: "USD" },
  { name: "Sygnum Bank · CHF / USD", jurisdiction: "CH", ccy: "CHF" },
];

function buildBanks() {
  const rows = [["BankAccount", "Jurisdiction", "Currency", "BalanceUSDEquiv", "Status"]];
  for (const b of BANKS) {
    const usdEquiv = round(Math.exp(between(15, 18.5)), 0); // ~3M-100M
    rows.push([b.name, b.jurisdiction, b.ccy, usdEquiv, "Active"]);
  }
  return rows;
}

const TXN_CATEGORIES = ["Operational", "Customer flow", "Hedging", "Inter-co", "Other"];
const COUNTERPARTIES = [
  "Fireblocks API",
  "Anchorage Digital",
  "JPMorgan ACH",
  "DBS SWIFT",
  "HSBC SWIFT",
  "Northstar Capital OTC",
  "Aurora Trading OTC",
  "Meridian Quant OTC",
  "User-deposit batch",
  "User-withdrawal batch",
  "AWS billing",
  "Chainalysis billing",
  "Inter-co · Group SG",
  "Inter-co · Group CH",
  "Settlement sweep",
];

function buildTransactions() {
  const rows = [
    ["Timestamp", "Counterparty", "Category", "AmountUSD", "Direction", "WalletOrBank", "ClassifiedBy"],
  ];
  const base = new Date("2026-05-28T03:30:00Z").getTime();
  for (let i = 0; i < 1247; i++) {
    const dt = new Date(base - Math.floor(between(0, 86400)) * 1000);
    const cat = pick(TXN_CATEGORIES);
    const amount = round(Math.exp(between(6, 16.5)), 2);
    const direction = pick(["in", "out", "out", "in"]);
    const isAnomaly = i < 2;
    rows.push([
      dt.toISOString(),
      isAnomaly
        ? i === 0
          ? "0xNEW...new-whitelist"
          : "Hot-04 (off-hours)"
        : pick(COUNTERPARTIES),
      cat,
      isAnomaly ? (i === 0 ? 42_000_000 : amount) : amount,
      direction,
      pick(["ETH-Hot-01", "BTC-Hot-01", "USDT-Hot-01", "JPM-USD", "DBS-SGD"]),
      Math.random() < 0.94 ? "AI auto" : "Human review",
    ]);
  }
  return rows;
}

function makeWorkbookTreasury() {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, aoaToSheet(buildWallets()), "Wallets");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(buildBanks()), "BankAccounts");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(buildTransactions()), "Transactions_24h");
  return wb;
}

// ─────────────────────────────────────────────────────────────────────
// Emit both workbooks
// ─────────────────────────────────────────────────────────────────────

function emit(wb, name) {
  const outPath = resolve(OUT_DIR, name);
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  writeFileSync(outPath, buf);
  console.log(`Wrote ${outPath}`);
  console.log(`  Sheets: ${wb.SheetNames.join(", ")}`);
  console.log(`  Size: ${(buf.length / 1024).toFixed(1)} KB`);
}

// ─────────────────────────────────────────────────────────────────────
// BP packet — 4 business lines × monthly P&L × unit-economics roll
// ─────────────────────────────────────────────────────────────────────

const BP_LINES = ["Derivatives", "Spot", "Institutional", "Compliance"];
const BP_MONTHS = ["2026-04", "2026-05", "2026-06-forecast"];

function buildBusinessLines() {
  return [
    ["BusinessLine", "Owner", "HeadcountFY", "Q2RevenueUSD", "Q2OpExUSD", "Q2NetUSD", "MarginPct"],
    ["Derivatives", "Sara Lim", 38, 145_312_000, 19_840_000, 125_472_000, 0.863],
    ["Spot", "Marcus Chen", 22, 33_280_000, 6_840_000, 26_440_000, 0.794],
    ["Institutional", "James Park", 17, 49_100_000, 6_300_000, 42_800_000, 0.871],
    ["Compliance", "Priya Iyer", 24, 2_840_000, 9_800_000, -6_960_000, -2.45],
  ];
}

function buildMonthlyPnL() {
  const rows = [["BusinessLine", "Month", "AccountCode", "AccountName", "AmountUSD"]];
  const lineAccounts = {
    Derivatives: [
      ["4020", "Funding rate revenue", [27_440_000, 31_142_211, 30_500_000]],
      ["4022", "Auto-deleveraging fund contribution", [9_120_000, 11_504_780, 10_800_000]],
      ["4030", "Principal trading PnL", [4_780_000, 4_412_330, 4_600_000]],
      ["4040", "Market-maker rebate net", [5_220_000, 5_018_117, 5_100_000]],
      ["5000", "Liquidation engine operational cost", [-720_000, -851_212, -800_000]],
      ["5020", "Insurance fund top-up", [-1_200_000, -1_410_500, -1_300_000]],
      ["5300", "People · Engineering & desk", [-3_200_000, -3_240_000, -3_280_000]],
    ],
    Spot: [
      ["4010", "Trading fee revenue · maker", [3_120_000, 3_437_947, 3_500_000]],
      ["4011", "Trading fee revenue · taker", [7_840_000, 8_217_503, 8_400_000]],
      ["4080", "Withdrawal fee income", [240_000, 264_000, 280_000]],
      ["5200", "Marketing & growth", [-1_240_000, -980_500, -1_100_000]],
      ["5300", "People · BU", [-1_800_000, -1_810_000, -1_820_000]],
    ],
    Institutional: [
      ["4050", "RFQ spread net", [13_770_000, 13_932_504, 14_100_000]],
      ["4060", "Prime brokerage interest income", [2_310_000, 2_417_905, 2_450_000]],
      ["4070", "Custodial fee income", [600_000, 612_000, 620_000]],
      ["5300", "People · sales & ops", [-2_000_000, -2_040_000, -2_080_000]],
    ],
    Compliance: [
      ["4500", "Sanction-screen pass-through fee", [240_000, 248_000, 250_000]],
      ["5320", "People · Compliance & Legal", [-1_640_000, -1_780_300, -1_900_000]],
      ["5410", "Legal · external counsel", [-410_000, -612_400, -650_000]],
      ["5500", "Sanction screening per-K-tx cost", [-88_000, -102_300, -105_000]],
      ["5400", "Licensing & regulatory fees", [-420_000, -440_000, -460_000]],
    ],
  };
  for (const line of BP_LINES) {
    for (const [code, name, monthly] of lineAccounts[line]) {
      for (let i = 0; i < BP_MONTHS.length; i++) {
        rows.push([line, BP_MONTHS[i], code, name, monthly[i]]);
      }
    }
  }
  return rows;
}

function buildUnitEconomics() {
  return [
    ["BusinessLine", "Metric", "Value", "Unit"],
    ["Derivatives", "Funding rate days positive (Q2)", 53, "days of 63"],
    ["Derivatives", "Avg daily liquidation revenue", 540_000, "USD"],
    ["Derivatives", "Insurance fund coverage ratio", 1.62, "x"],
    ["Spot", "Maker-taker fee mix", "31/69", "%"],
    ["Spot", "Listing pipeline ROI (TTM)", 4.2, "x"],
    ["Spot", "New token onboards Q2", 5, "tokens"],
    ["Institutional", "RFQ avg spread", 7.2, "bps"],
    ["Institutional", "Active Tier-1 OTC clients", 12, "count"],
    ["Institutional", "Prime brokerage utilisation", 0.68, "ratio"],
    ["Compliance", "License runway", 47, "months at burn"],
    ["Compliance", "Sanction screen cost per K-tx", 0.40, "USD"],
    ["Compliance", "KYC throughput cost per onboard", 18.40, "USD"],
  ];
}

function makeWorkbookBP() {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, aoaToSheet(buildBusinessLines()), "BusinessLines");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(buildMonthlyPnL()), "MonthlyPnL");
  XLSX.utils.book_append_sheet(wb, aoaToSheet(buildUnitEconomics()), "UnitEconomics");
  return wb;
}

emit(makeWorkbookGL(), "crypton-may-gl-extract.xlsx");
emit(makeWorkbookTreasury(), "crypton-treasury-statements.xlsx");
emit(makeWorkbookBP(), "crypton-q2-bp-packet.xlsx");
