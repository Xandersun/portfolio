import Link from "next/link";
import type { ReactNode } from "react";

// Kept as a standalone default (rather than merged into the JSX className
// via cn()) so a caller-supplied `innerClassName` fully REPLACES this
// instead of fighting it: cn()/tailwind-merge only dedupes classes with the
// exact same responsive-prefix bucket, so an override like `px-8` (no
// breakpoint) would leave this default's `sm:px-8`/`md:px-[calc(...)]`
// still winning at wider viewports — bit-for-bit replacement avoids that.
const DEFAULT_GUTTER = "px-4 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]";

/**
 * portfolio-import — shared primary nav bar.
 * Same sticky nav markup/behavior used on the landing page, about page, and
 * all 4 case studies (previously copy-pasted with only the link list
 * differing). Built with Tailwind + the coral/navy palette from the source
 * (#FF5733 / #0F172A / #64748B / #E2E8F0), not a new visual design.
 *
 * The inner wrapper's horizontal gutter defaults to the exact same
 * full-width + max(2rem, calc((100vw-1180px)/2)) padding pattern used by
 * CaseToc/CaseHero/CaseSection, so "Alex Sun" lines up with the sticky-nav
 * items and the content grid below it on every case-study page (and the
 * landing page, which uses the same 1180px column). The previous
 * `mx-auto max-w-[1180px] px-8` shape nested an extra 32px of padding
 * inside an already-centered box, landing "Alex Sun" ~32px right of the
 * content on wide viewports. About uses a different (1080px) content
 * width, so it passes `innerClassName` to keep its own unchanged gutter
 * rather than adopting the case-study one.
 */

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export function PrimaryNav({
  brandHref = "/",
  links,
  resume,
  innerClassName,
}: {
  brandHref?: string;
  links: NavLink[];
  /** The résumé link is always last and always external — kept separate so callers can swap its href (Capital One's gaming-mode variant) without touching the rest of the list. */
  resume: { href: string; label?: ReactNode };
  /** Override the inner wrapper's width/padding classes (see About's usage) — defaults to the shared case-study/landing 1180px gutter. */
  innerClassName?: string;
}) {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-40 h-[68px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-[10px]"
    >
      <div className={`flex h-full items-center justify-between ${innerClassName ?? DEFAULT_GUTTER}`}>
        <Link href={brandHref} className="text-xl font-bold tracking-[-0.03em] text-[#0F172A]">
          Alex Sun
        </Link>

        <ul className="hidden items-center gap-[30px] md:flex">
          {links.map((link) =>
            link.external ? (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-[#334155] hover:text-[#FF5733]"
                >
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.label}>
                <Link href={link.href} className="text-base font-medium text-[#334155] hover:text-[#FF5733]">
                  {link.label}
                </Link>
              </li>
            ),
          )}
          <li>
            <a
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-[#334155] hover:text-[#FF5733]"
            >
              {resume.label ?? "Resume"}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
