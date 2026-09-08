"use client";

import { useState } from "react";
import { Badge, Descriptions, Drawer, Empty, Table, Tabs, Tag, Timeline, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { programs, type Program, type RiskTier } from "@/lib/programs";

const { Title, Paragraph, Text } = Typography;

const RISK_COLOR: Record<RiskTier, string> = { Low: "success", Medium: "warning", High: "error" };

const columns: ColumnsType<Program> = [
  { title: "ID", dataIndex: "id", key: "id", width: 110 },
  { title: "Program Name", dataIndex: "name", key: "name" },
  { title: "Agency", dataIndex: "agency", key: "agency", width: 170 },
  { title: "FY27 Request", dataIndex: "budget", key: "budget", width: 120 },
  {
    title: "Risk Tier",
    dataIndex: "risk",
    key: "risk",
    width: 110,
    render: (risk: RiskTier) => <Tag color={RISK_COLOR[risk]}>{risk}</Tag>,
  },
  { title: "AI Confidence", dataIndex: "confidence", key: "confidence", width: 120, render: (v) => `${v}%` },
];

export default function SplitScreenPage() {
  const [selected, setSelected] = useState<Program | null>(null);

  return (
    <div style={{ padding: 32, maxWidth: 1100, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Split-Screen Inspector
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Click any row to slide out a rich context inspection drawer from the right.
      </Paragraph>

      <Table<Program>
        columns={columns}
        dataSource={programs}
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
              <div style={{ fontSize: 16, fontWeight: 600 }}>{selected.name}</div>
            </div>
          )
        }
        destroyOnHidden
      >
        {selected && (
          <>
            <Descriptions column={1} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Agency">{selected.agency}</Descriptions.Item>
              <Descriptions.Item label="FY27 Request">{selected.budget}</Descriptions.Item>
              <Descriptions.Item label="Risk Tier">
                <Tag color={RISK_COLOR[selected.risk]}>{selected.risk}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="AI Confidence">
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
                  key: "drivers",
                  label: `Risk Drivers (${selected.drivers.length})`,
                  children: (
                    <div style={{ display: "grid", gap: 10 }}>
                      {selected.drivers.map((driver) => (
                        <div
                          key={driver.label}
                          style={{
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <Text strong style={{ fontSize: 13 }}>
                              {driver.label}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "var(--font-geist-mono)",
                                color: driver.impact > 0 ? "#f87171" : "#34d399",
                              }}
                            >
                              {driver.impact > 0 ? "+" : ""}
                              {driver.impact}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {driver.detail}
                          </Text>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: "timeline",
                  label: "Provenance",
                  children: (
                    <Timeline
                      items={selected.provenance.map((step) => ({
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
        {!selected && <Empty description="No record selected" />}
      </Drawer>

      <style jsx global>{`
        .split-screen-row-active > td {
          background: rgba(16, 185, 129, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
