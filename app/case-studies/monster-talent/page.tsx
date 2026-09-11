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
import { getCaseStudyNav } from "../../_components/case-study-order";

/**
 * portfolio-import — Monster Talent Intelligence Platform case study.
 * IMPLEMENTATION REFACTOR pass: same content/structure/visual result as the
 * previous version of this file (source: case-studies/monster-talent.html
 * via monster-talent.css), rebuilt on Tailwind utilities + this route's
 * shared components (PrimaryNav, CaseHero, CaseSection, RevealFigure,
 * CaseNavFooter, CaseFooter) instead of monster-talent.css +
 * case-study-shared.css (both now unused by this page and deleted).
 *
 * This page's source never had a reveal-on-scroll script or any other
 * inline <script>, so it stays a single plain server component — no
 * "use client", no useReveal, no .reveal classes, matching the prior
 * version's own doc comment on this point.
 *
 * The source had no in-page table of contents. A later pass added CaseToc
 * here for consistency with the other three case studies — labels are
 * derived directly from this page's five existing CaseSection headings
 * (Overview / Hiring Workflow / Data Intake / Candidate Evaluation /
 * Product Ecosystem), no new sections or content invented. CaseSection
 * still requires an `id` per section; the ids below were already inert
 * scroll-target slugs (nothing linked to them before) and now serve as the
 * real CaseToc anchors.
 *
 * Known minor deltas vs. the pre-refactor pixel output, all a consequence
 * of the shared components being read-only (not modifiable as part of this
 * refactor):
 * - CaseHero always renders a pills row, but this page's hero has no pills
 *   in the source. An empty array is passed; the resulting empty row's
 *   top margin adds a small amount of extra vertical space in the hero
 *   that the original markup didn't have.
 * - RevealFigure's figcaption always includes 12px of left padding
 *   (matching the `.reveal-img` figcaption convention from case studies
 *   that do use the reveal script). This page's own `.case-visual`
 *   figcaptions had no left padding in the source CSS, so captions here
 *   sit ~12px further right than before.
 * - PrimaryNav renders a translucent `bg-white/95` nav background. This
 *   page's own nav override forced a fully opaque background
 *   (`var(--paper)`, no transparency). PrimaryNav has no background/
 *   className override prop, so this stays a minor translucency
 *   difference, only visible with content scrolled directly underneath.
 * - The closing "Product Suite Alignment" figure pairs two images
 *   side-by-side with a shared caption — a shape none of the shared
 *   figure components support (RevealFigure is single-image), so it's
 *   built directly with Tailwind (a two-column grid inside a plain
 *   figure), matching the original `.case-visual-duo` layout.
 */
