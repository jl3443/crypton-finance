import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PillButton } from "@/components/blocks/PillButton";
import type { FlowId } from "@/state";
import { X, RotateCcw, Sparkles } from "lucide-react";

type TextField = {
  kind: "text";
  id: string;
  label: string;
  value: string;
  hint?: string;
};
type NumberField = {
  kind: "number";
  id: string;
  label: string;
  value: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
};
type SelectField = {
  kind: "select";
  id: string;
  label: string;
  value: string;
  options: string[];
  hint?: string;
};
type DateField = {
  kind: "date";
  id: string;
  label: string;
  value: string;
  hint?: string;
};
type ChecklistField = {
  kind: "checklist";
  id: string;
  label: string;
  options: string[];
  value: string[];
  hint?: string;
};
type TextareaField = {
  kind: "textarea";
  id: string;
  label: string;
  value: string;
  rows?: number;
  hint?: string;
};

type Field = TextField | NumberField | SelectField | DateField | ChecklistField | TextareaField;

type Section = {
  title: string;
  sub?: string;
  badge?: string;
  fields: Field[];
};

type FlowConfig = {
  title: string;
  intro: string;
  primaryCta: string;
  aiInsight: string;
  sections: Section[];
};

const configs: Record<FlowId, FlowConfig> = {
  uc1: {
    title: "Edit offboarding package · Camila Souza",
    intro:
      "Adjust any field. The agent will re-cost severance and re-route homologação before sign-off.",
    primaryCta: "Save & continue",
    aiInsight:
      "Revoking high-risk access (AWS, PagerDuty, Lever) 30+ minutes before cutoff aligns with 96% of past CLT offboardings · 0 incidents in last 22 cases.",
    sections: [
      {
        title: "Knowledge transfer",
        sub: "14 single-owner areas across GitHub, Confluence, Jira",
        badge: "2 successors",
        fields: [
          {
            kind: "text",
            id: "succ1",
            label: "Successor #1",
            value: "Rafael F.",
            hint: "8 areas · 4 transfer sessions",
          },
          {
            kind: "text",
            id: "succ2",
            label: "Successor #2",
            value: "Beatriz O.",
            hint: "4 areas · 4 transfer sessions",
          },
          {
            kind: "date",
            id: "exitInt",
            label: "Exit interview",
            value: "2026-06-26",
            hint: "Thu 15:00 BRT · São Paulo office",
          },
        ],
      },
      {
        title: "Access revocation",
        sub: "23 SaaS systems · CLT cut-off Fri 27 Jun",
        badge: "23 systems queued",
        fields: [
          { kind: "date", id: "lastDay", label: "Last working day", value: "2026-06-27" },
          {
            kind: "select",
            id: "cutoff",
            label: "Cut-off time",
            value: "17:00 BRT",
            options: ["13:00 BRT", "15:00 BRT", "17:00 BRT", "19:00 BRT", "23:59 BRT"],
          },
          {
            kind: "checklist",
            id: "keepAccess",
            label: "Keep access to (post-exit, time-boxed)",
            options: [
              "Slack #alumni",
              "Confluence (read-only)",
              "Workday (self-service)",
              "Personal email forwarding · 30 days",
            ],
            value: ["Personal email forwarding · 30 days"],
          },
        ],
      },
      {
        title: "Exit package · TRCT-format",
        sub: "Brazilian payroll · auto-priced from Workday",
        badge: "BRL · PT + EN",
        fields: [
          {
            kind: "number",
            id: "basePay",
            label: "Base salary · prorated",
            value: 22313,
            step: 50,
            prefix: "BRL",
          },
          {
            kind: "number",
            id: "thirteenth",
            label: "13th-month proration (6/12)",
            value: 12400,
            step: 50,
            prefix: "BRL",
          },
          {
            kind: "number",
            id: "vacation",
            label: "Vacation + 1/3 constitutional bonus",
            value: 19840,
            step: 50,
            prefix: "BRL",
          },
          {
            kind: "number",
            id: "aviso",
            label: "Aviso prévio · paid in lieu",
            value: 24800,
            step: 50,
            prefix: "BRL",
          },
          {
            kind: "select",
            id: "lang",
            label: "Offboarding letter language",
            value: "Portuguese + English",
            options: ["Portuguese + English", "Portuguese only", "English only"],
          },
          {
            kind: "select",
            id: "homologation",
            label: "Homologação venue",
            value: "Local union (SINDICATO)",
            options: ["Local union (SINDICATO)", "Ministry of Labor (MTE)", "Online (e-Social)"],
          },
        ],
      },
    ],
  },
  uc2: {
    title: "Edit compliance roll-out · German Working Hours Act",
    intro: "Tune the phase plan, payroll scope, and works-council message before sign-off.",
    primaryCta: "Save & continue",
    aiInsight:
      "A 3-phase 90-day roll-out beats a single-shot change on works-council acceptance (78% vs 41% in prior comparable DACH changes).",
    sections: [
      {
        title: "Roll-out plan",
        sub: "How the workweek change lands",
        badge: "3 phases · 90 days",
        fields: [
          { kind: "date", id: "phase1", label: "Phase 1 · pilot start", value: "2026-06-01", hint: "Engineering + R&D (47 employees)" },
          { kind: "date", id: "phase2", label: "Phase 2 · go-live", value: "2026-07-01", hint: "Operations + Sales (62 employees)" },
          { kind: "date", id: "phase3", label: "Phase 3 · complete", value: "2026-08-01", hint: "Remaining German contracts (38 employees)" },
        ],
      },
      {
        title: "Payroll scope",
        sub: "4 German cost centres",
        badge: "Workday auto-push",
        fields: [
          {
            kind: "checklist",
            id: "costCentres",
            label: "Cost centres to update",
            options: [
              "DE-001 · Heidelberg HQ",
              "DE-002 · Frankfurt office",
              "DE-003 · Berlin lab",
              "DE-004 · Munich plant",
            ],
            value: [
              "DE-001 · Heidelberg HQ",
              "DE-002 · Frankfurt office",
              "DE-003 · Berlin lab",
              "DE-004 · Munich plant",
            ],
          },
          {
            kind: "select",
            id: "effective",
            label: "Workday effective date",
            value: "First day of phase",
            options: ["First day of phase", "First of the month after each phase", "Single date · 2026-08-01"],
          },
        ],
      },
      {
        title: "Employee announcement",
        sub: "Bilingual letter · German + English",
        badge: "147 recipients",
        fields: [
          {
            kind: "select",
            id: "tone",
            label: "Tone",
            value: "Direct + reassuring",
            options: ["Direct + reassuring", "Formal", "Conversational"],
          },
          {
            kind: "textarea",
            id: "preamble",
            label: "Opening line (HRBP voice)",
            value:
              "Following the latest amendment to the German Working Hours Act, your weekly hours will be adjusted in three phases over the next 90 days.",
            rows: 3,
          },
        ],
      },
      {
        title: "Works council notice",
        sub: "§87 (1) Nr. 2 BetrVG",
        badge: "Filed before launch",
        fields: [
          { kind: "date", id: "filedOn", label: "Filing date", value: "2026-05-21", hint: "Minimum 7 days before phase 1" },
          {
            kind: "select",
            id: "ackChannel",
            label: "Acknowledgement channel",
            value: "Works council portal",
            options: ["Works council portal", "Signed PDF", "In-person meeting"],
          },
        ],
      },
    ],
  },
  uc4: {
    title: "Edit onboarding package · Aurélie L.",
    intro:
      "Adjust the Day-1 calendar, buddy assignment, 30/60/90 plan, and compliance items before sign-off.",
    primaryCta: "Save & continue",
    aiInsight:
      "Day-1 calendars with at least one 1:1 with the hiring manager + a buddy lunch hit 92% \"great first day\" rating in past Basel hires.",
    sections: [
      {
        title: "Start details",
        sub: "Pulled from the signed offer",
        badge: "Mon 25 May",
        fields: [
          { kind: "text", id: "candidate", label: "Candidate", value: "Aurélie L.", hint: "From signed offer" },
          { kind: "text", id: "role", label: "Role", value: "Marketing Manager" },
          { kind: "date", id: "start", label: "Start date", value: "2026-05-25" },
          { kind: "text", id: "manager", label: "Hiring manager", value: "Niklas K." },
          { kind: "text", id: "buddy", label: "Buddy", value: "Léa M.", hint: "Auto-picked from team · same level, EMEA marketing" },
        ],
      },
      {
        title: "Preboarding bundle",
        sub: "What goes out before Day 1",
        badge: "4 dispatchers",
        fields: [
          {
            kind: "checklist",
            id: "preboarding",
            label: "Include in bundle",
            options: [
              "Welcome message (bilingual)",
              "Equipment ticket (MacBook Pro 14)",
              "IT account provisioning",
              "Work permit check",
              "Pre-read deck on Q1 brand audit",
            ],
            value: [
              "Welcome message (bilingual)",
              "Equipment ticket (MacBook Pro 14)",
              "IT account provisioning",
              "Work permit check",
            ],
          },
          {
            kind: "select",
            id: "deliverWindow",
            label: "Equipment delivery window",
            value: "Friday · before Day 1",
            options: ["Friday · before Day 1", "Day 1 morning", "Day 2"],
          },
        ],
      },
      {
        title: "Day-1 calendar",
        sub: "Auto-built from Niklas's calendar",
        badge: "7 meetings",
        fields: [
          {
            kind: "select",
            id: "kickoff",
            label: "Welcome with HRBP",
            value: "09:00 · Sara K. · in-person",
            options: [
              "09:00 · Sara K. · in-person",
              "09:30 · Sara K. · Teams",
              "10:00 · Sara K. · in-person",
            ],
          },
          {
            kind: "select",
            id: "managerSlot",
            label: "1:1 with hiring manager",
            value: "13:00 · 90 min · Niklas K.",
            options: [
              "11:00 · 60 min · Niklas K.",
              "13:00 · 90 min · Niklas K.",
              "14:30 · 60 min · Niklas K.",
            ],
          },
          {
            kind: "checklist",
            id: "extras",
            label: "Optional Day-1 add-ons",
            options: ["Office tour", "Benefits walkthrough", "Coffee with skip-level", "Product demo"],
            value: ["Office tour", "Benefits walkthrough", "Product demo"],
          },
        ],
      },
      {
        title: "30 / 60 / 90 plan",
        sub: "Generated from role template",
        badge: "9 milestones",
        fields: [
          {
            kind: "textarea",
            id: "thirty",
            label: "First 30 days · headline",
            value:
              "Land · learn the brand. Meet every EMEA marketing team (12). Shadow 3 active campaigns. Read Q1 brand audit + competitive scan.",
            rows: 3,
          },
          {
            kind: "textarea",
            id: "sixty",
            label: "First 60 days · headline",
            value:
              "Own a workstream. Take Q3 fragrance launch. Present pricing brief to leadership. Run first cross-functional review.",
            rows: 3,
          },
          {
            kind: "textarea",
            id: "ninety",
            label: "First 90 days · headline",
            value:
              "Ship & scale. Launch Basel hub regional plan. Hire one direct report (BC funded). Q3 KPI dashboard live in Tableau.",
            rows: 3,
          },
        ],
      },
      {
        title: "Switzerland compliance",
        sub: "Items needing your signature",
        badge: "2 to sign",
        fields: [
          {
            kind: "checklist",
            id: "complianceSign",
            label: "Sign off on Aurélie's behalf",
            options: [
              "Quellensteuer form (Basel canton)",
              "Cantonal residency registration reminder",
              "Mandatory training enrollment (ART)",
              "Mandatory training enrollment (Swiss FADP)",
            ],
            value: [
              "Quellensteuer form (Basel canton)",
              "Cantonal residency registration reminder",
            ],
          },
        ],
      },
    ],
  },
  uc3: {
    title: "Edit retention package · Marcus C.",
    intro: "Pick the scenario, adjust the offer, and the agent will refresh equity + budget impact.",
    primaryCta: "Save & continue",
    aiInsight:
      "Mid scenario keeps Marcus 6% above same-level peers · 92% retention probability over next 12 months based on 47 comparable cases.",
    sections: [
      {
        title: "Scenario",
        sub: "Three options drafted from market + internal equity",
        badge: "Pick one",
        fields: [
          {
            kind: "select",
            id: "scenario",
            label: "Active scenario",
            value: "Mid · $158K",
            options: ["Conservative · $148K", "Mid · $158K", "Retention · $168K", "Custom"],
          },
          {
            kind: "number",
            id: "baseSalary",
            label: "Base salary",
            value: 158000,
            step: 1000,
            prefix: "$",
            hint: "Auto-fills from the chosen scenario",
          },
          { kind: "number", id: "signOn", label: "Sign-on retention bonus", value: 12000, step: 500, prefix: "$" },
          { kind: "number", id: "equity", label: "Equity refresh", value: 35000, step: 1000, prefix: "$" },
        ],
      },
      {
        title: "Conditions",
        sub: "How the offer is communicated",
        badge: "HRBP × Manager",
        fields: [
          { kind: "date", id: "effective", label: "Effective date", value: "2026-06-01" },
          {
            kind: "select",
            id: "channel",
            label: "Communication channel",
            value: "Manager + HRBP joint call",
            options: ["Manager + HRBP joint call", "Manager only", "Written offer first, call after"],
          },
          {
            kind: "select",
            id: "claw",
            label: "Retention clawback period",
            value: "12 months",
            options: ["6 months", "12 months", "18 months", "24 months"],
          },
        ],
      },
      {
        title: "Stakeholder notifications",
        sub: "Routed automatically on save",
        fields: [
          {
            kind: "checklist",
            id: "notify",
            label: "Notify",
            options: [
              "Manager (requesting)",
              "Finance Director",
              "Comp & ben lead",
              "Marcus's skip-level",
            ],
            value: ["Manager (requesting)", "Finance Director", "Comp & ben lead"],
          },
        ],
      },
    ],
  },
};

