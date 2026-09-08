"use client";

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
    id: "AUD-2041",
    timestamp: "2026-09-03 08:14Z",
    actor: "System",
    actorRole: "Automated Scoring",
    action: "Updated",
    entityId: "PRG-104",
    entityName: "Autonomous Maritime Recon System",
    summary: "Re-scored after a new conflicting citation was ingested.",
    changes: [
      { field: "confidence", from: "82%", to: "78%" },
      { field: "risk", from: "Medium", to: "High" },
    ],
  },
  {
    id: "AUD-2040",
    timestamp: "2026-09-02 16:47Z",
    actor: "J. Okafor",
    actorRole: "Analyst",
    action: "Approved",
    entityId: "PRG-220",
    entityName: "AI-Enabled Joint Fires Network",
    summary: "Signed off on the integration-authority finding after transcript review.",
    changes: [{ field: "model.reviewer", from: "Unreviewed", to: "Reviewed — J. Okafor" }],
  },
  {
    id: "AUD-2039",
    timestamp: "2026-09-02 11:02Z",
    actor: "M. Delacroix",
    actorRole: "Senior Analyst",
    action: "Flagged",
    entityId: "PRG-315",
    entityName: "Hypersonic Defense Sensors",
    summary: "Flagged the CPARS rating decline for a second-level review.",
    changes: [{ field: "flag", from: "none", to: "Analyst review requested" }],
  },
  {
    id: "AUD-2038",
    timestamp: "2026-09-01 20:31Z",
    actor: "System",
    actorRole: "Automated Scoring",
    action: "Updated",
    entityId: "PRG-091",
    entityName: "Next-Gen Tactical Cloud (N-GTC)",
    summary: "Budget line reconciled against the FY27 President's Budget release.",
    changes: [{ field: "budget", from: "$470M", to: "$482M" }],
  },
  {
    id: "AUD-2037",
    timestamp: "2026-08-31 09:55Z",
    actor: "R. Alvarez",
    actorRole: "Data Steward",
    action: "Exported",
    entityId: "PORTFOLIO",
    entityName: "Full Portfolio Snapshot",
    summary: "Exported the quarterly portfolio snapshot to PDF for the SASC briefing.",
    changes: [],
  },
  {
    id: "AUD-2036",
    timestamp: "2026-08-29 14:18Z",
    actor: "System",
    actorRole: "Automated Scoring",
    action: "Created",
    entityId: "PRG-220",
    entityName: "AI-Enabled Joint Fires Network",
    summary: "Initial score generated from 3 fused sources.",
    changes: [
      { field: "risk", from: "—", to: "Medium" },
      { field: "confidence", from: "—", to: "88%" },
    ],
  },
  {
    id: "AUD-2035",
    timestamp: "2026-08-28 06:17Z",
    actor: "System",
    actorRole: "Automated Scoring",
    action: "Created",
    entityId: "PRG-104",
    entityName: "Autonomous Maritime Recon System",
    summary: "Initial score generated from 3 fused sources; conflict flagged on FY27 top line.",
    changes: [
      { field: "risk", from: "—", to: "High" },
      { field: "confidence", from: "—", to: "78%" },
    ],
  },
  {
    id: "AUD-2034",
    timestamp: "2026-08-18 10:02Z",
    actor: "J. Okafor",
    actorRole: "Analyst",
    action: "Approved",
    entityId: "PRG-220",
    entityName: "AI-Enabled Joint Fires Network",
    summary: "Quarterly reviewer sign-off recorded.",
    changes: [{ field: "model.reviewer", from: "Unreviewed", to: "Reviewed — J. Okafor, 2026-08-18" }],
  },
  {
    id: "AUD-2033",
    timestamp: "2026-08-04 09:40Z",
    actor: "M. Delacroix",
    actorRole: "Senior Analyst",
    action: "Approved",
    entityId: "PRG-315",
    entityName: "Hypersonic Defense Sensors",
    summary: "Reviewed and confirmed the Medium risk tier.",
    changes: [{ field: "model.reviewer", from: "Unreviewed", to: "Reviewed — M. Delacroix, 2026-08-04" }],
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
    title: "Entity",
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
  { key: "entityId", title: "Entity ID", dataIndex: "entityId" },
  { key: "entityName", title: "Entity", dataIndex: "entityName" },
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
