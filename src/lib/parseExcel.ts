/**
 * Excel parsing for the upload feature.
 *
 * Lazy-loads the `xlsx` library so the upload component is the only
 * route that pays the bundle cost. Returns sheet names + first 50 rows
 * per sheet plus file metadata — enough to render the UploadPreviewModal
 * with real data, without holding the entire workbook in memory.
 */

export type SheetPreview = {
  name: string;
  headers: string[];
  rows: (string | number | null)[][];
  /** Total row count (data rows, excluding header). */
  totalRows: number;
};

export type ParsedFile = {
  filename: string;
  sizeBytes: number;
  lastModified: number;
  parseMs: number;
  sheets: SheetPreview[];
  /** Auto-detected primary sheet name (heuristic). */
  primarySheet: string;
};

const PREVIEW_ROW_LIMIT = 50;

function pickPrimarySheet(names: string[]): string {
  // Heuristic: prefer sheets whose name suggests a journal/detail/transaction view.
  const priorities = [/journal/i, /gl[_ ]?detail/i, /detail/i, /transactions?/i, /ledger/i, /balance/i];
  for (const re of priorities) {
    const match = names.find((n) => re.test(n));
    if (match) return match;
  }
  return names[0];
}

export async function parseExcel(file: File): Promise<ParsedFile> {
  const t0 = performance.now();
  // Lazy-import keeps the xlsx chunk out of the initial bundle.
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  const sheets: SheetPreview[] = wb.SheetNames.map((name) => {
    const ws = wb.Sheets[name];
    const allRows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
      header: 1,
      defval: null,
      blankrows: false,
    });
    const headerRow = (allRows[0] ?? []).map((cell) => (cell == null ? "" : String(cell)));
    const dataRows = allRows.slice(1, PREVIEW_ROW_LIMIT + 1);
    return {
      name,
      headers: headerRow,
      rows: dataRows,
      totalRows: Math.max(allRows.length - 1, 0),
    };
  });

  const parseMs = Math.round(performance.now() - t0);
  return {
    filename: file.name,
    sizeBytes: file.size,
    lastModified: file.lastModified,
    parseMs,
    sheets,
    primarySheet: pickPrimarySheet(wb.SheetNames),
  };
}

/** Load a sample XLSX shipped under `public/samples/` and parse it like a real upload. */
export async function loadSample(url: string, displayName?: string): Promise<ParsedFile> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to load sample at ${url} (${resp.status})`);
  const blob = await resp.blob();
  const file = new File([blob], displayName ?? url.split("/").pop() ?? "sample.xlsx", {
    type: blob.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    lastModified: Date.now(),
  });
  return parseExcel(file);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
