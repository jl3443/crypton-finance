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

const wb = makeWorkbookGL();
const outPath = resolve(OUT_DIR, "crypton-may-gl-extract.xlsx");
const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
writeFileSync(outPath, buf);
console.log(`Wrote ${outPath}`);
console.log(`  Sheets: ${wb.SheetNames.join(", ")}`);
console.log(`  Size: ${(buf.length / 1024).toFixed(1)} KB`);
