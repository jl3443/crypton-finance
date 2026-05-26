import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { formatBytes, type ParsedFile, type SheetPreview } from "@/lib/parseExcel";

/**
 * Preview modal — shown after a real XLSX is parsed. Renders sheets
 * as tabs, first 50 rows of the active tab with frozen header,
 * file metadata + auto-detected primary sheet, and a "Continue with AI"
 * pill that hands the parsed file back to the workspace.
 */
export function UploadPreviewModal({
  parsed,
  onClose,
  onConfirm,
}: {
  parsed: ParsedFile;
  onClose: () => void;
  onConfirm: (parsed: ParsedFile) => void;
}) {
  const [activeSheet, setActiveSheet] = useState<string>(parsed.primarySheet);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const current = parsed.sheets.find((s) => s.name === activeSheet) ?? parsed.sheets[0];
  const totalRowCount = parsed.sheets.reduce((sum, s) => sum + s.totalRows, 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="ai-spring bg-white rounded-md border border-divider w-full max-w-[1100px] max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top: file metadata */}
        <header className="px-7 py-5 border-b border-divider">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-1">
                <AIDot size={6} tone="deep" /> File parsed · local only
              </div>
              <div className="text-[20px] font-bold text-ink tracking-[-0.01em] truncate">
                {parsed.filename}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ui-pill -mr-2 -mt-2 grid w-9 h-9 place-items-center rounded-full hover:bg-surface-fog text-mute hover:text-ink"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-4 gap-4 text-[12px] leading-[18px]">
            <Stat label="File size" value={formatBytes(parsed.sizeBytes)} />
            <Stat label="Sheets" value={String(parsed.sheets.length)} />
            <Stat label="Total rows" value={totalRowCount.toLocaleString()} />
            <Stat label="Parse time" value={`${parsed.parseMs} ms`} />
          </dl>
        </header>

        {/* Sheet tabs */}
        <div className="px-7 pt-4 border-b border-divider">
          <div className="flex items-center gap-1 flex-wrap">
            {parsed.sheets.map((s) => {
              const isActive = s.name === activeSheet;
              const isPrimary = s.name === parsed.primarySheet;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setActiveSheet(s.name)}
                  className={cn(
                    "ui-pill inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-t-md border-b-2 transition-colors",
                    isActive
                      ? "border-surface-deep text-ink"
                      : "border-transparent text-mute hover:text-ink",
                  )}
                >
                  {s.name}
                  <span className="text-mute font-normal">· {s.totalRows.toLocaleString()}</span>
                  {isPrimary && (
                    <span className="text-[9px] tracking-[0.08em] uppercase font-bold text-surface-deep bg-surface-mint px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sheet preview */}
        <div className="flex-1 min-h-0 overflow-auto bg-surface-fog/40">
          <SheetTable sheet={current} />
        </div>

        {/* Footer: confirm */}
        <footer className="px-7 py-4 border-t border-divider bg-white flex items-center justify-between gap-4">
          <div className="text-[12px] text-mute leading-[18px]">
            We'll use the <span className="text-ink font-medium">{parsed.primarySheet}</span> sheet
            for AI ingestion. Switch tabs to confirm the column mapping looks right.
          </div>
          <div className="flex items-center gap-2.5">
            <PillButton variant="secondary" onClick={onClose}>
              Cancel
            </PillButton>
            <PillButton variant="primary" arrow onClick={() => onConfirm(parsed)}>
              Continue with AI
            </PillButton>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute mb-0.5">
        {label}
      </dt>
      <dd className="text-[14px] font-medium text-ink">{value}</dd>
    </div>
  );
}

function SheetTable({ sheet }: { sheet: SheetPreview }) {
  return (
    <table className="w-full text-[12px] leading-[18px] font-mono">
      <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--divider)]">
        <tr>
          <th className="px-3 py-2 text-mute text-left w-12">#</th>
          {sheet.headers.map((h, i) => (
            <th
              key={`h-${i}`}
              className="px-3 py-2 text-left font-bold text-ink whitespace-nowrap border-l border-divider"
            >
              {h || <span className="text-mute italic">(blank)</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sheet.rows.length === 0 ? (
          <tr>
            <td colSpan={sheet.headers.length + 1} className="text-center text-mute py-12">
              Sheet has no data rows.
            </td>
          </tr>
        ) : (
          sheet.rows.map((row, i) => (
            <tr key={i} className="odd:bg-surface-fog/70 hover:bg-surface-mint/40">
              <td className="px-3 py-1.5 text-mute">{i + 1}</td>
              {sheet.headers.map((_, j) => {
                const v = row[j];
                const display =
                  v == null ? "" : typeof v === "number" ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(v);
                const isNum = typeof v === "number";
                return (
                  <td
                    key={`c-${i}-${j}`}
                    className={cn(
                      "px-3 py-1.5 border-l border-divider/60 whitespace-nowrap",
                      isNum && "text-right text-ink tabular-nums",
                      !isNum && "text-ink/90",
                    )}
                  >
                    {display}
                  </td>
                );
              })}
            </tr>
          ))
        )}
        {sheet.rows.length > 0 && sheet.rows.length < sheet.totalRows && (
          <tr>
            <td
              colSpan={sheet.headers.length + 1}
              className="text-center text-mute text-[11px] py-3 italic"
            >
              Showing first {sheet.rows.length} of {sheet.totalRows.toLocaleString()} rows. AI sees them all.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
