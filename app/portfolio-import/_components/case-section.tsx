import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * portfolio-import — shared case-study content section.
 * The repeated "full-bleed band, alternating background, accent bar + h2"
 * pattern used for every content section in every case study. Callers pass
 * `tone` explicitly (rather than this component inferring odd/even from
 * position) so alternation stays correct even if a page conditionally
 * omits a section.
 */
export function CaseSection({
  id,
  heading,
  tone = "paper",
  reveal = false,
  className,
  children,
}: {
  id: string;
  heading: ReactNode;
  tone?: "paper" | "surface";
  reveal?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "w-full scroll-mt-[112px] border-t border-[#E2E8F0] px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px] md:pb-[72px]",
        tone === "surface" ? "bg-[#F8F9FA]" : "bg-white",
        reveal && "reveal",
        className,
      )}
    >
      <h2 className="mb-0 max-w-[840px] text-balance text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#0F172A] before:mb-[18px] before:block before:h-[5px] before:w-12 before:rounded-full before:bg-[#FF5733] before:content-['']">
        {heading}
      </h2>
      <div className="mt-3 [&_h3+p]:mt-1.5 [&_h3]:mt-6 [&_h3]:max-w-[760px] [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-[-0.01em] [&_h3]:text-[#0F172A] [&_h4+p]:mt-1.5 [&_h4]:mt-4.5 [&_h4]:max-w-[700px] [&_h4]:text-lg [&_h4]:font-bold [&_h4]:tracking-[-0.01em] [&_h4]:text-[#0F172A] [&_li::marker]:text-[#FF5733] [&_li]:mb-3.5 [&_li]:text-[#334155] [&_p]:mt-3 [&_p]:max-w-[760px] [&_p]:text-lg [&_p]:leading-[1.65] [&_p]:text-[#334155] [&_ul]:mt-3 [&_ul]:max-w-[700px] [&_ul]:list-disc [&_ul]:pl-[18px] [&_ul]:text-[17px] [&_ul]:leading-[1.6] [&_ul]:text-[#334155]">
        {children}
      </div>
    </section>
  );
}
