import type { Metadata } from "next";

import { cn } from "@/lib/utils";

import { manrope } from "../../_components/fonts";
import { PrimaryNav } from "../../_components/primary-nav";
import { CaseToc } from "../../_components/case-toc";
import { CaseHero } from "../../_components/case-hero";
import { CaseSection } from "../../_components/case-section";
import { RevealFigure } from "../../_components/reveal-figure";
import { CaseNavFooter } from "../../_components/case-nav-footer";
import { CaseFooter } from "../../_components/case-footer";
import "./monster.css";

/**
 * portfolio-import — Monster Government Solutions case study.
 * IMPLEMENTATION REFACTOR pass: same content/structure/visual result as the
 * previous version of this file (source: case-studies/monster.html),
 * rebuilt on Tailwind utilities + this route's shared components
 * (PrimaryNav, CaseToc, CaseHero, CaseSection, RevealFigure, CaseNavFooter,
 * CaseFooter) instead of case-study-shared.css + the page-specific
 * monster.css (previously ~1095 lines — see monster.css's own header
 * comment for what's kept and why).
 *
 * No inline <script> in the source, so this stays a single plain server
 * component — no "use client" needed.
 *
 * The two-tier sticky nav this page's old CSS hand-rolled (a primary nav
 * bar + a case-study TOC bar stacked beneath it, both `position: sticky`)
 * turned out to be exactly the same structure PrimaryNav + CaseToc already
 * provide as shared components (same heights: 68px nav / 44px TOC, same
 * stacking), so no custom nav markup was needed here.
 *
 * The "Navigation Responsibilities" 4-column card grid in the
 * #navigation-system section is this case study's one genuinely bespoke
 * content pattern (illustrating the navigation model the case study is
 * about) — kept as scoped CSS in monster.css (`.nav-layers-grid`) since its
 * responsive border-collapse behavior isn't a clean Tailwind-only fit.
 *
 * Known minor deltas vs. the pre-refactor pixel output:
 * - This page's hero has no pill/tag chips in the source, but CaseHero
 *   requires a `pills` array — passed as `[]`, which adds a small (~28px)
 *   empty gap in the hero's first column that the source didn't have.
 * - CaseFooter has no border-top; the source footer had a 1px top border.
 * - The heading in the "Information Architecture" section was reachable at
 *   max-width 980px in the source via a section-position-specific override;
 *   CaseSection's own heading max-width (840px) is used instead. The
 *   heading text is short enough that this doesn't visibly change wrapping
 *   at any of the standard breakpoints checked.
 */
