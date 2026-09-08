"use client";

/**
 * "See the system in action" — the curated,
 * fixed set of Living Design System capabilities the Interactive
 * Reconstruction demonstrates: Navigation & Hierarchy, Data & Tables,
 * Forms & Workflows, History & Change Tracking, Design System, and
 * Components (Component States + Component Variants). Patterns like Live
 * Telemetry, a standalone Density Toggle, Split-Screen Inspector,
 * Keyboard Shortcuts, and Case Workspace exist elsewhere in
 * /portfolio-v2/lds but are deliberately not part of this set.
 *
 * Saved Views and Command Palette are deliberately NOT standalone
 * accordions here: Saved Views is folded into Data & Tables' own toolbar
 * (see after-caseload.tsx) as one more ordinary grid capability, and
 * Command Palette is a global capability of this whole section (see
 * below) rather than a single feature to expand and look at.
 *
 * Every expanded panel renders a REAL component: either a local light-mode
 * fork of a real /portfolio-v2/lds page (DesignSystemPanel, StatesPanel,
 * AuditTrailPanel — forked only so each can render inside this section's
 * light theme, and in AuditTrailPanel's case with a demo-appropriate row
 * count, without touching the real /portfolio-v2/lds route it's forked
 * from), or a real piece of the Monster reconstruction itself
 * (NavigationPanel, AfterCaseload, FormsWorkflowsPanel, VariantsPanel).
 * Nothing here is a screenshot or a redrawn imitation.
 *
 * One shared LdsLightEmbed wraps the whole accordion (a light-theme
 * counterpart to how components/portfolio-v2/living-design-system-section.tsx
 * embeds a single LDS module elsewhere in portfolio-v2) so every panel
 * shares one antd scope/theme instead of several redundant ones. shadcn
 * Accordion defaults to unmounting collapsed panels (keepMounted: false),
 * so the heavier panels (AG Grid, etc.) only mount once actually expanded.
 *
 * The command palette is global to this section (not the real browser
 * window) via a keydown-capture listener on the section's own outer
 * wrapper rather than a `window` listener — Cmd/Ctrl+K works no matter
 * which panel has focus WITHIN this reconstruction, without hijacking the
 * shortcut on the rest of the portfolio page the way the real LDS's own
 * CommandPaletteProvider (a `window` listener) would. It reuses
 * MonsterCommandPalette (already built for the reconstruction,
 * scoped-input only) with its own small action list that jumps to one of
 * this section's six top-level destinations — not the real action
 * registry (lib/portfolio-v2/actions.tsx), whose actions navigate to
 * actual /portfolio-v2/lds routes and include case-management vocabulary
 * that doesn't belong in this generic reconstruction.
 */

import {
  History as HistoryIcon,
  Palette,
  PanelsTopLeft,
  RefreshCw,
  Table2,
  Workflow,
} from "lucide-react";
import { Typography } from "antd";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { CaseSection } from "../../../_components/case-section";
import { AfterCaseload } from "../_reconstruction/after/after-caseload";
import { AuditTrailPanel } from "../_reconstruction/after/audit-trail-panel";
import { MonsterCommandPalette, useMonsterCommandPalette, type PaletteAction } from "../_reconstruction/after/command-palette";
import { DesignSystemPanel } from "../_reconstruction/after/design-system-panel";
import { FormsWorkflowsPanel } from "../_reconstruction/after/forms-workflows-panel";
import { NavigationPanel } from "../_reconstruction/after/navigation-panel";
import { StatesPanel } from "../_reconstruction/after/states-panel";
import { VariantsPanel } from "../_reconstruction/after/variants-panel";
import { LdsLightEmbed } from "./lds-light-embed";
import { useState } from "react";

const { Title, Paragraph } = Typography;

/**
 * A visual frame only — no fixed height, no overflow/scroll. Content
 * grows naturally and the page itself scrolls, per the "one page scroll,
 * not page scroll + scrolling inside accordions" requirement.
 */
function Frame({ children }: { children: React.ReactNode }) {
  return <div style={{ borderRadius: 8, border: "1px solid #E2E8F0", background: "#FFFFFF" }}>{children}</div>;
}

/**
 * Standardized expanded-accordion introduction — heading + one-sentence
 * description, matching the Title level={2} / Paragraph type="secondary"
 * treatment the real /portfolio-v2/lds pages (Audit Trail, Design System,
 * Saved Views, States, Variants) already use for their own page intros.
 * Only used here for the panels built directly in this file; the real LDS
 * page imports already carry this exact pattern natively, so they're left
 * untouched rather than wrapped a second time.
 */
function AccordionIntro({ heading, description }: { heading: string; description: string }) {
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

interface Capability {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const CAPABILITY_META: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "navigation", label: "Navigation & Hierarchy", icon: <PanelsTopLeft className="size-4" /> },
  { id: "data", label: "Data & Tables", icon: <Table2 className="size-4" /> },
  { id: "forms", label: "Forms & Workflows", icon: <Workflow className="size-4" /> },
  { id: "history", label: "History & Change Tracking", icon: <HistoryIcon className="size-4" /> },
  { id: "design-system", label: "Design System", icon: <Palette className="size-4" /> },
  { id: "components", label: "Components", icon: <RefreshCw className="size-4" /> },
];

/**
 * The command palette's only actions are "Go to X" jumps to this
 * section's six real destinations — expanding the target accordion item
 * (if collapsed) and scrolling it into view. Every command is real and
 * verifiable; there are no placeholder/fake actions.
 */
