import { useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { parseExcel, loadSample, type ParsedFile } from "@/lib/parseExcel";
import { UploadPreviewModal } from "@/components/upload/UploadPreviewModal";

/**
 * Excel upload entry point. Dual mode:
 *   - "Try sample" pill: 0.5s ceremony + loads /samples/<file> via fetch
 *     + parses through the same code path as a real drop. Drives the
 *     happy-path demo.
 *   - Drag/drop OR file picker: real XLSX is parsed via SheetJS,
 *     sheet names + first 50 rows are shown in the preview modal.
 */

export type DropZoneCopy = {
  eyebrow: string;
  title: string;
  sheetsHint: string;
  sampleFile: string;        // public/ path, e.g. "/samples/crypton-may-gl-extract.xlsx"
  sampleDisplayName: string; // shown in the preview modal as the "filename"
};

export function DropZone({
  copy,
  onConfirm,
}: {
  copy: DropZoneCopy;
  /** Called with the parsed file once the user clicks "Continue with AI". */
  onConfirm: (parsed: ParsedFile) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState<"idle" | "sample" | "real">("idle");
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedFile | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setParsing("real");
    try {
      const p = await parseExcel(file);
      if (p.sheets.length === 0) {
        setError("We couldn't find any sheets in that file. Try an .xlsx with at least one tab.");
        setParsing("idle");
        return;
      }
      setParsed(p);
      setParsing("idle");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Couldn't parse that file: ${msg}`);
      setParsing("idle");
    }
  }

  async function handleSample() {
    setError(null);
    setParsing("sample");
    try {
      // Theatrical 0.4s delay so the "reading…" microcopy gets a beat.
      const [p] = await Promise.all([
        loadSample(copy.sampleFile, copy.sampleDisplayName),
        new Promise((r) => setTimeout(r, 400)),
      ]);
      setParsed(p);
      setParsing("idle");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Couldn't load the sample: ${msg}`);
      setParsing("idle");
    }
  }

  return (
    <>
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "ai-spring rounded-md border-2 border-dashed px-8 py-10 text-center transition-colors duration-200",
          dragOver ? "border-surface-deep bg-surface-mint/40" : "border-divider bg-white",
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="grid w-12 h-12 place-items-center rounded-full bg-surface-mint text-surface-deep">
            {parsing === "real" || parsing === "sample" ? (
              <span className="ai-pulse">
                <FileSpreadsheet size={20} />
              </span>
            ) : (
              <Upload size={20} />
            )}
          </span>
          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
              {copy.eyebrow}
            </div>
            <div className="text-[18px] font-bold text-ink tracking-[-0.01em]">
              {parsing === "real" ? "Reading your file…" : parsing === "sample" ? "Loading the seeded extract…" : copy.title}
            </div>
            <div className="text-[12px] text-mute max-w-[440px] mx-auto">{copy.sheetsHint}</div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <PillButton variant="primary" onClick={handleSample} disabled={parsing !== "idle"}>
              Try sample
            </PillButton>
            <PillButton
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={parsing !== "idle"}
            >
              Choose your XLSX
            </PillButton>
          </div>
          <div className="flex items-center gap-2 text-[11px] tracking-[0.08em] uppercase font-medium text-mute pt-1">
            <AIDot size={6} tone="deep" />
            Files never leave your browser · local-only parse
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset input so re-picking the same file still fires onChange.
            e.target.value = "";
          }}
        />
        {error && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-rose border border-mark-red/30 text-[12px] text-mark-red">
            {error}
          </div>
        )}
      </section>
      {parsed && (
        <UploadPreviewModal
          parsed={parsed}
          onClose={() => setParsed(null)}
          onConfirm={(p) => {
            setParsed(null);
            onConfirm(p);
          }}
        />
      )}
    </>
  );
}
