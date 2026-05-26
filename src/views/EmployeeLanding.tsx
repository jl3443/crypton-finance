import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, type DocId } from "@/state";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { StreamingText } from "@/components/ai/StreamingText";
import { TypingDots } from "@/components/ai/TypingDots";
import { SpringIn } from "@/components/ai/SpringIn";
import { EmploymentVerification } from "@/components/docs/EmploymentVerification";
import { CoveragePlan } from "@/components/docs/CoveragePlan";
import { EmbeddedDocContext } from "@/components/docs/DocChrome";
import { Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tile = { glyph: string; label: string };

const tiles: Tile[] = [
  { glyph: "📄", label: "Letters" },
  { glyph: "💬", label: "HR chat" },
  { glyph: "🧘", label: "Wellness" },
  { glyph: "🎁", label: "Benefits" },
  { glyph: "⏰", label: "Time off" },
  { glyph: "📚", label: "Learning" },
  { glyph: "💬", label: "Helpdesk" },
  { glyph: "📊", label: "My pay" },
  { glyph: "🏥", label: "Health" },
  { glyph: "📋", label: "Policies" },
];

// What the left pane shows when chat is open. `null` keeps the landing view.
type LeftDoc = Extract<DocId, "employment-verification" | "coverage-plan"> | null;

export function EmployeeLanding({
  initialChatOpen = false,
}: {
  initialChatOpen?: boolean;
} = {}) {
  const { signOut } = useApp();
  const [chatOpen, setChatOpen] = useState(initialChatOpen);
  const [leftDoc, setLeftDoc] = useState<LeftDoc>(null);

  // Whenever the user closes the chat, return the left pane to landing.
  useEffect(() => {
    if (!chatOpen) setLeftDoc(null);
  }, [chatOpen]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Topbar — full width above the split */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-surface-deep flex items-center justify-center text-ink-inverse text-[14px] font-bold">
            ✦
          </div>
          <div className="text-[15px] font-bold text-ink">HR concierge</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-surface-fog text-[14px] text-mute w-[360px]">
            🔍&nbsp;&nbsp;Search letters, benefits, time off, learning…
          </div>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-ink">Inbox&nbsp;&nbsp;3</span>
          <button
            type="button"
            onClick={signOut}
            className="w-9 h-9 rounded-full bg-surface-rose flex items-center justify-center text-ink font-bold"
            title="Sign out"
          >
            EE
          </button>
        </div>
      </header>

      <div className="flex">
        {/* LEFT PANE — landing OR an opened document. Animates to ~2/3 width
            when the chat is open so the document side still has room to
            breathe (chat itself fits comfortably at ~1/3). */}
        <section
          className={cn(
            "min-w-0 transition-[width] duration-[450ms] ease-out",
            chatOpen ? "w-2/3" : "w-full",
          )}
        >
          {leftDoc ? (
            <LeftDocPane id={leftDoc} onClose={() => setLeftDoc(null)} />
          ) : (
            <LandingBody onOpenChat={() => setChatOpen(true)} />
          )}
        </section>

        {/* RIGHT PANE — chat. Slides in from the right when chatOpen. */}
        <aside
          aria-hidden={!chatOpen}
          className={cn(
            "border-l border-divider bg-white overflow-hidden transition-[width] duration-[450ms] ease-out",
            chatOpen ? "w-1/3" : "w-0",
          )}
        >
          {chatOpen && (
            <ChatPanel
              onClose={() => setChatOpen(false)}
              onShowDoc={(id) => setLeftDoc(id)}
            />
          )}
        </aside>
      </div>

      {/* Floating bot — only when chat is closed */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label="Open HR concierge chat"
          className="ui-pill fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-surface-deep text-ink-inverse shadow-lg shadow-surface-deep/25 flex items-center justify-center hover:bg-accent-green transition-colors"
        >
          <Bot size={26} strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-mark-red border-2 border-white" />
        </button>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// LEFT PANE — default landing content
// ───────────────────────────────────────────────────────────────────────────

function LandingBody({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <main className="px-12 py-10 space-y-8 max-w-[1280px] mx-auto">
      <section className="space-y-2">
        <h1 className="text-[36px] leading-[40px] font-bold tracking-[-0.02em] text-ink">
          Welcome back, Employee
        </h1>
        <div className="text-[14px] text-mute">
          3 actions waiting · last login 2 days ago
        </div>
      </section>

      <SpringIn>
        <section className="bg-surface-mint rounded-md px-8 py-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-surface-deep flex items-center justify-center text-ink-inverse font-bold shrink-0">
              AI
            </div>
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <AIDot size={6} tone="deep" />
                <span className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
                  A note from your AI partner
                </span>
              </div>
              <div className="text-[18px] font-bold text-ink mb-0.5">
                <StreamingText
                  text="You've worked 50+ hours a week for four weeks and have 11 unused PTO days."
                  cps={120}
                  caret={false}
                />
              </div>
              <div className="text-[14px] text-ink">
                Want me to draft a coverage plan and book some time off?
              </div>
            </div>
          </div>
          <PillButton variant="primary" size="lg" arrow onClick={onOpenChat}>
            Open chat
          </PillButton>
        </section>
      </SpringIn>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-ink">My tools</h2>
          <span className="text-[13px] text-mute">Most things start with the chat →</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {tiles.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={onOpenChat}
              className="ui-pill text-left rounded-md p-5 h-[150px] flex flex-col justify-between bg-white border-2 border-ink hover:bg-surface-fog transition-colors"
            >
              <span className="text-[28px]" aria-hidden>{t.glyph}</span>
              <div className="text-[18px] font-bold leading-tight">{t.label}</div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// LEFT PANE — document opened from a chat card
// ───────────────────────────────────────────────────────────────────────────

function LeftDocPane({ id, onClose }: { id: LeftDoc; onClose: () => void }) {
  return (
    <EmbeddedDocContext.Provider value={true}>
      <div className="h-[calc(100vh-65px)] overflow-y-auto bg-surface-fog">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-divider">
          <button
            type="button"
            onClick={onClose}
            className="ui-pill text-[13px] text-ink hover:text-surface-deep flex items-center gap-1.5"
          >
            <span aria-hidden>←</span> Back to home
          </button>
          <span className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">
            {id === "employment-verification" ? "Employment letter · USCIS" : "Coverage plan · Jun 1–12"}
          </span>
        </div>
        <SpringIn className="block">
          {id === "employment-verification" ? <EmploymentVerification /> : <CoveragePlan />}
        </SpringIn>
      </div>
    </EmbeddedDocContext.Provider>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// RIGHT PANE — chat with pre-filled input
// ───────────────────────────────────────────────────────────────────────────

type Bubble =
  | { kind: "employee"; text: string }
  | {
      kind: "agent";
      text: string;
      tone?: "mint" | "fog";
      children?: React.ReactNode;
      /** Skip the typewriter reveal and render text immediately. */
      instant?: boolean;
    };

const AGENT_REPLY_MS = 3000;

function ChatPanel({
  onClose,
  onShowDoc,
}: {
  onClose: () => void;
  onShowDoc: (id: LeftDoc) => void;
}) {
  const { addEscalation } = useApp();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Conversation script. Turn 0 is the agent's greeting — it fires
  // automatically when the chat opens, before any user input. Every later
  // turn fires when the user clicks a chip (or types something), so the
  // conversation reads bot-first / employee-chooses / bot-replies.
  type Turn = {
    /** Agent bubbles fired for this turn. */
    reply: Bubble[];
    /** Chips offered after this reply. Clicking a chip sends it as the
     *  user's message and advances to the next turn. */
    chips?: string[];
  };

  const turns: Turn[] = useMemo(
    () => [
      // 0 — greeting on chat open
      {
        reply: [
          {
            kind: "agent",
            tone: "mint",
            text: "Hi, I'm your Employee AI helpdesk — I can help you with a lot of things!",
            children: (
              <div className="text-[13px] text-ink leading-[20px]">
                <div className="text-mute mb-1.5">For example —</div>
                <ul className="space-y-1">
                  <li>· Pull an employment verification letter for a visa</li>
                  <li>· Plan time off and notify your team</li>
                  <li>· Answer benefits, payslip and policy questions</li>
                </ul>
              </div>
            ),
          },
        ],
        chips: [
          "Get a letter for my visa",
          "Plan some time off",
          "Ask about my benefits",
        ],
      },
      // 1 — picked the letter chip
      {
        reply: [
          { kind: "agent", tone: "mint", text: "Got it. Who's the recipient?" },
        ],
        chips: ["USCIS", "Embassy", "Bank", "Other"],
      },
      // 2 — picked recipient
      {
        reply: [
          {
            kind: "agent",
            tone: "mint",
            text: "Pulled your details from your HR record:",
            children: (
              <div className="space-y-1 text-[13px] text-ink">
                <div>Job  ·  Senior Software Engineer</div>
                <div>Joined  ·  2023-04-17 (2 yrs)</div>
                <div>Salary  ·  USD 158,000 / yr</div>
              </div>
            ),
          },
        ],
        chips: ["Looks good", "Edit"],
      },
      // 3 — confirmed details
      {
        reply: [
          {
            kind: "agent",
            tone: "fog",
            text: "Generated, signed, and sent.",
            children: (
              <PDFCard
                title="EmploymentVerification.pdf"
                sub="Letterhead · e-signed at 17:24 · 1 page"
                meta="Click to view"
                onClick={() => onShowDoc("employment-verification")}
              />
            ),
          },
          {
            kind: "agent",
            tone: "mint",
            text:
              "Before you go — I noticed you've worked 50+ hours a week for four straight weeks and have 11 unused PTO days. Want me to draft a coverage plan and book some time off?",
          },
        ],
        chips: ["Yes, plan it", "Not now"],
      },
      // 4 — confirmed PTO plan
      {
        reply: [
          {
            kind: "agent",
            tone: "fog",
            text:
              "Coverage plan drafted. Two weeks · 10 working days · 3 teammates notified.",
            children: (
              <button
                type="button"
                onClick={() => onShowDoc("coverage-plan")}
                className="ui-pill inline-flex items-center gap-2 rounded-full font-bold px-4 py-2 text-[14px] bg-surface-deep text-ink-inverse hover:bg-accent-green"
              >
                Open coverage plan <span aria-hidden>→</span>
              </button>
            ),
          },
        ],
      },
    ],
    [onShowDoc],
  );

  /** Index of the NEXT turn to fire. We start at 0, the greeting. */
  const [turnIdx, setTurnIdx] = useState(0);
  /** Chips currently surfaced under the agent's last reply. */
  const [activeChips, setActiveChips] = useState<string[] | null>(null);

  // Fire the greeting on mount — quick typing indicator, then drop the
  // greeting bubble and offer the starter chips.
  useEffect(() => {
    setAgentTyping(true);
    const t = window.setTimeout(() => {
      setAgentTyping(false);
      setBubbles((b) => [...b, ...turns[0].reply]);
      setActiveChips(turns[0].chips ?? null);
      setTurnIdx(1);
    }, 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the scroller pinned to the bottom whenever bubbles, chips, or
  // typing state change.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bubbles, agentTyping, activeChips, escalating]);

  const send = (overrideText?: string) => {
    const msg = (overrideText ?? draft).trim();
    if (!msg) return;

    // "escalate" is a special intent — short-circuit the script and route
    // the request to a human teammate (badged on the HRBP topbar).
    if (/^escalate\b/i.test(msg)) {
      setBubbles((b) => [...b, { kind: "employee", text: msg }]);
      setDraft("");
      setActiveChips(null);
      setAgentTyping(true);
      window.setTimeout(() => {
        setAgentTyping(false);
        setBubbles((b) => [
          ...b,
          {
            kind: "agent",
            tone: "fog",
            text: "Trying to reach a human teammate…",
            instant: true,
            children: <ReachingHumanIndicator />,
          },
        ]);
        setEscalating(true);
        addEscalation({
          employee: "Marcus Lee",
          reason: "Asked for a human via chat.",
        });
      }, 800);
      return;
    }

    const turn = turns[turnIdx];
    if (!turn) return;
    setBubbles((b) => [...b, { kind: "employee", text: msg }]);
    setDraft("");
    setActiveChips(null);
    setAgentTyping(true);
    window.setTimeout(() => {
      setAgentTyping(false);
      setBubbles((b) => [...b, ...turn.reply]);
      setActiveChips(turn.chips ?? null);
      setTurnIdx((i) => i + 1);
    }, AGENT_REPLY_MS);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const conversationDone = !escalating && turnIdx >= turns.length;

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      <header className="flex items-center justify-between px-5 py-3 border-b border-divider">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-deep text-ink-inverse flex items-center justify-center">
            <Bot size={16} strokeWidth={1.8} />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <AIDot size={6} tone="green" pulse />
              <span className="text-[13px] font-bold text-ink">HR concierge</span>
            </div>
            <span className="text-[11px] text-mute">online · 3s typical reply</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ui-pill w-8 h-8 rounded-full text-mute hover:text-ink flex items-center justify-center"
          aria-label="Close chat"
        >
          <X size={16} />
        </button>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        <div className="px-5 py-6 space-y-4">
          {bubbles.map((b, i) => (
            <BubbleView key={i} bubble={b} />
          ))}
          {agentTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-mint rounded-2xl px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}
          {activeChips && !agentTyping && (
            <div className="flex flex-wrap gap-2 pl-1">
              {activeChips.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => send(label)}
                  className="ui-pill px-3 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] border-ink bg-white text-ink hover:bg-surface-mint/60"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-divider px-4 py-3">
        <div className="flex items-end gap-2 bg-surface-fog rounded-2xl px-3 py-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            disabled={conversationDone || agentTyping || escalating}
            rows={1}
            placeholder={
              escalating
                ? "Waiting for a human teammate…"
                : conversationDone
                  ? "All done — you can keep chatting later."
                  : activeChips
                    ? "Tap an option, or type \"escalate\" to reach a human"
                    : "Type \"escalate\" to reach a human, or send a message…"
            }
            className="flex-1 resize-none bg-transparent outline-none text-[14px] text-ink placeholder:text-mute leading-snug py-1.5 max-h-32"
          />
          <button
            type="button"
            onClick={() => send()}
            disabled={conversationDone || agentTyping || escalating || !draft.trim()}
            className="w-9 h-9 rounded-full bg-black text-ink-inverse flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            ↑
          </button>
        </div>
      </footer>
    </div>
  );
}

/**
 * Inline "trying to reach a human" indicator — three pulsing dots + a
 * monospace status line that reads as a live spinner inside the agent
 * bubble after the user types "escalate".
 */
function ReachingHumanIndicator() {
  return (
    <div className="flex items-center gap-2.5 pt-1">
      <div className="flex items-end gap-1 h-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-surface-deep animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span className="text-[12px] text-mute">Paging HRBP on call · ETA ~30s</span>
    </div>
  );
}

function BubbleView({ bubble }: { bubble: Bubble }) {
  if (bubble.kind === "employee") {
    return (
      <div className="flex justify-end">
        <div className="ai-spring max-w-[78%] bg-surface-deep text-ink-inverse rounded-2xl px-4 py-3 text-[14px]">
          {bubble.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "ai-spring max-w-[92%] rounded-2xl px-4 py-3 text-[14px] text-ink space-y-3",
          bubble.tone === "fog" ? "bg-surface-fog" : "bg-surface-mint",
        )}
      >
        <div>
          {bubble.instant ? (
            bubble.text
          ) : (
            <StreamingText text={bubble.text} cps={120} caret={false} />
          )}
        </div>
        {bubble.children}
      </div>
    </div>
  );
}

function PDFCard({
  title,
  sub,
  meta,
  onClick,
}: {
  title: string;
  sub: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ui-pill bg-white border border-divider rounded-md px-4 py-3 flex items-center gap-3 w-full text-left hover:bg-surface-mint/40 hover:border-surface-deep transition-colors"
    >
      <div className="w-10 h-12 rounded bg-surface-mint flex flex-col justify-center px-1.5 gap-1">
        {[20, 28, 24, 16].map((w, i) => (
          <div key={i} className="h-0.5 bg-surface-deep rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="flex-1 min-w-0 leading-tight">
        <div className="text-[14px] font-bold text-ink truncate">{title}</div>
        <div className="text-[11px] text-mute mt-0.5">{sub}</div>
        <div className="text-[11px] text-surface-deep mt-0.5">{meta}</div>
      </div>
      <span className="text-mute text-[14px]" aria-hidden>↗</span>
    </button>
  );
}
