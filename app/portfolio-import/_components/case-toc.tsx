/**
 * portfolio-import — shared case-study table of contents.
 * Sticky in-page section nav below the primary nav. Kept as plain
 * overflow-x-auto + Tailwind rather than the ScrollArea component: the
 * source explicitly hides the scrollbar entirely, and ScrollArea always
 * renders a visible (if minimal) thumb — using it here would add a visual
 * element the design never had, so semantic HTML + Tailwind is the more
 * faithful choice per this refactor's own "don't force a component" rule.
 */

interface TocItem {
  href: string;
  label: string;
}

export function CaseToc({ items }: { items: TocItem[] }) {
  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-[68px] z-[39] h-11 overflow-hidden border-b border-[#E2E8F0] bg-white"
    >
      <div className="flex h-11 items-center gap-6 overflow-x-auto overflow-y-hidden px-4 whitespace-nowrap sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex h-full shrink-0 items-center text-[13px] leading-none font-semibold text-[#64748B] hover:text-[#FF5733]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
