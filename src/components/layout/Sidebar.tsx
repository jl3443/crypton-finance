import * as React from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/state";
import {
  LayoutDashboard,
  TrendingUp,
  Radar,
  Users,
  Briefcase,
  Inbox,
  FileText,
  BookOpen,
  ClipboardList,
  Settings,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  view?:
    | { kind: "dashboard" }
    | { kind: "insights" }
    | { kind: "compliance-radar" }
    | { kind: "documents"; tab: "letters" | "policies" };
  badge?: { kind: "star" } | { kind: "count"; value: number } | { kind: "soon" };
  active?: boolean;
  comingSoon?: boolean;
};

type Section = {
  title: string;
  items: NavItem[];
};

const sections: Section[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, view: { kind: "dashboard" }, active: true },
      { label: "AI insights", icon: TrendingUp, view: { kind: "insights" } },
    ],
  },
  {
    title: "HR operations",
    items: [
      { label: "Compliance radar", icon: Radar, view: { kind: "compliance-radar" }, badge: { kind: "star" } },
      { label: "People lifecycle", icon: Users, badge: { kind: "count", value: 5 } },
      { label: "Workforce", icon: Briefcase },
      { label: "Cases", icon: Inbox, badge: { kind: "count", value: 12 } },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "Letters", icon: FileText, view: { kind: "documents", tab: "letters" } },
      { label: "Policies", icon: BookOpen, view: { kind: "documents", tab: "policies" } },
      { label: "Audit log", icon: ClipboardList },
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", icon: Settings }],
  },
];

export function Sidebar() {
  const { view, go, signOut } = useApp();
  const activeKind = view.kind;

  return (
    <aside className="flex flex-col w-[240px] shrink-0 h-screen bg-white border-r border-divider sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-surface-deep flex items-center justify-center">
            <span className="text-ink-inverse text-[15px] leading-none font-bold">✦</span>
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-bold text-ink">HR concierge</div>
            <div className="text-[12px] text-mute">Agentic AI for HR</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto pt-3">
        {sections.map((section) => (
          <div key={section.title} className="pb-3">
            <div className="px-5 pb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-mute">
              {section.title}
            </div>
            <ul>
              {section.items.map((item) => {
                const isActive =
                  (item.view?.kind === "dashboard" && activeKind === "dashboard") ||
                  (item.view?.kind === "insights" && activeKind === "insights") ||
                  (item.view?.kind === "compliance-radar" && activeKind === "compliance-radar") ||
                  (item.view?.kind === "documents" &&
                    activeKind === "documents" &&
                    (view as { kind: "documents"; tab: string }).tab === item.view.tab);
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      disabled={item.comingSoon}
                      onClick={() => item.view && go(item.view as any)}
                      className={cn(
                        "ui-pill w-full flex items-center gap-2.5 px-5 py-1.5 text-[13px] text-left",
                        "border-l-4 border-transparent",
                        isActive && "bg-surface-mint border-surface-deep text-surface-deep font-medium",
                        !isActive && !item.comingSoon && "text-ink hover:bg-surface-mint/40",
                        item.comingSoon && "text-mute cursor-not-allowed",
                      )}
                    >
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge?.kind === "star" && (
                        <span className="text-surface-deep text-[12px]">★</span>
                      )}
                      {item.badge?.kind === "count" && (
                        <span className="text-[11px] rounded-full bg-surface-fog text-mute px-1.5 py-0.5">
                          {item.badge.value}
                        </span>
                      )}
                      {item.badge?.kind === "soon" && (
                        <span className="text-[11px] text-mute">Soon</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Persona footer */}
      <div className="px-4 py-4 border-t border-divider flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-surface-sage flex items-center justify-center text-[12px] font-bold text-ink-inverse">
          HR
        </div>
        <div className="leading-tight flex-1 min-w-0">
          <div className="text-[13px] text-ink truncate">HRBP · Senior</div>
          <button
            type="button"
            onClick={signOut}
            className="text-[11px] text-mute hover:text-ink"
          >
            Switch role · Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
