/**
 * View-state machine for the Crypton Finance AI demo.
 * Discriminated-union approach (no real router) — App.tsx switches on `view.kind`.
 *
 * Persona: single CFO (Wei Chen, Group CFO, Crypton).
 * Three flows: accounting · treasury · bp.
 *
 * Persistence: approvals + uploads are kept in sessionStorage so the demo
 * survives page reloads (handy when showing the screen). Clearing the tab
 * resets the demo cleanly.
 */

import * as React from "react";

export type FlowId = "accounting" | "treasury" | "bp";

export type DocId =
  // Accounting
  | "oracle-gl-extract"
  | "trial-balance-recon"
  | "ap-aging"
  | "ar-aging"
  | "journal-entry-proposal"
  | "variance-memo"
  | "board-financial-report"
  | "close-audit-trail"
  // Treasury
  | "wallet-balance-sheet"
  | "bank-account-summary"
  | "transaction-ledger-24h"
  | "anomaly-brief"
  | "rebalancing-plan"
  | "daily-treasury-brief"
  // Business Partner
  | "business-line-pnl"
  | "revenue-waterfall"
  | "cost-breakdown"
  | "scenario-analysis"
  | "synergy-map"
  | "bp-strategic-memo"
  | "bp-board-deck";

export type View =
  | { kind: "login" }
  | { kind: "hub" }
  | { kind: "workspace"; flow: FlowId }
  | { kind: "doc"; id: DocId }
  | { kind: "export"; flow: FlowId };

export type Approval = {
  flow: FlowId;
  step: number;
  approvedAt: string; // ISO
};

export type UploadRecord = {
  flow: FlowId;
  filename: string;
  sheetCount: number;
  rowCount: number;
  uploadedAt: string; // ISO
};

export type Anomaly = {
  id: string;
  cleared: boolean;
  clearedBy?: string;
};

export type FlowProgress = {
  activeStep: number;
  approved: boolean;
};

export type AppState = {
  view: View;
  history: View[];
  cfo: { name: string; email: string };
  flowProgress: Record<FlowId, FlowProgress>;
  approvals: Approval[];
  uploads: UploadRecord[];
  anomalies: Anomaly[];
};

export type AppActions = {
  go: (view: View) => void;
  back: () => void;
  signIn: () => void;
  signOut: () => void;
  setFlowProgress: (flow: FlowId, next: Partial<FlowProgress>) => void;
  recordApproval: (flow: FlowId, step: number) => void;
  recordUpload: (rec: Omit<UploadRecord, "uploadedAt">) => void;
  clearAnomaly: (id: string, clearedBy: string) => void;
};

const CFO = {
  name: "Wei Chen",
  email: "wei.chen@crypton.exchange",
};

const INITIAL_PROGRESS: Record<FlowId, FlowProgress> = {
  accounting: { activeStep: 0, approved: false },
  treasury: { activeStep: 0, approved: false },
  bp: { activeStep: 0, approved: false },
};

const SESSION_KEY = "crypton-finance-state-v1";

// flowProgress is deliberately NOT persisted — every hard refresh AND
// every "click flow card" from the hub returns the user to step 1 of
// the flow (a fresh demo run). Only audit-trail-shaped data (approvals,
// uploads, anomalies) survives a reload so the audit log on the hub
// retains evidence of past actions.
type PersistShape = Pick<
  AppState,
  "approvals" | "uploads" | "anomalies"
>;

function loadPersisted(): PersistShape {
  if (typeof window === "undefined") {
    return { approvals: [], uploads: [], anomalies: [] };
  }
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { approvals: [], uploads: [], anomalies: [] };
    const parsed = JSON.parse(raw) as Partial<PersistShape>;
    return {
      approvals: parsed.approvals ?? [],
      uploads: parsed.uploads ?? [],
      anomalies: parsed.anomalies ?? [],
    };
  } catch {
    return { approvals: [], uploads: [], anomalies: [] };
  }
}

const Ctx = React.createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(() => {
    const persisted = loadPersisted();
    return {
      view: { kind: "login" },
      history: [],
      cfo: CFO,
      flowProgress: INITIAL_PROGRESS,
      ...persisted,
    };
  });

  // Persist audit-shape slices only (NOT flowProgress).
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const slice: PersistShape = {
      approvals: state.approvals,
      uploads: state.uploads,
      anomalies: state.anomalies,
    };
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(slice));
  }, [state.approvals, state.uploads, state.anomalies]);

  // Entering a workspace from the hub ALWAYS resets that flow to step 0
  // for a fresh demo run. (Doc/export view-kind transitions don't reset.)
  const go = React.useCallback(
    (view: View) =>
      setState((s) => {
        const flowProgress =
          view.kind === "workspace"
            ? { ...s.flowProgress, [view.flow]: { activeStep: 0, approved: false } }
            : s.flowProgress;
        return { ...s, view, history: [...s.history, s.view], flowProgress };
      }),
    [],
  );

  const back = React.useCallback(
    () =>
      setState((s) => {
        if (s.history.length === 0) return { ...s, view: { kind: "hub" } };
        const prev = s.history[s.history.length - 1];
        return { ...s, view: prev, history: s.history.slice(0, -1) };
      }),
    [],
  );

  const signIn = React.useCallback(
    () =>
      setState((s) => ({
        ...s,
        view: { kind: "hub" },
        history: [],
      })),
    [],
  );

  const signOut = React.useCallback(
    () =>
      setState((s) => ({
        ...s,
        view: { kind: "login" },
        history: [],
      })),
    [],
  );

  const setFlowProgress = React.useCallback(
    (flow: FlowId, next: Partial<FlowProgress>) =>
      setState((s) => ({
        ...s,
        flowProgress: {
          ...s.flowProgress,
          [flow]: { ...s.flowProgress[flow], ...next },
        },
      })),
    [],
  );

  const recordApproval = React.useCallback(
    (flow: FlowId, step: number) =>
      setState((s) => ({
        ...s,
        approvals: [
          ...s.approvals,
          { flow, step, approvedAt: new Date().toISOString() },
        ],
      })),
    [],
  );

  const recordUpload = React.useCallback(
    (rec: Omit<UploadRecord, "uploadedAt">) =>
      setState((s) => ({
        ...s,
        uploads: [...s.uploads, { ...rec, uploadedAt: new Date().toISOString() }],
      })),
    [],
  );

  const clearAnomaly = React.useCallback(
    (id: string, clearedBy: string) =>
      setState((s) => ({
        ...s,
        anomalies: s.anomalies.map((a) =>
          a.id === id ? { ...a, cleared: true, clearedBy } : a,
        ),
      })),
    [],
  );

  return (
    <Ctx.Provider
      value={{
        ...state,
        go,
        back,
        signIn,
        signOut,
        setFlowProgress,
        recordApproval,
        recordUpload,
        clearAnomaly,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useApp must be inside <AppProvider>");
  return ctx;
}
