"use client";

/**
 * Monster-specific light-mode fork of the Living Design System's Audit
 * Trail page (app/portfolio-v2/lds/audit-trail/page.tsx) — same pattern as
 * design-system-panel.tsx / states-panel.tsx / variants-panel.tsx: forked
 * rather than reused directly so it can render inside this section's light
 * theme (and with a demo-appropriate row count) without touching that real
 * route. The real page's hardcoded dark-mode colors (white-on-navy
 * secondary text, a bright green for new diff values) don't work on a
 * white surface and are replaced with light-mode equivalents; the bright
 * green is also replaced with a restrained teal, since these are simply
 * NEW values, not a "success" state.
 *
 * Five entries (trimmed from the real page's nine) — enough to demonstrate
 * scanning, different actors/actions, and expandable field-level diffs
 * without pagination. "K. Vance" does not appear in this dataset; that
 * entry was renamed to "J. Chen" per the same demo-data cleanup applied
 * elsewhere in this reconstruction.
 */

import { Avatar, Button, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined, UserOutlined } from "@ant-design/icons";

import { exportToCsv } from "@/components/data-grid/export-utils";
import type { DataGridColumn } from "@/components/data-grid/types";
import { useSandboxNotify } from "../../_living-system/monster-notification-provider";

const { Title, Paragraph, Text } = Typography;

type ActionType = "Created" | "Updated" | "Approved" | "Flagged" | "Exported";

interface FieldChange {
  field: string;
  from: string;
  to: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: ActionType;
  entityId: string;
  entityName: string;
  summary: string;
  changes: FieldChange[];
}

const ACTION_COLOR: Record<ActionType, string> = {
  Created: "blue",
  Updated: "geekblue",
  Approved: "success",
  Flagged: "error",
  Exported: "purple",
};

const entries: AuditEntry[] = [
  {
    id: "AUD-3041",
    timestamp: "2026-09-03 08:14",
    actor: "System",
    actorRole: "Automated Determination",
    action: "Updated",
    entityId: "CASE-4750",
    entityName: "A. Okafor — Medicaid",
    summary: "Re-scored after the Housing Assistance referral log was updated.",
    changes: [
      { field: "confidence", from: "82%", to: "86%" },
      { field: "caseStatus", from: "Pending Review", to: "Referral Pending" },
    ],
  },
  {
    id: "AUD-3040",
    timestamp: "2026-09-02 16:47",
    actor: "R. Whitfield",
    actorRole: "Case Worker",
    action: "Approved",
    entityId: "CASE-4821",
    entityName: "M. Delgado — SNAP",
    summary: "Signed off on the recertification after document review.",
    changes: [{ field: "determination.reviewer", from: "Unreviewed", to: "Reviewed — R. Whitfield" }],
  },
  {
    id: "AUD-3039",
    timestamp: "2026-09-02 11:02",
    actor: "S. Boateng",
    actorRole: "Senior Case Worker",
    action: "Flagged",
    entityId: "CASE-4796",
    entityName: "T. Nakamura — TANF",
    summary: "Flagged a duplicate-application match for supervisor review.",
    changes: [{ field: "flag", from: "none", to: "Supervisor review requested" }],
  },
  {
    id: "AUD-3038",
    timestamp: "2026-09-01 20:31",
    actor: "System",
    actorRole: "Automated Determination",
    action: "Updated",
    entityId: "CASE-4712",
    entityName: "J. Chen — Employment Services",
    summary: "Job-search log reconciled against the weekly submission portal.",
    changes: [{ field: "nextAction", from: "Awaiting week 6 log", to: "Schedule 30-day employment check-in" }],
  },
  {
    id: "AUD-3037",
    timestamp: "2026-08-31 09:55",
    actor: "M. Alvarez",
    actorRole: "Data Steward",
    action: "Exported",
    entityId: "CASELOAD",
    entityName: "Full Caseload Snapshot",
    summary: "Exported the quarterly caseload snapshot to PDF for the county review.",
    changes: [],
  },
];

const columns: ColumnsType<AuditEntry> = [
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
    width: 170,
    render: (v) => <Text style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#334155" }}>{v}</Text>,
    sorter: (a, b) => a.timestamp.localeCompare(b.timestamp),
    defaultSortOrder: "descend",
  },
  {
    title: "Actor",
    dataIndex: "actor",
    key: "actor",
    width: 200,
    render: (_v, record) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar size="small" icon={<UserOutlined />} style={{ flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.3 }}>{record.actor}</div>
          <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.3 }}>{record.actorRole}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: 110,
    filters: (["Created", "Updated", "Approved", "Flagged", "Exported"] as ActionType[]).map((a) => ({
      text: a,
      value: a,
    })),
    onFilter: (value, record) => record.action === value,
    render: (action: ActionType) => <Tag color={ACTION_COLOR[action]}>{action}</Tag>,
  },
  {
    title: "Case",
    dataIndex: "entityName",
    key: "entity",
    render: (_v, record) => (
      <div>
        <div style={{ fontSize: 13, color: "#0F172A" }}>{record.entityName}</div>
        <div style={{ fontSize: 11, color: "#64748B", fontFamily: "var(--font-geist-mono)" }}>{record.entityId}</div>
      </div>
    ),
  },
  {
    title: "Summary",
    dataIndex: "summary",
    key: "summary",
    render: (v) => <span style={{ color: "#334155" }}>{v}</span>,
  },
];

const exportColumns: DataGridColumn<AuditEntry>[] = [
  { key: "timestamp", title: "Timestamp", dataIndex: "timestamp" },
  { key: "actor", title: "Actor", dataIndex: "actor" },
  { key: "actorRole", title: "Role", dataIndex: "actorRole" },
  { key: "action", title: "Action", dataIndex: "action" },
  { key: "entityId", title: "Case ID", dataIndex: "entityId" },
  { key: "entityName", title: "Case", dataIndex: "entityName" },
  { key: "summary", title: "Summary", dataIndex: "summary" },
];

export function AuditTrailPanel() {
  const notify = useSandboxNotify();

  const handleExport = () => {
    exportToCsv(entries, exportColumns, "audit-log");
    notify("success", "Audit log exported", `${entries.length} entries saved as CSV.`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Audit Trail
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 16, color: "#334155" }}>
        Timestamped changelog with user attribution. Expand a row to see the field-level diff for that entry.
      </Paragraph>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          Export audit log
        </Button>
      </div>

      <Table<AuditEntry>
        columns={columns}
        dataSource={entries}
        rowKey="id"
        pagination={false}
        expandable={{
          defaultExpandedRowKeys: ["AUD-3041"],
          expandedRowRender: (record) =>
            record.changes.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 12, color: "#64748B" }}>
                No field-level changes recorded for this entry.
              </Text>
            ) : (
              <div style={{ display: "grid", gap: 6 }}>
                {record.changes.map((change) => (
                  <div key={change.field} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                    <Text code>{change.field}</Text>
                    <Text style={{ color: "#64748B", textDecoration: "line-through" }}>{change.from}</Text>
                    <span style={{ color: "#94A3B8" }}>→</span>
                    <Text style={{ color: "#0F766E", fontWeight: 600 }}>{change.to}</Text>
                  </div>
                ))}
              </div>
            ),
          rowExpandable: () => true,
        }}
      />
    </div>
  );
}
