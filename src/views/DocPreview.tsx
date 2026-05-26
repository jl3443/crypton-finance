import type { DocId } from "@/state";
import { SpringIn } from "@/components/ai/SpringIn";
import { WorkingHoursAct } from "@/components/docs/WorkingHoursAct";
import { HandbookRedline } from "@/components/docs/HandbookRedline";
import { EmployeeAnnouncement } from "@/components/docs/EmployeeAnnouncement";
import { WorksCouncilNotice } from "@/components/docs/WorksCouncilNotice";
import { TerminationLetter } from "@/components/docs/TerminationLetter";
import { CompDeliverables } from "@/components/docs/CompDeliverables";
import { EmploymentVerification } from "@/components/docs/EmploymentVerification";
import { CoveragePlan } from "@/components/docs/CoveragePlan";

function pickDoc(id: DocId) {
  switch (id) {
    case "working-hours-act":
      return <WorkingHoursAct />;
    case "handbook-redline":
      return <HandbookRedline />;
    case "employee-announcement":
      return <EmployeeAnnouncement />;
    case "works-council-notice":
      return <WorksCouncilNotice />;
    case "termination-letter":
      return <TerminationLetter />;
    case "comp-deliverables":
      return <CompDeliverables />;
    case "employment-verification":
      return <EmploymentVerification />;
    case "coverage-plan":
      return <CoveragePlan />;
    default:
      return null;
  }
}

export function DocPreview({ id }: { id: DocId }) {
  const doc = pickDoc(id);
  if (doc) return <SpringIn className="block">{doc}</SpringIn>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-fog">
      <div className="bg-white rounded-md p-10 max-w-md text-center space-y-3">
        <div className="text-[13px] tracking-[0.08em] uppercase text-mute font-medium">
          Document preview
        </div>
        <h2 className="text-[22px] font-bold text-ink">{id}</h2>
        <p className="text-[14px] text-mute">
          Coming next phase. Mocked artifact for this document will land soon.
        </p>
      </div>
    </div>
  );
}
