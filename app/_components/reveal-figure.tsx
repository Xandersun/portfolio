import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * portfolio-import — shared image + caption pattern used throughout every
 * case study (annotated screenshots, diagrams, before/afters).
 *
 * The figure uses `display: table` and the figcaption `display:
 * table-caption` (Tailwind's `table` / `table-caption` utilities) rather
 * than plain block layout. This is the standard CSS technique for pinning
 * a caption's width to its image's actual rendered width: a block figure
 * sized with `w-fit` shrinks to fit the WIDEST child's content — often the
 * caption's own unwrapped text width, not the image — so a plain
 * full-width `<figcaption>` inside it can render wider than the image
 * above it. Table layout instead sizes the box from its cell content (the
 * image) and constrains the table-caption to that same computed width, so
 * the caption can never exceed the image's rendered width regardless of
 * how long the caption text is.
 */
export function RevealFigure({
  src,
  alt,
  caption,
  reveal = false,
  imgClassName,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  reveal?: boolean;
  imgClassName?: string;
}) {
  return (
    <figure className={cn("mx-auto mt-15 table max-w-full", reveal && "reveal-img")}>
      <img
        src={src}
        alt={alt}
        className={cn("block h-auto w-auto max-w-full rounded-sm border border-[#E0E0E0] bg-white", imgClassName)}
      />
      <figcaption className="table-caption caption-bottom mt-3 mb-16 text-sm leading-normal text-[#64748B] [&_strong]:font-bold [&_strong]:text-[#334155]">
        {caption}
      </figcaption>
    </figure>
  );
}
