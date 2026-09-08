"use client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  Plus,
  Search,
  Settings,
  Settings2,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Standalone prototype of a 3-level enterprise navigation model. Visual
 * pass toward the quality bar and specific patterns shown in Linear's own
 * "How we redesigned the Linear UI" writeup (linear.app/now/how-we-
 * redesigned-the-linear-ui) — reviewed directly for this pass, not
 * guessed at: the sidebar's workspace-switcher-at-top / account-at-bottom
 * structure, tight ~28-30px row density, small icons, and — critically —
 * a *subtle neutral* selected-state background rather than a colored one,
 * with the accent color reserved for the icon/indicator itself. Same
 * approach for the light/dark surface layering: sidebar and main pane use
 * two adjacent neutral tones (bg-neutral-50 vs white) rather than a single
 * flat background, which is what actually reads as "depth" in Linear's
 * screenshots — no shadows or blur needed for it.
 *
 * This is a visual reference only. Monster Works keeps its own IA/content
 * (client workspace, case management) — nothing here turns it into an
 * issue tracker.
 *
 * KPI cards and the bar/donut chart from the previous pass were removed:
 * the brief explicitly asked for information-driven structure instead of
 * charts added to fill space. "Case progress" is now a real per-case stage
 * tracker, not an aggregate rate; a "next action" callout was added since
 * it was requested and didn't exist yet.
 *
 * Isolated on purpose — own route outside both the portfolio (app/page.tsx)
 * and the (defense-app) dashboard's AppShell. Plain Tailwind + shadcn
 * Button/Table/Tooltip — no new dependency. Monster purple (violet-600)
 * stays a narrow accent: logo mark, an item's icon when selected, active
 * tab underline, the "next action" callout, the current case-progress
 * step, and avatars.
 */

const SIDEBAR_ITEMS = [
  { label: "Client Records", icon: FileText },
  { label: "Events", icon: Calendar },
  { label: "Reports", icon: BarChart3 },
  { label: "Users", icon: Users },
  { label: "Activity Log", icon: Activity },
  { label: "System Settings", icon: Settings2 },
];

const TABS = [
  "Overview",
  "Contact Info",
  "Case Documents",
  "Appointment History",
  "Case Notes",
  "Billing Details",
  "Event Log",
  "Referrals",
];

const CASE_STAGES = ["Intake", "Assessment", "In Progress", "Resolution"];
const CURRENT_STAGE = 2;

const DOCUMENTS = [
  { name: "Updated Resume.pdf", type: "Document", status: "Reviewed", date: "Jul 15" },
  { name: "Intake Assessment", type: "Form", status: "Completed", date: "Jul 10" },
  { name: "Follow-up call", type: "Task", status: "Pending", date: "Jul 22" },
  { name: "Career Fair Registration", type: "Document", status: "Completed", date: "Jul 08" },
  { name: "Skills Assessment Report", type: "Document", status: "In review", date: "Jun 30" },
];

const ACTIVITY = [
  { label: "Case CR-4521 moved to In Progress", time: "2h ago" },
  { label: "Resume.pdf uploaded", time: "5h ago" },
  { label: "Mock interview confirmed for Jul 22", time: "1d ago" },
  { label: "Referred to Workforce Training Partners", time: "2d ago" },
  { label: "Case CR-4521 opened", time: "5d ago" },
];

const STATUS_DOT: Record<string, string> = {
  Active: "bg-emerald-500",
  Completed: "bg-emerald-500",
  Reviewed: "bg-emerald-500",
  Pending: "bg-amber-500",
  "In review": "bg-amber-500",
};

const STATUS_TEXT: Record<string, string> = {
  Active: "text-emerald-700",
  Completed: "text-emerald-700",
  Reviewed: "text-emerald-700",
  Pending: "text-amber-700",
  "In review": "text-amber-700",
};

function StatusTag({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", STATUS_TEXT[status] ?? "text-neutral-600")}>
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status] ?? "bg-neutral-400")} aria-hidden="true" />
      {status}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium text-neutral-400">{children}</p>;
}

function PropertyRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[5px] text-[12.5px]">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}

