import { TopRow } from "@/components/blocks/TopRow";
import { HeroBanner } from "@/components/blocks/HeroBanner";
import { KPIStrip, type KPI } from "@/components/blocks/KPIStrip";
import { PillButton } from "@/components/blocks/PillButton";
import { CasesPanel } from "@/components/blocks/CasesPanel";
import { AlertsPanel } from "@/components/blocks/AlertsPanel";
import { WorkforceTable } from "@/components/blocks/WorkforceTable";
import { PendingDecisionsPanel } from "@/components/blocks/PendingDecisionsPanel";

const kpis: KPI[] = [
  {
    label: "Active employees",
    value: 3247,
    trend: { delta: "12", direction: "up" },
    spark: [3210, 3215, 3220, 3225, 3228, 3232, 3240, 3247],
  },
  {
    label: "Active cases",
    value: 12,
    trend: { delta: "3", direction: "up" },
    spark: [8, 9, 9, 10, 11, 11, 11, 12],
  },
  {
    label: "Need decision today",
    value: 2,
    trend: { delta: "1", direction: "up" },
    spark: [1, 1, 1, 1, 2, 1, 1, 2],
  },
  {
    label: "Employee satisfaction",
    value: 87,
    suffix: "%",
    trend: { delta: "1.8", direction: "up" },
    spark: [83, 84, 84, 85, 85, 86, 86, 87],
  },
];

export function Dashboard() {
  return (
    <div className="pl-5 pr-6 pt-4 pb-8 space-y-3 min-h-screen bg-[color-mix(in_srgb,var(--surface-mint)_18%,var(--surface-fog))]">
      <TopRow breadcrumb={{ label: "HR dashboard", chip: "HR Ops" }} />

      <HeroBanner
        eyebrow="AI-powered HR operations"
        summary="3 cases need your decision today · 5 lifecycle events in flight · agent has resolved 47 cases this month."
        cta={<PillButton variant="deep" size="sm">+ New HR request</PillButton>}
        meta="Updated 2 min ago"
      />

      <KPIStrip items={kpis} />

      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <CasesPanel />
        <AlertsPanel />
      </div>

      <WorkforceTable />

      <PendingDecisionsPanel />
    </div>
  );
}
