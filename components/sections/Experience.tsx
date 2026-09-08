import { MediaImage } from "@/components/portfolio/media-image";
import { PortfolioSection, SectionIntro } from "@/components/portfolio/section";

/**
 * Experience — four major employers, shown as large imagery rather than a
 * résumé timeline. Deliberately separate from Case Studies / Selected Work:
 * no links out, no project metrics, no dates, no case-study connection.
 *
 * Default state is image + company name only. Role and description reveal
 * on interaction — the same "show first, explain on demand" language used
 * in the Speaking & Media gallery: a base hidden state plus an adjacent
 * caption transition (opacity/max-height), no image overlay, no gradients.
 *
 * Cross-breakpoint behavior differs on purpose, since hover isn't available
 * on touch:
 *  - Desktop (md+): role and description are both hidden by default and
 *    reveal together on hover/keyboard-focus.
 *  - Touch/mobile (below md): role stays visible at all times (no
 *    interaction required to discover it). Description stays hidden by
 *    default and opens with a single tap — implemented via a native
 *    <details>/<summary> disclosure (zero JS, keyboard- and
 *    screen-reader-accessible), not a tap-to-reveal-then-tap-to-navigate
 *    pattern, since these tiles don't navigate anywhere.
 *
 * Section chrome (wrapper/eyebrow/heading) and the image-box treatment are
 * shared with SpeakingMedia via components/portfolio/* — see those files
 * for why they were extracted.
 *
 * IMAGE ASSETS: public/images/experience/*.svg are labeled temporary
 * placeholders, not real photography — see the "which image assets" note
 * in the implementation report for what to supply.
 *
 * Typography runs entirely through the shared .portfolio-* classes in
 * app/globals.css — no local font sizes/weights/tracking.
 *
 * Isolated on purpose — easy to substantially revise later.
 */

interface ExperienceEntry {
  company: string;
  role: string;
  description: string;
  image: string;
  alt: string;
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "Capital One",
    role: "Principal UX Designer",
    description:
      "Translated low NPS scores and direct user feedback into actionable product improvements, partnering with Product, Engineering, and Methodology.",
    image: "/images/experience/capital-one.jpg",
    alt: "Placeholder — Capital One headquarters / campus in McLean, Virginia",
  },
  {
    company: "Monster Government Solutions",
    role: "Lead UX Designer",
    description:
      "Led product design across enterprise government platforms while managing and contributing hands-on to the design team.",
    image: "/images/experience/monster-government-solutions.jpg",
    alt: "Placeholder — Monster Government Solutions branded office environment",
  },
  {
    company: "Marriott International",
    role: "Senior UX Designer",
    description:
      "Shaped digital loyalty experiences across Marriott Bonvoy, Marriott's global rewards program.",
    image: "/images/experience/marriott-international.jpg",
    alt: "Placeholder — Marriott International global headquarters in Bethesda",
  },
  {
    company: "Activision Blizzard",
    role: "Senior UX Designer",
    description:
      "Applied behavioral design across Blizzard's online platform, shaping large-scale systems and experiences for millions of players worldwide.",
    image: "/images/experience/activision-blizzard.jpg",
    alt: "Placeholder — Blizzard Entertainment's Orc statue at the Irvine campus",
  },
];

function ExperienceTile({ company, role, description, image, alt }: ExperienceEntry) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none marker:hidden focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        <MediaImage
          src={image}
          alt={alt}
          aspect="aspect-[4/3]"
          sizes="(min-width: 768px) 50vw, 100vw"
          unoptimized
        />
        <div className="mt-3">
          <p className="portfolio-caption text-foreground">{company}</p>
          <p className="portfolio-eyebrow portfolio-reveal-transition mt-1 max-h-6 text-muted-foreground opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-6 md:group-hover:opacity-100 md:group-focus-visible:max-h-6 md:group-focus-visible:opacity-100">
            {role}
          </p>
        </div>
      </summary>
      <p className="portfolio-body portfolio-reveal-transition mt-2 block max-h-0 max-w-prose text-foreground/80 opacity-0 max-md:group-open:max-h-40 max-md:group-open:opacity-100 md:group-hover:max-h-40 md:group-hover:opacity-100 md:group-focus-visible:max-h-40 md:group-focus-visible:opacity-100">
        {description}
      </p>
    </details>
  );
}

export function Experience() {
  return (
    <PortfolioSection id="experience" className="scroll-mt-[var(--header-height)]">
      <SectionIntro className="mb-12 md:mb-16" eyebrow="Experience" heading="Places I've worked" />

      {/* Four employers — one consistent grid, no hierarchy between them */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-12">
        {EXPERIENCE.map((entry) => (
          <ExperienceTile key={entry.company} {...entry} />
        ))}
      </div>
    </PortfolioSection>
  );
}