function NextAction() {
  return (
    <div className="flex items-start gap-2.5 border-l-2 border-violet-600 bg-violet-50/50 py-2 pl-3">
      <ArrowRight className="mt-[3px] size-3.5 shrink-0 text-violet-600" aria-hidden="true" />
      <div>
        <p className="text-[13px] font-medium text-neutral-900">Schedule follow-up call</p>
        <p className="text-[11.5px] text-neutral-500">Due Jul 22 · M. Alvarez</p>
      </div>
    </div>
  );
}

function CaseProgress() {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <SectionLabel>Case progress — CR-4521</SectionLabel>
        <span className="text-[11px] text-neutral-400">Updated 2h ago</span>
      </div>
      <div className="flex items-start">
        {CASE_STAGES.map((stage, i) => {
          const isDone = i < CURRENT_STAGE;
          const isCurrent = i === CURRENT_STAGE;
          return (
            <div key={stage} className={cn("flex items-center", i < CASE_STAGES.length - 1 && "flex-1")}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
                    isDone && "bg-neutral-900 text-white",
                    isCurrent && "bg-violet-600 text-white",
                    !isDone && !isCurrent && "border border-neutral-300 text-neutral-400",
                  )}
                >
                  {isDone ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[11px] whitespace-nowrap",
                    isCurrent ? "font-medium text-neutral-900" : "text-neutral-400",
                  )}
                >
                  {stage}
                </span>
              </div>
              {i < CASE_STAGES.length - 1 && (
                <div className={cn("mx-2 mb-4 h-px flex-1", isDone ? "bg-neutral-900" : "bg-neutral-200")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocumentsTable() {
  return (
    <div>
      <SectionLabel>Documents &amp; tasks</SectionLabel>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-7 pl-0 text-[11px] font-normal text-neutral-400">Name</TableHead>
            <TableHead className="h-7 text-[11px] font-normal text-neutral-400">Type</TableHead>
            <TableHead className="h-7 text-[11px] font-normal text-neutral-400">Status</TableHead>
            <TableHead className="h-7 pr-0 text-right text-[11px] font-normal text-neutral-400">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DOCUMENTS.map((doc) => (
            <TableRow key={doc.name} className="border-neutral-100">
              <TableCell className="py-[7px] pl-0 text-[12.5px] font-medium text-neutral-800">{doc.name}</TableCell>
              <TableCell className="py-[7px] text-[12.5px] text-neutral-500">{doc.type}</TableCell>
              <TableCell className="py-[7px]">
                <StatusTag status={doc.status} />
              </TableCell>
              <TableCell className="py-[7px] pr-0 text-right text-[12.5px] text-neutral-500">{doc.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ActivityTimeline() {
  return (
    <div>
      <SectionLabel>Recent activity</SectionLabel>
      <ul>
        {ACTIVITY.map((item, i) => (
          <li key={item.label} className="relative flex items-start gap-2.5 pb-3 pl-0.5 last:pb-0">
            {i !== ACTIVITY.length - 1 && (
              <span className="absolute top-2 left-[3px] h-full w-px bg-neutral-200" aria-hidden="true" />
            )}
            <span className="relative z-10 mt-1.5 size-[6px] shrink-0 rounded-full bg-violet-600" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
              <p className="text-[12.5px] text-neutral-700">{item.label}</p>
              <p className="shrink-0 text-[11px] text-neutral-400">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="grid gap-5">
      <NextAction />
      <CaseProgress />
      <DocumentsTable />
      <ActivityTimeline />
    </div>
  );
}

function ProfileOverview() {
  return (
    <div className="grid gap-5">
      <DocumentsTable />
      <ActivityTimeline />
    </div>
  );
}

function EmptyTabState({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <Inbox className="size-5 text-neutral-300" aria-hidden="true" />
      <p className="text-[12.5px] font-medium text-neutral-500">No {tab.toLowerCase()} content in this prototype</p>
    </div>
  );
}

export default function NavModelPrototype() {
  const [selectedNavItem, setSelectedNavItem] = useState(SIDEBAR_ITEMS[0].label);
  const [view, setView] = useState<"profile" | "dashboard">("dashboard");
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = () => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = tabScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollTabs = (direction: -1 | 1) => {
    tabScrollRef.current?.scrollBy({ left: direction * 200, behavior: "smooth" });
  };

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  };

  return (
    <TooltipProvider>
      <div className="flex h-dvh overflow-hidden bg-white text-neutral-900">
        {/* 1. Global navigation — workspace switcher top, account bottom, Linear-style */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between px-3 py-2.5">
            <button type="button" className="flex min-w-0 items-center gap-1.5 text-left">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-violet-600 text-[10px] font-semibold text-white">
                M
              </span>
              <span className="truncate text-[13px] font-semibold text-neutral-900">Monster Works</span>
              <ChevronDown className="size-3 shrink-0 text-neutral-400" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Search" className="size-6 text-neutral-500" />}>
                  <Search className="size-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>Search ⌘K</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="New" className="size-6 text-neutral-500" />}>
                  <Plus className="size-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>New record</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <nav aria-label="Global" className="flex-1 overflow-y-auto px-2 pt-1">
            <SectionLabel>Workspace</SectionLabel>
            {SIDEBAR_ITEMS.map((item) => {
              const isSelected = selectedNavItem === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedNavItem(item.label)}
                  aria-current={isSelected ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2 py-[6px] text-left text-[13px] transition-colors",
                    isSelected ? "bg-neutral-200/70 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  <item.icon className={cn("size-[15px] shrink-0", isSelected ? "text-violet-600" : "text-neutral-400")} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-white">
              MA
            </span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-neutral-700">M. Alvarez</span>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Notifications" className="size-6 text-neutral-400" />}>
                <Bell className="size-3.5" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Settings" className="size-6 text-neutral-400" />}>
                <Settings className="size-3.5" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Record header — client identity + 2. profile/dashboard toggle */}
          <div className="flex shrink-0 items-center justify-between gap-6 border-b border-neutral-200 px-6 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
                AB
              </span>
              <h1 className="text-[13px] font-semibold text-neutral-900">Alan Becker</h1>
              <StatusTag status="Active" />
              <span className="text-neutral-300">·</span>
              <span className="text-[12.5px] text-neutral-500">abecker@lowellcareer.com</span>
            </div>

            <div role="group" aria-label="View" className="inline-flex shrink-0 rounded-md bg-neutral-100 p-0.5">
              {(["profile", "dashboard"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  aria-pressed={view === option}
                  className={cn(
                    "rounded px-2.5 py-1 text-[12.5px] font-medium capitalize transition-all",
                    view === option ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[1200px] gap-8 px-6 py-5">
              {/* Properties rail — always-visible record fields */}
              <aside className="w-52 shrink-0">
                <div className="mb-5">
                  <SectionLabel>Client</SectionLabel>
                  <PropertyRow label="Program" value="Career Reentry" />
                  <PropertyRow label="Caseworker" value="M. Alvarez" />
                  <PropertyRow label="Contact" value="Email" />
                  <PropertyRow label="Client ID" value="#00482" />
                </div>
                <div>
                  <SectionLabel>Next appointment</SectionLabel>
                  <div className="flex items-start gap-2 text-[12.5px]">
                    <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-neutral-800">Mock Interview</p>
                      <p className="text-neutral-500">Jul 22, 10:30 AM</p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right pane */}
              <div className="min-w-0 flex-1">
                {/* 3. Customer-level navigation — constrained width, cycling arrows, no wrap */}
                <div className="mb-5 flex items-center gap-0.5 border-b border-neutral-200">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Scroll tabs left"
                    disabled={!canScrollPrev}
                    onClick={() => scrollTabs(-1)}
                    className="size-6 shrink-0 text-neutral-400"
                  >
                    <ChevronLeft className="size-3.5" aria-hidden="true" />
                  </Button>

                  <div
                    ref={tabScrollRef}
                    className="flex flex-1 gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          ref={(el) => {
                            tabRefs.current[tab] = el;
                          }}
                          onClick={() => selectTab(tab)}
                          aria-current={isActive ? "true" : undefined}
                          className={cn(
                            "shrink-0 border-b-2 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors",
                            isActive
                              ? "border-violet-600 text-neutral-900"
                              : "border-transparent text-neutral-500 hover:text-neutral-800",
                          )}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Scroll tabs right"
                    disabled={!canScrollNext}
                    onClick={() => scrollTabs(1)}
                    className="size-6 shrink-0 text-neutral-400"
                  >
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>

                {activeTab === "Overview" ? (
                  view === "dashboard" ? (
                    <DashboardOverview />
                  ) : (
                    <ProfileOverview />
                  )
                ) : (
                  <EmptyTabState tab={activeTab} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
