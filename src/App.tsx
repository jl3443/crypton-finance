import { AppProvider, useApp } from "@/state";
import { Sidebar } from "@/components/layout/Sidebar";
import { Login } from "@/views/Login";
import { Dashboard } from "@/views/Dashboard";
import { Insights } from "@/views/Insights";
import { Documents } from "@/views/Documents";
import { ComplianceRadar } from "@/views/ComplianceRadar";
import { CompletionModal } from "@/components/workspace/CompletionModal";
import { WorkspaceUC1 } from "@/views/WorkspaceUC1";
import { WorkspaceUC2 } from "@/views/WorkspaceUC2";
import { WorkspaceUC3 } from "@/views/WorkspaceUC3";
import { WorkspaceUC4 } from "@/views/WorkspaceUC4";
import { DocPreview } from "@/views/DocPreview";
import { Logout } from "@/views/Logout";
import { EmployeeLanding } from "@/views/EmployeeLanding";

function Router() {
  const { view } = useApp();

  switch (view.kind) {
    case "login":
      return <Login />;
    case "dashboard":
      return <Dashboard />;
    case "insights":
      return <Insights />;
    case "compliance-radar":
      return <ComplianceRadar />;
    case "documents":
      return <Documents tab={view.tab} />;
    case "workspace":
      if (view.flow === "uc1") return <WorkspaceUC1 />;
      if (view.flow === "uc2") return <WorkspaceUC2 />;
      if (view.flow === "uc3") return <WorkspaceUC3 />;
      if (view.flow === "uc4") return <WorkspaceUC4 />;
      return null;
    case "doc":
      return <DocPreview id={view.id} />;
    case "logout":
      return <Logout />;
    case "employee-landing":
      return <EmployeeLanding />;
    case "employee-chat":
      // Chat is now a side-panel inside the employee landing view; route any
      // legacy navigation back to that single combined surface.
      return <EmployeeLanding initialChatOpen />;
  }
}


function Shell() {
  const { persona, view } = useApp();
  // Global sidebar only on Dashboard. Compliance Radar embeds its own
  // sidebar; workspace + doc pages are full-bleed with their own topbar.
  const showSidebar =
    persona === "hrbp" &&
    (view.kind === "dashboard" ||
      view.kind === "insights" ||
      view.kind === "compliance-radar" ||
      view.kind === "documents");

  return (
    <div className="min-h-screen bg-surface-fog text-ink font-sans">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Router />
        </main>
      </div>
      <CompletionModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
