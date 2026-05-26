import { useState } from "react";
import { useApp } from "@/state";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Lock,
  User as UserIcon,
  LogIn,
} from "lucide-react";

// Tri-panel hero photography — served locally from /public so the page
// works on corporate networks that block images.unsplash.com.
const HERO_COLUMNS = [
  {
    label: "People & Lifecycle",
    src: "/hero-people.jpg",
  },
  {
    label: "Policy & Compliance",
    src: "/hero-policy.jpg",
  },
  {
    label: "Talent & Retention",
    src: "/hero-talent.jpg",
  },
];

// Two-tone accent — mirrors the V0 reference's "card per role, one accent
// per card" pattern. Teal for the operator; warm amber for the self-serve.
type AccentKey = "teal" | "amber";
const ACCENT: Record<AccentKey, { hex: string; halo: string }> = {
  teal: { hex: "#14b8a6", halo: "rgba(20,184,166,0.45)" },
  amber: { hex: "#f59e0b", halo: "rgba(245,158,11,0.40)" },
};

type Persona = {
  id: "hrbp" | "employee";
  badge: string;
  name: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  capabilities: string[];
  userId: string;
  accent: AccentKey;
};

const PERSONAS: Persona[] = [
  {
    id: "hrbp",
    badge: "HR Operations",
    name: "HRBP Control Tower",
    Icon: ShieldCheck,
    capabilities: [
      "Cross-jurisdiction policy radar",
      "Decision card with full audit trail",
      "Workday · Okta · email execution",
    ],
    userId: "agenticuser1",
    accent: "teal",
  },
  {
    id: "employee",
    badge: "Self-Service",
    name: "Employee Concierge",
    Icon: MessageSquare,
    capabilities: [
      "Conversational HR helpdesk",
      "Verification letters in 32 seconds",
      "Coverage plans + time off auto-drafted",
    ],
    userId: "agenticuser2",
    accent: "amber",
  },
];

