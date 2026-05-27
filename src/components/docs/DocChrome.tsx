import * as React from "react";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useApp } from "@/state";
import { PillButton } from "@/components/blocks/PillButton";
import { cn } from "@/lib/utils";

/**
 * When set, DocChrome renders its body without the outer fog background and
 * top header. Embedded mode is used inside workspace step content.
 */
export const EmbeddedDocContext = React.createContext(false);

export function DocChrome({
  title,
  primary,
  secondary,
  children,
}: {
  title: string;
  primary?: { label: string; onClick?: () => void };
  secondary?: { label: string; onClick?: () => void };
  children: React.ReactNode;
}) {
  const embedded = React.useContext(EmbeddedDocContext);
  const { back, history } = useApp();
  const [fullscreen, setFullscreen] = useState(false);
  const prev = history[history.length - 1];
  const backLabel =
    prev?.kind === "workspace"
      ? "Back to workspace"
      : prev?.kind === "export"
        ? "Back to export"
        : "Back to hub";

  if (embedded) {
    const cleanTitle = title.replace(/^Document\s·\s/i, "");
    return (
      <div
        className={cn(
          fullscreen
            ? "fixed inset-0 z-50 bg-surface-fog overflow-auto px-10 pt-6 pb-12"
            : "px-6 pt-5 pb-10",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="text-[14px] font-bold text-ink min-w-0 truncate max-w-full">
            {cleanTitle}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {secondary && (
              <PillButton variant="secondary" size="sm" onClick={secondary.onClick}>
                {secondary.label}
              </PillButton>
            )}
            {primary && (
              <PillButton variant="primary" size="sm" onClick={primary.onClick}>
                {primary.label}
              </PillButton>
            )}
            <button
              type="button"
              onClick={() => setFullscreen((v) => !v)}
              title={fullscreen ? "Exit fullscreen" : "Maximize"}
              className="ui-pill grid w-8 h-8 place-items-center rounded-md border border-divider hover:bg-surface-mint hover:border-surface-deep transition-colors"
            >
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
        {/* Paper full width on top, SideRail's children flow into a 2-col grid below */}
        <div className="space-y-5">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-fog">
      <header className="bg-white border-b border-divider px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            onClick={back}
            className="ui-pill text-[13px] text-ink hover:text-surface-deep flex items-center gap-1.5"
          >
            <span aria-hidden>←</span>
            {backLabel}
          </button>
          <span className="w-px h-5 bg-divider" />
          <div className="text-[15px] font-bold text-ink truncate">{title}</div>
        </div>
        <div className="flex items-center gap-2.5">
          {secondary && (
            <PillButton variant="secondary" onClick={secondary.onClick}>
              {secondary.label}
            </PillButton>
          )}
          {primary && (
            <PillButton variant="primary" onClick={primary.onClick}>
              {primary.label}
            </PillButton>
          )}
        </div>
      </header>
      <div className="flex justify-center px-10 py-10">
        {/* Full-width stacked layout: Paper full width, SideRail children flow into a 2-col grid below. */}
        <div className="w-full max-w-[1280px] space-y-6">{children}</div>
      </div>
    </div>
  );
}

/** Paper container — white card with comfortable padding. Always full width
 *  of the surrounding stack so tables/charts get the room they need. */
export function Paper({ children }: { children: React.ReactNode }) {
  const embedded = React.useContext(EmbeddedDocContext);
  return (
    <article
      className={
        embedded
          ? "bg-white border border-divider rounded-md p-8 space-y-4"
          : "bg-white border border-divider rounded-md p-14 space-y-5 min-h-[600px]"
      }
    >
      {children}
    </article>
  );
}

/** SideRail — its children (Provenance / CrossLinks / etc.) flow into a
 *  2-column grid below the Paper. On narrow viewports they stack 1-column. */
export function SideRail({ children }: { children: React.ReactNode }) {
  return (
    <aside className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</aside>
  );
}
