"use client";

/**
 * Living Design System overview — the "Overview" item in LdsSidebar.
 * Adapted from app/(defense-app)/sandbox/page.tsx (same card visual
 * language/tokens, same 10 modules) but no longer the only way to
 * navigate: LdsSidebar now provides real, always-available navigation
 * between every module, so this page is a supplementary landing view
 * rather than the required entry point.
 */

import Link from "next/link";
import { Typography } from "antd";
import {
  AuditOutlined,
  BgColorsOutlined,
  ColumnHeightOutlined,
  ExperimentOutlined,
  SearchOutlined,
  SplitCellsOutlined,
  TableOutlined,
  ThunderboltOutlined,
  BlockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

const { Title, Paragraph, Text } = Typography;

interface SandboxEntry {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  tags: string[];
}

const entries: SandboxEntry[] = [
  {
    href: "/portfolio-v2/lds/design-system",
    title: "Design System",
    description:
      "Typography scale, color token swatches, button states, and card containers in one reference page.",
    icon: <BgColorsOutlined />,
    tags: ["Typography", "Tokens", "Buttons"],
  },
  {
    href: "/portfolio-v2/lds/command-palette",
    title: "Command Palette",
    description: "Global ⌘K / Ctrl+K launcher with keyboard navigation and categorized actions.",
    icon: <SearchOutlined />,
    tags: ["Keyboard", "Search", "Modal"],
  },
  {
    href: "/portfolio-v2/lds/views",
    title: "Saved Views",
    description: "An AG Grid data table with a toolbar for saving, switching, and deleting presets.",
    icon: <TableOutlined />,
    tags: ["AG Grid", "Presets", "Filters"],
  },
  {
    href: "/portfolio-v2/lds/density",
    title: "Density Toggle",
    description: "Comfortable, Compact, and Ultra-Dense row modes for the same dataset.",
    icon: <ColumnHeightOutlined />,
    tags: ["Table", "Density"],
  },
  {
    href: "/portfolio-v2/lds/split-screen",
    title: "Split-Screen Inspector",
    description: "Master-detail layout — click a row to slide out a rich inspection drawer.",
    icon: <SplitCellsOutlined />,
    tags: ["Drawer", "Master-Detail"],
  },
  {
    href: "/portfolio-v2/lds/states",
    title: "Component States",
    description: "Toggle Normal, Loading Skeleton, Empty, and Error retry states on a storyboard.",
    icon: <ExperimentOutlined />,
    tags: ["Skeleton", "Empty", "Error"],
  },
  {
    href: "/portfolio-v2/lds/audit-trail",
    title: "Audit Trail",
    description: "Timestamped changelogs with user attribution and field-level modification history.",
    icon: <AuditOutlined />,
    tags: ["Compliance", "History"],
  },
  {
    href: "/portfolio-v2/lds/telemetry",
    title: "Live Telemetry",
    description: "Simulated streaming sensor feed with pause/resume, auto-scroll, and anomaly flashes.",
    icon: <ThunderboltOutlined />,
    tags: ["Streaming", "Real-time"],
  },
  {
    href: "/portfolio-v2/lds/keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description: "Every shortcut across the suite, with a Trigger button to fire each one on the fly.",
    icon: <KeyOutlined />,
    tags: ["Cheat Sheet", "Accessibility"],
  },
  {
    href: "/portfolio-v2/lds/variants",
    title: "Component Variants",
    description: "Default/Hover/Active/Focus/Disabled/Loading/Error grid — a 1:1 reference for Figma.",
    icon: <BlockOutlined />,
    tags: ["Figma", "States"],
  },
];

export default function LdsOverviewPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200, marginInline: "auto" }}>
      <Typography>
        <Title level={2} style={{ marginBottom: 4 }}>
          Living Design System
        </Title>
        <Paragraph type="secondary" style={{ maxWidth: 640 }}>
          An interactive environment for testing enterprise UI patterns, states, density,
          navigation, and behavior. Every module below is reachable directly from the sidebar —
          these cards are a starting point, not the only way in.
        </Paragraph>
      </Typography>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {entries.map((entry) => (
          <Link key={entry.href} href={entry.href} style={{ display: "block" }}>
            <div
              className="lds-overview-card"
              style={{
                height: "100%",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0f172a",
                padding: 20,
                transition: "border-color 0.15s ease, transform 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10b981",
                  fontSize: 20,
                  marginBottom: 14,
                }}
              >
                {entry.icon}
              </div>
              <Title level={4} style={{ margin: 0 }}>
                {entry.title}
              </Title>
              <Paragraph type="secondary" style={{ marginTop: 6, marginBottom: 12, fontSize: 13 }}>
                {entry.description}
              </Paragraph>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {entry.tags.map((tag) => (
                  <Text
                    key={tag}
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    {tag}
                  </Text>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .lds-overview-card:hover {
          border-color: rgba(16, 185, 129, 0.5) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
