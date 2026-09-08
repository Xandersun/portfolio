import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Shared "aspect-ratio box + next/image" treatment used by SpeakingMedia's
 * gallery tiles and Experience's employer tiles: hover/focus-visible scale
 * on the image, a focus-visible ring on the box, object-cover crop. Extracted
 * because both usages were byte-identical except for `rounded` (SpeakingMedia
 * uses rounded-sm, Experience doesn't) — preserved as a prop rather than
 * silently unified, since that's a real, pre-existing difference between the
 * two sections, not something this refactor should decide.
 *
 * Expects a `group` ancestor (the caller's focusable/hoverable wrapper) for
 * the hover/focus-visible variants to key off.
 */

interface MediaImageProps {
  src: string;
  alt: string;
  aspect: string;
  sizes: string;
  objectPosition?: string;
  priority?: boolean;
  unoptimized?: boolean;
  rounded?: boolean;
}

export function MediaImage({
  src,
  alt,
  aspect,
  sizes,
  objectPosition,
  priority,
  unoptimized,
  rounded,
}: MediaImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden group-focus-visible:ring-2 group-focus-visible:ring-offset-4 group-focus-visible:ring-foreground/40",
        aspect,
        rounded && "rounded-sm",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes}
        className={cn(
          "object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02] motion-safe:group-focus-visible:scale-[1.02]",
          objectPosition,
        )}
      />
    </div>
  );
}
