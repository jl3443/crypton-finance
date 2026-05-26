import * as React from "react";
import { cn } from "@/lib/utils";
import { useApp, type DocId } from "@/state";

/**
 * Shared building blocks for the hand-built finance docs.
 * Centralises the provenance side-rail + cross-link chips so every doc
 * has the same "we know where this came from" affordance.
 */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
      {children}
    </div>
  );
}

export function DocHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="space-y-2 pb-6 border-b border-divider">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-[40px] leading-[1.05] tracking-[-0.02em] text-ink">{title}</h1>
      {subtitle && (
        <p className="text-[14px] text-mute leading-[20px] max-w-[640px]">{subtitle}</p>
      )}
    </header>
  );
}

export function Provenance({
  source,
  generatedAt,
  model = "claude-opus-4-7 (1M ctx)",
  auditId = "JE-AUDIT-2026-05",
  notes,
}: {
  source: string;
  generatedAt: string;
  model?: string;
  auditId?: string;
  notes?: string;
}) {
  return (
    <div className="bg-white border border-divider rounded-md p-5 space-y-3">
      <Eyebrow>Provenance</Eyebrow>
      <dl className="space-y-1.5 text-[12px] leading-[18px]">
        <Row label="Source" value={source} />
        <Row label="Generated" value={generatedAt} />
        <Row label="Model" value={model} />
        <Row label="Audit trail" value={auditId} />
      </dl>
      {notes && <p className="text-[12px] text-mute leading-[18px] pt-1">{notes}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-mute">{label}</dt>
      <dd className="text-ink font-medium text-right truncate max-w-[180px]">{value}</dd>
    </div>
  );
}

export function CrossLinks({ links }: { links: { id: DocId; label: string }[] }) {
  const { go } = useApp();
  if (!links.length) return null;
  return (
    <div className="bg-white border border-divider rounded-md p-5 space-y-3">
      <Eyebrow>Related documents</Eyebrow>
      <div className="flex flex-col gap-1.5">
        {links.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => go({ kind: "doc", id: l.id })}
            className="ui-pill text-left text-[12px] text-ink hover:text-surface-deep underline decoration-divider decoration-2 underline-offset-[3px] hover:decoration-surface-deep flex items-center justify-between gap-2"
          >
            <span className="truncate">{l.label}</span>
            <span aria-hidden>↗</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatRow({
  items,
}: {
  items: { label: string; value: string; tone?: "ink" | "ok" | "warn" }[];
}) {
  return (
    <dl className="grid grid-cols-4 gap-5">
      {items.map((it) => (
        <div key={it.label}>
          <dt className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-1">
            {it.label}
          </dt>
          <dd
            className={cn(
              "text-[22px] leading-[26px] font-bold tracking-[-0.01em]",
              it.tone === "warn" ? "text-mark-red" : it.tone === "ok" ? "text-[var(--ok)]" : "text-ink",
            )}
          >
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function fmtUSD(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function fmtPct(n: number, decimals = 1) {
  return `${(n * 100).toFixed(decimals)}%`;
}
