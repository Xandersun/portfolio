"use client";

/**
 * portfolio-v2 / Living Design System — Audit Trail.
 * Content-only isolated copy of app/(defense-app)/sandbox/audit-trail/page.tsx
 * (untouched, still serves the original /sandbox): identical Table +
 * field-level-diff structure, fictional social-services audit entries
 * instead of defense-acquisition ones.
 */

import { Avatar, Button, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined, UserOutlined } from "@ant-design/icons";

import { exportToCsv } from "@/components/data-grid/export-utils";
import type { DataGridColumn } from "@/components/data-grid/types";
import { useSandboxNotify } from "@/components/sandbox/notification-provider";

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
    entityName: "K. Vance — Employment Services",
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
  {
    id: "AUD-3036",
    timestamp: "2026-08-29 14:18",
    actor: "System",
    actorRole: "Automated Determination",
    action: "Created",
    entityId: "CASE-4796",
    entityName: "T. Nakamura — TANF",
    summary: "Initial determination generated from 3 documents on file.",
    changes: [
      { field: "eligibilityStatus", from: "—", to: "Verification Needed" },
      { field: "confidence", from: "—", to: "68%" },
    ],
  },
  {
    id: "AUD-3035",
    timestamp: "2026-08-28 06:17",
    actor: "System",
    actorRole: "Automated Determination",
    action: "Created",
    entityId: "CASE-4750",
    entityName: "A. Okafor — Medicaid",
    summary: "Initial determination generated; referral to Housing Assistance noted.",
    changes: [
      { field: "eligibilityStatus", from: "—", to: "Pending Review" },
      { field: "confidence", from: "—", to: "86%" },
    ],
  },
  {
    id: "AUD-3034",
    timestamp: "2026-08-18 10:02",
    actor: "S. Boateng",
    actorRole: "Senior Case Worker",
    action: "Approved",
    entityId: "CASE-4712",
    entityName: "K. Vance — Employment Services",
    summary: "Quarterly compliance sign-off recorded.",
    changes: [{ field: "determination.reviewer", from: "Unreviewed", to: "Reviewed — S. Boateng, 2026-08-18" }],
  },
  {
    id: "AUD-3033",
    timestamp: "2026-08-04 09:40",
    actor: "R. Whitfield",
    actorRole: "Case Worker",
    action: "Approved",
    entityId: "CASE-4750",
    entityName: "A. Okafor — Medicaid",
    summary: "Reviewed and confirmed the Pending Review status.",
    changes: [{ field: "determination.reviewer", from: "Unreviewed", to: "Reviewed — R. Whitfield, 2026-08-04" }],
  },
];

const columns: ColumnsType<AuditEntry> = [
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
    width: 170,
    render: (v) => <Text style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>{v}</Text>,
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
        <Avatar size="small" icon={<UserOutlined />} />
        <div>
          <div style={{ fontSize: 13 }}>{record.actor}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{record.actorRole}</div>
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
        <div style={{ fontSize: 13 }}>{record.entityName}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-geist-mono)" }}>
          {record.entityId}
        </div>
      </div>
    ),
  },
  {
    title: "Summary",
    dataIndex: "summary",
    key: "summary",
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

export default function AuditTrailPage() {
  const notify = useSandboxNotify();

  const handleExport = () => {
    exportToCsv(entries, exportColumns, "audit-log");
    notify("success", "Audit log exported", `${entries.length} entries saved as CSV.`);
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200, marginInline: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Audit Trail
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            Timestamped changelog with user attribution. Expand a row to see the field-level diff
            for that entry.
          </Paragraph>
        </div>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          Export audit log
        </Button>
      </div>

      <Table<AuditEntry>
        columns={columns}
        dataSource={entries}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        expandable={{
          expandedRowRender: (record) =>
            record.changes.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                No field-level changes recorded for this entry.
              </Text>
            ) : (
              <div style={{ display: "grid", gap: 6 }}>
                {record.changes.map((change) => (
                  <div
                    key={change.field}
                    style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}
                  >
                    <Text code>{change.field}</Text>
                    <Text type="secondary" style={{ textDecoration: "line-through" }}>
                      {change.from}
                    </Text>
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>→</span>
                    <Text style={{ color: "#34d399" }}>{change.to}</Text>
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
