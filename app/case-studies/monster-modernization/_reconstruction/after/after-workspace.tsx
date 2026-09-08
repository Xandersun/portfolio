"use client";

import { useState } from "react";
import { Alert, Badge, Button, Descriptions, Empty, Steps, Table, Tabs, Tag, Timeline, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useSandboxNotify } from "../../_living-system/monster-notification-provider";

import type { DocumentItem, CaseRecord, ReferralItem, TaskItem } from "../types";

const { Text, Paragraph } = Typography;

const DOC_STATUS_TAG: Record<DocumentItem["status"], { color: string; label: string }> = {
  received: { color: "success", label: "Received" },
  outstanding: { color: "error", label: "Outstanding" },
  "due-soon": { color: "warning", label: "Due Soon" },
  "not-yet-due": { color: "default", label: "Not Yet Due" },
};

const REFERRAL_STATUS_TAG: Record<ReferralItem["status"], { color: string; label: string }> = {
  completed: { color: "success", label: "Completed" },
  "on-hold": { color: "warning", label: "On Hold" },
  scheduled: { color: "processing", label: "Scheduled" },
};

const TASK_STATUS_TAG: Record<TaskItem["status"], { color: string; label: string }> = {
  completed: { color: "success", label: "Done" },
  overdue: { color: "error", label: "Overdue" },
  open: { color: "processing", label: "Open" },
};

/**
 * Customer-level navigation: four grouped destinations (Summary /
 * Eligibility & Documents / Referrals & Services / History) instead of
 * Before's eight flat tabs — the same consolidation principle from the
 * 16→6 information-architecture section, applied at this scale. Nested
 * navigation is the Documents/Referrals tables' expandable rows; tertiary
 * navigation is the Activity/Notes/Related split inside History.
 *
 * Rendered with `key={record.caseId}` by AfterApp so switching between
 * Marisol Vega and Anna Kowalski resets this component's local demo
 * state (task completion) cleanly instead of leaking between cases.
 */
