"use client";

import { Inter } from "next/font/google";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  Inbox,
  Plus,
  Search,
  Settings,
  Settings2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * /monster-linear — a SEPARATE, standalone experiment: Monster Works
 * content rebuilt directly in Linear's dark visual language, copied as
 * closely as practical from linear.app/now/how-we-redesigned-the-linear-ui
 * (reviewed directly): the decorative macOS-style title bar, the
 * workspace-switcher-at-top / account-row-at-bottom sidebar shape, ~26-30px
 * nav row height, a near-black three-tier surface stack instead of shadows
 * for depth, and a *neutral* selected-nav background with the accent
 * reserved for the icon itself. Inter is loaded specifically for this
 * route since Linear's own typeface is part of what's being copied.
 *
 * Built on the project's existing shadcn/Base UI primitives
 * (components/ui/*) wherever one already exists for the job — Button,
 * Badge, Card, DropdownMenu, ScrollArea, Separator, Table, Tabs, Tooltip —
 * with Tailwind used only for layout/composition and Linear-specific
 * proportions, spacing, and color on top of those primitives. Two spots
 * stay hand-built on purpose: the macOS traffic-light/chevron chrome
 * (decorative, aria-hidden, no interactive semantics to delegate to a
 * primitive) and the case-progress connector line (its per-segment fill
 * color and flex-basis behavior conflict with Separator's own
 * data-orientation width rule).
 *
 * Intentionally does NOT touch components/portfolio.tsx (app/page.tsx),
 * app/globals.css, or app/prototypes/nav-model/page.tsx.
 */

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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

// Linear-style near-black surface stack — three tiers instead of shadows.
const BG_APP = "#0d0d0f"; // sidebar
const BG_PANEL = "#111113"; // main content pane
const BG_ELEVATED = "rgba(255,255,255,0.06)"; // hover/selected rows, callouts
const BORDER = "#232326";
const TEXT_PRIMARY = "#eef0f2";
const TEXT_SECONDARY = "#8b8b90";
const TEXT_TERTIARY = "#5c5c62";

const STATUS_DOT: Record<string, string> = {
  Active: "bg-emerald-400",
  Completed: "bg-emerald-400",
  Reviewed: "bg-emerald-400",
  Pending: "bg-amber-400",
  "In review": "bg-amber-400",
};

const STATUS_TEXT: Record<string, string> = {
  Active: "text-emerald-400",
  Completed: "text-emerald-400",
  Reviewed: "text-emerald-400",
  Pending: "text-amber-400",
  "In review": "text-amber-400",
};

function StatusTag({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto gap-1.5 rounded-none border-transparent bg-transparent px-0 py-0 text-[12px] font-medium",
        STATUS_TEXT[status] ?? "text-[#8b8b90]",
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status] ?? "bg-[#5c5c62]")} aria-hidden="true" />
      {status}
    </Badge>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium text-[#5c5c62]">{children}</p>;
}

function PropertyRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[5px] text-[12.5px]">
      <span className="text-[#8b8b90]">{label}</span>
      <span className="font-medium text-[#dcdde0]">{value}</span>
    </div>
  );
}

// Shared top-bar / sidebar-footer control — an icon Button wrapped in a
// Tooltip, reused for search, new, notifications, settings, and the tab
// overflow-cycling arrows.
function TopBarIconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  className,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={cn("size-6 text-[#8b8b90] hover:bg-white/[0.06] hover:text-[#eef0f2]", className)}
          />
        }
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// Shared sidebar nav row — neutral selected background, accent reserved
// for the icon only (Linear's actual selected-state treatment).
function SidebarNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-auto w-full justify-start gap-2.5 rounded-md px-2 py-[6px] text-[13px] font-normal",
        active
          ? "bg-white/[0.06] text-[#eef0f2] font-medium hover:bg-white/[0.06] hover:text-[#eef0f2]"
          : "text-[#8b8b90] hover:bg-white/[0.035] hover:text-[#8b8b90]",
      )}
    >
      <Icon className="size-[15px] shrink-0" style={{ color: active ? "#a78bfa" : TEXT_TERTIARY }} aria-hidden="true" />
      {label}
    </Button>
  );
}

