"use client";

/**
 * @design-spec AppSidebar — primary navigation rail.
 * Expanded width: 296px · Collapsed width: 72px · Header height: 56px, 12px
 * inline padding · Header label: 0.8125rem (13px) / 600 / 0.4px tracking,
 * rgba(255,255,255,0.95) · Border: 1px solid rgba(255,255,255,0.08) ·
 * Background: colorTokens.siderBg (#0f172a, see lib/design-tokens.ts).
 */

import { useState } from "react";
import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const navItems: MenuProps["items"] = [
  {
    key: "sub1",
    label: "Portfolio Operations",
    icon: <AppstoreOutlined />,
    children: [
      { key: "1", label: "Program & Budget Intelligence" },
      {
        key: "2",
        label: "Milestone & Schedule Tracking",
        children: [
          { key: "2-1", label: "Schedule Baseline vs. Actuals" },
          { key: "2-2", label: "Milestone Slippage Alerts" },
          { key: "2-3", label: "Critical Path Analysis" },
        ],
      },
      { key: "3", label: "Requirements & Capabilities" },
    ],
  },
  {
    key: "sub2",
    label: "Autonomous & Sensor Systems",
    icon: <ApiOutlined />,
    children: [
      { key: "4", label: "Unmanned & Maritime Platforms" },
      {
        key: "5",
        label: "JADC2 Network Health",
        children: [
          { key: "5-1", label: "Node Uptime & Latency" },
          { key: "5-2", label: "Link Degradation Events" },
          { key: "5-3", label: "Interoperability Test Status" },
        ],
      },
      { key: "6", label: "Hypersonic & Strategic Sensors" },
    ],
  },
  {
    key: "sub3",
    label: "Risk & Compliance Auditing",
    icon: <SafetyCertificateOutlined />,
    children: [
      { key: "7", label: "Explainable AI Model Records" },
      {
        key: "8",
        label: "Cost-Estimate Deviations",
        children: [
          { key: "8-1", label: "Variance by Contract Line" },
          { key: "8-2", label: "Estimate-at-Completion Trends" },
          { key: "8-3", label: "Independent Cost Assessments" },
        ],
      },
      { key: "9", label: "Statutory & Regulatory Oversight" },
    ],
  },
];

const defaultOpenKeys = navItems!.map((item) => item!.key as string);

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");

  return (
    <Sider
      className="app-sidebar-nav"
      collapsed={collapsed}
      trigger={null}
      width={296}
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
            DEFENSE ANALYTICS
          </span>
        )}
      </div>

      <Menu
        mode="inline"
        items={navItems}
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        onClick={({ key }) => setSelectedKey(key)}
        style={{ borderInlineEnd: "none" }}
      />

      {/*
        antd's default dark-theme focus-visible outline (~rgb(19,70,53)) sits at
        ~1.7:1 against the sider's dark backgrounds, well under the 3:1 WCAG 2.1
        SC 1.4.11 floor for non-text UI indicators. Scoped to this sidebar only.
      */}
      <style jsx global>{`
        .app-sidebar-nav .ant-menu:focus-visible,
        .app-sidebar-nav .ant-menu-item:focus-visible,
        .app-sidebar-nav .ant-menu-submenu-title:focus-visible,
        .app-sidebar-nav button:focus-visible {
          outline: 2px solid #ffffff !important;
          outline-offset: -2px !important;
        }
      `}</style>
    </Sider>
  );
}