export function AfterWorkspace({
  record,
  onOpenInspector,
  hideAttentionCallouts = false,
}: {
  record: CaseRecord;
  onOpenInspector: () => void;
  /** Omits the "Needs Attention" alerts entirely (used only by the Living System accordion's Case Workspace demo, which showcases the workspace content on its own, not the attention/inspector interaction) — default false preserves the full Interactive Reconstruction's existing behavior. */
  hideAttentionCallouts?: boolean;
}) {
  const notify = useSandboxNotify();
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});

  const effectiveTasks = record.tasks.map((t) => (completedOverrides[t.id] ? { ...t, status: "completed" as const } : t));

  const markComplete = (task: TaskItem) => {
    setCompletedOverrides((prev) => ({ ...prev, [task.id]: true }));
    notify("success", "Task completed", `"${task.label}" marked complete.`);
  };

  const documentColumns: ColumnsType<DocumentItem> = [
    { title: "Document", dataIndex: "label", key: "label" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: DocumentItem["status"]) => <Tag color={DOC_STATUS_TAG[status].color}>{DOC_STATUS_TAG[status].label}</Tag>,
    },
    { title: "Due", dataIndex: "dueDate", key: "dueDate", width: 100, render: (v) => v ?? "—" },
  ];

  const referralColumns: ColumnsType<ReferralItem> = [
    { title: "Provider", dataIndex: "provider", key: "provider" },
    { title: "Service", dataIndex: "service", key: "service" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: ReferralItem["status"]) => <Tag color={REFERRAL_STATUS_TAG[status].color}>{REFERRAL_STATUS_TAG[status].label}</Tag>,
    },
  ];

  const taskColumns: ColumnsType<TaskItem> = [
    { title: "Task", dataIndex: "label", key: "label" },
    { title: "Assignee", dataIndex: "assignee", key: "assignee", width: 130 },
    { title: "Due", dataIndex: "dueDate", key: "dueDate", width: 90 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: TaskItem["status"]) => <Tag color={TASK_STATUS_TAG[status].color}>{TASK_STATUS_TAG[status].label}</Tag>,
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_, task) =>
        task.status !== "completed" ? (
          <Button size="small" onClick={() => markComplete(task)}>
            Mark Complete
          </Button>
        ) : null,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="summary"
      tabBarStyle={{ paddingInline: 20, marginBottom: 0 }}
      items={[
        {
          key: "summary",
          label: "Summary",
          children: (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
              <Steps
                size="small"
                current={record.milestones.findIndex((m) => m.status === "current")}
                items={record.milestones.map((m) => ({ title: m.label }))}
              />

              {!hideAttentionCallouts && (
                <div>
                  <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" }}>
                    Needs Attention
                  </Text>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    {record.attentionItems.length === 0 ? (
                      <Alert type="success" showIcon title="Nothing needs attention on this case right now." />
                    ) : (
                      record.attentionItems.map((item) => (
                        <Alert
                          key={item.id}
                          type="error"
                          showIcon
                          title={item.label}
                          description={item.detail}
                          action={
                            item.linkedDocumentId ? (
                              <Button size="small" danger onClick={onOpenInspector}>
                                Investigate
                              </Button>
                            ) : undefined
                          }
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="Program">{record.program}</Descriptions.Item>
                <Descriptions.Item label="Eligibility Status">{record.eligibilityStatus}</Descriptions.Item>
                <Descriptions.Item label="Assigned Worker">{record.assignedWorker}</Descriptions.Item>
                <Descriptions.Item label="Supporting Staff">{record.supportingStaff}</Descriptions.Item>
                <Descriptions.Item label="Next Action" span={2}>
                  {record.nextAction}
                </Descriptions.Item>
                <Descriptions.Item label={record.eligibilityDeadline.label} span={2}>
                  {record.eligibilityDeadline.date} — {record.eligibilityDeadline.note}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ),
        },
        {
          key: "eligibility",
          label: "Eligibility & Documents",
          children: (
            <div style={{ padding: 20 }}>
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                {record.eligibilityDeadline.label}: <Text strong>{record.eligibilityDeadline.date}</Text> — {record.eligibilityDeadline.note}.
                Expand a document below for its request history and what it's blocking.
              </Paragraph>
              <Table<DocumentItem>
                size="small"
                rowKey="id"
                columns={documentColumns}
                dataSource={record.documents}
                pagination={false}
                locale={{ emptyText: <Empty description="No documents on file" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                expandable={{
                  expandedRowRender: (doc) => (
                    <div style={{ fontSize: 13 }}>
                      {doc.requestedDate && <div>Requested {doc.requestedDate}</div>}
                      {doc.receivedDate && <div>Received {doc.receivedDate}</div>}
                      {doc.status === "outstanding" && (
                        <Text type="danger">Blocking the eligibility determination and the training referral.</Text>
                      )}
                      {doc.status === "due-soon" && <Text type="warning">Due soon — no downstream impact yet.</Text>}
                    </div>
                  ),
                  defaultExpandedRowKeys: ["income"],
                }}
              />
            </div>
          ),
        },
        {
          key: "referrals",
          label: "Referrals & Services",
          children: (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" }}>
                  Referrals
                </Text>
                {record.referrals.length === 0 ? (
                  <Empty style={{ marginTop: 12 }} description="No referrals on this case" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <Table<ReferralItem>
                    size="small"
                    rowKey="id"
                    style={{ marginTop: 8 }}
                    columns={referralColumns}
                    dataSource={record.referrals}
                    pagination={false}
                    expandable={{
                      rowExpandable: (r) => Boolean(r.note),
                      expandedRowRender: (r) => <Text type="warning">{r.note}</Text>,
                    }}
                  />
                )}
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" }}>
                  Tasks
                </Text>
                {effectiveTasks.length === 0 ? (
                  <Empty style={{ marginTop: 12 }} description="No open tasks" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <Table<TaskItem> size="small" rowKey="id" style={{ marginTop: 8 }} columns={taskColumns} dataSource={effectiveTasks} pagination={false} />
                )}
              </div>
            </div>
          ),
        },
        {
          key: "history",
          label: "History",
          children: (
            <div style={{ padding: 20 }}>
              <Tabs
                size="small"
                defaultActiveKey="activity"
                items={[
                  {
                    key: "activity",
                    label: "Activity",
                    children:
                      record.activity.length === 0 ? (
                        <Empty style={{ marginTop: 12 }} description="No activity yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      ) : (
                        <Timeline
                          style={{ marginTop: 12 }}
                          items={record.activity.map((entry) => ({
                            content: (
                              <div>
                                <Text style={{ fontSize: 13 }}>{entry.description}</Text>
                                <div>
                                  <Text type="secondary" style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                                    {entry.date} · {entry.actor}
                                  </Text>
                                </div>
                              </div>
                            ),
                          }))}
                        />
                      ),
                  },
                  {
                    key: "notes",
                    label: "Case Notes",
                    children:
                      record.notes.length === 0 ? (
                        <Empty style={{ marginTop: 12 }} description="No case notes on file" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      ) : (
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
                          {[...record.notes].reverse().map((note) => (
                            <div key={note.id}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {note.author} · {note.date}
                              </Text>
                              <Paragraph style={{ marginBottom: 0, marginTop: 2 }}>{note.body}</Paragraph>
                            </div>
                          ))}
                        </div>
                      ),
                  },
                  {
                    key: "related",
                    label: "Related Records",
                    children: (
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                        {record.relatedRecords.length === 0 ? (
                          <Empty description="No related records" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        ) : (
                          record.relatedRecords.map((rec) => (
                            <div key={rec.label}>
                              <Text strong style={{ fontSize: 13 }}>
                                {rec.label}
                              </Text>
                              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                {rec.description}
                              </Paragraph>
                            </div>
                          ))
                        )}
                        <Badge status="processing" text={<Text type="secondary">{record.supportingStaff}</Text>} />
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