// Workspace switcher — the one genuine popover/menu in this prototype.
function WorkspaceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-auto min-w-0 flex-1 justify-start gap-1.5 px-1 py-1 text-left" />}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-violet-500 text-[10px] font-semibold text-white">
          M
        </span>
        <span className="truncate text-[13px] font-semibold" style={{ color: TEXT_PRIMARY }}>
          Monster Works
        </span>
        <ChevronDown className="size-3 shrink-0" style={{ color: TEXT_TERTIARY }} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{ width: 224 }}
        className="border border-[#232326] bg-[#18181b] p-1 text-[#dcdde0] ring-1 ring-white/10"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[#5c5c62]">Workspace</DropdownMenuLabel>
          <DropdownMenuItem className="text-[#eef0f2] focus:bg-white/[0.06] focus:text-[#eef0f2]">
            <span className="flex size-4 items-center justify-center rounded-[4px] bg-violet-500 text-[9px] font-semibold text-white">
              M
            </span>
            Monster Works
            <Check className="ml-auto size-3.5 text-violet-400" aria-hidden="true" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#232326]" />
        <DropdownMenuItem className="text-[#dcdde0] focus:bg-white/[0.06] focus:text-[#eef0f2]">
          Invite people
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#dcdde0] focus:bg-white/[0.06] focus:text-[#eef0f2]">
          Workspace settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NextAction() {
  return (
    <Card
      className="flex-row items-start gap-2.5 rounded-none border-0 border-l-2 border-violet-500 bg-transparent py-2 pl-3 ring-0"
      style={{ background: BG_ELEVATED }}
    >
      <ArrowRight className="mt-[3px] size-3.5 shrink-0 text-violet-400" aria-hidden="true" />
      <div>
        <p className="text-[13px] font-medium text-[#eef0f2]">Schedule follow-up call</p>
        <p className="text-[11.5px] text-[#8b8b90]">Due Jul 22 · M. Alvarez</p>
      </div>
    </Card>
  );
}

function CaseProgress() {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <SectionLabel>Case progress — CR-4521</SectionLabel>
        <span className="text-[11px] text-[#5c5c62]">Updated 2h ago</span>
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
                    isDone && "bg-[#eef0f2] text-[#0d0d0f]",
                    isCurrent && "bg-violet-500 text-white",
                    !isDone && !isCurrent && "border border-[#3a3a3e] text-[#5c5c62]",
                  )}
                >
                  {isDone ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                </div>
                <span className={cn("text-[11px] whitespace-nowrap", isCurrent ? "font-medium text-[#eef0f2]" : "text-[#5c5c62]")}>
                  {stage}
                </span>
              </div>
              {/* Custom, not Separator: fill color is per-segment and the
                  flex-1 basis would conflict with Separator's own
                  data-orientation:w-full rule. */}
              {i < CASE_STAGES.length - 1 && (
                <div className="mx-2 mb-4 h-px flex-1" style={{ background: isDone ? "#eef0f2" : BORDER }} />
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
          <TableRow className="border-[#232326] hover:bg-transparent">
            <TableHead className="h-7 pl-0 text-[11px] font-normal text-[#5c5c62]">Name</TableHead>
            <TableHead className="h-7 text-[11px] font-normal text-[#5c5c62]">Type</TableHead>
            <TableHead className="h-7 text-[11px] font-normal text-[#5c5c62]">Status</TableHead>
            <TableHead className="h-7 pr-0 text-right text-[11px] font-normal text-[#5c5c62]">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DOCUMENTS.map((doc) => (
            <TableRow key={doc.name} className="border-[#1c1c1f] hover:bg-white/[0.03]">
              <TableCell className="py-[7px] pl-0 text-[12.5px] font-medium text-[#dcdde0]">{doc.name}</TableCell>
              <TableCell className="py-[7px] text-[12.5px] text-[#8b8b90]">{doc.type}</TableCell>
              <TableCell className="py-[7px]">
                <StatusTag status={doc.status} />
              </TableCell>
              <TableCell className="py-[7px] pr-0 text-right text-[12.5px] text-[#8b8b90]">{doc.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Reusable connected-dot row — the "row/list item" pattern for the
// activity feed (Documents already reuses the library Table for its rows).
function ActivityItem({ label, time, isLast }: { label: string; time: string; isLast: boolean }) {
  return (
    <li className="relative flex items-start gap-2.5 pb-3 pl-0.5 last:pb-0">
      {!isLast && <span className="absolute top-2 left-[3px] h-full w-px" style={{ background: BORDER }} aria-hidden="true" />}
      <span className="relative z-10 mt-1.5 size-[6px] shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
        <p className="text-[12.5px] text-[#c2c3c6]">{label}</p>
        <p className="shrink-0 text-[11px] text-[#5c5c62]">{time}</p>
      </div>
    </li>
  );
}

function ActivityTimeline() {
  return (
    <div>
      <SectionLabel>Recent activity</SectionLabel>
      <ul>
        {ACTIVITY.map((item, i) => (
          <ActivityItem key={item.label} label={item.label} time={item.time} isLast={i === ACTIVITY.length - 1} />
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
      <Inbox className="size-5 text-[#3a3a3e]" aria-hidden="true" />
      <p className="text-[12.5px] font-medium text-[#5c5c62]">No {tab.toLowerCase()} content in this prototype</p>
    </div>
  );
}

export default function MonsterLinearPrototype() {
  const [selectedNavItem, setSelectedNavItem] = useState(SIDEBAR_ITEMS[0].label);
  const [view, setView] = useState<"profile" | "dashboard">("dashboard");
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
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
      <div className={cn("flex h-dvh overflow-hidden text-[13px]", inter.className)} style={{ background: BG_PANEL, color: TEXT_PRIMARY }}>
        {/* 1. Global navigation */}
        <aside className="flex w-56 shrink-0 flex-col" style={{ background: BG_APP }}>
          {/* Decorative title bar — copied Linear's native-app chrome look.
              Not delegated to Button: purely aria-hidden chrome, not a
              real control. */}
          <div className="flex h-9 shrink-0 items-center gap-2 px-3" aria-hidden="true">
            <div className="flex gap-[6px]">
              <span className="size-[10px] rounded-full bg-[#ff5f57]" />
              <span className="size-[10px] rounded-full bg-[#febc2e]" />
              <span className="size-[10px] rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-1 flex items-center gap-0.5" style={{ color: TEXT_TERTIARY }}>
              <ChevronLeft className="size-3.5" />
              <ChevronRight className="size-3.5" />
            </div>
            <History className="ml-auto size-3.5" style={{ color: TEXT_TERTIARY }} />
          </div>

          <div className="flex items-center gap-0.5 px-2 py-2">
            <WorkspaceSwitcher />
            <TopBarIconButton icon={Search} label="Search ⌘K" />
            <TopBarIconButton icon={Plus} label="New record" />
          </div>

          <ScrollArea className="flex-1">
            <nav aria-label="Global" className="px-2 pt-2">
              <SectionLabel>Workspace</SectionLabel>
              {SIDEBAR_ITEMS.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={selectedNavItem === item.label}
                  onClick={() => setSelectedNavItem(item.label)}
                />
              ))}
            </nav>
          </ScrollArea>

          <Separator className="bg-[#232326]" />
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3a3a3e] text-[10px] font-medium text-[#eef0f2]">
              MA
            </span>
            <span className="min-w-0 flex-1 truncate text-[12.5px]" style={{ color: TEXT_SECONDARY }}>
              M. Alvarez
            </span>
            <TopBarIconButton icon={Bell} label="Notifications" className="text-[#5c5c62]" />
            <TopBarIconButton icon={Settings} label="Settings" className="text-[#5c5c62]" />
          </div>
        </aside>

        <Separator orientation="vertical" className="bg-[#232326]" />

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: BG_PANEL }}>
          {/* Record header — client identity + 2. profile/dashboard toggle */}
          <div className="flex h-9 shrink-0 items-center justify-between gap-6 px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[11px] font-semibold text-white">
                AB
              </span>
              <h1 className="text-[13px] font-semibold" style={{ color: TEXT_PRIMARY }}>
                Alan Becker
              </h1>
              <StatusTag status="Active" />
              <span style={{ color: TEXT_TERTIARY }}>·</span>
              <span className="text-[12.5px]" style={{ color: TEXT_SECONDARY }}>
                abecker@lowellcareer.com
              </span>
            </div>

            <div role="group" aria-label="View" className="inline-flex shrink-0 rounded-md p-0.5" style={{ background: "rgba(255,255,255,0.045)" }}>
              {(["profile", "dashboard"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setView(option)}
                  aria-pressed={view === option}
                  className={cn(
                    "h-auto rounded px-2.5 py-1 text-[12.5px] font-medium capitalize",
                    view === option
                      ? "bg-white/[0.12] text-[#eef0f2] hover:bg-white/[0.12] hover:text-[#eef0f2]"
                      : "text-[#8b8b90] hover:bg-transparent hover:text-[#8b8b90]",
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <Separator className="bg-[#232326]" />

          <ScrollArea className="min-h-0 flex-1">
            <div className="mx-auto flex w-full max-w-[1200px] gap-8 px-6 py-5">
              {/* Properties rail — always-visible record fields */}
              <aside className="w-52 shrink-0">
                <div className="mb-5">
                  <SectionLabel>Client</SectionLabel>
                  <PropertyRow label="Program" value="Career Reentry Services" />
                  <PropertyRow label="Caseworker" value="M. Alvarez" />
                  <PropertyRow label="Client ID" value="#00482" />
                </div>
                <div>
                  <SectionLabel>Current case</SectionLabel>
                  <PropertyRow label="Case" value="CR-4521" />
                  <PropertyRow label="Type" value="Career Fair Follow-up" />
                </div>
              </aside>

              {/* Right pane — one Tabs.Root drives both the tab bar and its
                  panels, with the properties rail sitting alongside it as
                  a sibling. */}
              <div className="min-w-0 flex-1">
                <Tabs value={activeTab} onValueChange={(value) => selectTab(value as string)} className="block gap-0">
                  {/* 3. Customer-level navigation — constrained width, cycling arrows, no wrap */}
                  <div className="flex items-center gap-0.5">
                    <TopBarIconButton
                      icon={ChevronLeft}
                      label="Scroll tabs left"
                      disabled={!canScrollPrev}
                      onClick={() => scrollTabs(-1)}
                      className="shrink-0"
                    />

                    <div
                      ref={tabScrollRef}
                      className="flex flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      <TabsList variant="line" className="h-auto w-max gap-4 rounded-none bg-transparent p-0">
                        {TABS.map((tab) => (
                          <TabsTrigger
                            key={tab}
                            value={tab}
                            ref={(el: HTMLElement | null) => {
                              tabRefs.current[tab] = el;
                            }}
                            className="h-auto shrink-0 rounded-none border-none px-0 py-2 text-[12.5px] font-medium whitespace-nowrap text-[#8b8b90] after:bg-violet-500 hover:text-[#c2c3c6] data-active:bg-transparent data-active:text-[#eef0f2] data-active:shadow-none data-active:hover:text-[#eef0f2]"
                          >
                            {tab}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <TopBarIconButton
                      icon={ChevronRight}
                      label="Scroll tabs right"
                      disabled={!canScrollNext}
                      onClick={() => scrollTabs(1)}
                      className="shrink-0"
                    />
                  </div>
                  <Separator className="mb-5 bg-[#232326]" />

                  {TABS.map((tab) => (
                    <TabsContent key={tab} value={tab}>
                      {tab === "Overview" ? (
                        view === "dashboard" ? (
                          <DashboardOverview />
                        ) : (
                          <ProfileOverview />
                        )
                      ) : (
                        <EmptyTabState tab={tab} />
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </TooltipProvider>
  );
}
