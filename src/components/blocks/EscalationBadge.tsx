import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { useApp } from "@/state";
import { cn } from "@/lib/utils";

/**
 * Small "bot head" badge that sits in every HRBP TopRow. When an Employee
 * chat sends "escalate", a row appears here so the HRBP can see who's
 * trying to reach a human.
 */
export function EscalationBadge() {
  const { escalations, clearEscalations } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const count = escalations.length;
  const hasNew = count > 0;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={hasNew ? `${count} employee escalation${count === 1 ? "" : "s"}` : "Employee escalations"}
        className={cn(
          "ui-pill w-10 h-10 rounded-md border flex items-center justify-center transition-colors",
          hasNew
            ? "bg-white border-divider text-surface-deep hover:bg-surface-mint/40"
            : "bg-white border-divider text-mute hover:text-ink hover:bg-surface-fog",
        )}
      >
        <Bot size={18} strokeWidth={1.8} />
        {hasNew && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-mark-red text-ink-inverse text-[10px] font-bold leading-4 text-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[320px] bg-white border border-divider rounded-md shadow-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-divider flex items-center justify-between">
            <span className="text-[12px] tracking-[0.08em] uppercase text-surface-deep font-medium">
              Employee escalations
            </span>
            {hasNew && (
              <button
                type="button"
                onClick={() => {
                  clearEscalations();
                  setOpen(false);
                }}
                className="ui-pill text-[11px] text-mute hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
          {hasNew ? (
            <ul className="max-h-[320px] overflow-y-auto divide-y divide-divider">
              {escalations.map((e) => (
                <li key={e.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 text-[12px] text-mute mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-mark-red animate-pulse" />
                    <span>{e.at}</span>
                  </div>
                  <div className="text-[14px] font-bold text-ink leading-tight">
                    {e.employee} is trying to reach a human
                  </div>
                  <div className="text-[12px] text-mute mt-1 leading-snug">{e.reason}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-[13px] text-mute">
              No employees waiting. We'll ping you here if anyone escalates.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
