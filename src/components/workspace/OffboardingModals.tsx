import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PreviewModal } from "@/components/workspace/PreviewModal";
import { PillButton } from "@/components/blocks/PillButton";
import { AIDot } from "@/components/ai/AIDot";
import { StaggerList } from "@/components/ai/StaggerList";
import {
  Check,
  GitBranch,
  FileText,
  Layers,
  MessageSquare,
  Cloud,
  KeyRound,
  Database,
  Eraser,
  FileSignature,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
 * Step 0 — Resignation letter modal
 * ──────────────────────────────────────────────────────────────────────*/

export function ResignationLetterModal({
  open,
  onClose,
  onAdvance,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };
  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="Inbox · resignation parsed"
      title="Pedido de demissão · resignation notice"
      sub="Camila Souza · Senior R&D Scientist · São Paulo · received yesterday 14:42 BRT"
      width={720}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            10 fields extracted · aviso prévio detected · last day inferred
          </span>
          <PillButton variant="primary" size="md" arrow onClick={finish}>
            Close and continue
          </PillButton>
        </div>
      }
    >
      <div className="px-7 py-6 space-y-5 text-ink">
        {/* Email header */}
        <div className="bg-surface-fog rounded-md p-4 space-y-2 text-[12px]">
          <Row k="From" v="Camila Souza <camila.souza@dsm-firmenich.com>" />
          <Row k="To" v="Rafael Ferreira (manager) · HR Ops Brazil" />
          <Row k="Subject" v="Pedido formal de demissão · effective 27 June 2026" />
          <Row k="Received" v="Yesterday · 14:42 BRT" />
        </div>

        {/* Email body — Portuguese original */}
        <section className="space-y-3 text-[13px] leading-[20px]">
          <div className="flex items-center gap-2">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Português · original
            </div>
            <span className="flex-1 h-px bg-divider" />
          </div>
          <p className="font-bold">Prezado Rafael,</p>
          <p>
            Venho por meio desta carta apresentar formalmente o meu pedido de demissão do cargo de
            Senior R&D Scientist na DSM-Firmenich do Brasil, com último dia de trabalho previsto
            para a sexta-feira, 27 de junho de 2026, cumprindo o aviso prévio de 30 dias
            estipulado pela CLT.
          </p>
          <p>
            Estou comprometida em fazer uma transição organizada — documentando os processos, os
            sistemas e os SOPs sob minha responsabilidade exclusiva, e treinando os colegas que
            assumirão essas áreas. Por favor, me indique no momento oportuno quem serão essas
            pessoas para que possamos agendar as sessões de transferência de conhecimento.
          </p>
          <p>
            Agradeço pela oportunidade e pelos quatro anos de aprendizado nesta equipe.
          </p>
          <p className="text-mute text-[12px]">Atenciosamente,<br />Camila Souza</p>
        </section>

        {/* English translation */}
        <section className="space-y-3 text-[13px] leading-[20px] bg-surface-fog rounded-md px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              English · agent translation
            </div>
            <span className="flex-1 h-px bg-divider" />
            <span className="text-[10px] text-mute">Confidence 99%</span>
          </div>
          <p className="font-bold">Dear Rafael,</p>
          <p>
            I am writing to formally submit my resignation from the position of Senior R&D
            Scientist at DSM-Firmenich Brasil, with my last working day scheduled for Friday, 27
            June 2026, observing the 30-day notice period required under the Brazilian Labor
            Code (CLT).
          </p>
          <p>
            I am committed to an organised transition — documenting the processes, systems, and
            SOPs under my exclusive responsibility, and training the colleagues who will take
            them over. Please let me know in due course who those people will be so we can
            schedule the knowledge-transfer sessions.
          </p>
          <p>Thank you for the opportunity and for the four years of learning with this team.</p>
          <p className="text-mute text-[12px]">Best regards,<br />Camila Souza</p>
        </section>

        {/* Extracted facts */}
        <div className="grid grid-cols-3 gap-3 bg-surface-fog rounded-md p-4">
          {[
            ["Notice period", "30 days · CLT statutory"],
            ["Last working day", "Friday, 27 June 2026"],
            ["Tenure", "4 years, 3 months"],
            ["Base salary", "BRL 24,800 / month"],
            ["Vacation balance", "18 days accrued"],
            ["13th-month progress", "6 / 12 months earned"],
          ].map(([k, v]) => (
            <div key={k} className="text-[12px]">
              <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
                {k}
              </div>
              <div className="font-medium text-ink mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </PreviewModal>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2">
      <span className="text-mute">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Step 1 — Knowledge-transfer plan modal
 * ──────────────────────────────────────────────────────────────────────*/

type KTArtifact = {
  Icon: LucideIcon;
  source: string;
  name: string;
  detail: string;
  successor: "Rafael F." | "Beatriz O." | "Shared";
};

const ktArtifacts: KTArtifact[] = [
  // Git repos
  { Icon: GitBranch, source: "GitHub", name: "fragrance-pipeline-core", detail: "Primary owner · 412 commits · Q2 release in flight", successor: "Rafael F." },
  { Icon: GitBranch, source: "GitHub", name: "molecule-clustering-lib", detail: "Sole maintainer · 8 dependents · OSS dependency", successor: "Rafael F." },
  { Icon: GitBranch, source: "GitHub", name: "olfactory-eval-toolkit", detail: "Co-owner with Léa M. · used by 4 teams", successor: "Beatriz O." },
  { Icon: GitBranch, source: "GitHub", name: "scent-graph-experiments", detail: "Experimental · 2 active branches", successor: "Beatriz O." },
  // Confluence
  { Icon: FileText, source: "Confluence", name: "R&D Standards · São Paulo lab", detail: "47 pages · last touched 12 May · sole editor", successor: "Rafael F." },
  { Icon: FileText, source: "Confluence", name: "Sensory panel SOP", detail: "Active SOP for the LATAM sensory team (6 panelists)", successor: "Beatriz O." },
  { Icon: FileText, source: "Confluence", name: "Q3 fragrance roadmap", detail: "Living doc · 11 stakeholders · co-owned with PM", successor: "Shared" },
  // Jira
  { Icon: Layers, source: "Jira", name: "FRAG-2024 (epic) · core pipeline", detail: "12 stories open · assigned to Camila", successor: "Rafael F." },
  { Icon: Layers, source: "Jira", name: "SCENT-184 (epic) · graph experiments", detail: "5 stories open · early phase", successor: "Beatriz O." },
  { Icon: Layers, source: "Jira", name: "OPS-board · LATAM R&D", detail: "Camila is the board admin · transfer admin rights", successor: "Rafael F." },
];

const successorMeta = {
  "Rafael F.": { initials: "RF", role: "Senior Engineer · same pod", color: "bg-surface-deep text-ink-inverse" },
  "Beatriz O.": { initials: "BO", role: "Scientist II · 2 yrs ramp ready", color: "bg-surface-sage text-ink-inverse" },
  Shared: { initials: "··", role: "Shared with PM team", color: "bg-surface-fog text-mute" },
};

export function KTPlanModal({
  open,
  onClose,
  onAdvance,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const [tab, setTab] = useState<"git" | "confluence" | "jira">("git");
  const [detail, setDetail] = useState<KTArtifact | null>(null);
  const filtered = ktArtifacts.filter((a) =>
    tab === "git"
      ? a.source === "GitHub"
      : tab === "confluence"
        ? a.source === "Confluence"
        : a.source === "Jira",
  );
  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };

  return (
    <>
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="KT plan · generated from footprint"
      title="Knowledge transfer · 14 single-owner areas"
      sub="Mapped from Camila's git, Jira, Confluence footprint · 2 successors assigned"
      width={920}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            2 successors confirmed · 8 transfer sessions auto-scheduled
          </span>
          <PillButton variant="primary" size="md" arrow onClick={finish}>
            Close and continue
          </PillButton>
        </div>
      }
    >
      <div className="px-6 py-5 space-y-4">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {(
            [
              { id: "git", label: "GitHub", count: ktArtifacts.filter((a) => a.source === "GitHub").length, Icon: GitBranch },
              { id: "confluence", label: "Confluence", count: ktArtifacts.filter((a) => a.source === "Confluence").length, Icon: FileText },
              { id: "jira", label: "Jira", count: ktArtifacts.filter((a) => a.source === "Jira").length, Icon: Layers },
            ] as const
          ).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "ui-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors",
                  active
                    ? "bg-surface-deep text-ink-inverse"
                    : "bg-surface-fog text-ink hover:bg-surface-mint/40",
                )}
              >
                <t.Icon size={13} strokeWidth={1.8} />
                {t.label}
                <span
                  className={cn(
                    "text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full",
                    active ? "bg-white/15" : "bg-white text-mute",
                  )}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Artifact rows — each is clickable, opens an inline detail overlay */}
        <StaggerList step={70}>
          {filtered.map((a) => {
            const s = successorMeta[a.successor];
            return (
              <button
                key={a.name}
                type="button"
                onClick={() => setDetail(a)}
                className="ui-pill w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-divider text-left hover:bg-surface-mint/30 hover:border-surface-deep/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-surface-fog flex items-center justify-center text-surface-deep shrink-0">
                  <a.Icon size={16} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-ink leading-[16px]">{a.name}</div>
                  <div className="text-[12px] text-mute leading-[16px] mt-0.5">{a.detail}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right leading-tight">
                    <div className="text-[10px] tracking-[0.06em] uppercase text-mute font-medium">
                      Successor
                    </div>
                    <div className="text-[12px] font-bold text-ink">{a.successor}</div>
                  </div>
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold",
                      s.color,
                    )}
                  >
                    {s.initials}
                  </span>
                  <span className="text-[12px] font-bold text-surface-deep pl-1">View →</span>
                </div>
              </button>
            );
          })}
        </StaggerList>

        {/* Successor summary */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-divider">
          {(["Rafael F.", "Beatriz O."] as const).map((name) => {
            const s = successorMeta[name];
            const count = ktArtifacts.filter((a) => a.successor === name).length;
            return (
              <div key={name} className="flex items-center gap-3 bg-surface-fog rounded-md p-3">
                <span
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold",
                    s.color,
                  )}
                >
                  {s.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-ink leading-[16px]">{name}</div>
                  <div className="text-[11px] text-mute leading-[14px]">{s.role}</div>
                  <div className="text-[11px] text-surface-deep font-medium mt-0.5">
                    {count} areas · 4 transfer sessions
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </PreviewModal>
    <KTArtifactDetailModal artifact={detail} onClose={() => setDetail(null)} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * KT artifact detail modal — stacked above the KT plan modal
 * ──────────────────────────────────────────────────────────────────────*/

function KTArtifactDetailModal({
  artifact,
  onClose,
}: {
  artifact: KTArtifact | null;
  onClose: () => void;
}) {
  const open = artifact !== null;
  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow={
        artifact
          ? `${artifact.source} · transfer to ${artifact.successor}`
          : ""
      }
      title={artifact?.name ?? ""}
      sub={artifact?.detail}
      width={720}
      footer={
        <div className="flex items-center justify-end gap-3">
          <PillButton variant="secondary" size="md" onClick={onClose}>
            Close
          </PillButton>
        </div>
      }
    >
      {artifact && (
        <div className="px-7 py-6 space-y-5 text-ink">
          {artifact.source === "GitHub" && <GitHubDetail artifact={artifact} />}
          {artifact.source === "Confluence" && <ConfluenceDetail artifact={artifact} />}
          {artifact.source === "Jira" && <JiraDetail artifact={artifact} />}

          {/* Transfer plan + AI analysis */}
          <section className="space-y-3 pt-4 border-t border-divider">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Transfer plan
            </div>
            <div className="bg-surface-fog rounded-md p-3 space-y-2 text-[12px]">
              <Row k="Successor" v={artifact.successor} />
              <Row k="Sessions" v="2 × 90-min pair sessions · auto-booked" />
              <Row
                k="First session"
                v="Mon 9 June 10:00 BRT · São Paulo office (hybrid OK)"
              />
              <Row
                k="Materials"
                v="Read-only handover doc in Confluence · auto-generated"
              />
            </div>
            <div className="bg-surface-mint/40 border border-surface-deep/15 rounded-md p-3 text-[12px] text-ink space-y-1">
              <div className="text-[10px] tracking-[0.08em] uppercase text-surface-deep font-bold">
                Agent recommendation
              </div>
              <p className="leading-[18px]">
                {artifactRecommendation(artifact)}
              </p>
            </div>
          </section>
        </div>
      )}
    </PreviewModal>
  );
}

function artifactRecommendation(a: KTArtifact): string {
  if (a.source === "GitHub" && a.name === "fragrance-pipeline-core") {
    return "High-risk · Q2 release in flight. Schedule the first transfer session within 48 hours and pair-program the open PR queue before Camila's last day.";
  }
  if (a.source === "GitHub" && a.name === "molecule-clustering-lib") {
    return "Sole-maintainer OSS dependency with 8 internal dependents — promote Rafael F. to maintainer on GitHub and add him to the release pipeline before access cut-off.";
  }
  if (a.source === "Confluence" && a.name === "Sensory panel SOP") {
    return "Active SOP used weekly by 6 panelists. Walk Beatriz O. through the next two sensory sessions in person — silent observation, then co-lead.";
  }
  if (a.source === "Jira" && a.name === "OPS-board · LATAM R&D") {
    return "Camila is the only board admin. Transfer admin rights to Rafael F. before access cut-off — without admin the board cannot rebalance sprints.";
  }
  return "Standard transfer — pair the successor on the next two pieces of in-flight work, then hand the access over by the access-revocation cut-off.";
}

function GitHubDetail({ artifact }: { artifact: KTArtifact }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 bg-surface-fog rounded-md p-3 text-[12px]">
        <Stat label="Last commit" value="3 days ago" />
        <Stat label="Open PRs" value="2 by Camila" />
        <Stat label="Dependents" value={artifact.name === "molecule-clustering-lib" ? "8" : "—"} />
        <Stat label="License" value="Apache-2.0" />
      </div>
      <section>
        <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold mb-2">
          Recent commits
        </div>
        <ul className="space-y-1.5">
          {[
            ["feat: fragrance-pipeline batch normalisation", "Camila S.", "3 days ago"],
            ["fix: handle empty molecule-clustering edges", "Camila S.", "5 days ago"],
            ["chore: bump scikit-learn to 1.4", "Léa M.", "6 days ago"],
            ["docs: add olfactory-eval README", "Camila S.", "8 days ago"],
          ].map(([msg, who, when]) => (
            <li
              key={msg}
              className="flex items-start gap-2 text-[12px] border-b border-divider/70 pb-1.5 last:border-b-0 last:pb-0"
            >
              <GitBranch
                size={11}
                strokeWidth={1.8}
                className="text-surface-deep mt-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-ink leading-[15px]">{msg}</div>
                <div className="text-[10px] text-mute leading-[13px]">
                  {who} · {when}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ConfluenceDetail({ artifact }: { artifact: KTArtifact }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 bg-surface-fog rounded-md p-3 text-[12px]">
        <Stat label="Pages" value={artifact.name.includes("Sensory") ? "12" : "47"} />
        <Stat label="Sole editor on" value={artifact.name.includes("Sensory") ? "8" : "23"} />
        <Stat label="Last edit" value="12 May 2026" />
      </div>
      <section>
        <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold mb-2">
          Top pages in the space
        </div>
        <ul className="space-y-1.5">
          {[
            "Sensory panel · weekly cadence + sample shipment",
            "Olfactory evaluation framework v3.2",
            "R&D São Paulo · onboarding checklist",
            "Q2 roadmap · 2026 carryover",
          ].map((title) => (
            <li
              key={title}
              className="flex items-start gap-2 text-[12px] border-b border-divider/70 pb-1.5 last:border-b-0 last:pb-0"
            >
              <FileText
                size={11}
                strokeWidth={1.8}
                className="text-surface-deep mt-1 shrink-0"
              />
              <span className="text-ink leading-[15px]">{title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function JiraDetail({ artifact }: { artifact: KTArtifact }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 bg-surface-fog rounded-md p-3 text-[12px]">
        <Stat
          label="Stories open"
          value={artifact.name.includes("FRAG") ? "12" : artifact.name.includes("SCENT") ? "5" : "—"}
        />
        <Stat label="Board admin?" value={artifact.name.includes("OPS-board") ? "Yes" : "No"} />
        <Stat label="Sprint" value="Sprint 24 · day 6 of 10" />
      </div>
      <section>
        <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold mb-2">
          Stories assigned to Camila
        </div>
        <ul className="space-y-1.5">
          {[
            ["FRAG-2024-15", "Batch normalisation for nightly retraining", "In progress"],
            ["FRAG-2024-19", "Pipeline error budget alerts", "Code review"],
            ["FRAG-2024-22", "Backfill last 30 days · feature parity", "Todo"],
            ["SCENT-184-3", "Graph experiments · sparse molecule edges", "Todo"],
          ].map(([id, title, state]) => (
            <li
              key={id}
              className="flex items-start gap-2 text-[12px] border-b border-divider/70 pb-1.5 last:border-b-0 last:pb-0"
            >
              <Layers
                size={11}
                strokeWidth={1.8}
                className="text-surface-deep mt-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-ink leading-[15px]">
                  <span className="font-bold tabular-nums text-surface-deep">{id}</span> · {title}
                </div>
                <div className="text-[10px] text-mute leading-[13px]">{state}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
        {label}
      </div>
      <div className="text-[13px] font-bold text-ink mt-0.5">{value}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Step 2 — Access revocation checklist modal
 * ──────────────────────────────────────────────────────────────────────*/

type RevocationItem = {
  system: string;
  category: "Communication" | "Code" | "Cloud" | "Business" | "Data";
  Icon: LucideIcon;
  contains?: string;
  /** Minutes from end-of-business cutoff (17:00 BRT). Negative = before, positive = after */
  offsetMins: number;
};

const revocationItems: RevocationItem[] = [
  { system: "Slack", category: "Communication", Icon: MessageSquare, contains: "12 DMs · 4 private channels", offsetMins: 0 },
  { system: "GitHub", category: "Code", Icon: GitBranch, contains: "Owner of 4 repos · admin of 11", offsetMins: -30 },
  { system: "Jira", category: "Code", Icon: Layers, contains: "Admin of OPS-board · 12 stories", offsetMins: 0 },
  { system: "Confluence", category: "Communication", Icon: FileText, contains: "Editor of 47 pages", offsetMins: 0 },
  { system: "Workday", category: "Business", Icon: KeyRound, contains: "Self-service · payroll history kept", offsetMins: 0 },
  { system: "Okta SSO", category: "Communication", Icon: KeyRound, contains: "Master account · de-provisions cascade", offsetMins: 5 },
  { system: "Google Workspace", category: "Communication", Icon: KeyRound, contains: "Mail forwarded to Rafael F. · 30 days", offsetMins: 0 },
  { system: "Salesforce", category: "Business", Icon: Cloud, contains: "Read-only · no records owned", offsetMins: 0 },
  { system: "ServiceNow", category: "Business", Icon: Cloud, contains: "3 open tickets · auto-reassigned", offsetMins: -15 },
  { system: "AWS", category: "Cloud", Icon: Cloud, contains: "IAM in dev account · keys rotated", offsetMins: -45 },
  { system: "GCP", category: "Cloud", Icon: Cloud, contains: "BigQuery read access only", offsetMins: 0 },
  { system: "Datadog", category: "Cloud", Icon: Cloud, contains: "Dashboards transferred to Rafael F.", offsetMins: 0 },
  { system: "PagerDuty", category: "Cloud", Icon: Cloud, contains: "On-call rotation · removed today", offsetMins: -180 },
  { system: "Zoom", category: "Communication", Icon: Cloud, contains: "Recordings archived", offsetMins: 0 },
  { system: "Linear", category: "Code", Icon: Layers, contains: "Admin of LATAM project", offsetMins: 0 },
  { system: "Lever", category: "Business", Icon: FileText, contains: "Interviewer for 2 open reqs · reassigned", offsetMins: -60 },
  { system: "Office365", category: "Communication", Icon: FileText, contains: "Email + Teams · forwarded", offsetMins: 0 },
  { system: "Box", category: "Communication", Icon: FileText, contains: "Sole owner of 23 files · transferred to Rafael F.", offsetMins: -10 },
  { system: "SAP", category: "Business", Icon: Database, contains: "BPC reporting · read-only", offsetMins: 0 },
  { system: "Snowflake", category: "Data", Icon: Database, contains: "R&D warehouse access · BI keys revoked", offsetMins: 0 },
  { system: "Tableau", category: "Data", Icon: Database, contains: "12 published dashboards · ownership transferred", offsetMins: 0 },
  { system: "Looker", category: "Data", Icon: Database, contains: "LookML model contributor · read-only kept", offsetMins: 0 },
  { system: "Notion", category: "Communication", Icon: FileText, contains: "Personal notes · exported and shared", offsetMins: 0 },
];

function formatOffset(mins: number): { label: string; tone: "early" | "ontime" | "late" } {
  if (mins === 0) return { label: "17:00 BRT · cutoff", tone: "ontime" };
  if (mins < 0) {
    const m = Math.abs(mins);
    return { label: `17:00 − ${m >= 60 ? `${Math.round(m / 60)}h` : `${m}m`}`, tone: "early" };
  }
  return { label: `17:00 + ${mins}m`, tone: "late" };
}

export function AccessRevocationModal({
  open,
  onClose,
  onAdvance,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const [filter, setFilter] = useState<"all" | RevocationItem["category"]>("all");
  const visible =
    filter === "all" ? revocationItems : revocationItems.filter((x) => x.category === filter);
  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };
  const cats = ["Communication", "Code", "Cloud", "Business", "Data"] as const;

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="Identity provider · revocation queue"
      title="Access revocation · 23 SaaS systems"
      sub="Each item timed to Friday 27 June 17:00 BRT · CLT-statutory cutoff"
      width={920}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            Auto-runs · Okta cascade triggers 5 minutes after cutoff
          </span>
          <PillButton variant="primary" size="md" arrow onClick={finish}>
            Close and continue
          </PillButton>
        </div>
      }
    >
      <div className="px-6 py-5 space-y-3">
        {/* Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "ui-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium",
              filter === "all"
                ? "bg-surface-deep text-ink-inverse"
                : "bg-surface-fog text-ink hover:bg-surface-mint/40",
            )}
          >
            All ·{" "}
            <span className="font-bold tabular-nums">{revocationItems.length}</span>
          </button>
          {cats.map((c) => {
            const n = revocationItems.filter((x) => x.category === c).length;
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={cn(
                  "ui-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium",
                  active
                    ? "bg-surface-deep text-ink-inverse"
                    : "bg-surface-fog text-ink hover:bg-surface-mint/40",
                )}
              >
                {c} · <span className="font-bold tabular-nums">{n}</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="border border-divider rounded-md overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1fr_1.5fr_140px] bg-surface-deep text-ink-inverse text-[10px] tracking-[0.08em] uppercase font-medium">
            <div className="px-3 py-2">System</div>
            <div className="px-3 py-2">Category</div>
            <div className="px-3 py-2">Contains / risk</div>
            <div className="px-3 py-2">Scheduled (BRT)</div>
          </div>
          <StaggerList step={45}>
            {visible.map((r) => {
              const f = formatOffset(r.offsetMins);
              return (
                <div
                  key={r.system}
                  className="grid grid-cols-[1.2fr_1fr_1.5fr_140px] items-center border-t border-divider first:border-t-0 hover:bg-surface-mint/20 transition-colors"
                >
                  <div className="px-3 py-2.5 flex items-center gap-2 text-[13px] text-ink">
                    <r.Icon size={14} strokeWidth={1.8} className="text-surface-deep" />
                    <span className="font-medium">{r.system}</span>
                  </div>
                  <div className="px-3 py-2.5 text-[12px] text-mute">{r.category}</div>
                  <div className="px-3 py-2.5 text-[12px] text-ink truncate">
                    {r.contains}
                  </div>
                  <div className="px-3 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-[0.04em] font-bold tabular-nums",
                        f.tone === "ontime" && "bg-surface-fog text-ink",
                        f.tone === "early" && "bg-surface-mint text-surface-deep",
                        f.tone === "late" && "bg-[#FCD9A6] text-[#92400E]",
                      )}
                    >
                      {f.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </StaggerList>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-mute">
          <AIDot size={5} tone="deep" />
          Mint = revoked before cutoff (high-risk systems) · gray = at cutoff · amber = grace
          window (mail forwarding, archive access)
        </div>
      </div>
    </PreviewModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Step 3 — Exit package modal (final pay + termination letter preview)
 * ──────────────────────────────────────────────────────────────────────*/

export function ExitPackageModal({
  open,
  onClose,
  onAdvance,
  onOpenLetter,
  letterSigned = false,
}: {
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
  onOpenLetter: () => void;
  letterSigned?: boolean;
}) {
  const finish = () => {
    onClose();
    window.setTimeout(onAdvance, 200);
  };
  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="Final pay · CLT-compliant breakdown"
      title="Exit package · Camila Souza"
      sub="Brazilian payroll · TRCT format · offboarding letter ready in Portuguese + English"
      width={780}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-mute">
            Auto-priced from Workday · routes to homologação on signature
          </span>
          <PillButton variant="primary" size="md" arrow onClick={finish}>
            Close and continue
          </PillButton>
        </div>
      }
    >
      <div className="px-7 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-divider">
          <div>
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Termo de rescisão · TRCT
            </div>
            <div className="text-[15px] font-bold mt-0.5">Final pay summary</div>
          </div>
          <div className="text-right text-[11px] text-mute leading-tight">
            <div>Ref · DSMF-OFF-26-0178</div>
            <div>Generated yesterday · 15:14 BRT</div>
          </div>
        </div>

        {/* Pay breakdown */}
        <section className="space-y-2">
          <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-medium">
            Pay breakdown
          </div>
          <div className="border border-divider rounded-md overflow-hidden">
            {[
              ["Base salary · prorated to 27 Jun", "BRL", "22,313.33"],
              ["13th-month proration · 6/12", "BRL", "12,400.00"],
              ["Vacation balance · 18 days", "BRL", "14,880.00"],
              ["1/3 vacation bonus (Constitution)", "BRL", "4,960.00"],
              ["Aviso prévio · paid in lieu", "BRL", "24,800.00"],
              ["FGTS deposit + 40% fine", "BRL", "39,680.00"],
            ].map(([label, cur, amt], i) => (
              <div
                key={String(label)}
                className={cn(
                  "grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2 text-[13px]",
                  i > 0 && "border-t border-divider",
                )}
              >
                <div className="text-ink">{label}</div>
                <div className="text-[11px] text-mute tabular-nums">{cur}</div>
                <div className="font-bold text-ink tabular-nums w-24 text-right">{amt}</div>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 bg-surface-mint border-t border-surface-deep/30">
              <div className="text-[13px] font-bold text-ink">Gross total · gross severance</div>
              <div className="text-[11px] text-surface-deep tabular-nums">BRL</div>
              <div className="font-bold text-ink tabular-nums w-24 text-right text-[15px]">
                119,033.33
              </div>
            </div>
          </div>
        </section>

        {/* Termination letter card */}
        <section
          className={cn(
            "rounded-md p-4 flex items-center gap-4 transition-colors",
            letterSigned
              ? "bg-surface-mint/40 border border-surface-deep/30"
              : "bg-surface-fog",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center shrink-0",
              letterSigned
                ? "bg-accent-green/15 text-accent-green"
                : "bg-surface-mint text-surface-deep",
            )}
          >
            {letterSigned ? <Check size={18} strokeWidth={2.4} /> : <FileSignature size={18} strokeWidth={1.8} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-ink">
              Offboarding letter · Portuguese + English
            </div>
            <div className="text-[12px] text-mute leading-[16px] mt-0.5">
              {letterSigned
                ? "Signed · filed with homologação · routed to payroll."
                : "TRCT-compliant bilingual letter · awaits HRBP signature at the approval step."}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLetter}
            className="ui-pill text-[12px] font-bold text-surface-deep border border-surface-deep/30 rounded-full px-3 py-1.5 hover:bg-surface-mint/40 shrink-0"
          >
            {letterSigned ? "View →" : "Preview →"}
          </button>
        </section>
      </div>
    </PreviewModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Termination letter — signable bilingual TRCT
 * ──────────────────────────────────────────────────────────────────────*/

export function TerminationLetterSignableModal({
  open,
  onClose,
  onSigned,
  alreadySigned = false,
}: {
  open: boolean;
  onClose: () => void;
  onSigned?: () => void;
  /** When true, the modal opens in the post-sign "filed" state — no canvas. */
  alreadySigned?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!open) {
      setHasInk(false);
      setSubmitted(false);
      setAcknowledged(false);
    } else if (alreadySigned) {
      // Re-opening a previously-signed letter — show signed state immediately.
      setSubmitted(true);
      setAcknowledged(true);
      setHasInk(true);
    }
  }, [open, alreadySigned]);

  useEffect(() => {
    if (!open || submitted || alreadySigned) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * ratio;
    c.height = h * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#084337";

    let drawing = false;
    let last: { x: number; y: number } | null = null;
    const pos = (ev: PointerEvent) => {
      const rect = c.getBoundingClientRect();
      return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    };
    const down = (ev: PointerEvent) => {
      drawing = true;
      last = pos(ev);
      c.setPointerCapture(ev.pointerId);
    };
    const move = (ev: PointerEvent) => {
      if (!drawing) return;
      const p = pos(ev);
      if (last) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        setHasInk(true);
      }
      last = p;
    };
    const up = () => {
      drawing = false;
      last = null;
    };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, [open, submitted]);

  const clearSig = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };

  const sign = () => {
    if (!hasInk || !acknowledged) return;
    setSubmitted(true);
    window.setTimeout(() => {
      onSigned?.();
      onClose();
    }, 900);
  };

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      eyebrow="DSM-Firmenich Brasil · TRCT preview"
      title="Offboarding letter · Portuguese + English"
      sub="Termo de Rescisão do Contrato de Trabalho · Camila Souza · 27 June 2026"
      width={860}
      footer={
        submitted ? (
          <div className="flex items-center justify-end gap-3 text-[12px] text-surface-deep font-bold">
            <Check size={14} strokeWidth={2.4} />
            Signed · routed to homologação + payroll.
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[12px] text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-3.5 h-3.5 accent-[var(--accent-green-deep)]"
              />
              I confirm the TRCT figures and authorise homologação.
            </label>
            <div className="flex items-center gap-2">
              <PillButton variant="secondary" size="md" onClick={onClose}>
                Close
              </PillButton>
              <button
                type="button"
                onClick={sign}
                disabled={!hasInk || !acknowledged}
                className={cn(
                  "ui-pill inline-flex items-center gap-2 rounded-full font-bold text-[14px] px-5 py-2.5 transition-colors",
                  hasInk && acknowledged
                    ? "bg-ink text-ink-inverse hover:bg-surface-deep"
                    : "bg-divider text-mute cursor-not-allowed",
                )}
              >
                <FileSignature size={15} strokeWidth={2} />
                Sign + file
              </button>
            </div>
          </div>
        )
      }
    >
      <div className="px-7 py-5 space-y-4 text-ink">
        <div className="grid grid-cols-2 gap-5">
          {/* Portuguese */}
          <section className="space-y-2 text-[12px] leading-[18px]">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Português
            </div>
            <p className="font-bold">Carta de rescisão de contrato</p>
            <p>
              Pela presente, a DSM-Firmenich Brasil Ltda. e a Sra. Camila Souza, portadora do
              CPF nº XXX.XXX.XXX-XX, formalizam a rescisão do contrato de trabalho por iniciativa
              da empregada, com aviso prévio cumprido e último dia em 27 de junho de 2026.
            </p>
            <p>
              A empresa pagará as verbas rescisórias previstas na CLT — saldo de salário, 13º
              proporcional, férias proporcionais acrescidas de 1/3, aviso prévio indenizado, e
              recolherá o FGTS com a multa correspondente, conforme TRCT anexo.
            </p>
            <p>A rescisão será homologada perante o sindicato no prazo legal.</p>
          </section>

          {/* English */}
          <section className="space-y-2 text-[12px] leading-[18px]">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              English
            </div>
            <p className="font-bold">Letter of separation</p>
            <p>
              DSM-Firmenich Brasil Ltda. and Ms. Camila Souza (CPF XXX.XXX.XXX-XX) hereby
              formalise the termination of the employment contract at the employee's initiative,
              with notice period served and last working day on 27 June 2026.
            </p>
            <p>
              The company will pay all severance entitlements under the CLT — salary balance,
              prorated 13th-month, prorated vacation plus the constitutional 1/3 bonus, notice
              period paid in lieu, and will remit FGTS with the corresponding fine, per the
              attached TRCT.
            </p>
            <p>The termination will be homologated with the labor union within the statutory window.</p>
          </section>
        </div>

        {/* Signature panel */}
        <section className="border-t border-divider pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-[0.08em] uppercase text-mute font-bold">
              Signature · HRBP, DSM-Firmenich Brasil
            </div>
            {!submitted && (
              <button
                type="button"
                onClick={clearSig}
                disabled={!hasInk}
                className={cn(
                  "ui-pill inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded",
                  hasInk ? "text-mute hover:text-ink" : "text-divider cursor-not-allowed",
                )}
              >
                <Eraser size={12} strokeWidth={1.8} />
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={cn(
                "block w-full h-[120px] rounded-md bg-white border border-dashed touch-none",
                submitted || hasInk ? "border-surface-deep" : "border-divider",
              )}
              style={{ cursor: submitted ? "default" : "crosshair" }}
            />
            {!hasInk && !submitted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[12px] text-mute">
                Sign with mouse or finger
              </div>
            )}
            {submitted && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-mint/40 rounded-md">
                <div className="flex items-center gap-2 text-surface-deep font-bold text-[13px]">
                  <Check size={14} strokeWidth={2.4} />
                  {alreadySigned
                    ? "Signed · filed with homologação · routed to payroll"
                    : "Capturing signature · filing with homologação…"}
                </div>
              </div>
            )}
            <div
              aria-hidden
              className="absolute left-3 right-3 bottom-3 border-t border-divider"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] text-mute">
            <div>
              <div className="text-[10px] tracking-[0.08em] uppercase font-medium">Witness</div>
              <div className="text-ink">DSM-F Compliance agent</div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.08em] uppercase font-medium">Date</div>
              <div className="text-ink">Today · 11:02 BRT</div>
            </div>
          </div>
        </section>
      </div>
    </PreviewModal>
  );
}
