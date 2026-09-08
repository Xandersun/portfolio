"use client";

/**
 * portfolio-v2 / Living Design System — Split-Screen Inspector.
 * Content-only isolated copy of
 * app/(defense-app)/sandbox/split-screen/page.tsx (untouched, still serves
 * the original /sandbox): identical Table + Drawer + Tabs structure, backed
 * by lib/portfolio-v2/cases.ts (fictional social-services case data)
 * instead of lib/programs.ts.
 */

import { useState } from "react";
import { Badge, Descriptions, Drawer, Empty, Table, Tabs, Tag, Timeline, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { cases, PRIORITY_COLOR, type CaseRecord, type Priority } from "@/lib/portfolio-v2/cases";

const { Title, Paragraph, Text } = Typography;

const columns: ColumnsType<CaseRecord> = [
  { title: "Case ID", dataIndex: "id", key: "id", width: 110 },
  { title: "Participant", dataIndex: "participant", key: "participant" },
  { title: "Program", dataIndex: "program", key: "program", width: 190 },
  { title: "Assigned Worker", dataIndex: "assignedWorker", key: "assignedWorker", width: 150 },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    width: 110,
    render: (priority: Priority) => <Tag color={PRIORITY_COLOR[priority]}>{priority}</Tag>,
  },
  { title: "Confidence", dataIndex: "confidence", key: "confidence", width: 120, render: (v) => `${v}%` },
];

export default function SplitScreenPage() {
  const [selected, setSelected] = useState<CaseRecord | null>(null);

  return (
    <div style={{ padding: 32, maxWidth: 1100, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Split-Screen Inspector
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Click any row to slide out a rich case inspection drawer from the right.
      </Paragraph>

      <Table<CaseRecord>
        columns={columns}
        dataSource={cases}
        rowKey="id"
        pagination={false}
        onRow={(record) => ({
          onClick: () => setSelected(record),
          style: { cursor: "pointer" },
        })}
        rowClassName={(record) => (selected?.id === record.id ? "split-screen-row-active" : "")}
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        size={480}
        title={
          selected && (
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontFamily: "var(--font-geist-mono)" }}>
                {selected.id}
              </Text>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{selected.participant}</div>
            </div>
          )
        }
        destroyOnHidden
      >
        {selected && (
          <>
            <Descriptions column={1} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Program">{selected.program}</Descriptions.Item>
              <Descriptions.Item label="Assigned Worker">{selected.assignedWorker}</Descriptions.Item>
              <Descriptions.Item label="Case Status">{selected.caseStatus}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={PRIORITY_COLOR[selected.priority]}>{selected.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Eligibility Confidence">
                <Badge
                  status={selected.confidence >= 90 ? "success" : selected.confidence >= 80 ? "warning" : "error"}
                  text={`${selected.confidence}%`}
                />
              </Descriptions.Item>
            </Descriptions>

            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: <Paragraph>{selected.rationale}</Paragraph>,
                },
                {
                  key: "factors",
                  label: `Eligibility Factors (${selected.factors.length})`,
                  children: (
                    <div style={{ display: "grid", gap: 10 }}>
                      {selected.factors.map((factor) => (
                        <div
                          key={factor.label}
                          style={{
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <Text strong style={{ fontSize: 13 }}>
                              {factor.label}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "var(--font-geist-mono)",
                                color: factor.impact > 0 ? "#f87171" : "#34d399",
                              }}
                            >
                              {factor.impact > 0 ? "+" : ""}
                              {factor.impact}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {factor.detail}
                          </Text>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: "timeline",
                  label: "Processing Timeline",
                  children: (
                    <Timeline
                      items={selected.timeline.map((step) => ({
                        content: (
                          <div>
                            <Text strong style={{ fontSize: 13 }}>
                              {step.stage}
                            </Text>
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {step.detail}
                              </Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                              {step.at}
                            </Text>
                          </div>
                        ),
                      }))}
                    />
                  ),
                },
              ]}
            />
          </>
        )}
        {!selected && <Empty description="No case selected" />}
      </Drawer>

      <style jsx global>{`
        .split-screen-row-active > td {
          background: rgba(16, 185, 129, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
