import { DocChrome, SideRail } from "./DocChrome";

function LangColumn({
  lang,
  subject,
  body,
  signoff,
}: {
  lang: string;
  subject: string;
  body: string[];
  signoff: string[];
}) {
  return (
    <article className="bg-white border border-divider rounded-md p-10 space-y-4">
      <span className="inline-flex px-2.5 py-1 rounded-full bg-black text-ink-inverse text-[11px] tracking-[0.06em] uppercase font-medium">
        {lang}
      </span>
      <div className="text-[12px] text-mute">
        From: People team · 19 May 2026
        <br />
        To: All employees on German contracts (147)
      </div>
      <h2 className="text-[20px] font-bold leading-[26px] text-ink">{subject}</h2>
      {body.map((p, i) => (
        <p key={i} className="text-[14px] leading-[22px] text-ink">{p}</p>
      ))}
      <div className="pt-2">
        {signoff.map((line, i) => (
          <div key={i} className="text-[14px] text-ink">{line}</div>
        ))}
      </div>
    </article>
  );
}

export function EmployeeAnnouncement() {
  return (
    <DocChrome
      title="Document · Employee announcement · German + English"
      secondary={{ label: "Edit translation" }}
      primary={{ label: "Send to 147 employees" }}
    >
      <div className="grid grid-cols-2 gap-4 col-span-1">
        <LangColumn
          lang="DE · German"
          subject="Bevorstehende Änderungen Ihrer Arbeitszeit"
          body={[
            "Hallo,",
            "wir möchten Sie über eine wichtige Änderung Ihrer Arbeitszeit informieren. Ab dem 17. August 2026 wird die regelmäßige Wochenarbeitszeit von 40 auf 37 Stunden und 30 Minuten reduziert, in Übereinstimmung mit der neuen Änderung des Arbeitszeitgesetzes.",
            "Ihr Arbeitsvertrag wird automatisch angepasst, Ihr Grundgehalt bleibt unverändert. Ihre Führungskraft wird sich in den nächsten zwei Wochen mit Ihnen in Verbindung setzen, um Ihren neuen Zeitplan zu besprechen.",
            "Bei Fragen können Sie auf diese E-Mail antworten oder jederzeit mit dem HR concierge sprechen.",
          ]}
          signoff={["Mit freundlichen Grüßen,", "People-Team"]}
        />
        <LangColumn
          lang="EN · English"
          subject="Upcoming changes to your working hours"
          body={[
            "Hi,",
            "We're writing to let you know about an important change to your working hours. Starting 17 August 2026, the standard working week is moving from 40 hours to 37 hours and 30 minutes, in line with the new German Working Hours Act amendment.",
            "Your contract will be updated automatically, and your base salary stays the same. Your manager will reach out within the next two weeks to walk through your new schedule.",
            "If you have any questions, you can reply to this email or chat with HR concierge any time.",
          ]}
          signoff={["Best,", "People team"]}
        />
      </div>

      <SideRail>
        <div className="bg-surface-mint rounded-md p-5 space-y-3">
          <div className="text-[14px] font-bold text-ink">Translation quality</div>
          {[
            ["Length match", "98%"],
            ["Tone match", "Friendly + formal"],
            ["Reading level", "Grade 8 · clear"],
            ["Legal accuracy", "Reviewed by AI"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-[13px]">
              <span className="text-ink">{k}</span>
              <span className="text-surface-deep">{v}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-divider rounded-md p-5 space-y-2">
          <div className="text-[14px] font-bold text-ink">Audience</div>
          {[
            ["Berlin office", "62"],
            ["Munich office", "48"],
            ["Hamburg office", "21"],
            ["Remote (Germany)", "16"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-[13px]">
              <span className="text-ink">{k}</span>
              <span className="text-mute">{v}</span>
            </div>
          ))}
          <div className="pt-2 flex items-center justify-between border-t border-divider mt-2">
            <span className="text-[13px] text-ink">Total</span>
            <span className="text-[15px] font-bold text-surface-deep">147</span>
          </div>
        </div>
      </SideRail>
    </DocChrome>
  );
}
