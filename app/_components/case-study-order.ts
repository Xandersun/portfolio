/**
 * portfolio-import — single source of truth for case-study sequence.
 *
 * Mirrors the landing page's own CASES order (see ../landing-content.tsx)
 * so the two never drift apart. Each case-study page's Previous/Next footer
 * nav is derived from this list via getCaseStudyNav rather than
 * hard-coding its neighbors' href/title independently.
 */
interface CaseStudyOrderEntry {
  href: string;
  title: string;
}

export const CASE_STUDY_ORDER: CaseStudyOrderEntry[] = [
  {
    href: "/case-studies/monster-modernization",
    title: "Monster Government Solutions — Modernizing a Mature Enterprise Platform",
  },
  {
    href: "/case-studies/capital-one",
    title: "Capital One — AI-Powered Decision Support",
  },
  {
    href: "/case-studies/monster-talent",
    title: "Monster Government Solutions — Talent Intelligence Platform",
  },
  {
    href: "/case-studies/marriott",
    title: "Marriott Bonvoy — Promotion Registration",
  },
];

interface CaseStudyNavLink {
  href: string;
  eyebrow: string;
  title: string;
}

/**
 * Looks up `currentHref`'s neighbors in CASE_STUDY_ORDER. Returns
 * `undefined` for prev/next at either end of the sequence — callers should
 * render nothing there rather than inventing a destination.
 */
export function getCaseStudyNav(currentHref: string): {
  prev?: CaseStudyNavLink;
  next?: CaseStudyNavLink;
} {
  const index = CASE_STUDY_ORDER.findIndex((entry) => entry.href === currentHref);
  if (index === -1) return {};

  const prevEntry = CASE_STUDY_ORDER[index - 1];
  const nextEntry = CASE_STUDY_ORDER[index + 1];

  return {
    prev: prevEntry ? { href: prevEntry.href, eyebrow: "← Previous", title: prevEntry.title } : undefined,
    next: nextEntry ? { href: nextEntry.href, eyebrow: "Next →", title: nextEntry.title } : undefined,
  };
}
