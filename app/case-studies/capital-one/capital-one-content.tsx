"use client";

/**
 * portfolio-import — Capital One case study content.
 * IMPLEMENTATION REFACTOR pass: same content/structure/visual result as the
 * previous version of this file (source: case-studies/capital-one.html via
 * capital-one.css), rebuilt on Tailwind utilities + this route's shared
 * components (PrimaryNav, CaseToc, CaseHero, CaseSection, RevealFigure,
 * CaseNavFooter, CaseFooter) and the shadcn Table components, instead of
 * capital-one.css + case-study-shared.css.
 *
 * Interactivity preserved exactly:
 * 1. Reveal-on-scroll — now the shared useReveal() hook (./_components/
 *    use-reveal.ts) instead of a hand-rolled IntersectionObserver effect.
 *    Same behavior: observes .reveal/.reveal-img/.reveal-badge, adds "js"
 *    to the wrapper only when JS runs and prefers-reduced-motion is off.
 * 2. The "?from=gaming" query-param mode — same `fromGaming` state/effect
 *    as before, still swaps the résumé URL, the case-nav prev/next
 *    links+labels, and adds two extra footer links.
 *
 * One pixel-fidelity detail from the retired capital-one.css that doesn't
 * fall out of the shared components automatically, called out inline below:
 * - `.disclosure-note + figure.reveal-img { margin-top: 22px }` (vs. the
 *   normal 60px before a reveal-img figure) — reproduced with a negative
 *   top-margin wrapper around that one RevealFigure so the two margins
 *   collapse to the original 22px gap, without needing a figure-level prop
 *   on the shared RevealFigure component.
 */

import { useEffect, useState } from "react";

import { manrope } from "../../_components/fonts";
import { useReveal } from "../../_components/use-reveal";
import "../../_components/reveal.css";
import { PrimaryNav } from "../../_components/primary-nav";
import { CaseToc } from "../../_components/case-toc";
import { CaseHero } from "../../_components/case-hero";
import { CaseSection } from "../../_components/case-section";
import { AnalysisPlacementMockupAnimated } from "./_components/analysis-placement-illustration-animated";
import { PanelStructureIllustration } from "./_components/panel-structure-illustration";
import { PerCriterionAnalysisIllustration } from "./_components/per-criterion-analysis-illustration";
import { ConfidenceDesignComparisonIllustration } from "./_components/confidence-design-comparison-illustration";
import { CaseNavFooter } from "../../_components/case-nav-footer";
import { CaseFooter } from "../../_components/case-footer";
import { getCaseStudyNav } from "../../_components/case-study-order";
import {
  CaseTable,
  CaseTableHeader,
  CaseTableHead,
  CaseTableBody,
  CaseTableRow,
  CaseTableCell,
} from "../../_components/case-table";
import { OutcomeBadge } from "../../_components/outcome-badge";

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";
const RESUME_URL_GAMING =
  "https://docs.google.com/document/d/1OFk8UZZtZ0yK_eTOsUkoKdcGPCMsnk4atZt95AEGvWc/edit?usp=drive_link";

