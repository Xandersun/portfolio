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

import {
  CaseloadPrototype,
  DesignSystemPrototype,
  NavigationPrototype,
} from "./_living-system/living-system-section";
import { InformationArchitectureDiagram } from "./_diagrams/structure-diagrams";

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
  title: "Monster Modernization | Enterprise Casework Architecture",
  description:
    "Lead UX Architect case study on modernizing navigation and audit workflows for a complex public sector casework platform.",
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
  { href: "#information-architecture", label: "Platform Architecture" },
  { href: "#caseload-compliance", label: "Caseload & Compliance" },
  { href: "#design-system", label: "Design System & Components" },
  { href: "#modernized-experience", label: "Live-System Constraints" },
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
          intro="Restructuring six-tier navigation and contextual audit inspection without sacrificing capability"
          meta={[
            { label: "Role", value: "Lead UX Architect" },
            {
              label: "Focus Areas",
              value: "Information Architecture, Enterprise Workflows",
            },
          ]}
        />

        <CaseSection id="overview" heading="Overview" tone="paper" className="border-t-0">
          <p>
            Monster Works is an enterprise workforce platform used daily by caseworkers to assess job seekers,
            coordinate services, and place them into jobs across Customer, Employer, Staff, and Event records,
            alongside seven specialized program sections.
          </p>
          <p>
            Over more than five years of incremental growth, separate design and engineering teams shipped features
            without a shared structural model and relied on hardcoded navigation patterns that could not be updated
            globally. That technical and structural debt left the platform with six levels of nested hierarchy,
            low-priority tools cluttering primary workflows, and frequent context breaks during routine casework.
          </p>
          <p>
            I led an architectural overhaul of the product&apos;s structure, navigation, and record workflows, unifying
            fragmented modules into a single workspace organized around user context.
          </p>

          {/* Problem / Solution summary — div/span only, since CaseSection styles every descendant p. */}
          <div className="mt-10 grid max-w-[1000px] grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {[
              {
                label: "Problem",
                text: "Separate teams shipping hardcoded features over five years left Monster Works with a top-heavy global menu, six-level navigation depth, and fragmented workflows that broke caseworker context. At the same time, power users still depended on every underlying capability for daily caseloads.",
              },
              {
                label: "Solution",
                text: "A unified workspace architecture that separates global system tools from active record workflows, consolidates scattered modules into a predictable three-tier structure, and keeps supporting record data accessible in place.",
              },
            ].map((item) => (
              <div key={item.label} className="border-t-2 border-[#0F172A] pt-4">
                <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#FF5733]">
                  {item.label}
                </span>
                <span className="mt-2 block text-[17px] leading-[1.6] text-[#0F172A]">{item.text}</span>
              </div>
            ))}
          </div>
        </CaseSection>

        <CaseSection id="challenge" heading="01 / The Modernization Challenge" tone="paper">
          <h3>Structural Debt Beyond Visual Styling</h3>
          <p>
            Years of shipping regulatory updates and program features across separate teams had left Monster Works
            with a rigid, top-heavy structure. The central constraint was simplifying how caseworkers moved through
            the platform without removing capabilities that power users depended on for daily caseloads.
          </p>

          <p>Six structural bottlenecks defined the problem:</p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Unsustainable Hierarchy Depth:</strong> Deep sections pushed
              workflows up to six levels down and relied on breadcrumbs as a primary navigation mechanism, an
              architecture that did not scale as new program requirements were added.
            </li>
            <li>
              <strong className="text-[#0F172A]">Cross-Module Silos:</strong> Years of independent team delivery left
              related casework tasks split across disconnected sections with inconsistent grouping logic.
            </li>
            <li>
              <strong className="text-[#0F172A]">Mixed Navigation Metaphors:</strong> Competing menu, tab, and
              sub-navigation patterns overlapped across sections, forcing caseworkers to relearn how to move through
              the interface depending on where they were in the system.
            </li>
            <li>
              <strong className="text-[#0F172A]">Overloaded Global Navigation:</strong> The left-hand hamburger menu
              gave low-frequency administrative tools and minor modules the same prime visibility as core workflows.
            </li>
            <li>
              <strong className="text-[#0F172A]">Search Dependency Over Predictable Browsing:</strong> Because
              top-level navigation was cluttered with secondary tools, caseworkers relied on search just to reach core
              Customer, Employer, Staff, and Event records.
            </li>
            <li>
              <strong className="text-[#0F172A]">Frequent Context Breaks:</strong> Routine verification and
              cross-referencing workflows pulled caseworkers out of their active record state instead of keeping
              supporting information accessible in place.
            </li>
          </ul>
        </CaseSection>

        <CaseSection
          id="information-architecture"
          heading="02 / Platform Architecture"
          tone="paper"
          className="pb-10 md:pb-12"
        >
          <h3>Unifying Program Silos and State Configurations into One Core Model</h3>
          <p>
            Monster Works had evolved around individual program mandates and state-specific requests across Ohio and
            Michigan. While some of the seven specialized program modules supported core casework, others operated as
            disconnected tools with duplicated screens, meaning a core domain like Events was fragmented across modules
            rather than governed as a unified platform entity.
          </p>

          <p>Re-architecting the platform required resolving three structural and organizational tensions:</p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Moving from Program-Specific Views to Shared Domain Entities:</strong>{" "}
              Rather than letting each program maintain isolated workflows, I anchored the architecture around four
              core record entities (Customer, Employer, Staff, and Event) and positioned the seven specialized programs
              by how they actually intersect with daily caseloads. Shared domains like Events became unified platform
              entities instead of duplicated program sub-modules.
            </li>
            <li>
              <strong className="text-[#0F172A]">Balancing State-Specific Rules with a Canonical Record Model:</strong>{" "}
              Supporting both Ohio and Michigan meant accommodating distinct regulatory rules without forking the
              product. I defined a standardized record structure that preserved state-level configuration rules while
              consolidating 16 fragmented Customer Profile sections (such as Ex-Offender, Veteran Information, Household
              Composition, and MSFW) into 6 logical domain groups: Core Information, Education, Work History, Barriers,
              Tests &amp; Assessments, and Documents.
            </li>
            <li>
              <strong className="text-[#0F172A]">Aligning Program Stakeholders and Legacy Power Users:</strong>{" "}
              Consolidating familiar program screens into a shared model drew heavy pushback from both internal program
              owners protective of their dedicated workflows and experienced caseworkers reliant on muscle memory. I used
              workflow audits and usage data to demonstrate that core capabilities were preserved rather than cut,
              securing alignment without sacrificing the high-density tools daily staff depended on.
            </li>
          </ul>

          <InformationArchitectureDiagram />
        </CaseSection>

        <NavigationPrototype />

        <CaseSection
          id="caseload-compliance"
          heading="03 / High-Density Caseload & Compliance Execution"
          tone="paper"
          className="pb-10 md:pb-12"
        >
          <h3>Designing Power-User Workspaces for Speed and Auditability</h3>
          <p>
            A cleaner information architecture only succeeds if front-line staff can execute complex, regulated tasks
            without slowing down. Legacy enterprise tools often fail during modernization because teams oversimplify
            dense screens, forcing experienced caseworkers into extra clicks, blocking modals, and external
            spreadsheets.
          </p>
          <p>
            To preserve speed across daily caseloads in Ohio and Michigan, I established three operational interaction
            rules:
          </p>
          <ul>
            <li>
              <strong className="text-[#0F172A]">High-Density Caseload Scanning:</strong> Structured workspace grids
              around scannable field hierarchy, persistent record identifiers, and inline filtering so staff can triage
              large caseloads without losing orientation.
            </li>
            <li>
              <strong className="text-[#0F172A]">Progressive Disclosure for Regulated Intake:</strong> Separated core
              daily inputs from edge-case state compliance fields so routine updates move fast while specialized program
              requirements remain accessible on demand.
            </li>
            <li>
              <strong className="text-[#0F172A]">In-Place Compliance Verification:</strong> Replaced blocking audit
              modals with inline change inspection inside the record timeline, letting staff verify field-level updates
              while keeping active record context visible.
            </li>
          </ul>
        </CaseSection>

        <CaseloadPrototype />

        <CaseSection
          id="design-system"
          heading="04 / Governed Design System & Component Architecture"
          tone="paper"
          className="pb-10 md:pb-12"
        >
          <h3>Codifying Workspace Patterns into Shared Components</h3>
          <p>
            With separate teams building for both Ohio and Michigan, every new screen was another chance for the
            product to drift back into inconsistent patterns. The workspace patterns above (tiered navigation, dense
            caseload tables, progressive forms, and inline change history) were codified into shared, WCAG 2.1 AA
            compliant components, so every team and state deployment built from the same foundations, states, and
            variants.
          </p>
        </CaseSection>

        <DesignSystemPrototype />

        <CaseSection
          id="modernized-experience"
          heading="05 / Live-System Constraints & Stakeholder Alignment"
          tone="surface"
          className="bg-[#F6F7F9] md:pt-[88px] md:pb-[96px]"
        >
          <p>
            Because this was an active, mission-critical government platform rather than a greenfield build,
            structural changes had to respect existing workflows, regulatory requirements, and established power-user
            habits. Securing stakeholder sign-off meant demonstrating that reorganizing the navigation
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
