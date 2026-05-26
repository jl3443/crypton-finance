import { DocChrome, Paper, SideRail } from "./DocChrome";

export function WorksCouncilNotice() {
  return (
    <DocChrome
      title="Document · Works council notification (Betriebsrat) · German + English"
      secondary={{ label: "Edit" }}
      primary={{ label: "File notification" }}
    >
      <Paper>
        <header className="flex items-center gap-3.5 pb-5 border-b border-divider">
          <div className="w-10 h-10 rounded-lg bg-surface-deep flex items-center justify-center text-ink-inverse text-[14px] font-bold">
            HR
          </div>
          <div className="text-[13px] leading-tight">
            <div className="text-ink">People team · Berlin office</div>
            <div className="text-mute text-[12px]">Friedrichstraße 88, 10117 Berlin</div>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 text-[13px]">
          {[
            ["Document", "Mitbestimmungsverfahren"],
            ["Reference", "MB-2026-0184"],
            ["Date", "19. Mai 2026"],
            ["Per §87 (1) Nr. 2 BetrVG", "Working hours"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium">{k}</div>
              <div className="text-[13px] text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        <div className="space-y-0.5">
          <div className="text-[13px] text-ink">An den</div>
          <div className="text-[15px] font-bold text-ink">Betriebsrat (Berlin office)</div>
          <div className="text-[13px] text-mute">z.Hd. Hr. Klaus Werner, Vorsitzender</div>
        </div>

        <div className="bg-surface-mint rounded p-4 space-y-1.5">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Betreff
          </div>
          <div className="text-[15px] font-bold text-ink leading-tight">
            Anpassung der Wochenarbeitszeit auf 37,5 Stunden — Mitbestimmungsverfahren nach §87 BetrVG
          </div>
        </div>

        <div className="space-y-3 text-[14px] leading-[22px] text-ink">
          <p>Sehr geehrter Herr Werner,</p>
          <p>
            hiermit informieren wir den Betriebsrat über die geplante Anpassung der regelmäßigen
            Wochenarbeitszeit aller Beschäftigten in den deutschen Standorten von 40 auf 37 Stunden
            und 30 Minuten, in Übereinstimmung mit der Änderung des Arbeitszeitgesetzes vom
            19. Mai 2026.
          </p>
          <p>
            Die Anpassung tritt am 17. August 2026 in Kraft. Bestehende Arbeitsverträge werden in
            einem dreistufigen Verfahren über 90 Tage angepasst, ohne Änderung des Grundgehalts.
          </p>
          <p>
            Wir bitten den Betriebsrat um Zustimmung gemäß §87 (1) Nr. 2 BetrVG und schlagen einen
            Termin zur Erörterung am 26. Mai 2026, 14:00 Uhr, vor.
          </p>
        </div>

        <div className="bg-surface-fog rounded p-4">
          <div className="text-[11px] tracking-[0.08em] uppercase text-mute font-medium mb-2">
            English summary
          </div>
          <p className="text-[14px] leading-[22px] text-ink">
            We are notifying the works council of the planned change of standard weekly hours from 40
            hours to 37 hours 30 minutes at all German sites, effective 17 August 2026. Contracts
            will be updated over a 90-day phased plan with no change to base salary. We request the
            council's approval per §87 (1) No. 2 BetrVG and propose a discussion meeting on
            26 May 2026, 14:00.
          </p>
        </div>

        <div className="pt-3 space-y-1">
          <div className="text-[13px] text-ink">Mit freundlichen Grüßen</div>
          <div className="text-[15px] font-bold text-ink">Annika Voss</div>
          <div className="text-[12px] text-mute">HR Director Germany · e-signed 19 May 2026, 11:42 CET</div>
        </div>
      </Paper>

      <SideRail>
        <div className="bg-white border border-divider rounded-md p-5 space-y-2.5">
          <div className="text-[14px] font-bold text-ink">Legal basis</div>
          {[
            ["§87 (1) Nr. 2 BetrVG", "Working-hour rules require council approval"],
            ["§87 (1) Nr. 6 BetrVG", "Tools that monitor staff require council approval"],
            ["§90 BetrVG", "Council must be informed of planned changes"],
          ].map(([code, sub]) => (
            <div key={code}>
              <div className="text-[13px] font-medium text-surface-deep">{code}</div>
              <div className="text-[12px] text-mute">{sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface-mint rounded-md p-5 space-y-2.5">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Statutory timing
          </div>
          <div className="text-[14px] font-bold text-ink">Council has 1 week to respond</div>
          {[
            ["19 May", "Notice filed", "Today"],
            ["26 May", "Discussion meeting", "Proposed"],
            ["2 Jun", "Council response due", "Statutory"],
            ["17 Aug", "Change takes effect", "Legal deadline"],
          ].map(([d, l, s]) => (
            <div key={l} className="flex items-start gap-3">
              <div className="text-[12px] font-medium text-surface-deep w-12 shrink-0">{d}</div>
              <div>
                <div className="text-[13px] text-ink">{l}</div>
                <div className="text-[11px] text-mute">{s}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-fog rounded-md p-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mark-red" />
            <span className="text-[11px] tracking-[0.06em] uppercase text-mark-red font-medium">
              If we skip this
            </span>
          </div>
          <p className="text-[13px] text-ink mt-1.5 leading-[20px]">
            Any change to working hours without council approval can be challenged in labor court
            and rolled back.
          </p>
        </div>
      </SideRail>
    </DocChrome>
  );
}
