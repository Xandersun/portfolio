"use client";

/**
 * portfolio-v2 / Living Design System — Component Variants.
 * Content-only isolated copy of app/(defense-app)/sandbox/variants/page.tsx
 * (untouched, still serves the original /sandbox): identical structure —
 * only the one domain-flavored Alert demo string changed from "Portfolio
 * synced" to "Case synced" for consistency with the rest of this
 * experiment's case-management content.
 */

import type { ReactNode } from "react";
import { Alert, Button, Input, Tag, Typography } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const STATE_COLUMNS = ["Default", "Hover", "Active", "Focus", "Disabled", "Loading", "Error"] as const;
type StateColumn = (typeof STATE_COLUMNS)[number];

interface VariantRow {
  component: string;
  cells: Partial<Record<StateColumn, ReactNode>>;
}

function NotApplicable() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        border: "1px dashed rgba(255,255,255,0.14)",
        borderRadius: 6,
        color: "rgba(255,255,255,0.3)",
        fontSize: 11,
      }}
    >
      N/A
    </div>
  );
}

const rows: VariantRow[] = [
  {
    component: "Button",
    cells: {
      Default: <Button type="primary">Save</Button>,
      Hover: <Button type="primary">Save</Button>,
      Active: <Button type="primary">Save</Button>,
      Focus: <Button type="primary">Save</Button>,
      Disabled: <Button type="primary" disabled>Save</Button>,
      Loading: <Button type="primary" loading>Save</Button>,
      Error: <Button type="primary" danger>Delete</Button>,
    },
  },
  {
    component: "Badge / Tag",
    cells: {
      Default: <Tag color="success">Active</Tag>,
      Hover: (
        <Tag color="success" style={{ cursor: "pointer" }}>
          Active
        </Tag>
      ),
      Active: (
        <Tag color="success" style={{ cursor: "pointer" }}>
          Active
        </Tag>
      ),
      Focus: (
        <Tag color="success" tabIndex={0} style={{ cursor: "pointer" }}>
          Active
        </Tag>
      ),
      Disabled: (
        <Tag style={{ opacity: 0.4, cursor: "not-allowed" }} color="default">
          Active
        </Tag>
      ),
      Error: <Tag color="error">Blocked</Tag>,
    },
  },
  {
    component: "Alert",
    cells: {
      Default: <Alert type="info" title="Case synced" showIcon />,
      Loading: <Alert type="info" icon={<LoadingOutlined />} title="Syncing case…" showIcon />,
      Error: <Alert type="error" title="Sync failed" showIcon />,
    },
  },
  {
    component: "Input",
    cells: {
      Default: <Input placeholder="Search…" prefix={<SearchOutlined />} />,
      Hover: <Input placeholder="Search…" prefix={<SearchOutlined />} />,
      Active: <Input placeholder="Search…" prefix={<SearchOutlined />} />,
      Focus: <Input placeholder="Search…" prefix={<SearchOutlined />} />,
      Disabled: <Input placeholder="Search…" prefix={<SearchOutlined />} disabled />,
      Loading: <Input placeholder="Validating…" suffix={<LoadingOutlined />} />,
      Error: <Input placeholder="Search…" status="error" defaultValue="invalid" />,
    },
  },
];

const LIVE_STATES: StateColumn[] = ["Hover", "Active", "Focus"];

export default function VariantsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1280, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Component Variants
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 8, maxWidth: 760 }}>
        Every micro-state for the core primitives, side-by-side as a 1:1 code reference for Figma.
      </Paragraph>
      <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 32, maxWidth: 760 }}>
        <Text strong style={{ fontSize: 12 }}>
          Hover / Active / Focus
        </Text>{" "}
        cells render the real component — interact with them directly to see the actual CSS state,
        not an approximation.{" "}
        <Text strong style={{ fontSize: 12 }}>
          N/A
        </Text>{" "}
        marks a state the component genuinely doesn&apos;t have in this library.
      </Paragraph>

      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1120 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px repeat(7, 1fr)",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div />
            {STATE_COLUMNS.map((col) => (
              <Text
                key={col}
                type="secondary"
                style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                {col}
                {LIVE_STATES.includes(col) && (
                  <span style={{ color: "#10b981", marginLeft: 4 }}>●</span>
                )}
              </Text>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.component}
              style={{
                display: "grid",
                gridTemplateColumns: "140px repeat(7, 1fr)",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text strong style={{ fontSize: 13 }}>
                  {row.component}
                </Text>
              </div>
              {STATE_COLUMNS.map((col) => (
                <div
                  key={col}
                  style={{
                    minHeight: 96,
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {row.cells[col] ?? <NotApplicable />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
