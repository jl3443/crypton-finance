import { countries } from "@/data/cases";
import { StatusPill } from "@/components/blocks/StatusPill";
import { AIDot } from "@/components/ai/AIDot";

const headers = [
  { label: "Country", width: "w-[24%]" },
  { label: "Employees", width: "w-[12%]" },
  { label: "Active cases", width: "w-[12%]" },
  { label: "AI activity (24h)", width: "w-[28%]" },
  { label: "Status", width: "w-[24%]" },
];

export function WorkforceTable() {
  return (
    <section className="bg-white border border-divider rounded-md overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-divider">
        <div className="flex items-center gap-3">
          <AIDot size={6} tone="deep" />
          <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Multi-country workforce snapshot
          </span>
        </div>
        <span className="text-[12px] text-mute">Last updated 2 min ago</span>
      </header>
      <div className="grid grid-cols-[24%_12%_12%_28%_24%] bg-surface-deep text-ink-inverse">
        {headers.map((h) => (
          <div
            key={h.label}
            className="px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium"
          >
            {h.label}
          </div>
        ))}
      </div>
      {countries.map((c) => (
        <div
          key={c.country}
          className="grid grid-cols-[24%_12%_12%_28%_24%] items-center px-0 border-t border-divider first:border-t-0 hover:bg-surface-mint/40 transition-colors"
        >
          <div className="px-4 py-2.5 flex items-center gap-2.5 text-[14px] text-ink">
            <span aria-hidden>{c.flag}</span>
            <span>{c.country}</span>
          </div>
          <div className="px-4 py-2.5 text-[14px] text-ink">{c.employees}</div>
          <div className="px-4 py-2.5 text-[14px] text-ink">{c.cases}</div>
          <div className="px-4 py-2.5 text-[13px] text-mute">{c.activity}</div>
          <div className="px-4 py-2.5">
            <StatusPill label={c.status} kind={c.statusKind} />
          </div>
        </div>
      ))}
    </section>
  );
}
