/**
 * Per-flow scripted scenarios — the 5 steps each workspace plays through.
 * Step copy is the source of truth for what shows in the timeline and the
 * activity log. Every artifact mentioned here has a matching document
 * preview under /data/documents.ts and the doc preview page.
 */

import type { DocId } from "@/state";

export type Actor = "Agent" | "HRBP" | "Employee" | "Day 1" | "Last day";

export type FlowStep = {
  /** Short title shown on the timeline node. */
  title: string;
  actor: Actor;
  /** Body shown under the title on the timeline node. */
  detail: string;
  /** Mock timestamp shown on the right of the timeline node. */
  time: string;
};

export type FlowDef = {
  id: "uc1" | "uc2" | "uc3" | "uc4";
  /** Topbar context line in the workspace. */
  contextTitle: string;
  contextSub: string;
  statusPill: string;
  alert: {
    title: string;
    sub: string;
  };
  steps: FlowStep[];
};

export const uc2Flow: FlowDef = {
  id: "uc2",
  contextTitle: "German working hours update",
  contextSub: "Detected at 7:14 AM today",
  statusPill: "Awaiting your decision",
  alert: {
    title: "Germany · Working Hours Act amendment",
    sub: "Standard working week moving from 40 hours to 37 hours 30 minutes · effective in 90 days · 147 employees affected",
  },
  steps: [
    {
      title: "Detect law change",
      actor: "Agent",
      detail: "Picked up a new German labor law from the EU regulatory feed. High confidence.",
      time: "7:14 AM",
    },
    {
      title: "Calculate impact",
      actor: "Agent",
      detail: "147 employees affected · 12 contracts to update · 4 payroll systems to reconfigure.",
      time: "7:15 AM",
    },
    {
      title: "Draft all required documents",
      actor: "Agent",
      detail: "Handbook edits · employee announcement (German + English) · works council notice · payroll change.",
      time: "7:17 AM",
    },
    {
      title: "Human review",
      actor: "HRBP",
      detail: "Decision card sent. See the right pane.",
      time: "now",
    },
    {
      title: "Roll out the changes",
      actor: "Agent",
      detail: "Update payroll, send announcements, file works council notice, log the decision.",
      time: "—",
    },
  ],
};

export const uc1Flow: FlowDef = {
  id: "uc1",
  contextTitle: "Senior R&D · São Paulo offboarding",
  contextSub: "Resignation received yesterday · click each step to run",
  statusPill: "Click each step to run",
  alert: {
    title: "Camila Souza · Senior R&D Scientist · São Paulo, Brazil",
    sub: "Aviso prévio: 30 days · last day Friday 27 June · 14 single-owner systems · 23 SaaS accesses to revoke",
  },
  steps: [
    {
      title: "Read resignation notice",
      actor: "Agent",
      detail: "Parse the email + extract last working day, notice period, salary baseline.",
      time: "Yesterday",
    },
    {
      title: "Generate KT plan",
      actor: "Agent",
      detail: "Map Camila's git, Jira, Confluence footprint · find the single-owner SOPs.",
      time: "Click to run",
    },
    {
      title: "Compile access revocation",
      actor: "Agent",
      detail: "23 SaaS systems · each item timed to the CLT-statutory last-day deadline.",
      time: "Click to run",
    },
    {
      title: "Draft localized exit package",
      actor: "Agent",
      detail: "Final pay · 13th-month proration · vacation payout · offboarding letter (PT + EN).",
      time: "Click to run",
    },
    {
      title: "HRBP single approval",
      actor: "HRBP",
      detail: "One card summarizing KT plan, revocation list, exit package. Approve in one click.",
      time: "Awaiting",
    },
  ],
};

export const uc3Flow: FlowDef = {
  id: "uc3",
  contextTitle: "Retention case · Senior Engineer",
  contextSub: "Manager request at 11:02 AM",
  statusPill: "Pick a scenario",
  alert: {
    title: "Senior Engineer · San Francisco · current $146K (8% below market)",
    sub: "Manager: \"My top performer is underpaid — fix it before he resigns.\"",
  },
  steps: [
    {
      title: "Pull market data",
      actor: "Agent",
      detail: "Market data: Senior Engineer in San Francisco, range $148K–$180K, median $158K.",
      time: "11:03 AM",
    },
    {
      title: "Compute internal equity",
      actor: "Agent",
      detail: "Compared 11 teammates. 2 are within 5% of the proposed salary.",
      time: "11:04 AM",
    },
    {
      title: "Draft three options",
      actor: "Agent",
      detail: "Conservative · Mid · Retention, with budget impact and one-line reasoning.",
      time: "11:05 AM",
    },
    {
      title: "Human picks a scenario",
      actor: "HRBP",
      detail: "Decision card sent. See the right pane.",
      time: "now",
    },
    {
      title: "Generate deliverables",
      actor: "Agent",
      detail: "Salary update form, manager talking points, one-page summary for Finance.",
      time: "—",
    },
  ],
};

export const uc4Flow: FlowDef = {
  id: "uc4",
  contextTitle: "Marketing Manager · Basel onboarding",
  contextSub: "Offer signed yesterday · starts Mon 25 May",
  statusPill: "Click each step to run",
  alert: {
    title: "Aurélie L. · Marketing Manager · Basel, Switzerland",
    sub: "Signed offer received · Day 1 in 4 working days · CH compliance + preboarding bundle ready to file",
  },
  steps: [
    {
      title: "Read signed offer",
      actor: "Agent",
      detail: "Parsed offer + job profile. Pulled candidate record, role template, start date.",
      time: "Yesterday",
    },
    {
      title: "File preboarding bundle",
      actor: "Agent",
      detail: "Welcome message, equipment ticket, IT provisioning, work permit check — filed together.",
      time: "Click to run",
    },
    {
      title: "Build Day-1 calendar + 30/60/90",
      actor: "Agent",
      detail: "Pull manager's calendar, slot intro meetings, generate milestone plan from role template.",
      time: "Click to run",
    },
    {
      title: "Country compliance scan",
      actor: "Agent",
      detail: "Switzerland-specific checks · mandatory training · statutory paperwork.",
      time: "Click to run",
    },
    {
      title: "HRBP single approval",
      actor: "HRBP",
      detail: "One card summarizing everything. Approve in one click or make small edits.",
      time: "Awaiting",
    },
  ],
};

export const flowsById: Record<"uc1" | "uc2" | "uc3" | "uc4", FlowDef> = {
  uc1: uc1Flow,
  uc2: uc2Flow,
  uc3: uc3Flow,
  uc4: uc4Flow,
};

/** Documents linked from each workspace's decision card. */
export const docLinksByFlow: Record<"uc1" | "uc2" | "uc3" | "uc4", DocId[]> = {
  uc1: ["termination-letter"],
  uc2: ["working-hours-act", "handbook-redline", "employee-announcement", "works-council-notice"],
  uc3: ["comp-deliverables"],
  uc4: [],
};