export function Login() {
  const { signIn } = useApp();
  const [phase, setPhase] = useState<"hero" | "personas">("hero");

  return (
    <div className="fixed inset-0 overflow-auto bg-neutral-950 text-white">
      <HeroBackground heavyOverlay={phase === "personas"} />

      <div className="relative min-h-screen flex flex-col">
        <TopBar phase={phase} onSelect={() => setPhase("personas")} onBack={() => setPhase("hero")} />

        <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12 pt-6 sm:px-10">
          {phase === "hero" ? (
            <Hero onAccess={() => setPhase("personas")} />
          ) : (
            <PersonaGrid signIn={signIn} />
          )}
        </main>

        <footer className="relative z-10 px-6 pb-7 text-center sm:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Confidential · Enterprise Use Only
          </p>
        </footer>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hero photo backdrop — three full-bleed columns
// ────────────────────────────────────────────────────────────────────────────

function HeroBackground({ heavyOverlay = false }: { heavyOverlay?: boolean }) {
  // Equal column tints — the previous extra-dark centre column read as
  // "blurred" against the bright side columns. A central radial spotlight
  // still focuses the headline area without making the middle photo look
  // noticeably murkier than its neighbours.
  const colTint = heavyOverlay ? "bg-black/62" : "bg-black/42";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3">
        {HERO_COLUMNS.map((col) => (
          <div key={col.label} className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${col.src}')` }}
            />
            <div className={cn("absolute inset-0 transition-colors duration-500", colTint)} />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
            {!heavyOverlay && (
              <span className="absolute inset-x-0 bottom-20 z-10 text-center text-[11px] font-bold uppercase tracking-[0.32em] text-white/60">
                {col.label}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
      <div className="absolute inset-y-0 left-2/3 w-px bg-white/10" />
      {/* No central radial spotlight — was darkening the middle photo
          relative to its neighbours; headline relies on text drop-shadow
          for legibility instead. */}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Top bar — sparkle tile + brand label; right pill swaps SELECT ROLE / BACK
// ────────────────────────────────────────────────────────────────────────────

function TopBar({
  phase,
  onSelect,
  onBack,
}: {
  phase: "hero" | "personas";
  onSelect: () => void;
  onBack: () => void;
}) {
  return (
    <header className="relative z-20 flex w-full items-center justify-between px-6 py-5 sm:px-10">
      <div className="inline-flex items-center gap-3">
        <span className="grid w-10 h-10 place-items-center rounded-xl border border-teal-400/45 bg-teal-400/15 text-teal-300">
          <Sparkles size={16} strokeWidth={2} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-[-0.01em] text-white">
            Agentic HR Operations
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
            Multi AI Agent System
          </span>
        </span>
      </div>

      {phase === "hero" ? (
        // Neutral at rest (white outline + white text), teal only on hover.
        <button
          type="button"
          onClick={onSelect}
          className="ui-pill group inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.20em] text-white/85 transition-all duration-300 hover:border-teal-400 hover:bg-teal-400/[0.08] hover:text-teal-300"
        >
          Select Role
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="ui-pill group inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.20em] text-white/85 transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
      )}
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hero — small eyebrow → headline → sub → solid teal Access Portal
// ────────────────────────────────────────────────────────────────────────────

function Hero({ onAccess }: { onAccess: () => void }) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
      <span className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
        Global HR Intelligence
      </span>
      <h1
        className="font-bold leading-[1.04] tracking-[-0.025em] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]"
        style={{ fontSize: "clamp(2rem, 5.6vw, 4.4rem)" }}
      >
        Agentic HR Operations
      </h1>
      <p className="mt-6 max-w-xl text-[14px] font-normal leading-[1.55] text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-[15px]">
        Detect policy changes, assess workforce impact, draft compliant
        artifacts, route approvals, and execute HR actions with a complete
        audit trail.
      </p>
      <button
        type="button"
        onClick={onAccess}
        className="ui-pill group mt-8 inline-flex items-center gap-3 rounded-md bg-teal-400 px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.22em] text-neutral-950 transition-all duration-300 hover:bg-teal-300 active:scale-[0.97]"
      >
        Access Portal
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Persona selector — title + 2 dark glass cards, V0-reference style
// ────────────────────────────────────────────────────────────────────────────

function PersonaGrid({ signIn }: { signIn: (id: "hrbp" | "employee") => void }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl">
      <div className="text-center mb-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          Agentic Workspaces
        </span>
        <h2
          className="mt-3 font-bold leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
          style={{ fontSize: "clamp(1.85rem, 4.4vw, 3.2rem)" }}
        >
          Select Your Role
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-[1.55] text-white/75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-[14.5px]">
          Each workspace deploys a curated set of AI agents calibrated to your
          role and decision scope.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 max-w-[800px] mx-auto">
        {PERSONAS.map((p) => (
          <PersonaCard key={p.id} persona={p} signIn={signIn} />
        ))}
      </div>

      <p className="mt-10 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
        AI agents activate upon persona selection · actions are audited
      </p>
    </div>
  );
}

function PersonaCard({
  persona,
  signIn,
}: {
  persona: Persona;
  signIn: (id: "hrbp" | "employee") => void;
}) {
  const [user, setUser] = useState(persona.userId);
  const [pwd, setPwd] = useState("agentic-demo");
  const { Icon } = persona;
  const tone = ACCENT[persona.accent];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(persona.id);
  };

  return (
    <article
      style={{
        // Inner accent ring + outer accent-tinted drop shadow — the signature
        // glow that the V0 reference cards use to differentiate roles.
        boxShadow: `inset 0 0 0 1px ${tone.hex}33, 0 25px 70px -30px ${tone.halo}`,
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Top-right accent halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-25 blur-3xl"
        style={{ background: tone.hex }}
      />

      {/* Header — icon tile + role badge */}
      <div className="relative flex items-center justify-between gap-3">
        <span className="grid w-10 h-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.06] text-white/85">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{
            color: tone.hex,
            background: `${tone.hex}14`,
            border: `1px solid ${tone.hex}55`,
          }}
        >
          {persona.badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="relative mt-5 min-h-[2.6rem] text-[19px] font-bold leading-[1.15] tracking-[-0.015em] text-white">
        {persona.name}
      </h3>

      {/* Capabilities */}
      <ul className="relative mt-4 space-y-2">
        {persona.capabilities.map((cap) => (
          <li
            key={cap}
            className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-white/80"
          >
            <span
              aria-hidden
              className="mt-[6px] block w-1.5 h-1.5 shrink-0 rounded-full"
              style={{ background: tone.hex }}
            />
            <span>{cap}</span>
          </li>
        ))}
      </ul>

      {/* Accent gradient hairline */}
      <div
        className="relative my-5 h-px w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${tone.hex}55, transparent)`,
        }}
      />

      {/* Form — mt-auto pins the Sign In baseline across cards regardless of
          title or capability list height. */}
      <form onSubmit={handleSubmit} className="relative mt-auto flex flex-col gap-2">
        <Field
          icon={UserIcon}
          label="User ID"
          name={`${persona.id}-user`}
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Field
          icon={Lock}
          label="Password"
          name={`${persona.id}-pwd`}
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button
          type="submit"
          style={{ background: tone.hex }}
          className="ui-pill mt-3 inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-neutral-950 transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
        >
          <LogIn size={14} />
          Sign In
        </button>
      </form>
    </article>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="group relative flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 transition-colors duration-200 focus-within:bg-white/[0.07] focus-within:border-white/40">
      <Icon size={14} strokeWidth={1.8} className="text-white/55 shrink-0" />
      <input
        {...rest}
        className="flex-1 bg-transparent text-[13px] font-medium tracking-[0.02em] text-white placeholder-white/40 outline-none"
      />
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 shrink-0">
        {label}
      </span>
    </label>
  );
}
