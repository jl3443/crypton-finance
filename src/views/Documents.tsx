import { useState } from "react";
import { useApp, type DocId } from "@/state";
import { TopRow } from "@/components/blocks/TopRow";
import { HeroBanner } from "@/components/blocks/HeroBanner";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { SpringIn } from "@/components/ai/SpringIn";
import { CountUp } from "@/components/ai/CountUp";
import { cn } from "@/lib/utils";
import { FileText, ShieldCheck, Megaphone, Sparkles } from "lucide-react";

type Category = "policy" | "letter" | "announcement";

type Doc = {
  id: DocId;
  title: string;
  sub: string;
  country: string;
  flag: string;
  category: Category;
  status: "Draft" | "Approved" | "Filed" | "Sent";
  agent: string;
  updated: string;
  reads?: number;
};

const documents: Doc[] = [
  {
    id: "working-hours-act",
    title: "German Working Hours Act amendment",
    sub: "Source law · §3 ArbZG · workweek 40h → 37.5h",
    country: "Germany",
    flag: "🇩🇪",
    category: "policy",
    status: "Filed",
    agent: "Compliance agent",
    updated: "Today · 7:14 AM",
  },
  {
    id: "handbook-redline",
    title: "Employee handbook · Section 4 redline",
    sub: "Working hours clause updated to match the new ArbZG amendment",
    country: "Germany",
    flag: "🇩🇪",
    category: "policy",
    status: "Draft",
    agent: "Policy agent",
    updated: "Today · 7:16 AM",
  },
  {
    id: "works-council-notice",
    title: "Works council notice · §87 (1) Nr. 2 BetrVG",
    sub: "Required Betriebsrat notification for the workweek change",
    country: "Germany",
    flag: "🇩🇪",
    category: "policy",
    status: "Filed",
    agent: "Compliance agent",
    updated: "Today · 7:16 AM",
  },
  {
    id: "employee-announcement",
    title: "Workweek change · employee announcement",
    sub: "Bilingual letter · German + English · 147 recipients",
    country: "Germany",
    flag: "🇩🇪",
    category: "announcement",
    status: "Sent",
    agent: "Comms agent",
    updated: "Today · 7:18 AM",
    reads: 132,
  },
  {
    id: "termination-letter",
    title: "Offboarding letter · Sabine H.",
    sub: "Senior R&D · Heidelberg · final day 23 May · German + English",
    country: "Germany",
    flag: "🇩🇪",
    category: "letter",
    status: "Draft",
    agent: "Lifecycle agent",
    updated: "Yesterday · 10:42 AM",
  },
  {
    id: "comp-deliverables",
    title: "Retention package · Marcus C.",
    sub: "Senior Engineer · San Francisco · 3-scenario brief with budget impact",
    country: "USA",
    flag: "🇺🇸",
    category: "letter",
    status: "Approved",
    agent: "Compensation agent",
    updated: "Today · 11:05 AM",
  },
  {
    id: "employment-verification",
    title: "Employment verification · Liam O'Connor",
    sub: "Standard mortgage letter · auto-issued in 32 seconds",
    country: "Ireland",
    flag: "🇮🇪",
    category: "letter",
    status: "Sent",
    agent: "Self-service agent",
    updated: "Today · 9:11 AM",
    reads: 1,
  },
  {
    id: "coverage-plan",
    title: "Parental leave coverage plan · Aurélie L.",
    sub: "France · 12-week plan with handover map and re-onboarding checklist",
    country: "France",
    flag: "🇫🇷",
    category: "letter",
    status: "Draft",
    agent: "Lifecycle agent",
    updated: "Today · 8:42 AM",
  },
];

const tabs: {
  id: "letters" | "policies";
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  match: Category[];
  blurb: string;
}[] = [
  {
    id: "letters",
    label: "Letters & announcements",
    Icon: FileText,
    match: ["letter", "announcement"],
    blurb:
      "Every letter the agent drafts, sends, or files on behalf of an HRBP — offboarding, retention, mortgage proof, coverage plans, employee announcements.",
  },
  {
    id: "policies",
    label: "Policies & compliance",
    Icon: ShieldCheck,
    match: ["policy"],
    blurb:
      "Source-of-truth compliance artifacts the agent maintains — labor-law sources, handbook redlines, works council notices.",
  },
];

