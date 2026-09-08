import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * portfolio-import — shared coral category/eyebrow badge (e.g. "Qualitative
 * Outcomes", "Quantitative Outcome"). Built on the existing shadcn Badge
 * component rather than a hand-built div — previously each case study
 * re-declared the identical classes independently. Text is #9A3412 (a
 * coral-family tone) rather than the portfolio's navy/slate body color, so
 * the text reads as visually connected to the pale coral background
 * instead of looking like an unrelated dark label dropped on top of it.
 * Font size, weight, letter spacing, padding, border, and radius are
 * unchanged from the original — only the text color moved.
 */
export function OutcomeBadge({
  className,
  reveal = false,
  children,
}: {
  className?: string;
  reveal?: boolean;
  children: ReactNode;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded border-[#E2E8F0] bg-[rgba(255,87,51,0.08)] px-2.5 py-1.5 text-xs font-bold tracking-[0.04em] text-[#9A3412] uppercase shadow-none",
        reveal && "reveal-badge",
        className,
      )}
    >
      {children}
    </Badge>
  );
}
