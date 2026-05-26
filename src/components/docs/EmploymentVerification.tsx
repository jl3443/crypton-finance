import { DocChrome, Paper, SideRail } from "./DocChrome";

export function EmploymentVerification() {
  return (
    <DocChrome
      title="Document · Employment verification letter · for USCIS"
      secondary={{ label: "Edit fields" }}
      primary={{ label: "Download signed PDF" }}
    >
      <Paper>
        <header className="flex items-center justify-between pb-5 border-b border-divider">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-surface-deep flex items-center justify-center text-ink-inverse text-[16px] font-bold">
              HR
            </div>
            <div>
              <div className="text-[15px] font-bold text-ink">People team</div>
              <div className="text-[11px] uppercase tracking-[0.06em] text-mute">
                Global HR · Kaiseraugst HQ
              </div>
            </div>
          </div>
          <div className="text-[12px] text-mute leading-snug text-right">
            <div>Wurmisweg 576</div>
            <div>4303 Kaiseraugst, Switzerland</div>
            <div>people@company.com · +41 61 815 8000</div>
          </div>
        </header>

        <div className="flex items-center justify-between text-[13px]">
          <span>19 May 2026</span>
          <span className="text-mute">Reference: VOE-2026-3184</span>
        </div>

        <div className="space-y-0.5 text-[14px]">
          <div>To whom it may concern,</div>
          <div>U.S. Citizenship and Immigration Services (USCIS)</div>
        </div>

        <div className="bg-surface-mint rounded p-4 space-y-1">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Re
          </div>
          <div className="text-[15px] font-bold text-ink">
            Employment verification for Marcus Lee · H-1B extension
          </div>
        </div>

        <p className="text-[14px] leading-[22px] text-ink">
          This letter confirms the employment of Marcus Lee with our company as detailed below.
        </p>

        <div className="space-y-0">
          {[
            ["Full name", "Marcus Lee"],
            ["Date of birth", "12 March 1991"],
            ["Passport number", "G54218692"],
            ["Position", "Senior Software Engineer"],
            ["Employment type", "Full-time, indefinite"],
            ["Start date", "17 April 2023"],
            ["Current annual salary", "USD 158,000 per year"],
            ["Work location", "San Francisco, CA, USA"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-divider text-[14px]"
            >
              <span className="text-[11px] uppercase tracking-[0.06em] text-mute font-medium pt-0.5">
                {k}
              </span>
              <span className="text-ink">{v}</span>
            </div>
          ))}
        </div>

        <p className="text-[14px] leading-[22px] text-ink">
          Mr. Lee continues to be employed in good standing with our company. We confirm that his
          position is ongoing and that his compensation is as stated above.
        </p>
        <p className="text-[14px] leading-[22px] text-ink">
          Should you require any further information to support his H-1B extension application,
          please feel free to contact us using the details above.
        </p>

        <div className="flex items-end justify-between pt-6">
          <div className="leading-tight">
            <div className="text-[13px]">Sincerely,</div>
            <div className="h-10" />
            <div className="text-[15px] font-bold">Maria Schmidt</div>
            <div className="text-[12px] text-mute">VP, People · Global HR</div>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-surface-deep text-surface-deep flex flex-col items-center justify-center text-[10px] font-bold tracking-[0.08em] uppercase leading-tight">
              <div>Verified</div>
              <div className="mt-1">19 May 2026</div>
              <div>17:24 CET</div>
            </div>
            <div className="text-[11px] text-mute mt-2">E-signed via secure HR system</div>
          </div>
        </div>
      </Paper>

      <SideRail>
        <div className="bg-white border border-divider rounded-md p-5 space-y-2">
          <div className="text-[14px] font-bold text-ink">Letter details</div>
          {[
            ["Generated", "19 May 2026, 17:24"],
            ["Time to draft", "32 seconds"],
            ["Pages", "1"],
            ["Recipient", "USCIS"],
            ["Sent to", "Marcus + lawyer"],
            ["Signed by", "Maria Schmidt (VP)"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-[13px]">
              <span className="text-mute">{k}</span>
              <span className="text-ink">{v}</span>
            </div>
          ))}
        </div>

        <div className="bg-surface-mint rounded-md p-5 space-y-3">
          <div className="text-[11px] tracking-[0.08em] uppercase text-surface-deep font-medium">
            Source verification
          </div>
          <div className="text-[14px] font-bold text-ink">All fields pulled live</div>
          {[
            ["Name + start date", "From HR record"],
            ["Job title + position", "From HR record"],
            ["Salary", "From payroll"],
            ["Work location", "From HR record"],
          ].map(([k, src]) => (
            <div key={k}>
              <div className="text-[13px] text-ink">{k}</div>
              <div className="text-[11px] text-mute">{src}</div>
            </div>
          ))}
        </div>
      </SideRail>
    </DocChrome>
  );
}
