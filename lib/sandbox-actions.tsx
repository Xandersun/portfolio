"use client";

import type { ReactNode } from "react";
import type { useRouter } from "next/navigation";
import {
  AuditOutlined,
  BgColorsOutlined,
  ColumnHeightOutlined,
  DashboardOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  FlagOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  SplitCellsOutlined,
  TableOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

/**
 * Shared action registry — the single source of truth for both the command
 * palette (app/sandbox/command-palette) and the shortcuts cheat sheet
 * (app/sandbox/keyboard-shortcuts), so the two pages can't drift apart.
 */

export type ToastKind = "success" | "info" | "warning" | "error";

export interface ActionRunContext {
  router: ReturnType<typeof useRouter>;
  notify: (kind: ToastKind, title: string, description?: string) => void;
}

export interface CommandAction {
  id: string;
  category: "Navigation" | "Actions" | "Settings";
  label: string;
  description?: string;
  icon: ReactNode;
  /** Display-only shortcut hint shown next to the row (not necessarily globally bound). */
  shortcut?: string;
  run: (ctx: ActionRunContext) => void;
}

export const ACTIONS: CommandAction[] = [
  {
    id: "nav-dashboard",
    category: "Navigation",
    label: "Program & Budget Dashboard",
    description: "Main analytics dashboard",
    icon: <DashboardOutlined />,
    run: ({ router }) => router.push("/"),
  },
  {
    id: "nav-sandbox",
    category: "Navigation",
    label: "Sandbox Hub",
    description: "Index of all sandbox pages",
    icon: <HomeOutlined />,
    run: ({ router }) => router.push("/sandbox"),
  },
  {
    id: "nav-design-system",
    category: "Navigation",
    label: "Design System",
    icon: <BgColorsOutlined />,
    run: ({ router }) => router.push("/sandbox/design-system"),
  },
  {
    id: "nav-views",
    category: "Navigation",
    label: "Saved Views",
    icon: <TableOutlined />,
    run: ({ router }) => router.push("/sandbox/views"),
  },
  {
    id: "nav-density",
    category: "Navigation",
    label: "Density Toggle",
    icon: <ColumnHeightOutlined />,
    run: ({ router }) => router.push("/sandbox/density"),
  },
  {
    id: "nav-split-screen",
    category: "Navigation",
    label: "Split-Screen Inspector",
    icon: <SplitCellsOutlined />,
    run: ({ router }) => router.push("/sandbox/split-screen"),
  },
  {
    id: "nav-states",
    category: "Navigation",
    label: "Component States",
    icon: <ExperimentOutlined />,
    run: ({ router }) => router.push("/sandbox/states"),
  },
  {
    id: "nav-audit",
    category: "Navigation",
    label: "Audit Trail",
    icon: <AuditOutlined />,
    run: ({ router }) => router.push("/sandbox/audit-trail"),
  },
  {
    id: "nav-telemetry",
    category: "Navigation",
    label: "Live Telemetry",
    icon: <ThunderboltOutlined />,
    run: ({ router }) => router.push("/sandbox/telemetry"),
  },
  {
    id: "nav-variants",
    category: "Navigation",
    label: "Component Variants",
    icon: <BgColorsOutlined />,
    run: ({ router }) => router.push("/sandbox/variants"),
  },
  {
    id: "action-new-intake",
    category: "Actions",
    label: "New Program Intake",
    description: "Start a new acquisition intake form",
    icon: <PlusCircleOutlined />,
    shortcut: "Alt N",
    run: ({ notify }) => notify("success", "New program intake started", "A draft record was opened."),
  },
  {
    id: "action-export",
    category: "Actions",
    label: "Export Portfolio Snapshot",
    description: "Export the current portfolio as a PDF report",
    icon: <DownloadOutlined />,
    run: ({ notify }) => notify("success", "Portfolio snapshot exported", "Saved as a PDF report."),
  },
  {
    id: "action-flag",
    category: "Actions",
    label: "Flag Active Program for Review",
    icon: <FlagOutlined />,
    run: ({ notify }) => notify("warning", "Flagged for review", "Sent to the analyst review queue."),
  },
  {
    id: "settings-preferences",
    category: "Settings",
    label: "Open Preferences",
    icon: <SettingOutlined />,
    run: ({ notify }) => notify("info", "Preferences", "Preferences panel is a stub in this sandbox."),
  },
  {
    id: "settings-sign-out",
    category: "Settings",
    label: "Sign Out",
    icon: <LogoutOutlined />,
    run: ({ notify }) => notify("info", "Sign-out", "Sign-out is a stub in this sandbox."),
  },
];

export const CATEGORY_ORDER: CommandAction["category"][] = ["Navigation", "Actions", "Settings"];

export function getActionById(id: string) {
  return ACTIONS.find((a) => a.id === id);
}

export function isMacPlatform() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);
}
