import type { ReactNode } from "react";

/**
 * High-level structural diagrams for the v2 case study's sections 02–03.
 * Deliberately abstract (boxes, labels, flows, viewport frames) — the
 * interactive reconstruction further down the page covers real UI.
 *
 * Named items come from the reconstruction code; anything the code
 * doesn't name (the legacy menu's deeper levels) stays generic rather
 * than invented. after-sidebar.tsx has no
 * admin items, so the legacy Events/Users/Activity Log/System Settings
 * areas appear in the After tier as one grouped "outside scope" node.
 *
 * Note: these render inside CaseSection, whose descendant selectors style
 * every p/ul/li/h3/h4 — so this file uses div/span only.
 */

const INK = "#0F172A";
const ACCENT = "#FF5733";

/** before-left-nav.tsx */
const LEGACY_DOMAINS = ["Client Records", "Events", "Reports", "Users", "Activity Log", "System Settings"];
/** after-sidebar.tsx */
const GLOBAL_NAV = ["Caseload", "Appointments", "Reports"];
/** after-workspace.tsx — record-level tabs and History's sub-tabs */
const RECORD_SECTIONS = ["Summary", "Eligibility & Documents", "Referrals & Services", "History"];
const HISTORY_SUBSECTIONS = ["Activity", "Case Notes", "Related Records"];

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function DiagramFigure({
  number,
  label,
  caption,
  children,
}: {
  number: number;
  label: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure aria-label={`Figure ${number}: ${label}`} className="mt-10 mb-2 max-w-[1080px] border-t border-[#E2E8F0] pt-8">
      {children}
      <figcaption className="mt-6 max-w-[760px] text-[13.5px] leading-[1.55] text-[#64748B]">
        <span className="font-bold text-[#0F172A]">Figure {number}.</span> {caption}
      </figcaption>
    </figure>
  );
}

