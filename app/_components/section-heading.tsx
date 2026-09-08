import type { ReactNode } from "react";

/**
 * portfolio-import — landing page's repeated "eyebrow + heading + lede"
 * two-column section intro (Case Studies, Approach, Experience, Independent
 * Project all use this same shape).
 */
export function SectionHeading({
  eyebrow,
  heading,
  lede,
  className,
}: {
  eyebrow: ReactNode;
  heading: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-[60px] grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr] md:gap-10 ${className ?? ""}`}>
      <p className="relative text-sm font-bold tracking-[0.08em] text-[#FF5733] uppercase md:top-1.5">{eyebrow}</p>
      <div>
        <h2 className="text-[clamp(36px,4vw,44px)] leading-[1.08] font-bold tracking-[-0.045em] text-[#0F172A]">
          {heading}
        </h2>
        {lede && <p className="mt-4.5 max-w-[52ch] text-xl leading-[1.55] tracking-[-0.02em] text-[#334155]">{lede}</p>}
      </div>
    </div>
  );
}
