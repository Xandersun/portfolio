import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MediaImage } from "@/components/portfolio/media-image";
import { PortfolioSection, SectionIntro } from "@/components/portfolio/section";

/**
 * portfolio-v2's isolated copy of components/sections/Experience.tsx — the
 * original stays untouched (see the isolation constraint on this
 * experiment). The only change: the Monster Government Solutions tile
 * gets a "View case study" link to /portfolio-v2/work/monster inside its
 * existing hover-revealed description, added as an extra affordance
 * rather than by wrapping the whole tile in a link — that would swallow
 * the tile's existing <details>/<summary> disclosure click target and
 * break the hover-reveal interaction the original already has.
 * Everything else (grid, imagery, disclosure behavior, the other three
 * tiles) is byte-identical to the original.
 */

interface ExperienceEntry {
  company: string;
  role: string;
  description: string;
  image: string;
  alt: string;
  caseStudyHref?: string;
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
    caseStudyHref: "/portfolio-v2/work/monster",
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

function ExperienceTile({ company, role, description, image, alt, caseStudyHref }: ExperienceEntry) {
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
      {caseStudyHref && (
        <p className="portfolio-reveal-transition mt-2 block max-h-0 opacity-0 max-md:group-open:max-h-8 max-md:group-open:opacity-100 md:group-hover:max-h-8 md:group-hover:opacity-100 md:group-focus-visible:max-h-8 md:group-focus-visible:opacity-100">
          <Link
            href={caseStudyHref}
            className="portfolio-caption inline-flex items-center gap-1.5 text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            View case study
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </p>
      )}
    </details>
  );
}

export function ExperienceV2() {
  return (
    <PortfolioSection id="experience" className="scroll-mt-[var(--header-height)]">
      <SectionIntro className="mb-12 md:mb-16" eyebrow="Experience" heading="Places I've worked" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-12">
        {EXPERIENCE.map((entry) => (
          <ExperienceTile key={entry.company} {...entry} />
        ))}
      </div>
    </PortfolioSection>
  );
}
