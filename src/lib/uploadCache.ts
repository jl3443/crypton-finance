/**
 * Module-level cache for parsed uploads, keyed by FlowId.
 * We deliberately keep this OUT of React state so re-renders aren't
 * triggered when docs read it. The cache is volatile by design —
 * a page reload clears it (parallel to sessionStorage being the only
 * persistence for state).
 */

import type { ParsedFile } from "@/lib/parseExcel";
import type { FlowId } from "@/state";

const cache = new Map<FlowId, ParsedFile>();

export function rememberUpload(flow: FlowId, parsed: ParsedFile) {
  cache.set(flow, parsed);
}

export function recallUpload(flow: FlowId): ParsedFile | undefined {
  return cache.get(flow);
}
