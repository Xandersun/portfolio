"use client";

import { Inter } from "next/font/google";
import {
  AlertTriangle,
  ArrowUpDown,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDashed,
  CircleDot,
  Eye,
  FolderKanban,
  GitBranch,
  History,
  Inbox,
  Layers,
  ListFilter,
  Minus,
  Plus,
  Search,
  Settings,
  SignalHigh,
  SignalLow,
  SignalMedium,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * /linear-reference — a clean-room visual reproduction of Linear's own
 * product UI (linear.app/now/how-we-redesigned-the-linear-ui), built fresh
 * for this route: generic workspace/team/issue content, no Monster Works
 * branding or data. Not derived from app/monster-linear/page.tsx or
 * app/prototypes/nav-model/page.tsx — a separate file with its own content
 * model (an Issues list, Linear's most representative screen), though it
 * necessarily arrives at some of the same real Linear structural choices
 * (macOS title-bar chrome, workspace-switcher-top sidebar, a single flat
 * near-black surface tone rather than tiered panels) because those choices
 * belong to Linear's actual interface, not to either prototype.
 *
 * Built on the project's existing shadcn/Base UI primitives — Button,
 * Badge, DropdownMenu, ScrollArea, Separator, Tabs, Tooltip — the same way
 * as /monster-linear, with Tailwind reserved for layout, Linear's specific
 * proportions/spacing/color, and the one hand-built exception: the
 * decorative macOS traffic-light chrome (aria-hidden, no real control to
 * delegate to a primitive).
 *
 * Desktop only. Does not touch /monster-linear, the nav-model prototype,
 * or the portfolio.
 */

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Linear's actual redesign flattened the UI to one base surface tone with
// hairline borders instead of layered panel shadows — sidebar and content
// share BG_BASE, distinguished only by a vertical Separator.
const BG_BASE = "#0a0a0b";
const BG_ELEVATED = "#151517"; // popovers/menus
const BORDER = "#1f1f21";
const TEXT_PRIMARY = "#f7f8f8";
const TEXT_SECONDARY = "#8a8f98";
const TEXT_TERTIARY = "#62666d";
const ACCENT = "#5e6ad2"; // Linear brand purple

const WORKSPACE = "Acme";
const TEAM = { name: "Engineering", key: "ENG" };

const TOP_NAV = [
  { label: "Inbox", icon: Inbox },
  { label: "My Issues", icon: User },
];

const TEAM_NAV = [
  { label: "Issues", icon: Layers },
  { label: "Projects", icon: FolderKanban },
  { label: "Cycles", icon: GitBranch },
  { label: "Views", icon: Eye },
];

const STATUS_ORDER = ["Backlog", "Todo", "In Progress", "Done", "Canceled"] as const;
type Status = (typeof STATUS_ORDER)[number];

const STATUS_META: Record<Status, { icon: LucideIcon; color: string }> = {
  Backlog: { icon: CircleDashed, color: "#8a8f98" },
  Todo: { icon: Circle, color: "#e0e0e2" },
  "In Progress": { icon: CircleDot, color: "#f2c94c" },
  Done: { icon: CheckCircle2, color: "#4cb782" },
  Canceled: { icon: XCircle, color: "#8a8f98" },
};

type Priority = "Urgent" | "High" | "Medium" | "Low" | "None";

const PRIORITY_META: Record<Priority, { icon: LucideIcon; color: string }> = {
  Urgent: { icon: AlertTriangle, color: "#f2994a" },
  High: { icon: SignalHigh, color: "#e0e0e2" },
  Medium: { icon: SignalMedium, color: "#e0e0e2" },
  Low: { icon: SignalLow, color: "#8a8f98" },
  None: { icon: Minus, color: "#62666d" },
};

const LABEL_COLORS: Record<string, string> = {
  Feature: "#5e6ad2",
  Bug: "#f65c5c",
  Perf: "#f2994a",
  Docs: "#4ea1f7",
  Design: "#e364c6",
  A11y: "#4cb782",
  Polish: "#8a8f98",
  Infra: "#f2c94c",
  Spike: "#8a8f98",
};

const ASSIGNEE_COLORS: Record<string, string> = {
  JD: "#5e6ad2",
  AK: "#e364c6",
  MS: "#4ea1f7",
};

interface Issue {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string | null;
  labels: string[];
}

const ISSUES: Issue[] = [
  { id: "ENG-201", title: "Add support for custom emoji reactions", status: "Backlog", priority: "Low", assignee: null, labels: ["Feature"] },
  { id: "ENG-198", title: "Investigate slow query on issue list load", status: "Backlog", priority: "Medium", assignee: null, labels: ["Perf"] },
  { id: "ENG-190", title: "Write migration guide for API v2", status: "Backlog", priority: "None", assignee: null, labels: ["Docs"] },

  { id: "ENG-215", title: "Add keyboard navigation to command menu", status: "Todo", priority: "High", assignee: "JD", labels: ["Feature", "A11y"] },
  { id: "ENG-212", title: "Fix pagination bug on activity feed", status: "Todo", priority: "Urgent", assignee: "AK", labels: ["Bug"] },
  { id: "ENG-207", title: "Update design tokens for dark theme contrast", status: "Todo", priority: "Medium", assignee: "MS", labels: ["Design"] },

  { id: "ENG-224", title: "Refactor sidebar collapse animation", status: "In Progress", priority: "High", assignee: "JD", labels: ["Polish"] },
  { id: "ENG-221", title: "Sync workspace settings across devices", status: "In Progress", priority: "Medium", assignee: "AK", labels: ["Feature"] },
  { id: "ENG-219", title: "Address flaky test in CI pipeline", status: "In Progress", priority: "Urgent", assignee: "MS", labels: ["Infra"] },

  { id: "ENG-188", title: "Improve empty state for search results", status: "Done", priority: "Low", assignee: "JD", labels: ["Design"] },
  { id: "ENG-176", title: "Add rate limiting to public API", status: "Done", priority: "High", assignee: "AK", labels: ["Infra"] },

  { id: "ENG-165", title: "Explore GraphQL subscriptions for live updates", status: "Canceled", priority: "None", assignee: null, labels: ["Spike"] },
  { id: "ENG-159", title: "Redesign onboarding checklist", status: "Canceled", priority: "Low", assignee: "MS", labels: ["Design"] },
];

const VIEWS = ["All Issues", "Active", "Backlog"] as const;
type View = (typeof VIEWS)[number];

const VIEW_STATUSES: Record<View, Status[]> = {
  "All Issues": [...STATUS_ORDER],
  Active: ["Todo", "In Progress"],
  Backlog: ["Backlog"],
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-1 px-2 text-[11px] font-medium text-[#62666d]">{children}</p>;
}

// Shared top-bar / sidebar-footer control — icon Button + Tooltip.
function IconButton({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
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
            className={cn("size-6 text-[#8a8f98] hover:bg-white/[0.06] hover:text-[#f7f8f8]", className)}
          />
        }
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarRow({
  icon: Icon,
  label,
  active,
  onClick,
  indent,
  trailing,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  indent?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-auto w-full justify-start gap-2 rounded-md px-2 py-[5px] text-[13px] font-normal",
        indent && "pl-7",
        active
          ? "bg-white/[0.07] text-[#f7f8f8] hover:bg-white/[0.07] hover:text-[#f7f8f8]"
          : "text-[#8a8f98] hover:bg-white/[0.04] hover:text-[#c7c9cc]",
      )}
    >
      <Icon className="size-[15px] shrink-0" style={{ color: active ? TEXT_PRIMARY : TEXT_TERTIARY }} aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {trailing}
    </Button>
  );
}

function WorkspaceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-auto min-w-0 flex-1 justify-start gap-1.5 px-1 py-1 text-left" />}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-semibold text-white" style={{ background: ACCENT }}>
          A
        </span>
        <span className="truncate text-[13px] font-semibold" style={{ color: TEXT_PRIMARY }}>
          {WORKSPACE}
        </span>
        <ChevronDown className="size-3 shrink-0" style={{ color: TEXT_TERTIARY }} aria-hidden="true" />
      </DropdownMenuTrigger>
      {/* Popover surface stepped one tier up from the flat base — matches
          Linear's own elevated-popup treatment. */}
      <DropdownMenuContent
        align="start"
        style={{ width: 224, background: BG_ELEVATED, borderColor: BORDER }}
        className="rounded-md border bg-clip-padding p-1 shadow-xl ring-0"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[#62666d]">Workspace</DropdownMenuLabel>
          <DropdownMenuItem className="text-[#f7f8f8] focus:bg-white/[0.06] focus:text-[#f7f8f8]">
            <span className="flex size-4 items-center justify-center rounded-[4px] text-[9px] font-semibold text-white" style={{ background: ACCENT }}>
              A
            </span>
            {WORKSPACE}
            <Check className="ml-auto size-3.5" style={{ color: ACCENT }} aria-hidden="true" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#1f1f21]" />
        <DropdownMenuItem className="text-[#c7c9cc] focus:bg-white/[0.06] focus:text-[#f7f8f8]">Invite and manage members</DropdownMenuItem>
        <DropdownMenuItem className="text-[#c7c9cc] focus:bg-white/[0.06] focus:text-[#f7f8f8]">Workspace settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LabelBadge({ label }: { label: string }) {
  const color = LABEL_COLORS[label] ?? "#8a8f98";
  return (
    <Badge
      variant="outline"
      className="h-5 gap-1 rounded-[4px] border-[#232326] bg-transparent px-1.5 text-[11px] font-normal text-[#c7c9cc]"
    >
      <span className="size-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
      {label}
    </Badge>
  );
}

function Avatar({ initials }: { initials: string | null }) {
  if (!initials) {
    return <span className="size-5 shrink-0 rounded-full border border-dashed" style={{ borderColor: "#3a3a3e" }} aria-hidden="true" />;
  }
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-medium text-white"
      style={{ background: ASSIGNEE_COLORS[initials] ?? "#3a3a3e" }}
    >
      {initials}
    </span>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  const StatusIcon = STATUS_META[issue.status].icon;
  const PriorityIcon = PRIORITY_META[issue.priority].icon;
  const isCanceled = issue.status === "Canceled";

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto w-full justify-start gap-3 rounded-none border-b border-[#161617] px-4 py-[7px] text-left hover:bg-white/[0.03]"
    >
      <PriorityIcon className="size-3.5 shrink-0" style={{ color: PRIORITY_META[issue.priority].color }} aria-hidden="true" />
      <span className="w-14 shrink-0 text-[12px] font-medium text-[#62666d]">{issue.id}</span>
      <StatusIcon className="size-3.5 shrink-0" style={{ color: STATUS_META[issue.status].color }} aria-hidden="true" />
      <span
        className={cn("min-w-0 flex-1 truncate text-[13px] text-[#e5e6e8]", isCanceled && "text-[#62666d] line-through decoration-[#3a3a3e]")}
      >
        {issue.title}
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {issue.labels.map((label) => (
          <LabelBadge key={label} label={label} />
        ))}
      </span>
      <Avatar initials={issue.assignee} />
    </Button>
  );
}

function StatusGroup({
  status,
  issues,
  collapsed,
  onToggle,
}: {
  status: Status;
  issues: Issue[];
  collapsed: boolean;
  onToggle: () => void;
}) {
  const StatusIcon = STATUS_META[status].icon;
  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className="h-auto w-full justify-start gap-2 rounded-none px-4 py-2 text-[12px] font-medium text-[#8a8f98] hover:bg-white/[0.03] hover:text-[#8a8f98]"
      >
        <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", collapsed && "-rotate-90")} aria-hidden="true" />
        <StatusIcon className="size-3.5 shrink-0" style={{ color: STATUS_META[status].color }} aria-hidden="true" />
        {status}
        <span className="text-[#62666d]">{issues.length}</span>
      </Button>
      {!collapsed && issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)}
    </div>
  );
}

export default function LinearReferencePage() {
  const [activeView, setActiveView] = useState<View>("All Issues");
  const [teamExpanded, setTeamExpanded] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<Status>>(new Set(["Done", "Canceled"]));

  const toggleGroup = (status: Status) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const visibleStatuses = VIEW_STATUSES[activeView];

  return (
    <TooltipProvider>
      <div className={cn("flex h-dvh overflow-hidden text-[13px]", inter.className)} style={{ background: BG_BASE, color: TEXT_PRIMARY }}>
        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col" style={{ background: BG_BASE }}>
          {/* Decorative title bar — copies Linear's native-app chrome.
              aria-hidden: no interactive semantics to delegate to a
              primitive. */}
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
            <IconButton icon={Search} label="Search ⌘K" />
            <IconButton icon={Plus} label="New issue" />
          </div>

          <ScrollArea className="flex-1">
            <nav aria-label="Global" className="flex flex-col gap-4 px-2 pt-2">
              <div>
                {TOP_NAV.map((item) => (
                  <SidebarRow key={item.label} icon={item.icon} label={item.label} />
                ))}
              </div>

              <div>
                <SectionLabel>Your teams</SectionLabel>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setTeamExpanded((v) => !v)}
                  aria-expanded={teamExpanded}
                  className="h-auto w-full justify-start gap-2 rounded-md px-2 py-[5px] text-[13px] font-normal text-[#c7c9cc] hover:bg-white/[0.04] hover:text-[#c7c9cc]"
                >
                  <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", !teamExpanded && "-rotate-90")} style={{ color: TEXT_TERTIARY }} aria-hidden="true" />
                  <span
                    className="flex size-[15px] shrink-0 items-center justify-center rounded-[4px] text-[9px] font-semibold text-white"
                    style={{ background: "#4ea1f7" }}
                  >
                    E
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left">{TEAM.name}</span>
                </Button>
                {teamExpanded && (
                  <div>
                    {TEAM_NAV.map((item) => (
                      <SidebarRow key={item.label} icon={item.icon} label={item.label} active={item.label === "Issues"} indent />
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </ScrollArea>

          <Separator className="bg-[#1f1f21]" />
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3a3a3e] text-[10px] font-medium text-[#f7f8f8]">YO</span>
            <span className="min-w-0 flex-1 truncate text-[12.5px]" style={{ color: TEXT_SECONDARY }}>
              You
            </span>
            <IconButton icon={Bell} label="Notifications" />
            <IconButton icon={Settings} label="Settings" />
          </div>
        </aside>

        <Separator orientation="vertical" className="bg-[#1f1f21]" />

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: BG_BASE }}>
          {/* Top chrome — breadcrumb + toolbar */}
          <div className="flex h-11 shrink-0 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-1.5 text-[13px]">
              <span
                className="flex size-[15px] shrink-0 items-center justify-center rounded-[4px] text-[9px] font-semibold text-white"
                style={{ background: "#4ea1f7" }}
              >
                E
              </span>
              <span style={{ color: TEXT_SECONDARY }}>{TEAM.name}</span>
              <ChevronRight className="size-3.5" style={{ color: TEXT_TERTIARY }} aria-hidden="true" />
              <span className="font-medium" style={{ color: TEXT_PRIMARY }}>
                Issues
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-[12.5px] text-[#8a8f98] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
              >
                <ListFilter className="size-3.5" aria-hidden="true" />
                Filter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-[12.5px] text-[#8a8f98] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
              >
                <ArrowUpDown className="size-3.5" aria-hidden="true" />
                Display
              </Button>
              <IconButton icon={Search} label="Search" />
              <Separator orientation="vertical" className="mx-1 h-4 bg-[#232326]" />
              <Button
                variant="default"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-[12.5px] font-medium text-white hover:opacity-90"
                style={{ background: ACCENT }}
              >
                <Plus className="size-3.5" aria-hidden="true" />
                New issue
              </Button>
            </div>
          </div>
          <Separator className="bg-[#1f1f21]" />

          {/* View tabs */}
          <div className="px-4">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as View)} className="block gap-0">
              <TabsList variant="line" className="h-auto gap-4 rounded-none bg-transparent p-0">
                {VIEWS.map((view) => (
                  <TabsTrigger
                    key={view}
                    value={view}
                    className="h-auto shrink-0 rounded-none border-none px-0 py-2.5 text-[12.5px] font-medium whitespace-nowrap text-[#8a8f98] after:bg-[var(--linear-accent)] hover:text-[#c7c9cc] data-active:bg-transparent data-active:text-[#f7f8f8] data-active:shadow-none data-active:hover:text-[#f7f8f8]"
                    style={{ ["--linear-accent" as string]: ACCENT }}
                  >
                    {view}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Separator className="bg-[#1f1f21]" />

          <ScrollArea className="min-h-0 flex-1">
            {STATUS_ORDER.filter((status) => visibleStatuses.includes(status)).map((status) => {
              const issues = ISSUES.filter((issue) => issue.status === status);
              if (issues.length === 0) return null;
              return (
                <StatusGroup
                  key={status}
                  status={status}
                  issues={issues}
                  collapsed={collapsedGroups.has(status)}
                  onToggle={() => toggleGroup(status)}
                />
              );
            })}
          </ScrollArea>
        </main>
      </div>
    </TooltipProvider>
  );
}
