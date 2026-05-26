/**
 * View-state machine for the HR Concierge demo.
 * Inspired by Predictive-Risk-Agent2's discriminated-union approach:
 * no real router, just a typed `view` field that App.tsx switches on.
 */

import * as React from "react";

export type Persona = "hrbp" | "employee";

export type View =
  | { kind: "login"; nextPersona?: Persona }
  | { kind: "dashboard" }
  | { kind: "insights" }
  | { kind: "compliance-radar" }
  | { kind: "documents"; tab: "letters" | "policies" }
  | { kind: "workspace"; flow: "uc1" | "uc2" | "uc3" | "uc4" }
  | { kind: "doc"; id: DocId }
  | { kind: "logout" }
  | { kind: "employee-landing" }
  | { kind: "employee-chat" };

export type DocId =
  | "working-hours-act"
  | "handbook-redline"
  | "employee-announcement"
  | "works-council-notice"
  | "termination-letter"
  | "comp-deliverables"
  | "employment-verification"
  | "coverage-plan";

export type FlowId = "uc1" | "uc2" | "uc3" | "uc4";

export type FlowProgress = {
  activeStep: number;
  approved: boolean;
};

/**
 * One escalation = an Employee chat said "escalate". Surfaced to the HRBP
 * dashboard as a bell badge so the demo can show the round-trip from
 * self-service into a human-routed queue.
 */
export type Escalation = {
  id: string;
  employee: string;
  reason: string;
  /** Display string like "just now", "2 min ago". */
  at: string;
};

export type AppState = {
  persona: Persona;
  view: View;
  /** Stack of previous views (most recent at end). Drives the back button. */
  history: View[];
  /**
   * Per-flow workspace progress, lifted out of the workspace components so
   * navigating to a doc preview and back doesn't restart the auto-advance.
   */
  flowProgress: Record<FlowId, FlowProgress>;
  /**
   * When set, a full-screen completion modal is shown. Clicking its CTA
   * navigates the user back to the dashboard and clears this flag.
   */
  completionFlow: FlowId | null;
  /** Live queue of employee escalations, surfaced on the HRBP topbar. */
  escalations: Escalation[];
};

export type AppActions = {
  go: (view: View) => void;
  back: () => void;
  signIn: (persona: Persona) => void;
  signOut: () => void;
  setFlowProgress: (flow: FlowId, next: Partial<FlowProgress>) => void;
  showCompletion: (flow: FlowId) => void;
  clearCompletion: () => void;
  addEscalation: (e: Omit<Escalation, "id" | "at">) => void;
  clearEscalations: () => void;
};

const Ctx = React.createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>({
    persona: "hrbp",
    view: { kind: "login" },
    history: [],
    flowProgress: {
      uc1: { activeStep: 0, approved: false },
      uc2: { activeStep: 0, approved: false },
      uc3: { activeStep: 0, approved: false },
      uc4: { activeStep: 0, approved: false },
    },
    completionFlow: null,
    escalations: [],
  });

  const go = React.useCallback(
    (view: View) =>
      setState((s) => ({
        ...s,
        view,
        history: [...s.history, s.view],
      })),
    [],
  );

  const back = React.useCallback(
    () =>
      setState((s) => {
        if (s.history.length === 0) {
          // Fallback when there's no history (deep link or page reload).
          return { ...s, view: { kind: "dashboard" } };
        }
        const prev = s.history[s.history.length - 1];
        return { ...s, view: prev, history: s.history.slice(0, -1) };
      }),
    [],
  );

  const signIn = React.useCallback(
    (persona: Persona) =>
      setState((s) => ({
        ...s,
        persona,
        view: persona === "hrbp" ? { kind: "dashboard" } : { kind: "employee-landing" },
        history: [],
        flowProgress: {
          uc1: { activeStep: 0, approved: false },
          uc2: { activeStep: 0, approved: false },
          uc3: { activeStep: 0, approved: false },
          uc4: { activeStep: 0, approved: false },
        },
      })),
    [],
  );

  const signOut = React.useCallback(
    () =>
      setState((s) => ({
        ...s,
        view: { kind: "logout" },
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

  const showCompletion = React.useCallback(
    (flow: FlowId) => setState((s) => ({ ...s, completionFlow: flow })),
    [],
  );

  const clearCompletion = React.useCallback(
    () => setState((s) => ({ ...s, completionFlow: null })),
    [],
  );

  const addEscalation = React.useCallback(
    (e: Omit<Escalation, "id" | "at">) =>
      setState((s) => ({
        ...s,
        escalations: [
          {
            id: `esc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: "just now",
            ...e,
          },
          ...s.escalations,
        ],
      })),
    [],
  );

  const clearEscalations = React.useCallback(
    () => setState((s) => ({ ...s, escalations: [] })),
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
        showCompletion,
        clearCompletion,
        addEscalation,
        clearEscalations,
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
