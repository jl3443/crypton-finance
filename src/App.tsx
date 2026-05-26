import { AppProvider, useApp } from "@/state";
import { Login } from "@/views/Login";
import { Hub } from "@/views/Hub";
import { Workspace } from "@/views/Workspace";
import { DocView } from "@/views/DocView";
import { ExportView } from "@/views/ExportView";

function Router() {
  const { view } = useApp();

  switch (view.kind) {
    case "login":
      return <Login />;
    case "hub":
      return <Hub />;
    case "workspace":
      return <Workspace flow={view.flow} />;
    case "doc":
      return <DocView id={view.id} />;
    case "export":
      return <ExportView flow={view.flow} />;
  }
}

function Shell() {
  return (
    <div className="min-h-screen text-ink font-sans">
      <Router />
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