const statusTone: Record<Doc["status"], string> = {
  Draft: "bg-surface-fog text-mute",
  Approved: "bg-surface-mint text-surface-deep",
  Filed: "bg-surface-deep text-ink-inverse",
  Sent: "bg-accent-green text-ink-inverse",
};

const categoryIcon: Record<Category, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  policy: ShieldCheck,
  letter: FileText,
  announcement: Megaphone,
};

export function Documents({ tab }: { tab: "letters" | "policies" }) {
  const { go } = useApp();
  const [active, setActive] = useState<"letters" | "policies">(tab);
  const [hover, setHover] = useState<DocId | null>(null);
  const activeTab = tabs.find((t) => t.id === active)!;
  const visible = documents.filter((d) => activeTab.match.includes(d.category));

  const totalAgents = new Set(visible.map((d) => d.agent)).size;
  const sentOrFiled = visible.filter((d) => d.status === "Sent" || d.status === "Filed").length;
  const drafts = visible.filter((d) => d.status === "Draft").length;
  const totalReads = visible.reduce((a, b) => a + (b.reads ?? 0), 0);

  return (
    <div className="pl-5 pr-6 pt-4 pb-8 space-y-3 min-h-screen bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <TopRow
        breadcrumb={{
          label: active === "letters" ? "Letters" : "Policies",
          chip: "Document library",
        }}
      />

      <HeroBanner
        eyebrow="Every document the agent owns"
        summary={`${visible.length} ${active === "letters" ? "letters and announcements" : "compliance artifacts"} drafted, filed, or sent in the last 30 days — every change linked back to the case that triggered it.`}
        cta={<PillButton variant="deep" size="sm">+ Request new draft</PillButton>}
        meta="Refreshed 2 min ago"
      />

      {/* Tab switcher */}
      <div className="bg-white border border-divider rounded-md p-1 flex gap-1 max-w-fit">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={cn(
                "ui-pill flex items-center gap-2 px-3 py-2 rounded text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-surface-deep text-ink-inverse"
                  : "text-ink hover:bg-surface-mint/40",
              )}
            >
              <t.Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
              {t.label}
              <span
                className={cn(
                  "text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-white/15 text-ink-inverse" : "bg-surface-fog text-mute",
                )}
              >
                {documents.filter((d) => t.match.includes(d.category)).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* KPI strip — derived from the active tab */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total in library", value: visible.length, sub: activeTab.label.toLowerCase() },
          {
            label: active === "letters" ? "Sent / filed" : "Filed",
            value: sentOrFiled,
            sub: `${Math.round((sentOrFiled / visible.length) * 100)}% of library`,
          },
          { label: "Awaiting approval", value: drafts, sub: drafts ? "needs HRBP sign-off" : "all caught up" },
          active === "letters"
            ? { label: "Total reads", value: totalReads, sub: "across employees" }
            : { label: "Agents involved", value: totalAgents, sub: "across artifacts" },
        ].map((k, i) => (
          <SpringIn key={k.label} delay={i * 70}>
            <article className="bg-white border border-divider rounded-md px-4 py-3 h-[92px] flex flex-col justify-between">
              <div className="text-[12px] tracking-[0.08em] uppercase text-mute font-medium">
                {k.label}
              </div>
              <div>
                <div className="text-[24px] leading-[28px] font-bold tracking-[-0.02em] text-ink tabular-nums">
                  <CountUp to={k.value} duration={900} delay={i * 90} grouped />
                </div>
                <div className="text-[11px] text-mute mt-0.5">{k.sub}</div>
              </div>
            </article>
          </SpringIn>
        ))}
      </div>

      {/* Document table — real <table> with table-fixed so every row shares
          the same column model (uniform vertical column edges across rows). */}
      <section className="bg-white border border-divider rounded-md overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" pulse />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              {activeTab.label} · {visible.length} items
            </span>
          </div>
          <span className="text-[11px] text-mute">{activeTab.blurb}</span>
        </header>
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "38%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "110px" }} />
          </colgroup>
          <thead className="bg-surface-deep text-ink-inverse">
            <tr>
              {["Document", "Country", "Status", "Agent", "Updated", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-[11px] tracking-[0.08em] uppercase font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((d, i) => {
              const CategoryIcon = categoryIcon[d.category];
              const isHover = hover === d.id;
              return (
                <tr
                  key={d.id}
                  onMouseEnter={() => setHover(d.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => go({ kind: "doc", id: d.id })}
                  title={`${d.title} · ${d.updated}`}
                  className={cn(
                    "ai-stream cursor-pointer border-t border-divider transition-colors",
                    isHover ? "bg-surface-mint/40" : "bg-white",
                  )}
                  style={{ animationDelay: `${150 + i * 70}ms` }}
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-colors",
                          isHover
                            ? "bg-surface-deep text-ink-inverse"
                            : "bg-surface-fog text-surface-deep",
                        )}
                      >
                        <CategoryIcon size={16} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium text-ink truncate">{d.title}</div>
                        <div className="text-[12px] text-mute truncate">{d.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2 text-[13px] text-ink min-w-0">
                      <span aria-hidden>{d.flag}</span>
                      <span className="truncate">{d.country}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] tracking-[0.04em] font-medium shrink-0",
                          statusTone[d.status],
                        )}
                      >
                        {d.status}
                      </span>
                      {d.reads != null && (
                        <span className="text-[11px] text-mute truncate">{d.reads} reads</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-1.5 text-[13px] min-w-0">
                      <Sparkles size={12} strokeWidth={1.8} className="text-surface-deep shrink-0" />
                      <span className="text-surface-deep font-medium truncate">{d.agent}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-[12px] text-mute truncate">
                    {d.updated}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex justify-end">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold transition-colors whitespace-nowrap",
                          isHover
                            ? "bg-ink text-ink-inverse"
                            : "bg-white border border-ink/30 text-ink",
                        )}
                      >
                        Open <span aria-hidden>→</span>
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Footer rail — companion info to balance the page */}
      <section className="bg-white border border-divider rounded-md overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              How the agent uses {active === "letters" ? "letters" : "policies"}
            </span>
          </div>
          <span className="text-[11px] text-mute">Reference · always-on</span>
        </header>
        <div className="grid grid-cols-3 divide-x divide-divider">
          {(active === "letters"
            ? [
                {
                  title: "Draft from the case",
                  body:
                    "Every letter starts from a live case — lifecycle, retention, leave — so the right facts and tone land on the first pass.",
                },
                {
                  title: "Localize automatically",
                  body:
                    "Bilingual + region-specific templates ship by default · the agent picks the locale from the employee record.",
                },
                {
                  title: "Send + audit in one step",
                  body:
                    "On HRBP sign-off the agent posts to Workday, emails the recipient, and writes the audit entry simultaneously.",
                },
              ]
            : [
                {
                  title: "Read the source",
                  body:
                    "The agent pulls the actual regulation (ArbZG, BetrVG, EU directive) and stores it as the immutable basis for every downstream artifact.",
                },
                {
                  title: "Redline the handbook",
                  body:
                    "Section-by-section diff against the source law · every change traceable to a paragraph in the original text.",
                },
                {
                  title: "File with the works council",
                  body:
                    "Where co-determination applies, the agent writes the notice, attaches the redline, and tracks the response window.",
                },
              ]
          ).map((c) => (
            <article
              key={c.title}
              className="px-4 py-3 space-y-1.5 hover:bg-surface-mint/40 transition-colors"
            >
              <div className="text-[13px] font-bold text-ink">{c.title}</div>
              <p className="text-[12px] text-mute leading-[18px]">{c.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
