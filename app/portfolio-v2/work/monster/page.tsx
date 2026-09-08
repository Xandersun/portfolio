import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AssistantLauncher } from "@/components/portfolio/assistant/assistant-launcher";
import { AssistantPanel } from "@/components/portfolio/assistant/assistant-panel";
import { AssistantProvider } from "@/components/portfolio/assistant/assistant-context";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { MediaImage } from "@/components/portfolio/media-image";
import { PortfolioSection, SectionIntro } from "@/components/portfolio/section";
import { Button } from "@/components/ui/button";
import { LdsEmbed } from "@/components/portfolio-v2/lds-embed";
import DensityPage from "@/app/portfolio-v2/lds/density/page";

/**
 * portfolio-v2 case study for Monster Government Solutions. New page —
 * nothing like it exists in the current portfolio (Monster is currently
 * only a tile in Experience/a stat in Outcomes; per CLAUDE.md, enterprise
 * case studies haven't been built yet).
 *
 * Content constraint: only the facts already established elsewhere in this
 * codebase are used — "Lead UX Designer," "led product design across
 * enterprise government platforms while managing and contributing
 * hands-on to the design team" (Experience.tsx), and "100+ legacy pages
 * modernized" (Outcomes.tsx). No invented Monster screens, workflows,
 * dates, or additional metrics. The narrative-detail gap below is an
 * explicit, marked placeholder rather than filled with plausible-sounding
 * invention.
 *
 * The closing "Extending the system" section is the one place this case
 * study references the Living Design System — framed explicitly as
 * current work that extends the same principles, not as something that
 * shipped at Monster.
 */
export default function MonsterCaseStudyPage() {
  return (
    <AssistantProvider>
      <div className="flex min-h-dvh">
        <main className="min-w-0 flex-1">
          <SiteHeader />

          <PortfolioSection className="pb-0">
            <SectionIntro eyebrow="Case Study" heading="Monster Government Solutions" lead="Lead UX Designer" />
          </PortfolioSection>

          <PortfolioSection className="pt-10 md:pt-12">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
              <div className="group">
                <MediaImage
                  src="/images/experience/monster-government-solutions.jpg"
                  alt="Placeholder — Monster Government Solutions branded office environment"
                  aspect="aspect-[4/3]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized
                />
              </div>
              <div>
                <p className="portfolio-body max-w-md text-foreground/80">
                  Led product design across enterprise government platforms, managing and
                  contributing hands-on to the design team.
                </p>
                <p className="portfolio-display mt-6">100+</p>
                <p className="portfolio-body mt-2 text-foreground/80">Legacy pages modernized</p>
              </div>
            </div>
          </PortfolioSection>

          <PortfolioSection className="border-t border-border pt-10 md:pt-12">
            <p className="portfolio-eyebrow mb-4 text-muted-foreground">A note on this page</p>
            <p className="portfolio-body max-w-xl text-foreground/80">
              The full case-study narrative — process, specific modernization examples, and
              supporting artifacts — isn&apos;t written yet. Rather than fill that gap with
              plausible-sounding detail, this page currently focuses on one honest connection:
              how that modernization work relates to what I&apos;m building today.
            </p>
          </PortfolioSection>

          <PortfolioSection className="border-t border-border pt-10 md:pt-12">
            <SectionIntro
              eyebrow="Extending the system"
              heading="A current, working environment for the same kind of problem"
              lead="Modernizing 100+ legacy pages at Monster meant working on navigation, consistency, and reusable patterns at scale. The Living Design System is not that project — it's current, independent work exploring those same principles with real components, states, and interaction, under realistic enterprise conditions."
              className="mb-10 md:mb-12"
            />

            <div className="overflow-hidden rounded-lg border border-border shadow-sm">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="portfolio-caption ml-2 text-muted-foreground">
                  Live preview — Density Toggle
                </span>
              </div>
              <div className="h-[420px] overflow-auto" style={{ background: "#020617" }}>
                <LdsEmbed>
                  <DensityPage />
                </LdsEmbed>
              </div>
            </div>

            <Button render={<Link href="/portfolio-v2/lds" />} nativeButton={false} className="mt-6">
              Explore the Living Design System
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </PortfolioSection>

          <Footer />
        </main>
        <AssistantPanel />
      </div>
      <AssistantLauncher />
    </AssistantProvider>
  );
}
