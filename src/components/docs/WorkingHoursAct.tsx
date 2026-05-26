import { DocChrome, Paper, SideRail } from "./DocChrome";
import { AIDot } from "@/components/ai/AIDot";

export function WorkingHoursAct() {
  return (
    <DocChrome
      title="Source document · Germany · detected at 7:14 AM today"
      secondary={{ label: "Translate to English" }}
      primary={{ label: "Download PDF" }}
    >
      <Paper>
        {/* Letterhead */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-divider">
          <div className="w-14 h-14 rounded-full border-2 border-ink flex items-center justify-center text-[14px] font-bold">
            DE
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.08em] text-mute">
              Bundesrepublik Deutschland · Bundesministerium für Arbeit
            </div>
            <div className="text-[14px] text-ink mt-0.5">Bundesgesetzblatt</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-[28px] leading-[34px] font-bold tracking-[-0.01em]">
            Arbeitszeitgesetz, Änderung vom 19. Mai 2026
          </h1>
          <p className="text-[14px] text-ink">
            Zur Anpassung der gesetzlichen wöchentlichen Höchstarbeitszeit
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 text-[13px]">
          {[
            ["Veröffentlicht", "19. Mai 2026"],
            ["Inkrafttreten", "17. August 2026"],
            ["Geltungsbereich", "Bundesweit"],
            ["Betroffene Sektoren", "Alle"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">{k}</div>
              <div className="text-[13px] text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">§ 1  Zweck</h3>
          <p className="text-[14px] leading-[22px] text-ink">
            Dieses Gesetz ändert die im Arbeitszeitgesetz festgelegte wöchentliche
            Höchstarbeitszeit und reduziert die regelmäßige Wochenarbeitszeit.
          </p>
        </section>

        {/* Highlighted §2 */}
        <section className="bg-surface-mint rounded-md p-5 space-y-2">
          <div className="flex items-center gap-2">
            <AIDot size={6} tone="deep" />
            <span className="text-[12px] tracking-[0.06em] uppercase text-surface-deep font-medium">
              AI flagged this paragraph as the key change
            </span>
          </div>
          <h3 className="text-[15px] font-bold">§ 2  Wöchentliche Höchstarbeitszeit</h3>
          <p className="text-[14px] leading-[22px] text-ink">
            Die regelmäßige Wochenarbeitszeit beträgt 37 Stunden und 30 Minuten im
            Jahresdurchschnitt, höchstens jedoch 9 Stunden täglich, soweit keine
            abweichende tarifvertragliche Regelung besteht.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">§ 3  Stufenweise Einführung</h3>
          <p className="text-[14px] leading-[22px] text-ink">
            Die Anpassung an die neue Wochenarbeitszeit erfolgt stufenweise innerhalb von 90 Tagen
            nach Inkrafttreten gemäß dem beigefügten Zeitplan.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-[15px] font-bold">Übergangsbestimmung</h3>
          <p className="text-[14px] leading-[22px] text-ink">
            Bestehende Arbeitsverträge sind innerhalb von 90 Kalendertagen anzupassen. Unternehmen
            mit Betriebsrat müssen diesen vor jeder Änderung informieren.
          </p>
        </section>
      </Paper>

      <SideRail>
        <div className="bg-surface-deep text-ink-inverse rounded-md p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-surface-mint text-surface-deep text-[12px] font-bold rounded-md w-7 h-7 flex items-center justify-center">
              AI
            </span>
            <div className="text-[15px] font-bold">Plain-English summary</div>
          </div>
          <p className="text-[13px] leading-[20px] text-surface-mint">
            Germany is cutting the standard workweek from 40 hours to 37.5 hours. Effective in 90 days.
            All existing contracts must be updated. Works council must be informed first.
          </p>
        </div>

        <div className="bg-white border border-divider rounded-md p-5 space-y-3">
          <div className="text-[14px] font-bold text-ink">What this means for us</div>
          {[
            ["147", "employees in Germany affected"],
            ["12", "contracts need updating"],
            ["4", "payroll systems to reconfigure"],
            ["1", "works council to notify first"],
            ["90", "days until full compliance"],
          ].map(([n, txt]) => (
            <div key={txt} className="flex items-center gap-3">
              <div className="text-[20px] font-bold text-surface-deep w-10">{n}</div>
              <div className="text-[13px] text-ink">{txt}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface-fog rounded-md p-4">
          <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium mb-1">
            How the AI found this
          </div>
          <div className="text-[13px] text-ink">EU regulatory feed</div>
          <div className="text-[12px] text-mute mt-1">
            Picked up at 7:14 AM today, 13 minutes after publication.
          </div>
        </div>
      </SideRail>
    </DocChrome>
  );
}