function PanelHeading({ phase, title }: { phase: "Before" | "After"; title: string }) {
  return (
    <div className="mb-5">
      <span
        className="block text-[11px] font-bold uppercase tracking-[0.08em]"
        style={{ color: phase === "Before" ? "#64748B" : ACCENT }}
      >
        {phase}
      </span>
      <span className="mt-1 block text-[17px] font-bold tracking-[-0.01em] text-[#0F172A]">{title}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Information architecture                                       */
/* ------------------------------------------------------------------ */

type NodeKind = "domain" | "global" | "record" | "related";

const LEGACY_TREE: { depth: number; label: string; kind: NodeKind }[] = [
  { depth: 1, label: "Client Records", kind: "domain" },
  { depth: 2, label: "Level 2", kind: "record" },
  { depth: 3, label: "Level 3", kind: "global" },
  { depth: 4, label: "Level 4", kind: "related" },
  { depth: 5, label: "Level 5", kind: "global" },
  { depth: 6, label: "Level 6", kind: "record" },
  { depth: 1, label: "Events", kind: "domain" },
  { depth: 1, label: "Reports", kind: "domain" },
  { depth: 2, label: "Level 2", kind: "global" },
  { depth: 3, label: "Level 3", kind: "related" },
  { depth: 1, label: "Users", kind: "domain" },
  { depth: 1, label: "Activity Log", kind: "domain" },
  { depth: 1, label: "System Settings", kind: "domain" },
];

function NodeMarker({ kind }: { kind: NodeKind }) {
  if (kind === "domain") return null;
  if (kind === "related")
    return <span aria-hidden className="inline-block size-2 shrink-0 rotate-45" style={{ background: ACCENT }} />;
  return (
    <span
      aria-hidden
      className="inline-block size-2 shrink-0 rounded-full"
      style={kind === "record" ? { background: INK } : { border: "1.5px solid #64748B" }}
    />
  );
}

const KIND_TEXT: Record<Exclude<NodeKind, "domain">, string> = {
  global: "global tool",
  record: "record action",
  related: "related tool",
};

function LegacyTree() {
  return (
    <div>
      <PanelHeading phase="Before" title="Legacy: 6-tier mixed hierarchy" />
      <div className="font-mono text-[12.5px] leading-[1.9] text-[#334155]">
        <div className="font-sans text-[13px] font-semibold text-[#0F172A]">Main menu</div>
        {LEGACY_TREE.map((node, i) => (
          <div key={i} className="flex items-center gap-2" style={{ paddingLeft: (node.depth - 1) * 16 }}>
            <span aria-hidden className="text-[#CBD5E1]">
              └
            </span>
            <NodeMarker kind={node.kind} />
            <span className={node.kind === "domain" ? "font-sans font-semibold text-[#0F172A]" : ""}>{node.label}</span>
            {node.kind !== "domain" && <span className="text-[#94A3B8]">· {KIND_TEXT[node.kind]}</span>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#64748B]">
        <span className="flex items-center gap-2">
          <NodeMarker kind="global" /> Global tool
        </span>
        <span className="flex items-center gap-2">
          <NodeMarker kind="record" /> Record action
        </span>
        <span className="flex items-center gap-2">
          <NodeMarker kind="related" /> Related tools split across branches
        </span>
      </div>
    </div>
  );
}

function TierRow({ tier, children }: { tier: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-3">
      <span className="pt-[3px] text-[11px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">{tier}</span>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px] font-medium text-[#0F172A]">{children}</div>
    </div>
  );
}

function ModernTiers() {
  return (
    <div>
      <PanelHeading phase="After" title="Modernized: scope-separated 3-tier model" />

      <div className="border-l-[3px] border-[#0F172A] pl-4">
        <span className="block text-[12px] font-bold uppercase tracking-[0.06em] text-[#0F172A]">
          Persistent global navigation
        </span>
        <span className="mt-0.5 block text-[12.5px] text-[#64748B]">System-wide, always available</span>
        <div className="mt-3">
          <TierRow tier="Tier 1">
            {GLOBAL_NAV.map((item) => (
              <span key={item}>{item}</span>
            ))}
            <span className="border border-dashed border-[#CBD5E1] px-2 py-px font-normal text-[#64748B]">
              System &amp; admin tools <span className="text-[#94A3B8]">— outside prototype scope</span>
            </span>
          </TierRow>
        </div>
      </div>

      <div className="mt-7 border-l-[3px] pl-4" style={{ borderColor: ACCENT }}>
        <span className="block text-[12px] font-bold uppercase tracking-[0.06em] text-[#0F172A]">
          Record-level context
        </span>
        <span className="mt-0.5 block text-[12.5px] text-[#64748B]">
          Scoped to the active Customer, Employer, Staff, or Event profile
        </span>
        <div className="mt-3 flex flex-col gap-3">
          <TierRow tier="Tier 2">
            {RECORD_SECTIONS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </TierRow>
          <TierRow tier="Tier 3">
            <span className="text-[#64748B]">History →</span>
            {HISTORY_SUBSECTIONS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </TierRow>
        </div>
      </div>
    </div>
  );
}

export function InformationArchitectureDiagram() {
  return (
    <DiagramFigure
      number={1}
      label="Information architecture before and after"
      caption="Global tools and record-level work now live in separate, predictable zones instead of one tangled menu."
    >
      <div className="grid grid-cols-1 gap-x-14 gap-y-12 md:grid-cols-2">
        <LegacyTree />
        <ModernTiers />
      </div>
    </DiagramFigure>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Audit inspection                                               */
/* ------------------------------------------------------------------ */

function FlowRow({ phase, title, steps }: { phase: "Before" | "After"; title: string; steps: string[] }) {
  const last = steps.length - 1;
  return (
    <div>
      <PanelHeading phase={phase} title={title} />
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center md:gap-3">
            <div
              className="flex min-h-[64px] flex-1 items-center border bg-white px-4 py-3 text-[13.5px] font-medium leading-[1.4] text-[#0F172A]"
              style={{
                borderColor: i === last ? (phase === "Before" ? "#94A3B8" : INK) : "#E2E8F0",
                borderStyle: i === last && phase === "Before" ? "dashed" : "solid",
                borderWidth: i === last ? 1.5 : 1,
              }}
            >
              {step}
            </div>
            {i < last && (
              <span aria-hidden className="self-center text-[#94A3B8]">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditInspectionDiagram() {
  return (
    <DiagramFigure
      number={2}
      label="Audit inspection flow before and after"
      caption="Change history opens in place, so the record under review never leaves the screen."
    >
      <div className="flex flex-col gap-10">
        <FlowRow
          phase="Before"
          title="Legacy: blocking modal"
          steps={["Active record", "Opens blocking modal", "Context obscured; cross-referencing from memory"]}
        />
        <FlowRow
          phase="After"
          title="Modernized: inline row expansion"
          steps={["Active record + audit table", "Expands row inline", "Who, when, and old vs. new values visible in context"]}
        />
      </div>
    </DiagramFigure>
  );
}
