"use client";

/**
 * portfolio-import — Marriott case study content.
 * IMPLEMENTATION REFACTOR pass: same content/structure/visual result as
 * before, rebuilt on Tailwind utilities + this route's shared components
 * (PrimaryNav, CaseToc, CaseHero, CaseSection, RevealFigure, CaseNavFooter,
 * CaseFooter) + the shadcn Table primitives, instead of the large
 * page-specific marriott.css file (deleted — see below).
 *
 * The reveal-on-scroll behavior (previously a hand-rolled useEffect ported
 * from assets/js/animations.js) is now the shared useReveal() hook — same
 * IntersectionObserver options, same five querySelectorAll passes, same
 * per-index stagger on .metric/.reveal-h3, same "js" class gate.
 *
 * A handful of one-off spacing/color overrides from the source markup are
 * preserved via inline `style` (not Tailwind) because they need to beat the
 * higher-specificity descendant selectors CaseSection applies to its own
 * children (e.g. `[&_h3]:mt-6`) — this mirrors how the pre-refactor source
 * itself already used inline styles for the same one-off deviations.
 *
 * Known minor deltas vs. the pre-refactor pixel output (flagged per the
 * refactor brief rather than worked around, since fixing them cleanly would
 * mean bypassing the shared components this refactor is supposed to use):
 * - CaseFooter has no border-top; the source footer had a 1px top border.
 * - The two reveal-img figures in the Redesign section that sit back to
 *   back (after-flow.svg + the registered-account screenshot) collapse to
 *   ~64px apart instead of the source's 80px (RevealFigure has no margin
 *   override prop).
 */

import { cn } from "@/lib/utils";

import { manrope } from "../../_components/fonts";
import { useReveal } from "../../_components/use-reveal";
import { PrimaryNav } from "../../_components/primary-nav";
import { CaseToc } from "../../_components/case-toc";
import { CaseHero } from "../../_components/case-hero";
import { CaseSection } from "../../_components/case-section";
import { RevealFigure } from "../../_components/reveal-figure";
import { CaseNavFooter } from "../../_components/case-nav-footer";
import { getCaseStudyNav } from "../../_components/case-study-order";
import { CaseFooter } from "../../_components/case-footer";
import {
  CaseTable,
  CaseTableHeader,
  CaseTableHead,
  CaseTableBody,
  CaseTableRow,
  CaseTableCell,
} from "../../_components/case-table";
import { OutcomeBadge } from "../../_components/outcome-badge";
import "../../_components/reveal.css";

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";

const NAV_LINKS = [
  { label: "Case Studies", href: "/#work" },
  { label: "About", href: "/about" },
];

const TOC_ITEMS = [
  { href: "#overview", label: "Overview" },
  { href: "#opportunity", label: "Opportunity" },
  { href: "#investigation", label: "Investigation" },
  { href: "#validation", label: "Validation" },
  { href: "#redesign", label: "Redesign" },
  { href: "#results", label: "Results" },
  { href: "#takeaways", label: "Takeaways" },
];

const VALIDATION_CRITERIA = [
  { criteria: "Promotion Visibility", description: "Members should only be able to see promotions available to them." },
  { criteria: "Promotion Registration", description: "Members should only be able to register for promotions available to them." },
  { criteria: "Personalization", description: "Members should continue to receive offers based on their account and activity." },
  { criteria: "Security", description: "The updated flow could not introduce security risks." },
  { criteria: "Compliance", description: "The approach needed to meet legal and regulatory considerations." },
  { criteria: "Technical Feasibility", description: "The solution needed to work within existing platform capabilities." },
  { criteria: "Business Investment", description: "The value needed to justify the cost and effort required from the Promotions Team." },
];

