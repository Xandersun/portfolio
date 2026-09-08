"use client";

import type { ReactNode } from "react";
import { Bell, HelpCircle, Search, Settings, UserCircle } from "lucide-react";

import { BeforeLeftNav } from "./before-left-nav";

/**
 * The legacy application frame: an application header (branding + search
 * + utility actions — deliberately NOT the primary navigation) above a
 * persistent left-hand global navigation rail, with the customer-level
 * workspace to its right. This is the full accumulated structure the
 * historical critique describes — Global Navigation, Profile/Dashboard
 * competition, and customer-level horizontal navigation are all visible
 * and present at once, which is the point: none of these mechanisms is
 * unreasonable on its own, but together they compete for responsibility.
 * Deliberately plain/light and NOT built from the Living Design System —
 * the whole point of Before is that it predates that system.
 */
export function BeforeShell({
  breadcrumb,
  onGoToClientRecords,
  children,
}: {
  breadcrumb: ReactNode;
  onGoToClientRecords: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-[#D8DEE8] bg-white shadow-none">
      <div className="flex items-center justify-between border-b border-[#D8DEE8] bg-[#2B3A55] px-4 py-2.5">
        <span className="text-[13px] font-bold tracking-wide text-white/95">CASE MANAGEMENT SYSTEM</span>
        <div className="flex max-w-[280px] flex-1 items-center gap-2 rounded-sm bg-white/10 px-3 py-1.5 mx-6">
          <Search className="size-3.5 shrink-0 text-white/50" />
          <span className="text-xs text-white/50">Search participants, cases…</span>
        </div>
        <div className="flex items-center gap-3.5 text-white/70">
          <Bell className="size-4" />
          <HelpCircle className="size-4" />
          <Settings className="size-4" />
          <UserCircle className="size-[18px]" />
        </div>
      </div>

      <div className="flex">
        <BeforeLeftNav onGoToClientRecords={onGoToClientRecords} />
        <div className="min-w-0 flex-1">
          <div className="border-b border-[#D8DEE8] bg-[#FAFBFC] px-5 py-1.5 text-xs text-[#6B7686]">{breadcrumb}</div>
          <div className="bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}
