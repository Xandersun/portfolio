import { PortfolioSection } from "@/components/portfolio/section";

/**
 * Outcomes — four metrics as one dense, rule-framed typographic
 * composition, not stat cards. Renders the eyebrow directly rather than
 * through the shared SectionIntro: that component requires a heading, and
 * this section has none specified — the numbers themselves are the
 * content, not a headline followed by supporting detail.
 *
 * Numbers reuse .portfolio-display — the same "biggest" tier already used
 * for Wharton (Speaking & Media) and the Contact headline — rather than
 * introducing a new size token. The brief's clamp(64px, 8vw, 120px) is a
 * description of intent ("very large, dominant"), and the existing display
 * scale already fills that role; adding a second "huge number" tier next
 * to it would fragment the type scale for no real gain.
 *
 * The border-y frames the four metrics as one bounded block instead of
 * four independent pieces — the only "rule" used, per the brief's
 * allowance for thin rules using existing neutral colors.
 *
 * Placed between the hero and Experience (Hero → Outcomes → Places I've
 * worked) — see app/page.tsx.
 */

const OUTCOMES = [
  {
    metric: "5×",
    outcome: "Estimated analyst review productivity",
    company: "Capital One",
  },
  {
    metric: "100+",
    outcome: "Legacy pages modernized",
    company: "Monster Government Solutions",
  },
  {
    metric: "100M+",
    outcome: "Loyalty accounts merged",
    company: "Marriott International",
  },
  {
    metric: "40%",
    outcome: "Retention increase",
    company: "Activision Blizzard",
  },
];

export function Outcomes() {
  return (
    <PortfolioSection>
      <p className="portfolio-eyebrow mb-8 text-muted-foreground md:mb-12">Outcomes</p>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-y border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
        {OUTCOMES.map(({ metric, outcome, company }) => (
          <div key={company}>
            <p className="portfolio-display">{metric}</p>
            <p className="portfolio-body mt-3 text-foreground/80">{outcome}</p>
            <p className="portfolio-caption mt-1 text-muted-foreground">{company}</p>
          </div>
        ))}
      </div>
    </PortfolioSection>
  );
}
