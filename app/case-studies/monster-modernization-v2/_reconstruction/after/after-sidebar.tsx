"use client";

/**
 * Global navigation — one responsibility: move between major areas of
 * the platform. Built from antd Menu + Layout.Sider, the exact primitive
 * the real Living Design System sidebar (components/layout/app-sidebar.tsx,
 * components/portfolio-v2/lds-sidebar.tsx) already uses, with case-
 * management items in place of those pages' own module lists.
 */

import { AppstoreOutlined, BarChartOutlined, CalendarOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";

const items: MenuProps["items"] = [
  { key: "caseload", icon: <AppstoreOutlined />, label: "Caseload" },
  { key: "appointments", icon: <CalendarOutlined />, label: "Appointments", disabled: true },
  { key: "reports", icon: <BarChartOutlined />, label: "Reports", disabled: true },
];

export function AfterSidebar() {
  return (
    <Layout.Sider
      width={220}
      style={{ borderInlineEnd: "1px solid rgba(255,255,255,0.08)" }}
      theme="dark"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 48,
          paddingInline: 14,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: 0.5,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        CASE MANAGEMENT
      </div>
      <Menu mode="inline" theme="dark" items={items} selectedKeys={["caseload"]} style={{ borderInlineEnd: "none" }} />
    </Layout.Sider>
  );
}
