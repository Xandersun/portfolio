import { PortfolioSection } from "@/components/portfolio/section";

/**
 * My Approach — four principles as one typography-driven editorial list,
 * not cards/icons/an accordion. Renders the eyebrow directly rather than
 * through the shared SectionIntro (same reasoning as Outcomes): there's no
 * section heading specified here, only an eyebrow.
 *
 * Per principle: a large muted number (marker, not the focal point),
 * a large bold heading (the payoff), and a small supporting sentence —
 * reusing .portfolio-display / .portfolio-project-title / .portfolio-body,
 * the same tiers already established elsewhere, rather than introducing
 * new type sizes. divide-y border-border between entries is the same thin
 * "existing neutral color" rule treatment used in Outcomes.
 *
 * Desktop gets a two-column split (number gutter + content) via the
 * existing md: breakpoint; below md it collapses to a single stacked
 * column, which needs no extra work since the number/heading/sentence are
 * already full-width block elements — deliberately minimal mobile effort
 * per the brief ("desktop is the priority").
 *
 * Placed between Outcomes and Experience, matching the same ordering used
 * on the live alexandersun.com reference (Outcomes → Approach →
 * Experience) — see app/page.tsx.
 */

const PRINCIPLES = [
  {
    number: "01",
    heading: "Ask before prescribing.",
    sentence: "Understand the problem before deciding what the solution should be.",
  },
  {
    number: "02",
    heading: "Make complexity understandable.",
    sentence: "Find the structure that makes complicated products feel simpler.",
  },
  {
    number: "03",
    heading: "Build it together.",
    sentence: "Bring product, engineering, and users into the process early.",
  },
  {
    number: "04",
    heading: "Stay until it ships.",
    sentence: "Design doesn't stop when the Figma file is done.",
  },
];

export function Approach() {
  return (
    <PortfolioSection>
      <p className="portfolio-eyebrow mb-8 text-muted-foreground md:mb-12">My Approach</p>

      <div className="divide-y divide-border border-t border-border">
        {PRINCIPLES.map(({ number, heading, sentence }) => (
          <div key={number} className="grid grid-cols-1 gap-x-8 py-10 md:grid-cols-12 md:py-12">
            <p className="portfolio-display text-muted-foreground md:col-span-2">{number}</p>
            <div className="mt-4 md:col-span-10 md:mt-0">
              <h3 className="portfolio-project-title max-w-2xl">{heading}</h3>
              <p className="portfolio-body mt-3 max-w-xl text-muted-foreground">{sentence}</p>
            </div>
          </div>
        ))}
      </div>
    </PortfolioSection>
  );
}
