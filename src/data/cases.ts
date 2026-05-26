/**
 * Dashboard case list — every row is real, every row routes to a workspace
 * or document preview. CXO sees the 7 cases that drive the demo.
 */

import type { View } from "@/state";

export type CaseStatus = "critical" | "ready" | "progress" | "resolved";

export type CaseRow = {
  id: string;
  flag: string;
  country: string;
  title: string;
  sub: string;
  type: "Compliance" | "Offboarding" | "Compensation" | "Onboarding";
  status: string;
  statusKind: CaseStatus;
  due: string;
  dueUrgent: boolean;
  target: View;
};

export const cases: CaseRow[] = [
  {
    id: "HR-0184",
    flag: "🇩🇪",
    country: "Germany",
    title: "German workweek update",
    sub: "Compliance · 147 employees · proposal ready",
    type: "Compliance",
    status: "Needs decision",
    statusKind: "critical",
    due: "Today",
    dueUrgent: true,
    target: { kind: "workspace", flow: "uc2" },
  },
  {
    id: "HR-0178",
    flag: "🇧🇷",
    country: "Brazil",
    title: "Senior R&D · São Paulo offboarding",
    sub: "Lifecycle · last day Fri 27 Jun · click-to-run flow",
    type: "Offboarding",
    status: "Ready to run",
    statusKind: "ready",
    due: "Fri",
    dueUrgent: false,
    target: { kind: "workspace", flow: "uc1" },
  },
  {
    id: "HR-0182",
    flag: "🇺🇸",
    country: "United States",
    title: "Senior Engineer retention case",
    sub: "Compensation · three options drafted · pick one",
    type: "Compensation",
    status: "Pick one",
    statusKind: "critical",
    due: "Today",
    dueUrgent: true,
    target: { kind: "workspace", flow: "uc3" },
  },
  {
    id: "HR-0175",
    flag: "🇨🇭",
    country: "Switzerland",
    title: "Marketing Manager · Basel onboarding",
    sub: "Lifecycle · starts Mon 25 May · click-to-run flow",
    type: "Onboarding",
    status: "Ready to run",
    statusKind: "progress",
    due: "Mon",
    dueUrgent: false,
    target: { kind: "workspace", flow: "uc4" },
  },
  {
    id: "HR-0170",
    flag: "🇫🇷",
    country: "France",
    title: "Q2 pay equity audit",
    sub: "Compliance · filed for you on 15 May",
    type: "Compliance",
    status: "Resolved",
    statusKind: "resolved",
    due: "Closed",
    dueUrgent: false,
    target: { kind: "compliance-radar" },
  },
];

export type AlertRow = {
  severity: "critical" | "warning" | "info";
  title: string;
  time: string;
};

export const alerts: AlertRow[] = [
  { severity: "critical", title: "German workweek update detected", time: "7:14 AM today" },
  { severity: "critical", title: "Senior Engineer retention case from manager", time: "11:02 AM today" },
  { severity: "warning", title: "Heidelberg offboarding package ready to approve", time: "Yesterday" },
  { severity: "info", title: "France Q2 pay equity audit filed (handled)", time: "15 May" },
];

export type CountryRow = {
  country: string;
  flag: string;
  employees: string;
  cases: string;
  activity: string;
  status: string;
  statusKind: "ok" | "active" | "alert";
};

export const countries: CountryRow[] = [
  { country: "Switzerland · Kaiseraugst HQ", flag: "🇨🇭", employees: "642", cases: "3", activity: "Onboarding · compensation review", status: "On track", statusKind: "ok" },
  { country: "Netherlands · Maastricht", flag: "🇳🇱", employees: "518", cases: "2", activity: "EU pay transparency prep", status: "On track", statusKind: "ok" },
  { country: "Germany · Heidelberg + Berlin", flag: "🇩🇪", employees: "247", cases: "3", activity: "Workweek change · offboarding", status: "Needs decision", statusKind: "alert" },
  { country: "United States · multiple sites", flag: "🇺🇸", employees: "812", cases: "2", activity: "Compensation cycle · visa letters", status: "Active", statusKind: "active" },
  { country: "China · Shanghai", flag: "🇨🇳", employees: "324", cases: "1", activity: "Data residency review", status: "On track", statusKind: "ok" },
  { country: "India · Hyderabad", flag: "🇮🇳", employees: "486", cases: "1", activity: "Onboarding wave", status: "On track", statusKind: "ok" },
  { country: "Singapore · APAC hub", flag: "🇸🇬", employees: "218", cases: "—", activity: "All clear", status: "Quiet", statusKind: "ok" },
];

export type PendingDecision = {
  urgency: "critical" | "high" | "medium";
  id: string;
  type: string;
  country: string;
  title: string;
  sub: string;
  dueLabel: string;
  dueWhen: string;
  target: View;
};

export const pendingDecisions: PendingDecision[] = [
  {
    urgency: "critical",
    id: "HR-0184",
    type: "Compliance",
    country: "Germany",
    title: "German workweek change · adopt 37.5 hours",
    sub: "147 employees affected · 12 contracts · works council notice ready",
    dueLabel: "Decide by",
    dueWhen: "Today, end of day",
    target: { kind: "workspace", flow: "uc2" },
  },
  {
    urgency: "critical",
    id: "HR-0182",
    type: "Compensation",
    country: "United States",
    title: "Senior Engineer retention case · three options",
    sub: "Pick a scenario. Conservative · Mid · Retention. Internal equity preview ready.",
    dueLabel: "Decide by",
    dueWhen: "Today, end of day",
    target: { kind: "workspace", flow: "uc3" },
  },
  {
    urgency: "high",
    id: "HR-0178",
    type: "Offboarding",
    country: "Germany",
    title: "Senior R&D · Heidelberg · approve offboarding package",
    sub: "Last day Friday · offboarding letter drafted in German + English · 23 systems queued",
    dueLabel: "Decide by",
    dueWhen: "Tomorrow",
    target: { kind: "workspace", flow: "uc1" },
  },
];
