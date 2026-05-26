import { useEffect, useState } from "react";
import { useApp } from "@/state";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";

/**
 * Crypton CFO login ceremony.
 * Single persona (Wei Chen). Autotyped email + password dots + sign-in
 * pill that fades to the hub. The autotype + the calm DM Sans hierarchy
 * does most of the "different surface than your existing tools" beat.
 */
export function Login() {
  const { signIn, cfo } = useApp();
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(cfo.email.slice(0, i));
      if (i >= cfo.email.length) {
        window.clearInterval(id);
        window.setTimeout(() => setDone(true), 350);
      }
    }, 55);
    return () => window.clearInterval(id);
  }, [cfo.email]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[460px]">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5 mb-12">
          <span className="grid w-9 h-9 place-items-center rounded-md bg-surface-deep text-ink-inverse text-[14px] font-bold tracking-[-0.02em]">
            CX
          </span>
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-ink tracking-[-0.01em]">
              Crypton Finance
            </div>
            <div className="text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
              AI · Finance Operations
            </div>
          </div>
        </div>

        <div className="space-y-7 ai-spring">
          <div className="space-y-2">
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-mute">
              Welcome back, {cfo.name.split(" ")[0]}
            </span>
            <h1
              className="text-ink leading-[1.05]"
              style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)" }}
            >
              Sign in to your<br />finance workspace.
            </h1>
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (done) signIn();
            }}
          >
            <Field label="Email">
              <span className={done ? "text-ink" : "text-ink ai-caret"}>
                {typed}
              </span>
            </Field>
            <Field label="Password">
              <span className="tracking-[0.4em] text-ink">••••••••••</span>
            </Field>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.08em] uppercase text-mute">
                <AIDot size={6} tone="green" pulse={done} />
                {done ? "Identity verified · MFA passed" : "Authenticating…"}
              </div>
              <PillButton
                type="submit"
                variant="primary"
                size="md"
                disabled={!done}
                arrow
              >
                Continue
              </PillButton>
            </div>
          </form>
        </div>

        <footer className="mt-16 text-[10px] tracking-[0.18em] uppercase font-medium text-mute">
          Confidential · CFO Org · SSO · MFA Required
        </footer>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.18em] uppercase text-mute font-medium mb-1.5">
        {label}
      </span>
      <div className="bg-white border border-divider rounded-md px-4 py-3 text-[14px] font-medium min-h-[48px] flex items-center">
        {children}
      </div>
    </label>
  );
}
