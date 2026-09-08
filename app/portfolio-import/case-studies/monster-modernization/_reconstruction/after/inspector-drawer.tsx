"use client";

import { useState } from "react";
import { Button, Descriptions, Drawer, Tabs, Tag, Timeline, Typography } from "antd";

import { useSandboxNotify } from "../../_living-system/monster-notification-provider";

import type { CaseRecord } from "../types";

const { Text, Paragraph } = Typography;

/**
 * "Go deeper without losing your place" — the historical principle from
 * the case study, demonstrated with the same Drawer + Descriptions + Tabs
 * pattern as the Living Design System's own Split-Screen Inspector
 * (app/portfolio-v2/lds/split-screen/page.tsx), not a one-off panel. The
 * shell (sidebar, breadcrumb, workspace) stays mounted behind it — this
 * is the current reconstruction's implementation of that principle, not
 * a claim that Monster's production UI used this exact side-drawer.
 */
export function InspectorDrawer({
  record,
  open,
  onClose,
  inline = false,
}: {
  record: CaseRecord;
  open: boolean;
  onClose: () => void;
  /** Renders in place (no fixed overlay/mask) inside a positioned container, for showing the inspector "already open" alongside other content rather than as a full-viewport slide-out. */
  inline?: boolean;
}) {
  const notify = useSandboxNotify();
  const [reminderSent, setReminderSent] = useState(false);

  const document = record.documents.find((d) => d.id === "income")!;
  const referral = record.referrals.find((r) => r.blockedByDocumentId === "income")!;
  const task = record.tasks.find((t) => t.label.toLowerCase().includes("income"));
  const note = record.notes.find((n) => n.body.toLowerCase().includes("voicemail")) ?? record.notes[record.notes.length - 1];

  const handleSendReminder = () => {
    setReminderSent(true);
    notify("success", "Reminder sent", `A document reminder was sent to ${record.participantName}.`);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={480}
      getContainer={inline ? false : undefined}
      mask={!inline}
      rootStyle={inline ? { position: "absolute" } : undefined}
      title={
        <div>
          <Text type="secondary" style={{ fontSize: 12, fontFamily: "var(--font-geist-mono)" }}>
            {record.caseId}
          </Text>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{record.participantName}</div>
        </div>
      }
      destroyOnHidden
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 20 }}>
        <Descriptions.Item label="Outstanding Document">
          {document.label} <Tag color="error">Outstanding</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Requested / Due">
          {document.requestedDate} → {document.dueDate}
        </Descriptions.Item>
        <Descriptions.Item label="Blocked Referral">
          {referral.provider} <Tag color="warning">On Hold</Tag>
        </Descriptions.Item>
        {task && (
          <Descriptions.Item label="Related Task">
            {task.label} <Tag color={task.status === "overdue" ? "error" : "processing"}>{task.status === "overdue" ? "Overdue" : "Open"}</Tag>
          </Descriptions.Item>
        )}
        <Descriptions.Item label={record.eligibilityDeadline.label}>
          {record.eligibilityDeadline.date} — {record.eligibilityDeadline.note}
        </Descriptions.Item>
      </Descriptions>

      <Tabs
        defaultActiveKey="details"
        items={[
          {
            key: "details",
            label: "Details",
            children: (
              <div>
                <Paragraph>
                  <Text strong>{document.label}</Text> is 36 days past due. Until it's received, the eligibility
                  determination cannot be finalized, which is why <Text strong>{referral.provider}</Text> ({referral.service})
                  remains on hold.
                </Paragraph>
                <Paragraph type="secondary" style={{ fontStyle: "italic" }}>{referral.note}</Paragraph>
                {note && (
                  <>
                    <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" }}>
                      Case Note
                    </Text>
                    <Paragraph style={{ marginTop: 4 }}>{note.body}</Paragraph>
                  </>
                )}
              </div>
            ),
          },
          {
            key: "related",
            label: "Related",
            children: (
              <div style={{ display: "grid", gap: 10 }}>
                {record.relatedRecords.map((rec) => (
                  <div key={rec.label} style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Text strong style={{ fontSize: 13 }}>
                      {rec.label}
                    </Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {rec.description}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
          {
            key: "history",
            label: "History",
            children: (
              <Timeline
                items={record.activity.slice(-4).map((entry) => ({
                  content: (
                    <div>
                      <Text style={{ fontSize: 13 }}>{entry.description}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                          {entry.date}
                        </Text>
                      </div>
                    </div>
                  ),
                }))}
              />
            ),
          },
        ]}
      />

      <Button type="primary" block disabled={reminderSent} onClick={handleSendReminder} style={{ marginTop: 20 }}>
        {reminderSent ? "Reminder Sent" : "Send Document Reminder"}
      </Button>
    </Drawer>
  );
}