export function CapitalOneContent() {
  const rootRef = useReveal<HTMLDivElement>();
  const [fromGaming, setFromGaming] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("from") === "gaming") {
      setFromGaming(true);
    }
  }, []);

  const caseNav = getCaseStudyNav("/case-studies/capital-one");

  const prevLink = fromGaming
    ? {
        href: "/case-studies/blizzard-ui",
        eyebrow: "All Work",
        title: "Blizzard Entertainment / StarCraft II — UI Design",
      }
    : caseNav.prev;

  const nextLink = fromGaming
    ? {
        href: "/case-studies/monster?from=gaming",
        eyebrow: "Next →",
        title: "Monster Government Solutions — Enterprise Legacy Modernization",
      }
    : caseNav.next;

  return (
    <div className={`${manrope.className} portfolio-import selection:bg-[#FF5733] selection:text-white`} ref={rootRef}>
      <a
        className="fixed top-3 left-3 z-[1100] -translate-y-[150%] bg-[#0F172A] px-3.5 py-2.5 font-bold text-white focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>

      <PrimaryNav
        brandHref="/#top"
        links={[
          { label: "Case Studies", href: "/#work" },
          { label: "About", href: "/about" },
        ]}
        resume={{ href: fromGaming ? RESUME_URL_GAMING : RESUME_URL }}
      />

      <CaseToc
        items={[
          { href: "#overview", label: "Overview" },
          { href: "#process-design", label: "Key Decisions" },
          { href: "#impact", label: "Impact" },
        ]}
      />

      <main id="main-content">
        <CaseHero
          title="AI-Powered Decision Support"
          intro="Building the first human-in-the-loop AI feature for a risk management platform and defining reusable interaction patterns for future AI systems."
          pills={["Explainable AI", "AI Decision Support", "Enterprise Risk", "Cross-Functional Collaboration"]}
          pillBackground="#FFFFFF"
          meta={[
            { label: "Role", value: "Sole UX Designer" },
            { label: "Domain", value: "Enterprise Financial Services, AI Risk Management" },
            { label: "Tools", value: "Figma, Gemini" },
          ]}
        />

        <CaseSection id="overview" heading="Overview" tone="paper" reveal>
          <p>
            I designed an AI-assisted evaluation tool into Capital One&apos;s risk management platform to improve
            data quality at the point of entry. The work delivered a production decision-support feature and
            defined reusable AI interaction patterns to support consistency across future features.
          </p>

          {/* Same disclaimer treatment as the Legacy case study's own "Note"
              callout (app/case-studies/monster/page.tsx) — class names and
              inline border styles copied verbatim, not approximated. Only
              the top margin differs (24px here, per this case study's own
              spacing request), the copy is Capital One's own, and (below)
              `mx-auto` is dropped so the box left-aligns with the heading
              and body copy instead of centering — Legacy's own layout
              happens to want it centered in its own wrapper, but here that
              centering just indented it 64.5px off the shared left edge.
              Width behavior (the min(calc(100%-64px),1036px) formula) is
              otherwise untouched.
              The inner text is a <div>, not a <p> — this section's own
              ambient prose styling (the [&_p]:text-lg / leading-[1.65] /
              max-w-[760px] / text-[#334155] / mt-3 rules on its wrapper,
              see capital-one-content.tsx's outer prose div) targets every
              <p> and otherwise silently overrides this callout's own
              text-base/leading-[1.5]/text-[#9A3412]/m-0 — inflating the
              type, forcing an unwanted line wrap, and even overriding the
              coral text color back to the page's default slate. Legacy's
              own page has no such ambient rule, so its <p> never hits this;
              here a <div> with the identical classes sidesteps it instead
              of fighting it with !important. */}
          <div
            className="mt-[24px] mb-[22px] w-[min(calc(100%-64px),1036px)] max-w-[1036px] rounded-md bg-[#FFF0EB] px-[18px] py-4"
            style={{ border: "1px solid rgba(255,87,51,0.28)", borderLeft: "5px solid #FF5733" }}
          >
            <div className="m-0 text-base leading-[1.5] text-[#9A3412]">
              <strong>Note:</strong> Mockups shown here are simplified abstractions created to illustrate layout
              strategy. They do not reflect final production code.
            </div>
          </div>
        </CaseSection>

        <CaseSection id="process-design" heading="Key Decisions" tone="paper" reveal>
          <h3>Analysis Placement</h3>
          <p>
            Analysts needed to write control descriptions that satisfied compliance requirements. We embedded AI
            evaluation directly into the authoring experience so they could review findings without leaving their
            workflow, while keeping review and decision-making with the analyst.
          </p>
          <div className="mt-10 w-full max-w-[1100px]">
            <figure className="reveal-img mt-4 mb-16 w-full">
              <AnalysisPlacementMockupAnimated />
            </figure>
          </div>

          <h3>Analysis Breakdown</h3>
          <p>
            The AI Analysis panel brought the overall evaluation into one place, including the AI context,
            individual findings, and the information used to support the analysis.
          </p>

          {/* TEMPORARY — local-only HTML replacement candidate for the (now
              removed) Panel Structure image. Not part of the case study;
              safe to delete along with panel-structure-illustration.tsx. */}
          <div className="mx-auto mt-10 mb-16 w-full max-w-[1100px]">
            <figure className="reveal-img w-full">
              <PanelStructureIllustration />
            </figure>
          </div>

          <h3>Explaining individual findings</h3>
          <p>
            Each finding could be opened for a deeper explanation. Rather than showing only the result, the detail
            view exposed the confidence, conclusion, supporting evidence, reasoning, and underlying logic so
            analysts could evaluate the finding before deciding what to do next.
          </p>
          {/* TEMPORARY — local-only HTML replacement candidate for the (now
              removed) Per-Criterion Analysis image. Not part of the case
              study; safe to delete along with
              per-criterion-analysis-illustration.tsx. */}
          <div className="mx-auto mt-10 mb-16 w-full max-w-[1100px]">
            <figure className="reveal-img w-full">
              <PerCriterionAnalysisIllustration />
            </figure>
          </div>

          <h3>AI Confidence Indicator</h3>
          <p>
            Presenting AI confidence as a progress bar and percentage blurred the distinction between confidence and
            analytical results already shown throughout the interface. High, Medium, and Low communicated the same
            information while keeping confidence as supporting context.
          </p>
          <div className="mx-auto mt-10 mb-16 w-full max-w-[1100px]">
            <figure className="reveal-img w-full">
              <ConfidenceDesignComparisonIllustration />
            </figure>
          </div>

          <h3>Status Indicators</h3>
          <p>
            Control descriptions were evaluated against multiple quality criteria. The AI generated a report showing
            whether each criterion was detected within the description.
          </p>

          <h4 className="!mt-[58px]">Indicator Colors</h4>
          <p>
            Multiple color options were evaluated using established UI semantics to reinforce AI evaluation without
            implying success or failure.
          </p>
          <CaseTable className="mt-[46px] mx-0 max-w-[1000px]">
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "60%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <CaseTableHeader>
              <CaseTableHead>Option</CaseTableHead>
              <CaseTableHead>Consideration</CaseTableHead>
              <CaseTableHead>Result</CaseTableHead>
            </CaseTableHeader>
            <CaseTableBody>
              <CaseTableRow>
                <CaseTableCell>Green / Red</CaseTableCell>
                <CaseTableCell>Implied success and failure.</CaseTableCell>
                <CaseTableCell className="text-muted-foreground">Rejected</CaseTableCell>
              </CaseTableRow>
              <CaseTableRow>
                <CaseTableCell>Blue / Orange</CaseTableCell>
                <CaseTableCell>Communicated information and warnings.</CaseTableCell>
                <CaseTableCell className="text-[#047857] font-semibold">✓ Final</CaseTableCell>
              </CaseTableRow>
            </CaseTableBody>
          </CaseTable>

          <h4 className="!mt-[58px]">Indicator Terminology</h4>
          <p>
            Multiple terminology options were evaluated to communicate AI evaluation without implying certainty or
            correctness.
          </p>
          <CaseTable className="mt-[46px] mx-0 max-w-[1000px]">
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "60%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <CaseTableHeader>
              <CaseTableHead>Option</CaseTableHead>
              <CaseTableHead>Consideration</CaseTableHead>
              <CaseTableHead>Result</CaseTableHead>
            </CaseTableHeader>
            <CaseTableBody>
              <CaseTableRow>
                <CaseTableCell>Pass / Fail</CaseTableCell>
                <CaseTableCell>Implied a final judgment.</CaseTableCell>
                <CaseTableCell className="text-muted-foreground">Rejected</CaseTableCell>
              </CaseTableRow>
              <CaseTableRow>
                <CaseTableCell>Present / Missing</CaseTableCell>
                <CaseTableCell>Described the criterion rather than the evaluation.</CaseTableCell>
                <CaseTableCell className="text-muted-foreground">Rejected</CaseTableCell>
              </CaseTableRow>
              <CaseTableRow>
                <CaseTableCell>Found / Not Found</CaseTableCell>
                <CaseTableCell>Resembled search results.</CaseTableCell>
                <CaseTableCell className="text-muted-foreground">Rejected</CaseTableCell>
              </CaseTableRow>
              <CaseTableRow>
                <CaseTableCell>Detected / Not Detected</CaseTableCell>
                <CaseTableCell>Framed the result as an evaluation rather than a definitive system status.</CaseTableCell>
                <CaseTableCell className="text-[#047857] font-semibold">✓ Final</CaseTableCell>
              </CaseTableRow>
            </CaseTableBody>
          </CaseTable>
        </CaseSection>

        <CaseSection id="impact" heading="Impact" tone="surface" reveal>
          <OutcomeBadge className="mt-3.5" reveal>
            Qualitative Outcomes
          </OutcomeBadge>

          <ul>
            <li>Analysts incorporated the reasoning modal into their review workflow before making final decisions.</li>
            <li>
              Stakeholders reported improved clarity and faster review of AI-generated evaluations, with informal
              feedback indicating meaningful efficiency gains.
            </li>
            <li>
              Engineering handoff was completed on schedule, including full specifications for the reasoning modal
              and associated UI components.
            </li>
          </ul>

          <h3>Reflections</h3>
          <ul>
            <li>Formal post-launch measurement was not in place, so long-term impact was not quantified at scale.</li>
            <li>
              Future work would include lightweight instrumentation earlier in the build process to capture usage
              and decision signals prior to launch.
            </li>
            <li>
              The primary constraint was not feature capability, but how AI outputs were structured and interpreted
              within the workflow.
            </li>
          </ul>
        </CaseSection>

        <div className="border-t border-[#E2E8F0] px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <CaseNavFooter prev={prevLink} next={nextLink} reveal />
        </div>
      </main>

      <CaseFooter
        background="#F6F7F9"
        extraLinks={
          fromGaming ? (
            <>
              <a href="https://alexandersun.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5733]">
                Systems &amp; Architecture Work ↗
              </a>
              <a href="https://mrsunsbooks.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5733]">
                Mr. Sun&apos;s Books ↗
              </a>
            </>
          ) : undefined
        }
      />
    </div>
  );
}
