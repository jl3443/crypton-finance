import { useEffect, useState } from "react";
import { useApp } from "@/state";

/**
 * Persona-switch ceremony: black fade → login screen autofills employee
 * credentials → primary button "presses itself" → employee landing.
 *
 * Total runtime ~3 seconds.
 */
export function Logout() {
  const { signIn } = useApp();
  const [phase, setPhase] = useState<"fade" | "login" | "complete">("fade");
  const [emailTyped, setEmailTyped] = useState(0);
  const targetEmail = "employee@company.com";

  // Phase 1: hold black for 600ms then move to login form
  useEffect(() => {
    if (phase !== "fade") return;
    const t = window.setTimeout(() => setPhase("login"), 600);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Phase 2: typewriter email, then "press" the sign-in button
  useEffect(() => {
    if (phase !== "login") return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + 200;
      const elapsed = Math.max(0, now - start);
      const next = Math.min(targetEmail.length, Math.floor(elapsed / 50));
      setEmailTyped(next);
      if (next < targetEmail.length) raf = requestAnimationFrame(tick);
      else {
        // Auto-submit
        const t = window.setTimeout(() => {
          setPhase("complete");
          window.setTimeout(() => signIn("employee"), 400);
        }, 600);
        return () => window.clearTimeout(t);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, signIn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink text-ink-inverse">
      {phase === "fade" && (
        <div className="text-[14px] tracking-[0.08em] uppercase opacity-60">Signing out…</div>
      )}

      {(phase === "login" || phase === "complete") && (
        <div
          className={`bg-white text-ink rounded-md p-10 w-[420px] space-y-6 transition-opacity duration-500 ${
            phase === "complete" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-deep flex items-center justify-center text-ink-inverse font-bold">
              ✦
            </div>
            <div>
              <div className="text-[14px] font-bold">HR concierge</div>
              <div className="text-[11px] text-mute">Sign in</div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] tracking-[0.06em] uppercase text-mute font-medium">
              Email
            </label>
            <div className="border-b-[1.5px] border-ink py-2 text-[14px] min-h-[28px]">
              {targetEmail.slice(0, emailTyped)}
              <span className="inline-block w-[2px] h-3.5 bg-ink ml-0.5 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] tracking-[0.06em] uppercase text-mute font-medium">
              Password
            </label>
            <div className="border-b-[1.5px] border-ink py-2 text-[14px] min-h-[28px]">
              {emailTyped >= targetEmail.length ? "••••••••••" : ""}
            </div>
          </div>

          <button
            type="button"
            className={`ui-pill w-full px-5 py-3 rounded-full bg-black text-ink-inverse font-bold text-[15px] transition-all ${
              phase === "complete" ? "scale-[0.96]" : ""
            }`}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
