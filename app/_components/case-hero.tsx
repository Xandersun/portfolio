import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

/**
 * portfolio-import — shared case-study hero.
 * The two-column "tag / h1 / intro / pills" + bordered meta card pattern
 * repeated at the top of all 4 case studies. Pills use the existing Badge
 * component (fully re-themed via className to match the source's chip
 * look — larger padding, square-ish radius, not Badge's default pill).
 */

export interface CaseMetaItem {
  label: string;
  value: ReactNode;
}

export function CaseHero({
  tag = "Case Study",
  title,
  intro,
  pills,
  meta,
  background = "#F6F7F9",
  pillBackground = "#F8F9FA",
}: {
  tag?: string;
  title: ReactNode;
  intro: ReactNode;
  pills?: string[];
  meta: CaseMetaItem[];
  background?: string;
  pillBackground?: string;
}) {
  return (
    <header
      className="grid w-full grid-cols-1 items-start gap-y-7 px-4 pt-12 pb-13 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] md:gap-x-[68px] md:px-[max(2rem,calc((100vw-1180px)/2))] md:pt-[108px] md:pb-[76px]"
      style={{ background }}
    >
      <div className="text-sm font-bold uppercase tracking-[0.05em] text-[#FF5733] md:col-start-1">
        {tag}
      </div>

      <h1 className="mt-3.5 max-w-[900px] text-balance text-[clamp(34px,10vw,64px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#0F172A] md:col-start-1 md:text-[clamp(42px,5vw,64px)]">
        {title}
      </h1>

      <p className="mt-5 max-w-[760px] text-lg leading-[1.55] text-[#334155] md:col-start-1">{intro}</p>

      {pills && pills.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-2.5 md:col-start-1">
          {pills.map((pill) => (
            <Badge
              key={pill}
              variant="outline"
              className="h-auto rounded-md border-[#E2E8F0] px-3.5 py-2.5 text-sm font-semibold text-[#334155] shadow-none"
              style={{ background: pillBackground }}
            >
              {pill}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8 md:col-start-2 md:row-start-1 md:row-end-5 md:self-center">
        {meta.map((item, i) => (
          <div key={item.label} className={i === 0 ? "" : "border-t border-[#E2E8F0] pt-4"}>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
              {item.label}
            </span>
            <span className="mt-1 block text-base font-medium text-[#334155]">{item.value}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