export const metadata: Metadata = {
  title: "Monster Government Solutions — Legacy Modernization | Alex Sun",
  description:
    "How I simplified a mature enterprise platform's information architecture and replaced competing navigation patterns with a scalable system.",
  icons: { icon: "/portfolio-import/favicon.png" },
  openGraph: {
    type: "website",
    title: "Monster Government Solutions — Legacy Modernization | Alex Sun",
    description:
      "How I simplified a mature enterprise platform's information architecture and replaced competing navigation patterns with a scalable system.",
    images: ["/portfolio-import/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monster Government Solutions — Legacy Modernization | Alex Sun",
    description:
      "How I simplified a mature enterprise platform's information architecture and replaced competing navigation patterns with a scalable system.",
    images: ["/portfolio-import/og-image.png"],
  },
};

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";

const NAV_LINKS = [
  { label: "Case Studies", href: "/#work" },
  { label: "About", href: "/about" },
];

const TOC_ITEMS = [
  { href: "#overview", label: "Overview" },
  { href: "#challenges", label: "Challenges" },
  { href: "#architecture", label: "Information Architecture" },
  { href: "#navigation-system", label: "Navigation System" },
  { href: "#outcomes", label: "Outcomes" },
];

const NAV_LAYERS = [
  { term: "Global", description: "Moves between major areas of the platform." },
  { term: "Customer-level", description: "Organizes primary sections for the active customer." },
  { term: "Nested", description: "Groups related destinations within a section." },
  { term: "Tertiary", description: "Supports deeper organization within a destination." },
];

export default function PortfolioImportMonsterCaseStudyPage() {
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
          title="Modernizing a live enterprise platform."
          intro="Monster Government Solutions supported complex casework across Customer, Employer, Staff, and Events. This case study focuses on the Customer experience, where years of incremental development had created overlapping navigation patterns, dense information, and growing structural complexity."
          pills={[]}
          meta={[
            { label: "Role", value: "UX Manager" },
            { label: "Domain", value: "Public Sector / GovTech" },
          ]}
        />

        <CaseSection id="overview" heading="Years of growth had created competing navigation systems." tone="paper" className="border-t-0">
          <p>
            The Customer experience had evolved incrementally rather than as a unified system. Global navigation,
            contextual controls, nested destinations, and increasingly granular tabs competed without a clear
            hierarchy. As functionality grew, users had to work harder to understand where information lived and how
            different destinations related to one another.
          </p>

          <h3>The Legacy Navigation</h3>
          <p>
            The Customer experience had accumulated multiple navigation mechanisms, each handling a different part
            of moving through the product:
          </p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Global Navigation:</strong> Moved between major areas of the
              platform.
            </li>
            <li>
              <strong className="text-[#0F172A]">Profile / Dashboard Toggle:</strong> Switched between the current
              customer&apos;s Profile and Dashboard.
            </li>
            <li>
              <strong className="text-[#0F172A]">Customer-Level Navigation:</strong> Used horizontal tabs to move
              between sections of the current customer.
            </li>
            <li>
              <strong className="text-[#0F172A]">Tab Cycling Controls:</strong> Provided access to customer-level
              tabs that extended beyond the available width.
            </li>
          </ul>

          <p>
            As features accumulated, these mechanisms increasingly competed for attention and made the hierarchy
            harder to understand.
          </p>

          <div
            className="mx-auto mt-[46px] mb-[22px] w-[min(calc(100%-64px),1036px)] max-w-[1036px] rounded-md bg-[#FFF0EB] px-[18px] py-4"
            style={{ border: "1px solid rgba(255,87,51,0.28)", borderLeft: "5px solid #FF5733" }}
          >
            <p className="m-0 text-base leading-[1.5] text-[#9A3412]">
              <strong>Note:</strong> Interface mocks and workflows are simplified abstractions created to illustrate
              interaction principles and layout strategy.
            </p>
          </div>

          <div className="mt-[-38px]">
            <RevealFigure
              src="/portfolio-import/images/legacy/tabs.png"
              alt="Legacy navigation showing an overflowing horizontal tab structure"
              caption={
                <>
                  <strong>Legacy Navigation:</strong> Multiple navigation patterns competed for attention, consumed
                  screen space, and made the hierarchy harder to understand.
                </>
              }
            />
          </div>
        </CaseSection>

        <CaseSection id="challenges" heading="Challenges" tone="surface" className="border-t-0">
          <ul>
            <li>
              <strong className="text-[#0F172A]">Navigation Complexity:</strong> Multiple navigation mechanisms had
              accumulated across the Customer experience, making hierarchy and relationships between destinations
              harder to understand.
            </li>
            <li>
              <strong className="text-[#0F172A]">Information Density:</strong> Complex casework required users to
              navigate and interpret large amounts of information without losing context or access to key
              functionality.
            </li>
            <li>
              <strong className="text-[#0F172A]">Legacy Dependencies:</strong> Different areas had evolved
              independently over many years, making structural changes risky to integrate across existing
              workflows.
            </li>
          </ul>
        </CaseSection>

        <CaseSection
          id="architecture"
          heading="Before redesigning the navigation, we simplified what it had to navigate."
          tone="paper"
          className="border-t-0"
        >
          <p>
            Moving the same fragmented structure into a new component would only relocate the problem. Within
            Customer Profile, I worked with the team to consolidate 16 top-level sections into 6 functional groups
            based on frequency of use and relationships between tasks.
          </p>

          <RevealFigure
            src="/portfolio-import/images/legacy/navigation-consolidation.png"
            alt="Customer Profile information architecture showing 16 legacy sections consolidated into 6 redesigned groups"
            caption={
              <>
                <strong>Information Architecture:</strong> Simplified the underlying structure before redesigning
                the navigation around it.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="navigation-system" heading="Each level of navigation needed one clear job." tone="surface" className="border-t-0">
          <p>
            With the information architecture simplified, I defined clearer responsibilities for each layer of
            navigation. We explored several alternatives. Flyouts were difficult to use, extending menus
            horizontally consumed valuable workspace, and replacing the left navigation at each level made it
            easier for users to lose their place. The final approach preserved context while staying compact enough
            for data-dense workflows.
          </p>

          <dl className="nav-layers-grid">
            {NAV_LAYERS.map((layer) => (
              <div key={layer.term}>
                <dt>{layer.term}</dt>
                <dd>{layer.description}</dd>
              </div>
            ))}
          </dl>
        </CaseSection>

        <CaseSection id="redesigned-navigation" heading="The Redesigned Navigation System" tone="paper" className="border-t-0">
          <p>
            The redesigned system kept both the customer and current section visible as users moved through the
            experience. Related destinations could expand within a section without crowding the primary navigation,
            while page-level navigation handled deeper organization only when it was needed.
          </p>

          <RevealFigure
            src="/portfolio-import/images/legacy/contextual-navigation.png"
            alt="Annotated interface showing contextual and nested navigation"
            caption={
              <>
                <strong>Page Orientation:</strong> Carried the navigation structure into the page so users could see
                where they were within the current workflow.
              </>
            }
          />

          <h4>Organizing Secondary Navigation</h4>
          <p>
            Sections can expand to reveal related destinations without adding them to the main navigation. Here,
            Case Notes contains Add Note, View All Notes, and Recent Notes. The page header carries that same
            structure into the content, identifying the current page as Case Notes &gt; Add Note.
          </p>

          <RevealFigure
            src="/portfolio-import/images/legacy/nested-navigation.png"
            alt="Annotated interface showing nested navigation and breadcrumb orientation"
            caption={
              <>
                <strong>Nested Navigation:</strong> Added depth without sacrificing workspace or customer context.
              </>
            }
          />

          <h4>Navigating Within the Content</h4>
          <p>
            When a destination contains multiple sections, tertiary navigation organizes them within the page.
            Here, View All Notes contains three sections, so tabs let users move between them without leaving the
            current destination. Pages without multiple sections, such as Add Note, don&apos;t need this additional
            navigation level.
          </p>

          <RevealFigure
            src="/portfolio-import/images/legacy/tertiary-navigation.png"
            alt="Annotated interface showing tertiary tab navigation"
            caption={
              <>
                <strong>Tertiary Navigation:</strong> Kept tabs where they still worked, instead of using them as
                the primary navigation model.
              </>
            }
          />
        </CaseSection>

        <CaseSection
          id="outcomes"
          heading="One architecture replaced a collection of competing patterns."
          tone="surface"
          className="bg-[#F6F7F9] md:pt-[88px] md:pb-[96px]"
        >
          <p>
            The new hierarchy established clear responsibilities across platform, Customer-level, nested, and
            tertiary navigation. It also created room for additional destinations without adding another competing
            navigation mechanism. Because this was a mature product, the system was introduced incrementally. New
            patterns were piloted in lower-risk areas, validated with experienced users, and reviewed with
            Engineering as implementation issues surfaced. Design reviews helped subsequent modernization work stay
            aligned with the new structure. The result was a reusable navigation foundation that supported
            continued modernization without requiring a full platform rewrite.
          </p>
        </CaseSection>

        <CaseSection id="scaling" heading="Scaling the System" tone="paper">
          <p>
            The navigation model was part of a broader effort to establish reusable patterns across the platform,
            but redesigning the architecture was only part of the challenge. Introducing it into a mature platform
            required an incremental rollout that could expose integration problems without destabilizing core
            workflows.
          </p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Pilot Rollout:</strong> Introduced new patterns in lower-risk areas
              to identify integration issues before broader adoption.
            </li>
            <li>
              <strong className="text-[#0F172A]">User Validation:</strong> Exposed early versions to experienced
              users while Engineering monitored implementation issues.
            </li>
            <li>
              <strong className="text-[#0F172A]">Design Governance:</strong> Used design reviews to keep subsequent
              modernization work aligned with the new patterns.
            </li>
          </ul>
        </CaseSection>

        <CaseSection id="design-outcomes" heading="Design Outcomes" tone="surface">
          <ul>
            <li>
              Established clear responsibilities across platform, Customer-level, nested, and tertiary navigation.
            </li>
            <li>
              Created a structure that could absorb additional destinations without introducing competing
              navigation mechanisms.
            </li>
            <li>
              Established reusable patterns and rollout practices that supported continued modernization without
              requiring a full platform rewrite.
            </li>
          </ul>
        </CaseSection>

        <div className="px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <CaseNavFooter
            prev={{
              href: "/case-studies/monster-talent",
              eyebrow: "← Previous",
              title: "Monster Government Solutions — Talent Intelligence Platform",
            }}
            next={{
              href: "/case-studies/marriott",
              eyebrow: "Next →",
              title: "Marriott Bonvoy — Promotion Registration",
            }}
          />
        </div>
      </main>

      <CaseFooter background="#F6F7F9" />
    </div>
  );
}
