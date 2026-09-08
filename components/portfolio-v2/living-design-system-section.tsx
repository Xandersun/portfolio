import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PortfolioSection, SectionIntro } from "@/components/portfolio/section";
import { Button } from "@/components/ui/button";
import { LdsEmbed } from "@/components/portfolio-v2/lds-embed";
import DensityPage from "@/app/portfolio-v2/lds/density/page";

/**
 * Living Design System — a substantial, prominently-presented entry point
 * into the isolated /portfolio-v2/lds experience, not a small text link.
 * The preview below is the actual Density Toggle module — imported from
 * app/portfolio-v2/lds/density/page.tsx, portfolio-v2's isolated,
 * case-management-flavored copy of the original /sandbox module — rendered
 * live inside LdsEmbed's isolated antd scope — a real interactive artifact
 * standing in for what would otherwise be a static screenshot, per the
 * "show the actual thing" principle driving this experiment.
 *
 * Kept intentionally subordinate to the portfolio's own coral system: this
 * section uses the same PortfolioSection/SectionIntro chrome as every other
 * section, with the dark navy/teal LDS visual language strictly contained
 * inside the bordered preview frame below, not applied to the surrounding
 * copy.
 */
export function LivingDesignSystemSection() {
  return (
    <PortfolioSection id="living-design-system">
      <SectionIntro
        eyebrow="Living Design System"
        heading="An interactive environment for enterprise UI patterns"
        lead="A working environment for testing states, density, navigation, and behavior under realistic enterprise conditions — not a set of static mockups."
        className="mb-10 md:mb-12"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-center">
        <div>
          <p className="portfolio-body max-w-md text-foreground/80">
            Ten modules covering foundations, navigation and interaction, and dense enterprise
            data — built with real components, real states, and real keyboard behavior, organized
            behind a single persistent navigation shell.
          </p>
          <Button render={<Link href="/portfolio-v2/lds" />} nativeButton={false} className="mt-6">
            Enter the Living Design System
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

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
      </div>
    </PortfolioSection>
  );
}
