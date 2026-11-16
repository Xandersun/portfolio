"use client";

/**
 * Interactive prototypes for the v2 case study, unbundled from the former
 * single six-item accordion so each one sits directly under the narrative
 * section it supports:
 *
 *   02 Platform Architecture  → NavigationPrototype (single view, open)
 *   03 Caseload & Compliance  → CaseloadPrototype (Data & Tables /
 *                               Forms & Workflows / History & Change Tracking)
 *   04 Design System          → DesignSystemPrototype (Design System /
 *                               Components)
 *
 * Every view renders a REAL component — a light-mode fork of a real
 * /portfolio-v2/lds page (DesignSystemPanel, StatesPanel, AuditTrailPanel)
 * or a real piece of the Monster reconstruction (NavigationPanel,
 * AfterCaseload, FormsWorkflowsPanel, VariantsPanel). Nothing is a
 * screenshot.
 *
 * Each prototype renders OUTSIDE CaseSection (CaseSection styles every
 * descendant p/ul/li/h3/h4, which would restyle the prototypes' own
 * markup), in a band that continues the section's background. Only the
 * active tab is mounted, so the heavier views (AG Grid etc.) mount on
 * demand. No ancestor here sets overflow, so NavigationPanel's sticky
 * sidebar keeps an unbroken path to the page scroll.
 */

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Typography } from "antd";

import { AfterCaseload } from "../_reconstruction/after/after-caseload";
import { AuditTrailPanel } from "../_reconstruction/after/audit-trail-panel";
import { DesignSystemPanel } from "../_reconstruction/after/design-system-panel";
import { FormsWorkflowsPanel } from "../_reconstruction/after/forms-workflows-panel";
import { NavigationPanel } from "../_reconstruction/after/navigation-panel";
import { StatesPanel } from "../_reconstruction/after/states-panel";
import { VariantsPanel } from "../_reconstruction/after/variants-panel";
import { LdsLightEmbed } from "./lds-light-embed";

const { Title, Paragraph } = Typography;

/** Heading + one-sentence description inside a view (matches the real LDS page intros). */
function ViewIntro({ heading, description }: { heading: string; description: string }) {
  return (
    <>
      <Title level={2} style={{ marginBottom: 4 }}>
        {heading}
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24, fontSize: 15, lineHeight: 1.6, color: "#334155" }}>
        {description}
      </Paragraph>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared frame                                                        */
/* ------------------------------------------------------------------ */

interface View {
  id: string;
  label: string;
  render: () => ReactNode;
}

