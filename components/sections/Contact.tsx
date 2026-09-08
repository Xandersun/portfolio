import { PortfolioSection } from "@/components/portfolio/section";

/**
 * Contact — the portfolio's closing composition, the last major content
 * section before the minimal Footer.
 *
 * The headline deliberately uses .portfolio-display (the system's largest
 * tier, otherwise only used for Wharton in Speaking & Media) rather than
 * the shared SectionIntro component, whose heading is fixed at the smaller
 * .portfolio-section-title — that would undersize the one moment on the
 * page meant to dominate most. The wrapper is still the shared
 * PortfolioSection, and every type size still comes from the existing
 * .portfolio-* classes/tokens.
 *
 * Inverted (bg-foreground/text-background) using only the existing color
 * tokens — no new palette — as a full-stop visual endpoint before Footer.
 *
 * The three actions are plain anchors styled with .portfolio-project-title
 * plus the same arrow/hover treatment already established by
 * ChildrensBooks' CTA, rather than the shadcn Button: Button's variants
 * are sized for compact UI controls, not display-scale editorial links,
 * and reusing an existing large-link pattern is more consistent than
 * introducing a second one.
 *
 * Email, LinkedIn, and résumé destinations are sourced verbatim from the
 * live alexandersun.com "Get in touch" section — never invented. No
 * location line: alexandersun.com doesn't state one, and the brief is
 * explicit not to add one that isn't already there.
 */

const ACTIONS: { label: string; href: string; external?: boolean }[] = [
  { label: "Email me", href: "mailto:alexandersun@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alexandersun/", external: true },
  {
    label: "Download résumé",
    href: "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true",
    external: true,
  },
];

export function Contact() {
  return (
    <div id="contact" className="scroll-mt-[var(--header-height)] bg-foreground text-background">
      <PortfolioSection>
        <p className="portfolio-eyebrow mb-6 text-muted-foreground">Contact</p>
        <h2 className="portfolio-display max-w-4xl">Let&apos;s make something useful.</h2>

        <div className="mt-16 flex flex-col items-start gap-4 md:mt-20">
          {ACTIONS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group portfolio-project-title inline-flex flex-wrap items-baseline gap-x-3 text-background transition-colors hover:text-background/70"
            >
              {label}
              <span
                aria-hidden="true"
                className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-1.5"
              >
                →
              </span>
            </a>
          ))}
        </div>
      </PortfolioSection>
    </div>
  );
}
