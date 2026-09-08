"use client";

import { Activity, BarChart3, Calendar, Settings, UsersRound } from "lucide-react";

/**
 * Global navigation — a persistent left rail, not a top bar. This is the
 * layer the case study's "Global Navigation: Moved between major areas
 * of the platform" describes. Only "Client Records" is wired up (it's
 * where the caseload/case-record workflow this reconstruction covers
 * actually lives); the rest are real destinations from the reference
 * reconstruction, present for architectural weight, not clickable —
 * exactly like the inert "Appointments"/"Reports" items already used in
 * the After sidebar, for the same reason: this reconstruction covers one
 * workflow, not the whole platform.
 */
const ITEMS = [
  { key: "client-records", label: "Client Records", icon: UsersRound, active: true },
  { key: "events", label: "Events", icon: Calendar, active: false },
  { key: "reports", label: "Reports", icon: BarChart3, active: false },
  { key: "users", label: "Users", icon: UsersRound, active: false },
  { key: "activity-log", label: "Activity Log", icon: Activity, active: false },
  { key: "system-settings", label: "System Settings", icon: Settings, active: false },
];

export function BeforeLeftNav({ onGoToClientRecords }: { onGoToClientRecords: () => void }) {
  return (
    <nav className="w-[208px] shrink-0 border-r border-[#E4E7EC] bg-white py-3">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const clickable = item.key === "client-records";
        return (
          <button
            key={item.key}
            onClick={clickable ? onGoToClientRecords : undefined}
            className={`flex w-full items-center gap-3 border-l-[3px] px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${
              item.active
                ? "border-l-[#2B3A55] bg-[#F4F5F7] text-[#1F2937]"
                : clickable
                  ? "border-l-transparent text-[#4B5565] hover:bg-[#FAFBFC]"
                  : "cursor-default border-l-transparent text-[#B0B7C3]"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
