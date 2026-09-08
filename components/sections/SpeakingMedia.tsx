import { MediaImage } from "@/components/portfolio/media-image";
import { PortfolioSection, SectionIntro } from "@/components/portfolio/section";

/**
 * Speaking & Media — unified four-image gallery (v5).
 *
 * Redesigned from four independent editorial compositions into ONE
 * asymmetric grid gallery: a dominant Wharton + Press Tours row on top,
 * a secondary StarCraft II + BlizzCon row below, both aligned to the same
 * 12-column grid with one consistent gap value. Per-cell aspect ratios are
 * chosen so each row's two images share an equal height with no forced
 * wrapper/stretch trick — aspect-[3/2] + aspect-[3/4] (top), aspect-[7/4] +
 * aspect-[5/4] (bottom): for two cells spanning m and n of 12 columns at
 * aspect m/k and n/k respectively, both resolve to the same height (kW/12),
 * so picking a shared k per row guarantees clean edge-to-edge alignment.
 *
 * Each image shows exactly one simple caption by default, in normal flow
 * directly below it — never floating independently. A second, small
 * eyebrow-style line (existing factual detail: role, cities, location)
 * reveals on hover/keyboard-focus as an adjacent caption transition, not an
 * image overlay — kept restrained (opacity/height only, plus one subtle
 * universal image scale; no gradients, no zoom). StarCraft II has no extra
 * line since its default caption already states the only relevant fact.
 * Mobile stays a single-column stack with the same one caption always
 * visible; there's no separate tap-to-reveal step since the extra line is
 * optional/secondary, not essential.
 *
 * Section chrome (wrapper/eyebrow/heading) and the image-box treatment are
 * shared with Experience via components/portfolio/* — see those files for
 * why they were extracted.
 *
 * Source images: public/images/speaking-media/ (temporary copies from the
 * live alexandersun.com).
 *
 * Typography runs entirely through the shared .portfolio-* classes in
 * app/globals.css — no local font sizes/weights/tracking.
 *
 * Isolated on purpose — easy to substantially change or delete.
 */

interface GalleryTileProps {
  className: string;
  aspect: string;
  objectPosition?: string;
  src: string;
  alt: string;
  sizes: string;
  caption: string;
  reveal?: string;
  priority?: boolean;
}

function GalleryTile({
  className,
  aspect,
  objectPosition,
  src,
  alt,
  sizes,
  caption,
  reveal,
  priority,
}: GalleryTileProps) {
  return (
    <div className={`group focus-visible:outline-none ${className}`} tabIndex={reveal ? 0 : undefined}>
      <MediaImage
        src={src}
        alt={alt}
        aspect={aspect}
        objectPosition={objectPosition}
        sizes={sizes}
        priority={priority}
        rounded
      />
      <div className="mt-3">
        <p className="portfolio-caption text-foreground">{caption}</p>
        {reveal && (
          <p className="portfolio-eyebrow portfolio-reveal-transition mt-1 max-h-0 text-muted-foreground opacity-0 group-hover:max-h-6 group-hover:opacity-100 group-focus-visible:max-h-6 group-focus-visible:opacity-100">
            {reveal}
          </p>
        )}
      </div>
    </div>
  );
}

export function SpeakingMedia() {
  return (
    <PortfolioSection>
      <SectionIntro
        className="mb-20 md:mb-28"
        eyebrow="Speaking & Media"
        heading="Speaking, media, and industry recognition"
      />

      {/* Top row — Wharton (dominant, ~2/3) + Press Tours (~1/3, taller crop) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <GalleryTile
          className="md:col-span-8"
          aspect="aspect-[3/2]"
          objectPosition="object-bottom"
          src="/images/speaking-media/wharton.png"
          alt="Empty podium on stage beneath a Wharton School banner"
          sizes="(min-width: 768px) 66vw, 100vw"
          caption="Wharton School"
          reveal="Guest speaker on behavioral design"
          priority
        />
        <GalleryTile
          className="md:col-span-4"
          aspect="aspect-[3/4]"
          src="/images/speaking-media/press-tour-signing.png"
          alt="Signing materials at an international press event"
          sizes="(min-width: 768px) 33vw, 100vw"
          caption="Blizzard International Press Tours"
          reveal="Moscow · Beijing · Seoul · Anaheim"
        />
      </div>

      {/* Bottom row — StarCraft II + BlizzCon, aligned to the same grid, secondary */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-12 md:gap-6">
        <GalleryTile
          className="md:col-span-7"
          aspect="aspect-[7/4]"
          objectPosition="object-top"
          src="/images/speaking-media/starcraft-trophy.png"
          alt="StarCraft II World Championship Series trophy"
          sizes="(min-width: 768px) 58vw, 100vw"
          caption="Award-winning StarCraft II Ranking System"
        />
        <GalleryTile
          className="md:col-span-5"
          aspect="aspect-[5/4]"
          src="/images/speaking-media/blizzcon.png"
          alt="Panel of four speakers on stage at BlizzCon"
          sizes="(min-width: 768px) 42vw, 100vw"
          caption="BlizzCon Panelist"
          reveal="Anaheim"
        />
      </div>
    </PortfolioSection>
  );
}
