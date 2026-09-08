import Image from "next/image";

import { PortfolioSection, SectionIntro } from "@/components/portfolio/section";

/**
 * Independent Project — children's books ("Mr. Sun's Books"), first
 * exploration.
 *
 * Deliberately more colorful and playful than Speaking & Media — the color
 * comes entirely from the book covers themselves, not an invented palette.
 * One accent color (a warm orange sampled from the cover artwork) is used
 * locally on the CTA only; this is a local experiment, not a new global
 * token.
 *
 * Content sourced verbatim from alexandersun.com (project description,
 * tagline) and mrsunsbooks.com (book titles, cover images, catalog size).
 * Cover images are temporary copies — see public/images/childrens-books/.
 * Displayed via aspect-square + object-cover, not native resolution, so
 * higher-res versions can drop in later without layout changes.
 *
 * Order: intro, then the mrsunsbooks.com homepage hero illustration
 * (public/images/childrens-books/mrsunsbooks-hero.png, sourced full-res
 * from the live site) as the dominant visual and primary CTA to the actual
 * site, then the scattered book covers as secondary supporting content
 * below it. The hero is one large, uncropped, native-aspect-ratio image —
 * no card/frame. Desktop reveals a hover/focus overlay; touch/small
 * viewports keep the CTA visible on the image at all times, so discovery
 * never depends on hover and a single tap always navigates.
 *
 * Typography runs entirely through the shared .portfolio-* classes in
 * app/globals.css — no local font sizes/weights/tracking. Section chrome
 * (wrapper/eyebrow/heading) is shared with SpeakingMedia and Experience via
 * components/portfolio/section.tsx. The hero overlay and book-cover
 * treatment below are intentionally NOT shared with those sections — both
 * are materially different compositions, not the same pattern restyled.
 *
 * Isolated on purpose — easy to substantially revise or remove.
 */

interface BookCover {
  src: string;
  title: string;
  size: string;
  offset: string;
  rotate: string;
  z: string;
}

const COVERS: BookCover[] = [
  {
    src: "/images/childrens-books/the-almost-funny-clownfish.jpg",
    title: "The Almost Funny Clownfish",
    size: "w-56 sm:w-64 md:w-80",
    offset: "",
    rotate: "-rotate-2",
    z: "z-30",
  },
  {
    src: "/images/childrens-books/ivy-the-prodigal-daughter.jpg",
    title: "Ivy, the Prodigal Daughter",
    size: "w-40 sm:w-48 md:w-60",
    offset: "translate-y-6 md:-ml-8",
    rotate: "rotate-3",
    z: "z-20",
  },
  {
    src: "/images/childrens-books/the-extra-ordinary-star.jpg",
    title: "The Extra-Ordinary Star",
    size: "w-40 sm:w-48 md:w-56",
    offset: "-translate-y-4",
    rotate: "-rotate-3",
    z: "z-20",
  },
  {
    src: "/images/childrens-books/six-against-the-slow-and-steady.jpg",
    title: "Six Against the Slow & Steady",
    size: "w-28 sm:w-32 md:w-40",
    offset: "translate-y-3",
    rotate: "rotate-6",
    z: "z-10",
  },
  {
    src: "/images/childrens-books/the-good-samaritans-cat.jpg",
    title: "The Good Samaritan's Cat",
    size: "w-28 sm:w-32 md:w-40",
    offset: "-translate-y-2",
    rotate: "-rotate-6",
    z: "z-10",
  },
];

export function ChildrensBooks() {
  return (
    <PortfolioSection>
      <SectionIntro
        className="mb-16 md:mb-24"
        eyebrow="Independent Project"
        heading="Fables, Parables & Silly Tales with Morals."
        lead="Learn from the mistakes of others — or just laugh at them."
      />

      {/* Hero artwork — the section's dominant visual and primary website
          CTA. Native aspect ratio, no crop, no frame. */}
      <a
        href="https://www.mrsunsbooks.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Mr. Sun's Books at mrsunsbooks.com"
        className="group relative mb-16 block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-foreground/40 md:mb-24"
      >
        <Image
          src="/images/childrens-books/mrsunsbooks-hero.png"
          alt="A boy reads Mr. Sun's Books to his mom at bedtime while their sleepy teddy bear looks on, under a starry window and a Mr. Sun's Books sign."
          width={1888}
          height={1144}
          sizes="100vw"
          className="h-auto w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02] motion-safe:group-focus-visible:scale-[1.02]"
        />

        {/* Touch / small viewports — CTA stays visible on the artwork at all times */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 md:hidden"
        >
          <div>
            <p className="portfolio-lead font-semibold text-white">Visit Mr. Sun&apos;s Books →</p>
            <p className="portfolio-caption mt-1 text-white/80">mrsunsbooks.com</p>
          </div>
        </div>

        {/* Desktop — restrained hover/focus reveal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent p-10 opacity-0 transition-opacity duration-300 motion-reduce:transition-none md:flex md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        >
          <div>
            <p className="portfolio-project-title text-white">Visit Mr. Sun&apos;s Books →</p>
            <p className="portfolio-caption mt-2 text-white/80">mrsunsbooks.com</p>
          </div>
        </div>
      </a>

      {/* Book covers — secondary supporting content below the hero;
          scattered, overlapping, scaled by hand rather than gridded */}
      <div className="flex flex-wrap items-end justify-center gap-5 py-8 md:gap-6 md:py-12">
        {COVERS.map((book) => (
          <a
            key={book.src}
            href="https://www.mrsunsbooks.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative shrink-0 ${book.size} ${book.offset} ${book.z}`}
          >
            <div
              className={`relative aspect-square ${book.rotate} shadow-xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:rotate-0 motion-safe:group-hover:scale-105`}
            >
              <Image
                src={book.src}
                alt={`${book.title} book cover`}
                fill
                sizes="(min-width: 768px) 320px, 224px"
                className="object-cover"
              />
            </div>
          </a>
        ))}
      </div>
    </PortfolioSection>
  );
}
