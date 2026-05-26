import { useState } from "react";
import { DocChrome, Paper, SideRail } from "@/components/docs/DocChrome";
import { DocHeader, Provenance, CrossLinks, Eyebrow } from "@/components/docs/shared";
import { recallUpload } from "@/lib/uploadCache";
import { formatBytes } from "@/lib/parseExcel";
import { cn } from "@/lib/utils";

/**
 * OracleGLExtract — renders the actual uploaded XLSX (from uploadCache)
 * as styled tabs + frozen-header table. If no upload is in cache yet
 * (deep link, refresh), shows a friendly empty state pointing the user
 * to the workspace step 0.
 */

export function OracleGLExtract() {
  const upload = recallUpload("accounting");
  const [activeSheet, setActiveSheet] = useState<string | null>(upload?.primarySheet ?? null);

  if (!upload) {
    return (
      <DocChrome title="Oracle GL extract">
        <Paper>
          <DocHeader
            eyebrow="Oracle Cloud GL · May 2026"
            title="Oracle GL extract"
            subtitle="No upload found in this session."
          />
          <p className="text-[14px] text-mute pt-4">
            Open the Accounting workspace and complete step 1 ("Ingest Oracle GL extract") to bring the
            workbook into view here.
          </p>
        </Paper>
        <SideRail>
          <Provenance
            source="—"
            generatedAt={new Date().toISOString().slice(0, 16).replace("T", " ")}
            auditId="—"
            notes="Upload an XLSX to populate this doc."
          />
        </SideRail>
      </DocChrome>
    );
  }

  const current = upload.sheets.find((s) => s.name === activeSheet) ?? upload.sheets[0];
  const totalRowCount = upload.sheets.reduce((s, sh) => s + sh.totalRows, 0);

  return (
    <DocChrome
      title="Oracle GL extract"
      primary={{ label: "Download as XLSX", onClick: () => triggerDownload(upload.filename) }}
      secondary={{ label: "Re-upload", onClick: () => alert("Switch to workspace step 1 to re-upload.") }}
    >
      <Paper>
        <DocHeader
          eyebrow="Oracle Cloud GL · May 2026"
          title="Oracle GL extract"
          subtitle="What AI read from your workbook · 50-row preview per sheet."
        />

        <section className="grid grid-cols-4 gap-5 pt-2">
          <Stat label="File" value={upload.filename} />
          <Stat label="Sheets" value={String(upload.sheets.length)} />
          <Stat label="Total rows" value={totalRowCount.toLocaleString()} />
          <Stat label="Parse time" value={`${upload.parseMs} ms`} />
        </section>

        <section className="pt-6">
          <div className="flex items-center gap-1 flex-wrap border-b border-divider">
            {upload.sheets.map((s) => {
              const isActive = s.name === (activeSheet ?? upload.primarySheet);
              const isPrimary = s.name === upload.primarySheet;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setActiveSheet(s.name)}
                  className={cn(
                    "ui-pill inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium border-b-2",
                    isActive ? "border-surface-deep text-ink" : "border-transparent text-mute hover:text-ink",
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
          <div className="overflow-auto max-h-[520px] mt-3 border border-divider rounded-md">
            <table className="w-full text-[12px] leading-[18px] font-mono">
              <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--divider)]">
                <tr>
                  <th className="px-3 py-2 text-mute text-left w-12">#</th>
                  {current.headers.map((h, i) => (
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
                {current.rows.map((row, i) => (
                  <tr key={i} className="odd:bg-surface-fog/70 hover:bg-surface-mint/40">
                    <td className="px-3 py-1.5 text-mute">{i + 1}</td>
                    {current.headers.map((_, j) => {
                      const v = row[j];
                      const isNum = typeof v === "number";
                      const display =
                        v == null
                          ? ""
                          : isNum
                            ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : String(v);
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
                ))}
                {current.rows.length < current.totalRows && (
                  <tr>
                    <td
                      colSpan={current.headers.length + 1}
                      className="text-center text-mute text-[11px] py-3 italic"
                    >
                      Preview of {current.rows.length} rows. Full sheet has {current.totalRows.toLocaleString()} rows; AI sees them all.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </Paper>
      <SideRail>
        <Provenance
          source={`${upload.filename} (${formatBytes(upload.sizeBytes)})`}
          generatedAt={new Date(upload.lastModified).toISOString().slice(0, 16).replace("T", " ")}
          notes={`Parsed locally · ${upload.parseMs} ms · ${upload.sheets.length} sheets detected.`}
        />
        <CrossLinks
          links={[
            { id: "trial-balance-recon", label: "Trial Balance reconciliation" },
            { id: "ap-aging", label: "AP aging report" },
            { id: "ar-aging", label: "AR aging report" },
            { id: "close-audit-trail", label: "Close audit trail" },
          ]}
        />
      </SideRail>
    </DocChrome>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <div className="text-[14px] font-medium text-ink mt-1 truncate" title={value}>
        {value}
      </div>
    </div>
  );
}

function triggerDownload(filename: string) {
  // Demo affordance — the file lives in /public/samples/ if it's the seeded
  // sample, otherwise we can't re-emit the user's own XLSX (we never stored it).
  if (filename.includes("crypton-may-gl-extract")) {
    const a = document.createElement("a");
    a.href = "/samples/crypton-may-gl-extract.xlsx";
    a.download = filename;
    a.click();
  } else {
    alert(`Re-emitting "${filename}" is a Day-5 enhancement — for now download the seeded sample.`);
  }
}
