"use client";

/**
 * Monster-specific copy of the Component Variants state matrix
 * (app/portfolio-v2/lds/variants/page.tsx), forked here rather than reused
 * directly so its column count and typography can diverge from the live
 * /portfolio-v2/lds page without touching that route.
 */

import type { ReactNode } from "react";
import { Alert, Button, Input, Tag } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";

const STATE_COLUMNS = ["Default", "Focus", "Disabled", "Loading", "Error"] as const;
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
        border: "1px dashed #CBD5E1",
        borderRadius: 6,
        color: "#0F172A",
        fontSize: 14,
        fontWeight: 600,
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
      Focus: <Button type="primary">Save</Button>,
      Disabled: <Button type="primary" disabled>Save</Button>,
      Loading: <Button type="primary" loading>Save</Button>,
      Error: <Button type="primary" danger>Delete</Button>,
    },
  },
  {
    component: "Badge / Tag",
    cells: {
      Default: <Tag color="success" style={{ fontSize: 14 }}>Active</Tag>,
      Focus: (
        <Tag color="success" tabIndex={0} style={{ cursor: "pointer", fontSize: 14 }}>
          Active
        </Tag>
      ),
      Disabled: (
        <Tag style={{ opacity: 0.4, cursor: "not-allowed", fontSize: 14 }} color="default">
          Active
        </Tag>
      ),
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
      Focus: <Input placeholder="Search…" prefix={<SearchOutlined />} />,
      Disabled: <Input placeholder="Search…" prefix={<SearchOutlined />} disabled />,
      Loading: <Input placeholder="Validating…" suffix={<LoadingOutlined />} />,
      Error: <Input placeholder="Search…" status="error" defaultValue="invalid" />,
    },
  },
];

const LIVE_STATES: StateColumn[] = ["Focus"];

export function VariantsPanel() {
  return (
    <div style={{ padding: 24, background: "#F8FAFC" }}>
      <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: "#0F172A", marginBottom: 4 }}>Component Variants</div>
      <p style={{ fontSize: 16, lineHeight: "24px", color: "#334155", marginBottom: 8, maxWidth: 760 }}>
        Every micro-state for the core primitives, side-by-side as a 1:1 code reference for Figma.
      </p>
      <p style={{ fontSize: 14, lineHeight: "24px", color: "#334155", marginBottom: 32, maxWidth: 760 }}>
        <span style={{ fontWeight: 600, color: "#0F172A" }}>Hover / Active / Focus</span> cells render the real
        component — interact with them directly to see the actual CSS state, not an approximation.{" "}
        <span style={{ fontWeight: 600, color: "#0F172A" }}>N/A</span> marks a state the component genuinely
        doesn&apos;t have in this library.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px repeat(5, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div />
        {STATE_COLUMNS.map((col) => (
          <div
            key={col}
            style={{ fontSize: 14, fontWeight: 500, color: "#334155", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            {col}
            {LIVE_STATES.includes(col) && <span style={{ color: "#0f766e", marginLeft: 4 }}>●</span>}
          </div>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.component}
          style={{
            display: "grid",
            gridTemplateColumns: "140px repeat(5, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{row.component}</span>
          </div>
          {STATE_COLUMNS.map((col) => (
            <div
              key={col}
              style={{
                minHeight: 96,
                minWidth: 0,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
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
  );
}