function useGlobalCommandPalette(openItems: string[], setOpenItems: (items: string[]) => void) {
  const goTo = (id: string) => {
    if (!openItems.includes(id)) setOpenItems([...openItems, id]);
    window.setTimeout(() => {
      document.getElementById(`living-system-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const paletteActions: PaletteAction[] = CAPABILITY_META.map((cap) => ({
    id: `goto-${cap.id}`,
    label: `Go to ${cap.label}`,
    category: "Navigation",
    icon: cap.icon,
    run: () => goTo(cap.id),
  }));

  return useMonsterCommandPalette(paletteActions);
}

/**
 * Rendered as a child of LdsEmbed (not by LivingSystemSection directly) —
 * hooks like useSandboxNotify only resolve against a provider that is
 * actually an ancestor in the render tree, not one appearing later in a
 * sibling's JSX, so all the panel-building logic that depends on it has
 * to live inside this inner component.
 */
function LivingSystemAccordion() {
  const [openItems, setOpenItems] = useState<string[]>(["navigation"]);
  const palette = useGlobalCommandPalette(openItems, setOpenItems);
  const capabilities: Capability[] = [
    {
      id: "navigation",
      icon: <PanelsTopLeft className="size-5" />,
      title: "Navigation & Hierarchy",
      content: (
        <>
          <div style={{ padding: "24px 24px 0" }}>
            <AccordionIntro
              heading="Navigation & Hierarchy"
              description="Clear levels of navigation keep global tools, record context, and deeper workflows distinct."
            />
          </div>
          <div style={{ padding: "0 24px 24px" }}>
            <Frame>
              <NavigationPanel />
            </Frame>
          </div>
        </>
      ),
    },
    {
      id: "data",
      icon: <Table2 className="size-5" />,
      title: "Data & Tables",
      content: (
        <Frame>
          <div style={{ paddingTop: 36, paddingInline: 24, paddingBottom: 24 }}>
            <AccordionIntro
              heading="Data & Tables"
              description="Dense operational data designed for fast scanning, filtering, and action — with saved views, filtering, and column configuration built into one toolbar."
            />
            <AfterCaseload onSelect={() => {}} />
          </div>
        </Frame>
      ),
    },
    {
      id: "forms",
      icon: <Workflow className="size-5" />,
      title: "Forms & Workflows",
      content: (
        <Frame>
          <div style={{ padding: 24 }}>
            <AccordionIntro
              heading="Forms & Workflows"
              description="Complex forms need to support validation, dependencies, repeated information, and recovery without forcing users through a rigid sequence."
            />
            <FormsWorkflowsPanel />
          </div>
        </Frame>
      ),
    },
    {
      id: "history",
      icon: <HistoryIcon className="size-5" />,
      title: "History & Change Tracking",
      content: (
        <Frame>
          <div style={{ padding: "24px 24px 0" }}>
            <AccordionIntro
              heading="History & Change Tracking"
              description="Who changed something, what changed, when, and the before/after state — traceability as an interaction problem, not a single feature checkbox."
            />
          </div>
          <AuditTrailPanel />
        </Frame>
      ),
    },
    {
      id: "design-system",
      icon: <Palette className="size-5" />,
      title: "Design System",
      content: (
        <Frame>
          <DesignSystemPanel />
        </Frame>
      ),
    },
    {
      id: "components",
      icon: <RefreshCw className="size-5" />,
      title: "Components",
      content: (
        <Frame>
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
        </Frame>
      ),
    },
  ];

  return (
    <div onKeyDownCapture={palette.onKeyDownCapture}>
      <Accordion multiple value={openItems} onValueChange={setOpenItems} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {capabilities.map((cap) => (
          <AccordionItem key={cap.id} value={cap.id} id={`living-system-${cap.id}`} className="border-slate-200 px-5 scroll-mt-4">
            <AccordionTrigger className="living-system-trigger -mx-5 cursor-pointer rounded-md px-5 py-3.5 text-slate-900 hover:no-underline [&_svg]:text-slate-600">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                  {cap.icon}
                </div>
                <div className="min-w-0 flex-1 font-semibold text-slate-900">{cap.title}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="mt-2">{cap.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <MonsterCommandPalette open={palette.open} onClose={() => palette.setOpen(false)} actions={palette.actions} />
      <style jsx global>{`
        .living-system-trigger {
          background-color: #f1f5f9 !important;
          transition: background-color 0.15s ease;
        }
        .living-system-trigger:hover {
          background-color: #e9eef5 !important;
        }
        .living-system-trigger[aria-expanded="true"] {
          background-color: #f1f5f9 !important;
        }
        .living-system-trigger[aria-expanded="true"]:hover {
          background-color: #e9eef5 !important;
        }
        .states-align-fix > div {
          max-width: 1280px !important;
        }
        .states-align-fix h2.ant-typography {
          font-size: 20px !important;
          line-height: 28px !important;
        }
        .living-system-trigger:focus-visible {
          outline: none !important;
          box-shadow: inset 0 0 0 2px #0d9488 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .living-system-trigger {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export function LivingSystemSection() {
  return (
    <>
      <CaseSection
        id="living-system"
        heading="See the system in action."
        tone="surface"
        className="border-t-0"
      >
        <p>
          The interactive examples below show how common enterprise patterns can work together across a mature
          product. They demonstrate the design approach
          and interaction patterns, rather than reproducing the historical Monster interface.
        </p>
      </CaseSection>

      <div className="w-full bg-[#F8F9FA] px-4 pb-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:pb-24">
        <LdsLightEmbed>
          <LivingSystemAccordion />
        </LdsLightEmbed>
      </div>
    </>
  );
}
