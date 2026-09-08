import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * portfolio-import — shared prev/next case-study footer nav.
 */
interface CaseNavLink {
  href: string;
  eyebrow: ReactNode;
  title: ReactNode;
}

export function CaseNavFooter({
  prev,
  next,
  reveal = false,
}: {
  prev?: CaseNavLink;
  next?: CaseNavLink;
  reveal?: boolean;
}) {
  return (
    <nav className={cn("grid grid-cols-1 gap-5 py-12 sm:grid-cols-2", reveal && "reveal")}>
      {prev && (
        <Link href={prev.href} className="block">
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[#FF5733] uppercase">{prev.eyebrow}</div>
          <div className="mt-1 text-base leading-[1.35] font-semibold text-[#334155] transition-colors hover:text-[#64748B]">
            {prev.title}
          </div>
        </Link>
      )}
      {next && (
        <Link href={next.href} className={cn("block text-left sm:text-right", !prev && "sm:col-start-2")}>
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[#FF5733] uppercase">{next.eyebrow}</div>
          <div className="mt-1 text-base leading-[1.35] font-semibold text-[#334155] transition-colors hover:text-[#64748B]">
            {next.title}
          </div>
        </Link>
      )}
    </nav>
  );
}
