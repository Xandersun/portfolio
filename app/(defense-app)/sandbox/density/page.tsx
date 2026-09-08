"use client";

import { useMemo, useState } from "react";
import { Segmented, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useSandboxNotify } from "@/components/sandbox/notification-provider";

const { Title, Paragraph, Text } = Typography;

interface Row {
  id: string;
  name: string;
  agency: string;
  budget: string;
  risk: "Low" | "Medium" | "High";
  confidence: number;
}

const AGENCIES = ["US Army", "US Navy", "US Air Force", "OSD / Joint Staff", "MDA", "DARPA"];
const NAME_PARTS = [
  "Tactical Cloud",
  "Maritime Recon",
  "Joint Fires Network",
  "Defense Sensors",
  "Autonomy Stack",
  "ISR Platform",
  "Logistics Mesh",
  "C2 Interface",
  "Munitions Program",
  "Sensor Fusion Suite",
];
const RISK: Row["risk"][] = ["Low", "Medium", "High"];

const rows: Row[] = Array.from({ length: 42 }, (_, i) => ({
  id: `PRG-${String(100 + i).padStart(3, "0")}`,
  name: `${NAME_PARTS[i % NAME_PARTS.length]} ${i % 4 === 0 ? "Increment II" : ""}`.trim(),
  agency: AGENCIES[i % AGENCIES.length],
  budget: `$${(120 + i * 37) % 900}M`,
  risk: RISK[i % RISK.length],
  confidence: 60 + ((i * 13) % 38),
}));

const RISK_COLOR: Record<Row["risk"], string> = { Low: "success", Medium: "warning", High: "error" };

type Density = "comfortable" | "compact" | "ultra";

const DENSITY_CONFIG: Record<Density, { label: string; cellPadding: string; fontSize: number; rowHeight: number }> = {
  comfortable: { label: "Comfortable", cellPadding: "16px 16px", fontSize: 14, rowHeight: 56 },
  compact: { label: "Compact", cellPadding: "8px 12px", fontSize: 13, rowHeight: 36 },
  ultra: { label: "Ultra-Dense", cellPadding: "2px 8px", fontSize: 12, rowHeight: 24 },
};

const columns: ColumnsType<Row> = [
  { title: "ID", dataIndex: "id", key: "id", width: 110 },
  { title: "Program Name", dataIndex: "name", key: "name" },
  { title: "Agency", dataIndex: "agency", key: "agency", width: 170 },
  { title: "FY27 Request", dataIndex: "budget", key: "budget", width: 120 },
  {
    title: "Risk Tier",
    dataIndex: "risk",
    key: "risk",
    width: 110,
    render: (risk: Row["risk"]) => <Tag color={RISK_COLOR[risk]}>{risk}</Tag>,
  },
  { title: "AI Confidence", dataIndex: "confidence", key: "confidence", width: 120, render: (v) => `${v}%` },
];

export default function DensityPage() {
  const notify = useSandboxNotify();
  const [density, setDensity] = useState<Density>("comfortable");
  const config = DENSITY_CONFIG[density];

  const handleDensityChange = (value: Density) => {
    setDensity(value);
    notify("info", "Density updated", `Table density set to ${DENSITY_CONFIG[value].label}.`);
  };

  const scopedStyles = useMemo(
    () => `
      .density-table .ant-table-cell {
        padding: ${config.cellPadding} !important;
        font-size: ${config.fontSize}px !important;
        line-height: ${config.rowHeight - 2}px !important;
      }
    `,
    [config],
  );

  return (
    <div style={{ padding: 32, maxWidth: 1100, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Density Toggle
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Same 42-row dataset, three real-time row-density modes — padding and font size change live,
        no page reload.
      </Paragraph>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <Segmented
          value={density}
          onChange={(value) => handleDensityChange(value as Density)}
          options={(Object.keys(DENSITY_CONFIG) as Density[]).map((key) => ({
            label: DENSITY_CONFIG[key].label,
            value: key,
          }))}
        />
        <Text type="secondary" style={{ fontSize: 13 }}>
          Row height ≈ {config.rowHeight}px · font {config.fontSize}px
        </Text>
      </div>

      <div className="density-table" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>
        <Table<Row>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          pagination={false}
          scroll={{ y: 520 }}
        />
      </div>

      <style>{scopedStyles}</style>
    </div>
  );
}
