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

import { Alert, AlertDescription } from "@/components/ui/alert";

import { manrope } from "../../_components/fonts";
import { useReveal } from "../../_components/use-reveal";
import "../../_components/reveal.css";
import { PrimaryNav } from "../../_components/primary-nav";
import { CaseToc } from "../../_components/case-toc";
import { CaseHero } from "../../_components/case-hero";
import { CaseSection } from "../../_components/case-section";
import { RevealFigure } from "../../_components/reveal-figure";
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
          { href: "#challenge", label: "Traditional Workflow" },
          { href: "#solution", label: "AI-Assisted Workflow" },
          { href: "#process-design", label: "Key Decisions" },
          { href: "#impact", label: "Impact" },
        ]}
      />

      <main id="main-content">
        <CaseHero
          title="AI-Powered Decision Support"
          intro="Building the first human-in-the-loop AI feature for a risk management platform and defining reusable interaction patterns for future AI systems."
          pills={["Explainable AI", "AI Decision Support", "Enterprise Risk", "Cross-Functional Collaboration"]}
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
        </CaseSection>

        <CaseSection id="challenge" heading="AI-Assisted Workflow" tone="surface" reveal>
          <p>
            Analysts were responsible for writing control descriptions that had to satisfy compliance requirements.
            The new workflow embedded AI evaluation directly into the authoring experience which provided immediate
            feedback allowing them to resolve issues earlier while preserving human decision-making.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/capital-one/workflow.png"
            alt="Compact vertical workflow showing reactive review steps"
            caption={
              <>
                <strong>Human-in-the-Loop Architecture:</strong> Embedded real-time AI evaluation into the authoring
                phase so analysts can resolve data quality issues prior to formal submission.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="process-design" heading="Key Decisions" tone="paper" reveal>
          <h3>Analysis Placement</h3>
          <p>
            The AI evaluation was embedded directly alongside the authoring experience rather than presented as a
            separate workflow or chat interface. Analysts could review AI feedback while editing the control
            description, eliminating the need to switch contexts or navigate away from their work.
          </p>
          <RevealFigure
            reveal
            src="/portfolio-import/images/capital-one/panels.png"
            alt="Split-panel interface with authoring form on left and AI evaluation report on right"
            caption={
              <>
                <strong>Unified Workspace:</strong> Paired authoring directly with real-time AI evaluation so
                analysts could review feedback without leaving their workflow.
              </>
            }
          />

          <h3>Analysis Breakdown</h3>
          <p>
            The AI Analysis panel brought the overall evaluation into one place, including the AI context,
            individual findings, and the information used to support the analysis.
          </p>

          <Alert className="mx-auto mt-10 max-w-[800px] items-center gap-0 rounded-md border-[rgba(255,87,51,0.28)] border-l-[5px] border-l-[#FF5733] bg-[#FFF0EB] px-[18px] py-4">
  <AlertDescription className="text-base leading-[1.5] text-[#9A3412]">
    <strong className="font-bold text-[#9A3412]">Note:</strong> Mockups shown here are simplified
    abstractions created to illustrate layout strategy. They do not reflect final production code.
  </AlertDescription>
</Alert>

          {/* Source has a page-specific ".disclosure-note + figure.reveal-img { margin-top: 22px }" rule
              (vs. RevealFigure's normal 60px). The wrapper's negative margin collapses with the figure's
              own top margin to reproduce that 22px gap without a prop on the shared component.
              max-w-[800px] matches this section's own established content-width convention (the
              disclosure-note box and both comparison tables below already use the same 800px cap) —
              without it, RevealFigure's mx-auto centers the image against the full section width
              instead of this narrower text column, landing it well right of the paragraph/note box
              above instead of sharing their left edge. */}
         <div className="mx-auto mt-[-38px] max-w-[800px]">
  <RevealFigure
    reveal
    src="/portfolio-import/images/capital-one/before-after-detected-placement.png"
    alt="AI Analysis Panel annotated into four distinct sections"
    caption={
      <>
        <strong>Analysis Structure:</strong> Organized AI context, findings, policy references, and user
        feedback into distinct sections so analysts could scan the evaluation in a predictable order.
      </>
    }
  />
</div>

          <p>
            From there, analysts could open any individual finding to understand how the AI reached it.
          </p>

          <h3>Explaining individual findings</h3>
          <p>
            Each finding could be opened for a deeper explanation. Rather than showing only the result, the detail
            view exposed the confidence, conclusion, supporting evidence, reasoning, and underlying logic so
            analysts could evaluate the finding before deciding what to do next.
          </p>
          <RevealFigure
            reveal
            src="/portfolio-import/images/capital-one/reasoning2.png"
            alt="AI Conclusion and Explanation modal annotated with confidence, conclusion, evidence, reasoning, and logic"
            caption={
              <>
                <strong>Explainable AI pattern:</strong> Each finding connected the model’s conclusion back to its
                confidence, evidence, reasoning, and governing logic rather than presenting the AI output as an
                answer to accept.
              </>
            }
          />

          <h3>AI Confidence Indicator</h3>
          <p>
            Presenting AI confidence as a progress bar and percentage blurred the distinction between confidence and
            analytical results already shown throughout the interface. High, Medium, and Low communicated the same
            information while keeping confidence as supporting context.
          </p>
          <RevealFigure
            reveal
            src="/portfolio-import/images/capital-one/pattern-2-certainty-vs-analytics.png"
            alt="Comparison between percentage-based and qualitative confidence indicators"
            caption={
              <>
                <strong>Qualitative Confidence Framing:</strong> Replaced numerical percentage meters with
                qualitative confidence tiers to prevent users from confusing model certainty with empirical data
                metrics.
              </>
            }
          />

          <h3>Status Indicators</h3>
          <p>
            Control descriptions were evaluated against multiple quality criteria. The AI generated a report showing
            whether each criterion was detected within the description.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/capital-one/pattern-1-scoping-disclaimer.png"
            alt="AI Analysis card displaying status terminology and color semantics"
            caption={
              <>
                <strong>Semantics:</strong> Terminology and colors communicate
                <br />
                findings without implying pass/fail judgment.
              </>
            }
          />

          <h4 className="!mt-[58px]">Indicator Colors</h4>
          <p>
            Multiple color options were evaluated using established UI semantics to reinforce AI evaluation without
            implying success or failure.
          </p>
          <CaseTable className="mt-[46px]">
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
                <CaseTableCell />
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
          <CaseTable className="mt-[46px]">
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
                <CaseTableCell />
              </CaseTableRow>
              <CaseTableRow>
                <CaseTableCell>Present / Missing</CaseTableCell>
                <CaseTableCell>Described the criterion rather than the evaluation.</CaseTableCell>
                <CaseTableCell />
              </CaseTableRow>
              <CaseTableRow>
                <CaseTableCell>Found / Not Found</CaseTableCell>
                <CaseTableCell>Resembled search results.</CaseTableCell>
                <CaseTableCell />
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
        background="#F6F4F2"
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
