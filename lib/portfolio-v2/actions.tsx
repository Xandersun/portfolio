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
 * portfolio-v2 / Living Design System — isolated action registry.
 * Content-only counterpart to lib/sandbox-actions.tsx (untouched, still
 * serves the original /sandbox). Same shared-registry structure powering
 * both the command palette and the shortcuts cheat sheet, routed to
 * /portfolio-v2/lds/* and using case-management vocabulary instead of
 * defense-acquisition vocabulary.
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
  shortcut?: string;
  run: (ctx: ActionRunContext) => void;
}

export const ACTIONS: CommandAction[] = [
  {
    id: "nav-overview",
    category: "Navigation",
    label: "Living Design System Overview",
    description: "Main entry point for all modules",
    icon: <DashboardOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds"),
  },
  {
    id: "nav-portfolio",
    category: "Navigation",
    label: "Back to Portfolio",
    description: "Return to the portfolio-v2 landing page",
    icon: <HomeOutlined />,
    run: ({ router }) => router.push("/portfolio-v2"),
  },
  {
    id: "nav-design-system",
    category: "Navigation",
    label: "Design System",
    icon: <BgColorsOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/design-system"),
  },
  {
    id: "nav-views",
    category: "Navigation",
    label: "Saved Views",
    icon: <TableOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/views"),
  },
  {
    id: "nav-density",
    category: "Navigation",
    label: "Density Toggle",
    icon: <ColumnHeightOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/density"),
  },
  {
    id: "nav-split-screen",
    category: "Navigation",
    label: "Split-Screen Inspector",
    icon: <SplitCellsOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/split-screen"),
  },
  {
    id: "nav-states",
    category: "Navigation",
    label: "Component States",
    icon: <ExperimentOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/states"),
  },
  {
    id: "nav-audit",
    category: "Navigation",
    label: "Audit Trail",
    icon: <AuditOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/audit-trail"),
  },
  {
    id: "nav-telemetry",
    category: "Navigation",
    label: "Live Telemetry",
    icon: <ThunderboltOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/telemetry"),
  },
  {
    id: "nav-variants",
    category: "Navigation",
    label: "Component Variants",
    icon: <BgColorsOutlined />,
    run: ({ router }) => router.push("/portfolio-v2/lds/variants"),
  },
  {
    id: "action-new-intake",
    category: "Actions",
    label: "New Case Intake",
    description: "Start a new participant application",
    icon: <PlusCircleOutlined />,
    shortcut: "Alt N",
    run: ({ notify }) => notify("success", "New case intake started", "A draft application was opened."),
  },
  {
    id: "action-export",
    category: "Actions",
    label: "Export Caseload Snapshot",
    description: "Export the current caseload as a PDF report",
    icon: <DownloadOutlined />,
    run: ({ notify }) => notify("success", "Caseload snapshot exported", "Saved as a PDF report."),
  },
  {
    id: "action-flag",
    category: "Actions",
    label: "Flag Active Case for Supervisor Review",
    icon: <FlagOutlined />,
    run: ({ notify }) => notify("warning", "Flagged for review", "Sent to the supervisor review queue."),
  },
  {
    id: "settings-preferences",
    category: "Settings",
    label: "Open Preferences",
    icon: <SettingOutlined />,
    run: ({ notify }) => notify("info", "Preferences", "Preferences panel is a stub in this experiment."),
  },
  {
    id: "settings-sign-out",
    category: "Settings",
    label: "Sign Out",
    icon: <LogoutOutlined />,
    run: ({ notify }) => notify("info", "Sign-out", "Sign-out is a stub in this experiment."),
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
