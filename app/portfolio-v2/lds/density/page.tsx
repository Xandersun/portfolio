"use client";

/**
 * portfolio-v2 / Living Design System — Density Toggle.
 * Content-only isolated copy of app/(defense-app)/sandbox/density/page.tsx
 * (untouched, still serves the original /sandbox): identical Segmented +
 * Table structure and live density-switching logic, fictional
 * social-services case data instead of defense-acquisition data.
 */

import { useMemo, useState } from "react";
import { Segmented, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useSandboxNotify } from "@/components/sandbox/notification-provider";

const { Title, Paragraph, Text } = Typography;

interface Row {
  id: string;
  participant: string;
  program: string;
  assignedWorker: string;
  caseStatus: string;
  eligibilityConfidence: number;
}

const PARTICIPANTS = [
  "M. Delgado",
  "T. Nakamura",
  "A. Okafor",
  "K. Vance",
  "J. Petrov",
  "L. Whitaker",
  "D. Osei",
  "C. Reyes",
  "N. Falcone",
  "S. Iqbal",
];
const PROGRAMS = ["SNAP", "TANF", "Child Care Assistance", "Employment Services", "Housing Assistance", "Medicaid", "Energy Assistance"];
const WORKERS = ["R. Whitfield", "S. Boateng", "M. Alvarez", "P. Ng", "K. O'Sullivan"];
const CASE_STATUSES = [
  "Application Received",
  "Pending Review",
  "Benefits Active",
  "Recertification Due",
  "Referral Pending",
  "Follow-up Required",
];

const rows: Row[] = Array.from({ length: 42 }, (_, i) => ({
  id: `CASE-${String(4500 + i * 3).padStart(4, "0")}`,
  participant: PARTICIPANTS[i % PARTICIPANTS.length],
  program: PROGRAMS[i % PROGRAMS.length],
  assignedWorker: WORKERS[i % WORKERS.length],
  caseStatus: CASE_STATUSES[i % CASE_STATUSES.length],
  eligibilityConfidence: 58 + ((i * 11) % 41),
}));

const STATUS_COLOR: Record<string, string> = {
  "Application Received": "blue",
  "Pending Review": "warning",
  "Benefits Active": "success",
  "Recertification Due": "gold",
  "Referral Pending": "purple",
  "Follow-up Required": "error",
};

type Density = "comfortable" | "compact" | "ultra";

const DENSITY_CONFIG: Record<Density, { label: string; cellPadding: string; fontSize: number; rowHeight: number }> = {
  comfortable: { label: "Comfortable", cellPadding: "16px 16px", fontSize: 14, rowHeight: 56 },
  compact: { label: "Compact", cellPadding: "8px 12px", fontSize: 13, rowHeight: 36 },
  ultra: { label: "Ultra-Dense", cellPadding: "2px 8px", fontSize: 12, rowHeight: 24 },
};

const columns: ColumnsType<Row> = [
  { title: "Case ID", dataIndex: "id", key: "id", width: 110 },
  { title: "Participant", dataIndex: "participant", key: "participant" },
  { title: "Program", dataIndex: "program", key: "program", width: 190 },
  { title: "Assigned Worker", dataIndex: "assignedWorker", key: "assignedWorker", width: 150 },
  {
    title: "Case Status",
    dataIndex: "caseStatus",
    key: "caseStatus",
    width: 170,
    render: (status: string) => <Tag color={STATUS_COLOR[status]}>{status}</Tag>,
  },
  { title: "Eligibility Confidence", dataIndex: "eligibilityConfidence", key: "eligibilityConfidence", width: 150, render: (v) => `${v}%` },
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
        Same 42-row caseload, three real-time row-density modes — padding and font size change
        live, no page reload.
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