const STAKEHOLDERS = [
  {
    name: "Promotions Team",
    body: "Validated promotion visibility, registration, personalization, and business requirements.",
  },
  {
    name: "Engineering",
    body: "Verified the authentication step could be removed within the existing platform architecture.",
  },
  {
    name: "Legal",
    body: "Reviewed the redesigned flow for compliance requirements.",
  },
  {
    name: "DevSecOps",
    body: "Evaluated the authentication-free flow for security risk.",
  },
];

export function MarriottContent() {
  const rootRef = useReveal<HTMLDivElement>();
  const { prev, next } = getCaseStudyNav("/case-studies/marriott");

  return (
    <div className={cn("portfolio-import bg-white selection:bg-[#FF5733] selection:text-white", manrope.className)} ref={rootRef}>
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
          title="Promotion Registration"
          intro="Marriott Bonvoy supported a complex ecosystem of loyalty experiences across rewards, stays, and personalized promotions. This case study focuses on promotion registration, where the existing experience introduced unnecessary friction into a high-value member journey."
          pills={["Product Discovery", "Funding Strategy", "Stakeholder Buy-In", "Enterprise Loyalty"]}
          meta={[
            { label: "Role", value: "Senior UX Designer" },
            { label: "Timeline", value: "Feb 2016 – Jun 2020" },
            { label: "Domain", value: "Hospitality / Enterprise Loyalty Platform" },
          ]}
        />

        <CaseSection id="overview" heading="Overview" tone="paper" reveal className="border-t-0">
          <p>
            Marriott Bonvoy contained a complex ecosystem of member experiences across loyalty, rewards, and stays.
            My focus was on identifying high-value system improvements that justified cross-functional investment.
          </p>
          <p>
            Instead of starting with a predefined project ticket, I evaluated opportunities across the platform to
            determine where UX could have the greatest revenue impact. Promotions emerged as the strongest candidate
            because individual campaigns frequently generated more than $10M in revenue.
          </p>

          <h3>Marriott Bonvoy Promotions</h3>
          <p style={{ color: "#666666" }}>
            A personalized promotions experience designed to help members discover and register for available
            offers.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/account-promotions.png"
            alt="Marriott Bonvoy account page displaying a member's personalized promotional offers"
            caption={
              <>
                <strong>Personalized Promotions:</strong> Account-specific offers reinforced the assumption that
                members needed to authenticate before registering.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="opportunity" heading="Identifying High-Value Opportunities" tone="surface" reveal className="border-t-0">
          <p>
            Marriott Bonvoy contained many potential opportunities, but identifying a good UX improvement
            wasn&apos;t enough. I evaluated each initiative based on business value, implementation effort,
            organizational readiness, and strategic impact to select projects that justified cross-functional
            alignment across Product, Engineering, and Business operations.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/investment-decision-framework.png"
            alt="Initiative Funding Framework: four investment decision lenses used to build the case for investing in the Promotions Registration Redesign. Customer Opportunity (Member Experience), Business Impact (Strategic Value), Investment Requirement (Delivery Effort), and Organizational Readiness (Implementation Alignment), each with supporting criteria. A highlighted banner reads Recommended Investment: Promotions Registration Redesign."
            imgClassName="w-full"
            caption={
              <>
                <strong>Opportunity Prioritization: </strong>Evaluated business opportunity, investment
                requirements, and organizational readiness to build the case for expanded investment.
              </>
            }
          />

          <h3 className="reveal-h3" style={{ marginTop: "76px" }}>
            How Promotions Worked
          </h3>
          <p>
            Promotions were personalized offers tied to each member&apos;s account and activity. That
            personalization shaped how members discovered promotions, how eligibility was determined, and
            ultimately how the registration experience was designed.
          </p>
        </CaseSection>

        <CaseSection id="investigation" heading="Understanding the Experience" tone="paper" reveal className="border-t-0">
          <p>
            I expanded my analysis beyond the web interface to understand how members actually discovered and
            registered for promotions across channels. Telemetry confirmed that approximately 90% of promotion
            traffic originated from personalized emails.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/entry-point-breakdown.png"
            alt="Bar chart of promotion registration entry points: email 90%, account management 5%, Marriott.com landing page 3%, Deals and Offers page 2%."
            caption={
              <>
                <strong>Omnichannel Analysis:</strong> Traced promotion traffic across channels and found that 90%
                of registration journeys originated from personalized emails.
              </>
            }
          />

          <h3 className="reveal-h3" style={{ marginTop: "76px" }}>
            Challenging the Assumption
          </h3>
          <p>
            Because promotions were personalized, authentication had become an accepted part of the registration
            experience. My investigation focused on understanding how eligibility was actually enforced and whether
            authentication played a meaningful role in that process. I worked with the Promotions and Engineering
            teams to trace how eligibility, registration, and the existing flow operated before determining whether
            authentication was truly necessary.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/existing-assumption.png"
            alt="Left: the initial assumption, where a personalized promotion flows into an Assumption label reading personalized promotions require authentication, leading into an Authentication Required callout explaining that every member is required to sign in before registering. Right: the investigation, where UX research branches into Promotions Team logic and Engineering system architecture, converging directly into Verified Registration. A bottom banner, made visually stronger than the two side callouts, reads: assumption invalidated, eligibility was already confirmed at the email stage, authentication added no additional protection."
            caption={
              <>
                <strong>Invalidating System Assumptions:</strong> Investigated the underlying business logic and
                system architecture to confirm that authentication provided no additional eligibility protection.
              </>
            }
          />
        </CaseSection>

        <CaseSection id="validation" heading="Validating the Solution" tone="surface" reveal className="border-t-0">
          <h3 className="reveal-h3">Validation Criteria</h3>
          <p>
            Removing authentication wasn&apos;t simply a UX decision. Before implementation, each validation
            criterion was reviewed by the stakeholder responsible for that area to confirm the redesigned flow
            preserved business requirements, security, compliance, and technical feasibility.
          </p>

          <CaseTable className="mt-6 mb-16">
            <CaseTableHeader>
              <CaseTableHead>Validation Criteria</CaseTableHead>
              <CaseTableHead>Description</CaseTableHead>
            </CaseTableHeader>
            <CaseTableBody>
              {VALIDATION_CRITERIA.map((row) => (
                <CaseTableRow key={row.criteria}>
                  <CaseTableCell>{row.criteria}</CaseTableCell>
                  <CaseTableCell>{row.description}</CaseTableCell>
                </CaseTableRow>
              ))}
            </CaseTableBody>
          </CaseTable>

          <h3 className="reveal-h3">Stakeholder Validation</h3>
          <p>
            Each validation criterion was reviewed by the stakeholder responsible for that area before
            implementation.
          </p>

          <div className="mx-auto mt-8 grid w-full max-w-[800px] grid-cols-1 gap-x-16 gap-y-7 sm:grid-cols-2">
            {STAKEHOLDERS.map((s) => (
              <div key={s.name}>
                <div className="flex items-center gap-3">
                  <span className="translate-y-[10px] text-xl font-bold text-[#FF5733]">✓</span>
                  <h4 className="m-0 text-lg font-bold text-[#0F172A]">{s.name}</h4>
                </div>
                <p className="mt-2.5 ml-8 text-base leading-[1.6] text-[#334155]">{s.body}</p>
              </div>
            ))}
          </div>
        </CaseSection>

        <CaseSection id="redesign" heading="Registration Flow" tone="paper" reveal className="border-t-0">
          <h3 className="reveal-h3" style={{ marginTop: 0 }}>
            Authentication-Gated Registration
          </h3>
          <p>
            Members arriving from personalized promotion emails were routed through the standard website
            registration flow, where they were required to authenticate before registering. For security reasons,
            Marriott only remembered usernames, requiring members to re-enter their password before continuing.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/before-flow.png"
            alt="Authentication-gated registration: personalized promotion email, Marriott.com, authenticate, promotion page, register, confirmation, connected by downward arrows. The authenticate step is tinted amber as the focal point."
            caption={
              <>
                <strong>Streamlined Registration:</strong> Removed the unnecessary authentication step, allowing
                members to register directly from personalized promotion emails.
              </>
            }
          />

          <h3 className="reveal-h3" style={{ marginTop: "76px" }}>
            Authentication-Free Registration
          </h3>
          <p>
            Once my investigation confirmed that authentication wasn&apos;t enforcing eligibility, I redesigned the
            registration flow around the existing business rules rather than the existing interface. Members
            arriving from personalized promotion emails could register directly while continuing to access only the
            offers available to them. The redesigned experience preserved the personalized promotion system without
            requiring an additional authentication step.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/after-flow.svg"
            alt="Simplified registration: personalized promotion email, register, confirmation, connected by downward arrows. All three steps use the same neutral card style."
            caption={
              <>
                <strong>Streamlined One-Click Flow:</strong> Members could register directly from personalized
                promotion emails without an additional authentication step.
              </>
            }
          />

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/account-promotions-registered.png"
            alt="Marriott Bonvoy account page showing a completed promotion registration, with a Registration Complete confirmation and the bonus points the member is now eligible to earn on an upcoming stay"
            caption={
              <>
                <strong>Instant Confirmation:</strong> Provided immediate confirmation after registration, completing
                the journey without an additional sign-in.
              </>
            }
          />
        </CaseSection>

        <CaseSection
          id="results"
          heading="Results"
          tone="surface"
          reveal
          className="border-t-0 bg-[#F6F7F9] md:pt-[88px] md:pb-[96px]"
        >
          <p>
            Members arriving through personalized promotion emails could now register immediately without
            authenticating. The simplified journey reduced page loads from three to one, reduced clicks from four to
            one, and increased promotional registrations by 30%.
          </p>

          <RevealFigure
            reveal
            src="/portfolio-import/images/marriott/before-after-metrics-comparison.svg"
            alt="Before and after comparison: 3 page loads, authentication required, 4 clicks, versus 1 page load, no authentication required, 1 click."
            caption={
              <>
                <strong>Journey Simplification:</strong> Reduced the registration flow from 3 page loads to 1 and 4
                clicks to 1 by eliminating unnecessary authentication.
              </>
            }
          />

          <OutcomeBadge className="mt-3.5 mb-0" reveal>
            Quantitative Outcome
          </OutcomeBadge>
          <div className="mt-8 block">
            <div className="metric w-auto max-w-[560px] rounded-xl border border-[#E2E8F0] bg-white p-[26px_28px] shadow-none">
              <div className="text-[56px] leading-none font-extrabold tracking-[-0.03em] text-[#FF5733]">+30%</div>
              <div className="mt-2.5 text-base leading-[1.45] text-[#334155]">
                Increase in registrations for $10M+ promotion campaigns
              </div>
            </div>
          </div>
        </CaseSection>

        <CaseSection id="takeaways" heading="Key Takeaways" tone="paper" reveal className="border-t-0">
          <p>
            This project reinforced the importance of understanding how experiences span channels, business rules,
            and system behavior before attempting to improve the interface. Looking beyond the website revealed an
            opportunity that would not have been visible from the registration flow alone.
          </p>
          <p>
            More importantly, it demonstrated that some of the highest-impact UX improvements come from validating
            long-standing product assumptions. By partnering with Product, Engineering, Legal, and DevSecOps, I
            confirmed the underlying business rules before redesigning the experience, resulting in a simpler
            workflow without changing how the system actually operated.
          </p>
        </CaseSection>

        <div className="px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <CaseNavFooter reveal prev={prev} next={next} />
        </div>
      </main>

      <CaseFooter background="#F6F7F9" />
    </div>
  );
}
