import { DocChrome, Paper, SideRail } from "./DocChrome";

export function TerminationLetter() {
  return (
    <DocChrome
      title="Document · Offboarding letter · Heidelberg · German + English"
      secondary={{ label: "Edit" }}
      primary={{ label: "Send signed PDF" }}
    >
      <Paper>
        <header className="flex items-center gap-3.5 pb-5 border-b border-divider">
          <div className="w-10 h-10 rounded-lg bg-surface-deep flex items-center justify-center text-ink-inverse text-[14px] font-bold">
            HR
          </div>
          <div className="text-[13px] leading-tight">
            <div className="text-ink">People team · Heidelberg site</div>
            <div className="text-mute text-[12px]">Industriestraße 25, 69115 Heidelberg</div>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 text-[13px]">
          {[
            ["Document", "Aufhebungsvereinbarung"],
            ["Reference", "AUF-2026-0178"],
            ["Date", "19. Mai 2026"],
            ["Last day", "23. Mai 2026"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">{k}</div>
              <div className="text-[13px] text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        <div className="space-y-0.5">
          <div className="text-[13px] text-ink">An</div>
          <div className="text-[15px] font-bold text-ink">Sabine Hofmann</div>
          <div className="text-[13px] text-mute">Senior R&D Scientist · Personalnummer 8842-DE</div>
        </div>

        <div className="bg-surface-mint rounded p-4 space-y-1.5">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Betreff
          </div>
          <div className="text-[15px] font-bold text-ink leading-tight">
            Bestätigung der einvernehmlichen Vertragsauflösung zum 23. Mai 2026
          </div>
        </div>

        <div className="space-y-3 text-[14px] leading-[22px] text-ink">
          <p>Sehr geehrte Frau Hofmann,</p>
          <p>
            hiermit bestätigen wir die einvernehmliche Auflösung Ihres Arbeitsvertrags zum
            23. Mai 2026, gemäß dem Aufhebungsangebot vom 5. Mai 2026. Wir danken Ihnen herzlich
            für Ihre Arbeit und Ihren Beitrag über die letzten Jahre.
          </p>
          <p>
            Mit Ihrer letzten Gehaltsabrechnung erhalten Sie das vollständige Gehalt für Mai 2026,
            das anteilige Weihnachtsgeld, sowie die Abgeltung Ihres verbleibenden Urlaubsanspruchs.
            Die Gesamtsumme beläuft sich auf EUR 8.940 (brutto).
          </p>
          <p>
            Ihre System-Zugänge werden am letzten Arbeitstag um 18:00 Uhr automatisch deaktiviert.
            Ein qualifiziertes Arbeitszeugnis wird Ihnen innerhalb von vier Wochen ausgestellt.
          </p>
          <p>Für Rückfragen stehen wir Ihnen jederzeit zur Verfügung.</p>
        </div>

        <div className="bg-surface-fog rounded p-4">
          <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium mb-2">
            English summary
          </div>
          <p className="text-[14px] leading-[22px] text-ink">
            This confirms the mutual termination of your employment contract effective
            23 May 2026, per the separation agreement of 5 May 2026. Your final payment of
            EUR 8,940 (gross) includes May salary, prorated Christmas bonus, and unused leave
            payout. System access will be deactivated at 18:00 on your last day. A qualified work
            reference will be issued within four weeks.
          </p>
        </div>

        <div className="pt-3 space-y-1">
          <div className="text-[13px] text-ink">Mit freundlichen Grüßen</div>
          <div className="text-[15px] font-bold text-ink">Annika Voss</div>
          <div className="text-[12px] text-mute">HR Director Germany · e-signed 19 May 2026, 10:42 CET</div>
        </div>
      </Paper>

      <SideRail>
        <div className="bg-white border border-divider rounded-md p-5 space-y-2">
          <div className="text-[14px] font-bold text-ink mb-1">Final pay breakdown</div>
          {[
            ["May salary (full)", "EUR 7,200"],
            ["Christmas bonus (prorated)", "EUR 1,200"],
            ["Unused leave (12 days)", "EUR 540"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-[13px]">
              <span className="text-ink">{k}</span>
              <span className="text-ink">{v}</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-divider flex items-center justify-between">
            <span className="text-[13px] text-ink">Gross total</span>
            <span className="text-[16px] font-bold text-surface-deep">EUR 8,940</span>
          </div>
        </div>

        <div className="bg-surface-mint rounded-md p-5 space-y-2.5">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            What happens next
          </div>
          <div className="text-[14px] font-bold text-ink">Last 4 working days</div>
          {[
            ["Mon 19 May", "Letter sent to Sabine"],
            ["Tue 20 May", "Transfer sessions with João + Carla"],
            ["Wed 21 May", "Knowledge wiki finalized"],
            ["Thu 22 May", "Exit interview at 15:00"],
            ["Fri 23 May", "Last day · access removed 18:00"],
            ["Mon 26 May", "Final payslip · €8,940"],
            ["~21 Jun", "Qualified work reference issued"],
          ].map(([d, lbl]) => (
            <div key={lbl} className="flex items-start gap-3">
              <div className="text-[12px] font-medium text-surface-deep w-16 shrink-0">{d}</div>
              <div className="text-[13px] text-ink">{lbl}</div>
            </div>
          ))}
        </div>
      </SideRail>
    </DocChrome>
  );
}
