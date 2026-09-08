import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared section chrome for the portfolio. Extracted from SpeakingMedia,
 * ChildrensBooks, and Experience, which all defined the exact same wrapper
 * and eyebrow/heading structure independently. Purely structural — visual
 * values (max-width, gutters, type scale) still come entirely from the
 * shared tokens/.portfolio-* classes in app/globals.css.
 */

export function PortfolioSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-6 py-24 md:py-32", className)}>
      {children}
    </section>
  );
}

interface SectionIntroProps {
  eyebrow: string;
  heading: ReactNode;
  lead?: ReactNode;
  className?: string;
}

export function SectionIntro({ eyebrow, heading, lead, className }: SectionIntroProps) {
  return (
    <div className={className}>
      <p className="portfolio-eyebrow mb-4 text-muted-foreground">{eyebrow}</p>
      <h2 className="portfolio-section-title max-w-3xl">{heading}</h2>
      {lead && <p className="portfolio-lead mt-4 max-w-xl text-muted-foreground">{lead}</p>}
    </div>
  );
}
