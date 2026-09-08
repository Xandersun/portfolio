"use client";

/**
 * Minimal utility footer — small, metadata-like, deliberately not another
 * content section (much smaller type than Contact, no eyebrow/display
 * classes). "Back to top" scrolls the window directly rather than using a
 * hash-anchor link, so it needs no id added anywhere else on the page.
 */
export function Footer() {
  const handleBackToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="portfolio-caption text-foreground">Alex Sun</p>
          <p className="portfolio-caption text-muted-foreground">Product Design Lead</p>
        </div>
        <p className="portfolio-caption text-muted-foreground">© 2026</p>
        <button
          type="button"
          onClick={handleBackToTop}
          className="portfolio-caption self-start text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