export function EditDecisionModal({
  flow,
  open,
  onClose,
  onSave,
}: {
  flow: FlowId;
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}) {
  const cfg = configs[flow];
  // Local edit state — initialized from config defaults.
  const initial = () => {
    const map: Record<string, string | number | string[]> = {};
    cfg.sections.forEach((s) =>
      s.fields.forEach((f) => {
        map[f.id] = f.kind === "checklist" ? [...f.value] : f.value;
      }),
    );
    return map;
  };

  const [values, setValues] = useState<Record<string, string | number | string[]>>(initial);
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initial());
      setSaving(false);
      const t = window.setTimeout(() => setVisible(true), 20);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flow]);

  if (!open) return null;

  const close = () => {
    setVisible(false);
    window.setTimeout(onClose, 200);
  };

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      onSave?.();
      close();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <aside
        className="relative w-full max-w-[720px] h-full bg-white border-l border-divider shadow-[0_-12px_60px_rgba(8,67,55,0.18)] flex flex-col transition-transform duration-300"
        style={{ transform: visible ? "translateX(0)" : "translateX(24px)", opacity: visible ? 1 : 0 }}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-divider flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-bold">
              Edit before approving
            </div>
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">{cfg.title}</h2>
            <p className="text-[12px] text-mute">{cfg.intro}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="ui-pill w-8 h-8 rounded-full border border-divider flex items-center justify-center text-ink hover:bg-surface-fog"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </header>

        {/* AI insight strip */}
        <div className="px-6 py-2.5 bg-surface-mint/40 border-b border-divider flex items-start gap-2 text-[12px] text-ink">
          <Sparkles size={14} strokeWidth={1.8} className="text-surface-deep shrink-0 mt-0.5" />
          <span>{cfg.aiInsight}</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {cfg.sections.map((sec) => (
            <section key={sec.title} className="bg-surface-fog rounded-md border border-divider">
              <header className="px-4 py-2.5 border-b border-divider flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-ink">{sec.title}</div>
                  {sec.sub && <div className="text-[11px] text-mute mt-0.5">{sec.sub}</div>}
                </div>
                {sec.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-deep text-ink-inverse text-[10px] tracking-[0.06em] uppercase font-medium">
                    {sec.badge}
                  </span>
                )}
              </header>
              <div className="px-4 py-3 space-y-3">
                {sec.fields.map((f) => (
                  <FieldRow
                    key={f.id}
                    field={f}
                    value={values[f.id]}
                    onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-divider flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setValues(initial())}
            className="ui-pill inline-flex items-center gap-1.5 text-[12px] text-mute hover:text-ink px-2 py-1 rounded"
          >
            <RotateCcw size={13} strokeWidth={1.8} />
            Reset to agent defaults
          </button>
          <div className="flex items-center gap-2">
            <PillButton variant="secondary" size="md" onClick={close}>
              Cancel
            </PillButton>
            <PillButton
              variant="primary"
              size="md"
              arrow
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : cfg.primaryCta}
            </PillButton>
          </div>
        </footer>
      </aside>
    </div>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string | number | string[];
  onChange: (v: string | number | string[]) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] tracking-[0.06em] uppercase text-mute font-medium">
        {field.label}
      </label>
      {field.kind === "text" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-divider rounded px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-surface-deep focus:ring-2 focus:ring-surface-mint"
        />
      )}
      {field.kind === "number" && (
        <div className="flex items-center bg-white border border-divider rounded focus-within:border-surface-deep focus-within:ring-2 focus-within:ring-surface-mint overflow-hidden">
          {field.prefix && (
            <span className="px-3 py-2 text-[12px] text-mute bg-surface-fog border-r border-divider">
              {field.prefix}
            </span>
          )}
          <input
            type="number"
            step={field.step ?? 1}
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 px-3 py-2 text-[13px] text-ink tabular-nums focus:outline-none bg-transparent"
          />
          {field.suffix && (
            <span className="px-3 py-2 text-[12px] text-mute bg-surface-fog border-l border-divider">
              {field.suffix}
            </span>
          )}
        </div>
      )}
      {field.kind === "date" && (
        <input
          type="date"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-divider rounded px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-surface-deep focus:ring-2 focus:ring-surface-mint"
        />
      )}
      {field.kind === "select" && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-divider rounded px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-surface-deep focus:ring-2 focus:ring-surface-mint"
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {field.kind === "textarea" && (
        <textarea
          rows={field.rows ?? 3}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-divider rounded px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-surface-deep focus:ring-2 focus:ring-surface-mint leading-[18px] resize-none"
        />
      )}
      {field.kind === "checklist" && (
        <div className="space-y-1.5 pt-1">
          {field.options.map((opt) => {
            const checked = (value as string[]).includes(opt);
            return (
              <label
                key={opt}
                className={cn(
                  "flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded text-[13px] transition-colors",
                  checked ? "bg-surface-mint/50 text-ink" : "text-ink hover:bg-white",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const arr = value as string[];
                    onChange(
                      checked ? arr.filter((x) => x !== opt) : [...arr, opt],
                    );
                  }}
                  className="w-3.5 h-3.5 accent-[var(--accent-green-deep)]"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}
      {field.hint && (
        <div className="text-[11px] text-mute pt-0.5">{field.hint}</div>
      )}
    </div>
  );
}
