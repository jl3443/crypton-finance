import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Generic centered modal used by the UC4 onboarding flow for offer letter,
 * preboarding artifacts, 30/60/90 calendar, and signable contract previews.
 *
 * Visual contract: DSM-F — white rounded card, mint header eyebrow, divider
 * footer, soft backdrop. Locks body scroll while open.
 */
export function PreviewModal({
  open,
  onClose,
  eyebrow,
  title,
  sub,
  width = 720,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  sub?: string;
  width?: number;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setVisible(true), 20);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    setVisible(false);
    document.body.style.overflow = "";
  }, [open]);

  if (!open) return null;

  const close = () => {
    setVisible(false);
    window.setTimeout(onClose, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <article
        className={cn(
          "relative w-full bg-white rounded-[16px] overflow-hidden flex flex-col max-h-[88vh]",
          "shadow-[0_30px_80px_rgba(8,67,55,0.35)] transition-all duration-300",
        )}
        style={{
          maxWidth: width,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(12px) scale(0.97)",
        }}
      >
        <header className="px-6 py-4 border-b border-divider flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 space-y-0.5">
            {eyebrow && (
              <div className="text-[10px] tracking-[0.08em] uppercase text-surface-deep font-bold">
                {eyebrow}
              </div>
            )}
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">{title}</h2>
            {sub && <p className="text-[12px] text-mute">{sub}</p>}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="ui-pill w-8 h-8 rounded-full border border-divider flex items-center justify-center text-ink hover:bg-surface-fog shrink-0"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <footer className="px-6 py-3 border-t border-divider shrink-0">
            {footer}
          </footer>
        )}
      </article>
    </div>
  );
}