function PrototypeFrame({
  id,
  prompt,
  views,
  defaultView,
  tone = "paper",
}: {
  id: string;
  prompt: string;
  views: View[];
  defaultView?: string;
  tone?: "paper" | "surface";
}) {
  const [active, setActive] = useState(defaultView ?? views[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = views.find((v) => v.id === active) ?? views[0];
  const tabbed = views.length > 1;

  const onTabKeyDown = (e: KeyboardEvent, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + views.length) % views.length;
    setActive(views[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      id={id}
      className={`w-full scroll-mt-[112px] px-4 pb-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:pb-24 ${
        tone === "surface" ? "bg-[#F8F9FA]" : "bg-white"
      }`}
    >
      <div className="border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]">
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 pt-4 sm:px-6">
          <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${tabbed ? "pb-3" : "pb-4"}`}>
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#FF5733]">
              Interactive Prototype
            </span>
            <span className="text-[14px] leading-[1.5] text-[#475569]">{prompt}</span>
          </div>

          {tabbed && (
            <div role="tablist" aria-label="Prototype views" className="-mb-px flex gap-6 overflow-x-auto">
              {views.map((view, i) => {
                const selected = view.id === current.id;
                return (
                  <button
                    key={view.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${view.id}`}
                    aria-selected={selected}
                    aria-controls={`${id}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(view.id)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={`shrink-0 cursor-pointer whitespace-nowrap border-b-2 pb-2.5 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A] ${
                      selected
                        ? "border-[#FF5733] text-[#0F172A]"
                        : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    {view.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          id={`${id}-panel`}
          // Below md, wide views (audit table, nav demo) scroll inside the frame instead of the page.
          // Desktop keeps overflow visible so NavigationPanel's sticky sidebar still tracks the page scroll.
          className="max-md:relative max-md:overflow-x-auto"
          role={tabbed ? "tabpanel" : undefined}
          aria-labelledby={tabbed ? `${id}-tab-${current.id}` : undefined}
        >
          <LdsLightEmbed>
            <div key={current.id}>{current.render()}</div>
          </LdsLightEmbed>
        </div>
      </div>

      <style jsx global>{`
        .states-align-fix > div {
          max-width: 1280px !important;
        }
        .states-align-fix h2.ant-typography {
          font-size: 20px !important;
          line-height: 28px !important;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Views                                                               */
/* ------------------------------------------------------------------ */

const NAVIGATION_VIEW: View = {
  id: "navigation",
  label: "Navigation & Hierarchy",
  render: () => (
    <div style={{ padding: 24 }}>
      <ViewIntro
        heading="Navigation & Hierarchy"
        description="Clear levels of navigation keep global tools, record context, and deeper workflows distinct."
      />
      <div style={{ borderRadius: 8, border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
        <NavigationPanel />
      </div>
    </div>
  ),
};

const DATA_VIEW: View = {
  id: "data",
  label: "Data & Tables",
  render: () => (
    <div style={{ padding: 24 }}>
      <ViewIntro
        heading="Data & Tables"
        description="Dense operational data designed for fast scanning, filtering, and action — with saved views, filtering, and column configuration built into one toolbar."
      />
      <AfterCaseload onSelect={() => {}} />
    </div>
  ),
};

const FORMS_VIEW: View = {
  id: "forms",
  label: "Forms & Workflows",
  render: () => (
    <div style={{ padding: 24 }}>
      <ViewIntro
        heading="Forms & Workflows"
        description="Complex forms need to support validation, dependencies, repeated information, and recovery without forcing users through a rigid sequence."
      />
      <FormsWorkflowsPanel />
    </div>
  ),
};

const HISTORY_VIEW: View = {
  id: "history",
  label: "History & Change Tracking",
  render: () => (
    <>
      <div style={{ padding: "24px 24px 0" }}>
        <ViewIntro
          heading="History & Change Tracking"
          description="Who changed something, what changed, when, and the before/after state — traceability as an interaction problem, not a single feature checkbox."
        />
      </div>
      <AuditTrailPanel />
    </>
  ),
};

const DESIGN_SYSTEM_VIEW: View = {
  id: "design-system",
  label: "Design System",
  render: () => <DesignSystemPanel />,
};

const COMPONENTS_VIEW: View = {
  id: "components",
  label: "Components",
  render: () => (
    <>
      <div style={{ padding: "24px 24px 0" }}>
        <Title level={2} style={{ marginBottom: 4 }}>
          Components
        </Title>
        <p style={{ fontSize: 16, lineHeight: "24px", color: "#334155", marginBottom: 24, maxWidth: 760 }}>
          Consistent states and variants make system behavior predictable across the product.
        </p>
      </div>
      <div className="states-align-fix">
        <StatesPanel />
      </div>
      <div style={{ borderTop: "1px solid #E2E8F0" }} />
      <VariantsPanel />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Section embeds                                                      */
/* ------------------------------------------------------------------ */

export function NavigationPrototype() {
  return (
    <PrototypeFrame
      id="prototype-navigation"
      prompt="Explore the unified workspace shell and 6 consolidated Customer Profile groups."
      views={[NAVIGATION_VIEW]}
    />
  );
}

export function CaseloadPrototype() {
  return (
    <PrototypeFrame
      id="prototype-caseload"
      prompt="Switch views to inspect dense caseload grids, progressive forms, and in-place audit diffs."
      views={[DATA_VIEW, FORMS_VIEW, HISTORY_VIEW]}
      defaultView="data"
    />
  );
}

export function DesignSystemPrototype() {
  return (
    <PrototypeFrame
      id="prototype-design-system"
      prompt="Switch views to inspect the design system foundations and component states and variants."
      views={[DESIGN_SYSTEM_VIEW, COMPONENTS_VIEW]}
    />
  );
}
