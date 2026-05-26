import * as React from "react";
import { useApp } from "@/state";
import { PillButton } from "@/components/blocks/PillButton";

/**
 * When set, DocChrome renders its body without the outer fog background and
 * top header. Used by the employee split-screen where the surrounding panel
 * already owns the back / breadcrumb chrome.
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
  // Label the back button based on the previous view, so the chrome reads
  // truthfully whether you came from a workspace, the dashboard, or the chat.
  const prev = history[history.length - 1];
  const backLabel =
    prev?.kind === "workspace"
      ? "Back to workspace"
      : prev?.kind === "employee-chat"
        ? "Back to chat"
        : prev?.kind === "employee-landing"
          ? "Back to home"
          : prev?.kind === "compliance-radar"
            ? "Back to compliance radar"
            : "Back to dashboard";

  if (embedded) {
    // Strip the redundant "Document · " preamble so the inline title reads
    // cleanly inside the split-screen pane.
    const cleanTitle = title.replace(/^Document\s·\s/i, "");
    return (
      <div className="px-6 pt-5 pb-10">
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
          </div>
        </div>
        {/* In the split-screen we have ~2/3 of the viewport — wide enough
            to keep the doc body + side rail side-by-side, but with a
            slimmer rail than the full-page chrome. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">{children}</div>
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
        <div className="w-full max-w-[1100px] grid grid-cols-[1fr_320px] gap-6">{children}</div>
      </div>
    </div>
  );
}

/** Paper container — white card with comfortable padding. */
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

/** Right rail under the paper — for AI summary / metadata cards. */
export function SideRail({ children }: { children: React.ReactNode }) {
  return <aside className="space-y-4">{children}</aside>;
}
