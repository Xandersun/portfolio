import type { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { manrope } from "../../_components/fonts";
import { PrimaryNav } from "../../_components/primary-nav";
import { CaseToc } from "../../_components/case-toc";
import { CaseHero } from "../../_components/case-hero";
import { CaseSection } from "../../_components/case-section";
import { CaseNavFooter } from "../../_components/case-nav-footer";
import { CaseFooter } from "../../_components/case-footer";
import { getCaseStudyNav } from "../../_components/case-study-order";

import { LivingSystemSection } from "./_living-system/living-system-section";
import {
  AuditInspectionDiagram,
  DataGridDiagram,
  InformationArchitectureDiagram,
} from "./_diagrams/structure-diagrams";

/**
 * portfolio-import — "Monster Legacy Modernization" alternate case study.
 *
 * A separate, isolated route built alongside the existing
 * /case-studies/monster page (untouched) so the two can be compared
 * directly. Historical claims throughout this page are drawn only from
 * that existing case study (structural consolidation, the pilot/validate/
 * govern rollout) — nothing here invents new historical facts, metrics,
 * or Monster functionality.
 *
 * This case study is framed around the broader problem of modernizing a
 * mature, complicated product incrementally — navigation is one of several
 * recurring problems addressed, not the main subject; the interactive
 * reconstruction below (Navigation & Hierarchy, Data & Tables, Forms &
 * Workflows, History & Change Tracking, Design System, Components) is
 * where those patterns are actually demonstrated, so they aren't
 * re-explained separately in prose.
 *
 * The five reconstructed legacy screenshots used by the original page are
 * deliberately not reused here. In their place: the Living Design System
 * accordion section, where the current reconstructed product experience —
 * fictional, clearly-labeled, built from real components — lives.
 */
export const metadata: Metadata = {
  title: "Monster Modernization | High-Density Enterprise Casework Architecture",
  description:
    "Lead UX Architect case study on modernizing navigation, data tables, and audit workflows for a complex public sector casework platform.",
  icons: { icon: "/portfolio-import/favicon.png" },
  robots: { index: false, follow: false },
};

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";

const NAV_LINKS = [
  { label: "Case Studies", href: "/#work" },
  { label: "About", href: "/about" },
];

const TOC_ITEMS = [
  { href: "#overview", label: "Overview" },
  { href: "#challenge", label: "The Modernization Challenge" },
  { href: "#information-architecture", label: "Information Architecture" },
  { href: "#audit-inspection", label: "Audit Inspection" },
  { href: "#data-grids", label: "Data Grids" },
  { href: "#living-system-navigation", label: "Navigation & Hierarchy" },
  { href: "#living-system-data", label: "Data & Tables" },
  { href: "#living-system-forms", label: "Forms & Workflows" },
  { href: "#living-system-history", label: "History & Change Tracking" },
  { href: "#living-system-design-system", label: "Design System" },
  { href: "#living-system-components", label: "Components" },
  { href: "#modernized-experience", label: "The Modernized Experience" },
];

export default function MonsterModernizationCaseStudyPage() {
  const { prev, next } = getCaseStudyNav("/case-studies/monster-modernization");

  return (
    <div className={cn("portfolio-import bg-white selection:bg-[#FF5733] selection:text-white", manrope.className)}>
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[1100] -translate-y-[150%] bg-[#0F172A] px-3.5 py-2.5 font-bold text-white no-underline focus:translate-y-0"
      >
        Skip to main content
      </a>

      <PrimaryNav brandHref="/#top" links={NAV_LINKS} resume={{ href: RESUME_URL }} />
      <CaseToc items={TOC_ITEMS} />

      <main id="main-content">
        <CaseHero
          tag="Monster Government Solutions"
          title="Modernizing a Complex Enterprise Application"
          intro="Restructuring six-tier navigation, contextual audit inspection, and dense data grids without sacrificing capability"
          meta={[
            { label: "Role", value: "Lead UX Architect" },
            {
              label: "Focus Areas",
              value: "Information Architecture, Enterprise Workflows, High-Density Data Grids",
            },
          ]}
        />

        <CaseSection id="overview" heading="Overview" tone="paper" className="border-t-0">
          <p>
            Over years of incremental feature growth, an established enterprise application had accumulated deep
            structural debt: core functionality was buried up to six levels deep in fragile dropdowns, audit histories
            opened in workflow-blocking modals, and data-heavy tables forced continuous horizontal scrolling on standard
            office monitors. Rather than applying a cosmetic visual refresh or stripping out functionality to make the
            UI look minimal, I led a structural modernization—reorganizing the information architecture around user
            context, preserving surrounding state during record inspection, and establishing clear scanning hierarchy
            across dense data tables.
          </p>
        </CaseSection>

        <CaseSection id="challenge" heading="01 / The Modernization Challenge" tone="paper">
          <h3>Structural Debt Beyond Visual Styling</h3>
          <p>
            Enterprise applications rarely become difficult to use overnight; they degrade over years of bolting new
            regulatory and business requirements onto an aging navigation tree. The central constraint of this
            modernization was{" "}
            <strong className="text-[#0F172A]">simplifying the structure without oversimplifying the product</strong>.
            Experienced users relied on deep capabilities and dense record data to process daily workloads—a
            superficial reskin would leave the underlying friction untouched, while stripping out density would slow
            down power users.
          </p>

          <p>Three systemic bottlenecks defined the problem:</p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Scattered, Six-Tier Navigation:</strong> Related tools were spread
              across unrelated categories up to six levels deep, forcing users through fragile cascading menus.
            </li>
            <li>
              <strong className="text-[#0F172A]">Context-Destroying Audit Modals:</strong> Viewing a record&apos;s
              change history launched a blocking modal that obscured the active workspace.
            </li>
            <li>
              <strong className="text-[#0F172A]">Horizontal Scroll Across Dense Grids:</strong> Unprioritized table
              columns overflowed typical office viewports, making row tracking error-prone.
            </li>
          </ul>
        </CaseSection>

        <CaseSection id="information-architecture" heading="02 / Rethinking the Information Architecture" tone="paper">
          <h3>Collapsing Six Levels of Scattered Dropdowns into Three Scope-Separated Tiers</h3>
          <p>
            The core problem in the legacy application was organizational, not visual. Simply moving the existing
            six-level menu tree into a modern sidebar would have preserved the exact same confusion in a new container.
          </p>

          <p>I restructured the information architecture around two foundational shifts:</p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Separating Global Tools from Record-Level Context:</strong> The legacy
              dropdowns conflated system-wide navigation with actions belonging to an active record. I replaced that
              single cascading tree with a <strong className="text-[#0F172A]">three-tier sidebar</strong> that
              separated persistent global navigation from record-specific context—ensuring users always knew whether
              they were acting at the system level or inside an individual profile.
            </li>
            <li>
              <strong className="text-[#0F172A]">Consolidating Scattered Functionality:</strong> I audited where tools
              lived across the application and regrouped fragmented capabilities into logical functional domains,
              collapsing up to six levels of nested menus into three predictable tiers.
            </li>
          </ul>

          <p>
            The same consolidation applies inside an individual record: eight flat legacy tabs became four grouped
            destinations, with the separate Case Notes and Event Log tabs now sitting together under History.
          </p>

          <InformationArchitectureDiagram />

          <h4>Design Trade-Off — Pointer Speed vs. Menu Stability</h4>
          <p>
            Moving to a three-tier sidebar eliminated six-level menu collapses, but multi-tier flyouts still break down
            under fast pointer movement if hover states trigger instantaneously or dismiss the moment a cursor moves
            diagonally toward a submenu. To keep navigation responsive without forcing extra clicks, we implemented
            asymmetric hover delays—approximately 60 ms before opening to ignore accidental pass-throughs, and 150 ms
            before closing to forgive diagonal cursor trajectories.
          </p>
        </CaseSection>

        <CaseSection id="audit-inspection" heading="03 / Preserving Context During Audit Inspection" tone="paper">
          <h3>Replacing Blocking Modals with Inline Row Expansion</h3>
          <p>
            Once users could reach a record cleanly, the next major friction point hit during audit verification. In
            the legacy system, inspecting a record&apos;s change history opened a blocking modal that covered the
            active form and surrounding rows, forcing users to cross-reference changes without seeing the live record
            in context.
          </p>
          <p>
            I eliminated the audit modals and redesigned the flow around{" "}
            <strong className="text-[#0F172A]">inline expandable rows</strong> inside the audit trail table. Expanding
            an entry reveals the complete change record in place—who made the change, when it occurred, and previous
            versus updated values—while keeping the surrounding workspace intact.
          </p>

          <h4>Design Trade-Off — Context Preservation vs. Vertical Table Growth</h4>
          <p>
            Inline expansion eliminates modal open-and-close steps and keeps the active record visible, at the cost of
            increasing vertical table height when multiple entries are expanded. Structuring the inline diff as a
            compact, scannable block preserved surrounding orientation without overwhelming the table.
          </p>

          <AuditInspectionDiagram />
        </CaseSection>

        <CaseSection id="data-grids" heading="04 / Balancing Information Density and Readability" tone="paper">
          <h3>Structuring Enterprise Data Grids for Typical Office Viewports</h3>
          <p>
            Primary casework tables needed to support high attribute density without forcing constant horizontal
            scrolling across standard office monitors.
          </p>

          <p>
            Built on <strong className="text-[#0F172A]">AG Grid</strong>, the redesigned tables established a strict
            scanning hierarchy:
          </p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Pinned Primary Identifiers:</strong> Key row anchors such as{" "}
              <strong className="text-[#0F172A]">Case ID</strong> were pinned to the left edge so record identity
              stayed locked during horizontal inspection.
            </li>
            <li>
              <strong className="text-[#0F172A]">Viewport-Conscious Column Prioritization:</strong> Case status and
              priority sit immediately after the pinned Case ID, followed by category, review, and last activity. Every
              column except Case ID can be hidden from the grid&apos;s Columns panel, so users can narrow the table to
              what fits their monitor without losing the row anchor.
            </li>
          </ul>

          <DataGridDiagram />
        </CaseSection>

        <LivingSystemSection />

        <CaseSection
          id="modernized-experience"
          heading="05 / The Modernized Experience"
          tone="surface"
          className="bg-[#F6F7F9] md:pt-[88px] md:pb-[96px]"
        >
          <h3>Bringing Structure, Context, and Density Together</h3>
          <p>
            The reorganized information architecture, inline audit diffs, and structured AG Grid layouts operate as a
            single cohesive workspace:
          </p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Navigate by Scope:</strong> Move between persistent global tools and
              record-level sections across a three-tier sidebar without traversing deep dropdown trees.
            </li>
            <li>
              <strong className="text-[#0F172A]">Inspect History in Place:</strong> Expand audit rows inline to verify
              before-and-after field values while keeping the active record visible.
            </li>
            <li>
              <strong className="text-[#0F172A]">Scan Dense Records Cleanly:</strong> Review multi-attribute rows
              anchored by pinned Case IDs within a standard office viewport.
            </li>
          </ul>

          <h3>Shipping Into a Live System &amp; Stakeholder Alignment</h3>
          <p>
            Because this was an active, mission-critical government platform rather than a greenfield build,
            structural changes had to respect existing workflows, regulatory requirements, and established power-user
            habits. Securing stakeholder sign-off meant demonstrating that reorganizing the navigation and table
            hierarchy would reduce daily friction without removing required data fields or disrupting veteran
            caseworkers—using interactive prototypes to align product, engineering, and domain stakeholders before
            committing changes to the live system.
          </p>
        </CaseSection>

        <div className="px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <CaseNavFooter prev={prev} next={next} />
        </div>
      </main>

      <CaseFooter background="#F6F7F9" />
    </div>
  );
}