export const metadata: Metadata = {
  title: "Monster Talent Intelligence Platform | Alex Sun",
  description:
    "How I designed the information architecture, workflows, and shared interaction patterns for a new enterprise recruiting platform.",
  icons: { icon: "/portfolio-import/favicon.png" },
  openGraph: {
    type: "website",
    title: "Monster Talent Intelligence Platform | Alex Sun",
    description:
      "How I designed the information architecture, workflows, and shared interaction patterns for a new enterprise recruiting platform.",
    images: ["/portfolio-import/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monster Talent Intelligence Platform | Alex Sun",
    description:
      "How I designed the information architecture, workflows, and shared interaction patterns for a new enterprise recruiting platform.",
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
  { href: "#systems-alignment", label: "Overview" },
  { href: "#map-workflow", label: "Hiring Workflow" },
  { href: "#data-intake", label: "Data Intake" },
  { href: "#candidate-evaluation", label: "Candidate Evaluation" },
  { href: "#product-ecosystem", label: "Product Ecosystem" },
];

export default function PortfolioImportMonsterTalentPage() {
  const { prev, next } = getCaseStudyNav("/case-studies/monster-talent");

  return (
    <div className={cn("portfolio-import bg-white selection:bg-[#FF5733] selection:text-white", manrope.className)}>
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[1100] -translate-y-[150%] bg-[#0F172A] px-3.5 py-2.5 font-bold text-white no-underline focus:translate-y-0"
      >
        Skip to main content
      </a>

      <PrimaryNav links={NAV_LINKS} resume={{ href: RESUME_URL }} />
      <CaseToc items={TOC_ITEMS} />

      <main id="main-content">
        <CaseHero
          tag="Monster Government Solutions"
          title="Building a recruiting platform from the ground up."
          intro={
            <>
              Monster Government Solutions envisioned a new Talent Intelligence Platform connecting
              recruiters, candidates, and enterprise recruiting systems. Working with Product Owners
              and Engineering, I translated that vision into the platform&apos;s information
              architecture, interaction model, and shared experience patterns.
            </>
          }
          pills={[]}
          meta={[
            { label: "Role", value: "Lead UX Designer" },
            { label: "Domain", value: "Public Sector / GovTech" },
          ]}
        />

        <CaseSection id="systems-alignment" heading="The platform had to connect people, data, and systems." tone="paper">
          <p>
            Recruiting workflows crossed multiple roles, products, and enterprise systems. Recruiters,
            candidates, Talent Pool, Appian, and other tools exchanged information through a series of
            handoffs that needed to work as one experience.
          </p>
        </CaseSection>

        <CaseSection id="map-workflow" heading="Map the hiring workflow before designing the interface." tone="surface">
          <p>
            Before designing screens, I partnered with Product Owners to map the complete hiring
            workflow. The map showed how recruiters, candidates, and enterprise systems exchanged
            information and exposed where handoffs, legacy tools, and disconnected data created
            friction. It became a shared source of truth for Product, Engineering, and Design, helping
            define platform responsibilities, automated handoffs, and technical boundaries.
          </p>

          <RevealFigure
            src="/portfolio-import/images/monster/flow.png"
            alt="Diagram showing recruiter roles, candidates, Talent Pool, Appian, and automated handoffs"
            imgClassName="max-w-[800px]"
            caption={
              <>
                <strong>System Alignment:</strong> Mapped roles, handoffs, and system boundaries before
                defining the product experience.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="data-intake" heading="Fix messy data before it entered the system." tone="paper">
          <p>
            Recruiting assistants regularly imported large, inconsistent applicant files from hiring
            events and campaigns. I designed a bulk intake workflow with validation, error messaging,
            status tracking, processing history, and downloadable templates so teams could identify
            problems before records entered the talent pool.
          </p>

          <RevealFigure
            src="/portfolio-import/images/monster/TP-AddCadidates.png"
            alt="Bulk upload workflow with validation, processing history, and upload status"
            caption={
              <>
                <strong>Guided Data Intake:</strong> Added validation and formatting guidance upstream
                so teams could resolve import problems before processing.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="candidate-evaluation" heading="Design around how recruiters actually evaluate candidates." tone="surface">
          <p>
            The workflow map shaped the product around recruiters&apos; daily work. I designed a
            centralized dashboard and shared patterns for navigation, filtering, and page structure so
            recruiters could move between talent pools, recommendations, searches, and candidate
            details without losing context. Search results and candidate profiles were designed as one
            continuous evaluation workflow. Key requisition information stayed visible, candidate
            tables supported filtering and inline actions, and profiles prioritized the signals
            recruiters needed for hiring decisions.
          </p>

          <RevealFigure
            src="/portfolio-import/images/monster/TP-Home-Desktop-cropped.png"
            alt="Dashboard providing a centralized workspace for recruiting activity"
            caption={
              <>
                <strong>Workflow-Driven Dashboard:</strong> Prioritized recent work and saved activity
                so recruiters could return quickly to active tasks.
              </>
            }
          />

          <RevealFigure
            src="/portfolio-import/images/monster/TP-Job-Desktop-Top.png"
            alt="Job announcement header showing key requisition metadata and controls"
            caption={
              <>
                <strong>Persistent Job Context:</strong> Kept key requisition information and primary
                controls visible while recruiters evaluated candidates.
              </>
            }
          />

          <RevealFigure
            src="/portfolio-import/images/monster/TP-Job-Desktop-Bottom.png"
            alt="Candidate table view with inline actions and filtering capabilities"
            caption={
              <>
                <strong>Efficient Candidate Evaluation:</strong> Combined filtering and inline actions
                so recruiters could review and move candidates through the pipeline without unnecessary
                page changes.
              </>
            }
          />

          <RevealFigure
            src="/portfolio-import/images/monster/profile.png"
            alt="Candidate profile prioritizing key recruiting signals before detailed information"
            caption={
              <>
                <strong>Decision-First Hierarchy:</strong> Prioritized the information most useful to
                candidate evaluation while keeping supporting details accessible.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="product-ecosystem" heading="One product, built to fit a larger ecosystem." tone="surface" className="bg-[#F6F7F9]">
          <p>
            The platform needed its own interaction patterns while remaining recognizable as part of
            Monster. I aligned typography, iconography, color application, and other visual
            foundations with the broader Monster style guide, then adapted those foundations for dense
            enterprise workflows and public-sector requirements. The result was a unified recruiting
            platform with shared navigation, search, dashboard, data-intake, and candidate-evaluation
            patterns that could support multiple product areas while integrating with the broader
            Monster ecosystem.
          </p>

          <figure className="mx-auto mt-6 w-full max-w-[1100px] px-5 sm:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <img
                src="/portfolio-import/images/monster/monster-com.png"
                alt="Monster.com commercial portal interface"
                className="w-full rounded-sm border border-[#E2E8F0] bg-white"
              />
              <img
                src="/portfolio-import/images/monster/monster-gov.png"
                alt="Monster Government Solutions enterprise portal interface"
                className="w-full rounded-sm border border-[#E2E8F0] bg-white"
              />
            </div>

            <figcaption className="mt-3 mb-16 text-sm leading-normal text-[#64748B] [&_strong]:font-bold [&_strong]:text-[#334155]">
              <strong>Product Suite Alignment:</strong> Extended Monster&apos;s shared visual
              foundations into a denser enterprise product without forcing consumer patterns onto
              government workflows.
            </figcaption>
          </figure>
        </CaseSection>

        <div className="border-t border-[#E2E8F0] px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <CaseNavFooter prev={prev} next={next} />
        </div>
      </main>

      <CaseFooter background="#F6F7F9" />
    </div>
  );
}
