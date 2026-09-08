import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * portfolio-import — shared case-study footer.
 * Same `© year / Work · Philosophy · Experience · Email [+ extra links]`
 * row used at the bottom of every case study. `extraLinks` exists for
 * Capital One's "?from=gaming" variant, which appends two additional
 * external links — everything else is identical across the four studies.
 */
export function CaseFooter({
  background = "#F8F9FA",
  extraLinks,
}: {
  background?: string;
  extraLinks?: ReactNode;
}) {
  return (
    <footer className="py-[30px]" style={{ background }}>
      <div className="mx-auto flex w-[min(1180px,calc(100%-64px))] flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[15px] text-[#64748B]">© 2026 Alex Sun</p>
        <div className={cn("flex flex-wrap items-center gap-5 text-[15px] text-[#334155]")}>
          <Link href="/portfolio-import#work" className="hover:text-[#FF5733]">
            Work
          </Link>
          <Link href="/portfolio-import#how-i-work" className="hover:text-[#FF5733]">
            Philosophy
          </Link>
          <Link href="/portfolio-import#experience" className="hover:text-[#FF5733]">
            Experience
          </Link>
          <a href="mailto:alexandersun@gmail.com" className="hover:text-[#FF5733]">
            Email
          </a>
          {extraLinks}
        </div>
      </div>
    </footer>
  );
}
