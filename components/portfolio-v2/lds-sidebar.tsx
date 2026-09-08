"use client";

/**
 * @design-spec LdsSidebar — Living Design System primary navigation rail.
 *
 * Replaces the generic, disconnected "Defense Analytics" AppSidebar
 * (components/layout/app-sidebar.tsx — its "Portfolio Operations /
 * Autonomous & Sensor Systems / Risk & Compliance Auditing" nav is
 * unrelated leftover content from the earlier prototype, not a map of the
 * actual sandbox modules) with real navigation to the 10 real Living
 * Design System modules, grouped by what they actually are.
 *
 * Built entirely from antd's existing Menu (mode="inline",
 * inlineCollapsed) — the same nav primitive the original AppSidebar
 * already used — which provides icon+label / icon-rail collapse,
 * multi-level submenus, and built-in hover tooltips on collapsed items for
 * free, matching the isolated dark-navy/teal visual language pinned in
 * lib/design-tokens.ts (colorTokens.siderBg / colorTokens.primary).
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  AuditOutlined,
  BgColorsOutlined,
  BlockOutlined,
  ColumnHeightOutlined,
  ExperimentOutlined,
  KeyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SplitCellsOutlined,
  TableOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

interface LdsModule {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface LdsGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  children: LdsModule[];
}

const GROUPS: LdsGroup[] = [
  {
    key: "foundations",
    label: "Foundations",
    icon: <BgColorsOutlined />,
    children: [
      { key: "design-system", label: "Design System", href: "/portfolio-v2/lds/design-system", icon: <BgColorsOutlined /> },
      { key: "variants", label: "Component Variants", href: "/portfolio-v2/lds/variants", icon: <BlockOutlined /> },
    ],
  },
  {
    key: "navigation-interaction",
    label: "Navigation & Interaction",
    icon: <SearchOutlined />,
    children: [
      { key: "command-palette", label: "Command Palette", href: "/portfolio-v2/lds/command-palette", icon: <SearchOutlined /> },
      { key: "keyboard-shortcuts", label: "Keyboard Shortcuts", href: "/portfolio-v2/lds/keyboard-shortcuts", icon: <KeyOutlined /> },
      { key: "split-screen", label: "Split-Screen Inspector", href: "/portfolio-v2/lds/split-screen", icon: <SplitCellsOutlined /> },
      { key: "states", label: "Component States", href: "/portfolio-v2/lds/states", icon: <ExperimentOutlined /> },
    ],
  },
  {
    key: "data-compliance",
    label: "Data & Compliance",
    icon: <TableOutlined />,
    children: [
      { key: "views", label: "Saved Views", href: "/portfolio-v2/lds/views", icon: <TableOutlined /> },
      { key: "density", label: "Density Toggle", href: "/portfolio-v2/lds/density", icon: <ColumnHeightOutlined /> },
      { key: "telemetry", label: "Live Telemetry", href: "/portfolio-v2/lds/telemetry", icon: <ThunderboltOutlined /> },
      { key: "audit-trail", label: "Audit Trail", href: "/portfolio-v2/lds/audit-trail", icon: <AuditOutlined /> },
    ],
  },
];

const ALL_MODULES = GROUPS.flatMap((group) => group.children);

function findActiveKey(pathname: string) {
  const module = ALL_MODULES.find((m) => pathname === m.href || pathname.startsWith(`${m.href}/`));
  return module?.key ?? (pathname === "/portfolio-v2/lds" ? "overview" : "");
}

function findActiveGroupKey(activeKey: string) {
  return GROUPS.find((group) => group.children.some((m) => m.key === activeKey))?.key;
}

export function LdsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const activeKey = findActiveKey(pathname);
  const activeGroupKey = findActiveGroupKey(activeKey);

  const [openKeys, setOpenKeys] = useState<string[]>(() => (activeGroupKey ? [activeGroupKey] : []));

  // Keep the active module's parent group expanded whenever navigation
  // changes the active page, without collapsing a group the reviewer
  // manually opened by hand.
  useEffect(() => {
    if (activeGroupKey) {
      setOpenKeys((prev) => (prev.includes(activeGroupKey) ? prev : [...prev, activeGroupKey]));
    }
  }, [activeGroupKey]);

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "overview",
        icon: <AppstoreOutlined />,
        label: <Link href="/portfolio-v2/lds">Overview</Link>,
      },
      { type: "divider" as const },
      ...GROUPS.map((group) => ({
        key: group.key,
        icon: group.icon,
        label: group.label,
        children: group.children.map((mod) => ({
          key: mod.key,
          icon: mod.icon,
          label: <Link href={mod.href}>{mod.label}</Link>,
        })),
      })),
    ],
    [],
  );

  return (
    <Layout.Sider
      className="lds-sidebar-nav"
      collapsed={collapsed}
      trigger={null}
      width={288}
      collapsedWidth={72}
      style={{
        height: "100vh",
        position: "sticky",
        insetBlockStart: 0,
        insetInlineStart: 0,
        borderInlineEnd: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 56,
          paddingInline: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Button
          type="text"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ color: "rgba(255,255,255,0.85)" }} />
            ) : (
              <MenuFoldOutlined style={{ color: "rgba(255,255,255,0.85)" }} />
            )
          }
        />
        {!collapsed && (
          <span
            style={{
              marginInlineStart: 8,
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: 0.4,
              color: "rgba(255,255,255,0.95)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            LIVING DESIGN SYSTEM
          </span>
        )}
      </div>

      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        selectedKeys={[activeKey]}
        openKeys={collapsed ? undefined : openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)}
        style={{ borderInlineEnd: "none" }}
      />

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: collapsed ? "12px 0" : "12px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Link
          href="/portfolio-v2"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(255,255,255,0.65)",
          }}
          title="Back to portfolio"
        >
          <ArrowLeftOutlined />
          {!collapsed && <span>Back to portfolio</span>}
        </Link>
      </div>

      {/*
        Mirrors app-sidebar.tsx's own focus-visible contrast fix, scoped to
        this sidebar only. Also makes Sider a column flex container so the
        "Back to portfolio" block above can sit at the bottom via
        margin-top: auto.
      */}
      <style jsx global>{`
        .lds-sidebar-nav .ant-layout-sider-children {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .lds-sidebar-nav .ant-menu:focus-visible,
        .lds-sidebar-nav .ant-menu-item:focus-visible,
        .lds-sidebar-nav .ant-menu-submenu-title:focus-visible,
        .lds-sidebar-nav button:focus-visible {
          outline: 2px solid #ffffff !important;
          outline-offset: -2px !important;
        }
      `}</style>
    </Layout.Sider>
  );
}
