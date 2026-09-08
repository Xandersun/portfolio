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
  title: "Monster Government Solutions — Modernizing a Mature Enterprise Platform | Alex Sun",
  description:
    "How I approached recurring interaction problems in a mature government platform — navigation, data, forms, and system history — without rewriting the product from scratch.",
  icons: { icon: "/portfolio-import/favicon.png" },
  robots: { index: false, follow: false },
};

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";

const NAV_LINKS = [
  { label: "Case Studies", href: "/portfolio-import#work" },
  { label: "About", href: "/portfolio-import/about" },
];

const TOC_ITEMS = [
  { href: "#challenges", label: "The Problem" },
  { href: "#living-system-navigation", label: "Navigation & Hierarchy" },
  { href: "#living-system-data", label: "Data & Tables" },
  { href: "#living-system-forms", label: "Forms & Workflows" },
  { href: "#living-system-history", label: "History & Change Tracking" },
  { href: "#living-system-design-system", label: "Design System" },
  { href: "#living-system-components", label: "Components" },
  { href: "#outcomes", label: "Outcomes" },
];

export default function MonsterModernizationCaseStudyPage() {
  const { prev, next } = getCaseStudyNav("/portfolio-import/case-studies/monster-modernization");

  return (
    <div className={cn("portfolio-import bg-white selection:bg-[#FF5733] selection:text-white", manrope.className)}>
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[1100] -translate-y-[150%] bg-[#0F172A] px-3.5 py-2.5 font-bold text-white no-underline focus:translate-y-0"
      >
        Skip to main content
      </a>

      <PrimaryNav brandHref="/portfolio-import#top" links={NAV_LINKS} resume={{ href: RESUME_URL }} />
      <CaseToc items={TOC_ITEMS} />

      <main id="main-content">
        <CaseHero
          tag="Monster Government Solutions"
          title="Modernizing a mature enterprise platform."
          intro="Monster Government Solutions supported complex casework across Customer, Employer, Staff, and Event profiles. I worked on modernizing a mature enterprise product that had grown and changed over many years."
          meta={[
            { label: "Role", value: "UX Manager" },
            { label: "Domain", value: "Public Sector / GovTech" },
          ]}
        />

        <CaseSection id="challenges" heading="Years of growth had made the product harder to change." tone="paper" className="border-t-0">
          <p>
            Over time, the Customer experience had
            accumulated different structures, different interaction patterns, information-dense workflows, and legacy
            dependencies. Improving one part of the product often meant working around decisions made somewhere else.
          </p>

          <ul>
            <li>
              <strong className="text-[#0F172A]">Inconsistent Patterns:</strong> Different parts of the product had been
              built independently, each solving similar problems in its own way.
            </li>
            <li>
              <strong className="text-[#0F172A]">Information Density:</strong> Complex casework required navigating and
              interpreting large amounts of information without losing context.
            </li>
            <li>
              <strong className="text-[#0F172A]">Legacy Dependencies:</strong> Long-standing workflows and integrations
              made changes risky to introduce.
            </li>
          </ul>
        </CaseSection>

        <LivingSystemSection />

        <CaseSection
          id="outcomes"
          heading="Each improvement made the next one easier."
          tone="surface"
          className="bg-[#F6F4F2] md:pt-[88px] md:pb-[96px]"
        >
          <p>
            As useful patterns became reusable, the team didn&rsquo;t have to solve the same interaction problems from
            scratch on every screen. New work could build on decisions that had already been designed, reviewed,
            tested, and refined. Because this was a mature product, that consistency was introduced incrementally:
            piloted in lower-risk areas, validated with experienced users, and governed through design review as
            later work continued.
          </p>
        </CaseSection>

        <div className="px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <CaseNavFooter prev={prev} next={next} />
        </div>
      </main>

      <CaseFooter background="#F6F4F2" />
    </div>
  );
}
