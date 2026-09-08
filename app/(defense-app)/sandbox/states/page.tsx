"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Result,
  Segmented,
  Skeleton,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

type ViewState = "normal" | "loading" | "empty" | "error";

const ACTIVITY = [
  { id: 1, actor: "J. Okafor", action: "reviewed risk drivers for PRG-220" },
  { id: 2, actor: "M. Delacroix", action: "approved CPARS update for PRG-315" },
  { id: 3, actor: "System", action: "re-scored PRG-104 after new citation" },
];

function StoryboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card title={title} style={{ minHeight: 280 }}>
      {children}
    </Card>
  );
}

export default function StatesPage() {
  const [state, setState] = useState<ViewState>("normal");
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setState("normal");
    }, 1400);
  };

  const errorBlock = (label: string) =>
    retrying ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
        <Spin description="Retrying…">
          <div style={{ width: 120, height: 40 }} />
        </Spin>
      </div>
    ) : (
      <Result
        status="error"
        title="Failed to load"
        subTitle={`Could not fetch ${label.toLowerCase()}.`}
        extra={
          <Button icon={<ReloadOutlined />} onClick={handleRetry}>
            Retry
          </Button>
        }
      />
    );

  return (
    <div style={{ padding: 32, maxWidth: 1100, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Component States
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Toggle the same three components through Normal, Loading, Empty, and Error — Error includes
        a real interactive retry that resolves back to Normal.
      </Paragraph>

      <Segmented
        value={state}
        onChange={(v) => setState(v as ViewState)}
        options={[
          { label: "Normal", value: "normal" },
          { label: "Loading Skeleton", value: "loading" },
          { label: "Empty", value: "empty" },
          { label: "Error", value: "error" },
        ]}
        style={{ marginBottom: 20 }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {/* Stat card */}
        <StoryboardCard title="Portfolio Stat">
          {state === "normal" && (
            <>
              <Statistic
                title="Tracked Portfolio Value"
                value={4.97}
                suffix="B"
                prefix="$"
                styles={{ content: { color: "#10b981" } }}
              />
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <RiseOutlined style={{ color: "#10b981" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  +12.4% from previous fiscal baseline
                </span>
              </div>
            </>
          )}
          {state === "loading" && <Skeleton active title paragraph={{ rows: 2 }} />}
          {state === "empty" && <Empty description="No portfolio data for this period" />}
          {state === "error" && errorBlock("Portfolio Stat")}
        </StoryboardCard>

        {/* Program list */}
        <StoryboardCard title="Program Watchlist">
          {state === "normal" && (
            <div style={{ display: "grid" }}>
              {[
                { name: "Autonomous Maritime Recon System", risk: "High" },
                { name: "Hypersonic Defense Sensors", risk: "Medium" },
                { name: "AI-Enabled Joint Fires Network", risk: "Medium" },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: 13 }}>
                    <SafetyCertificateOutlined style={{ marginRight: 8, color: "rgba(255,255,255,0.45)" }} />
                    {item.name}
                  </span>
                  <Tag color={item.risk === "High" ? "error" : "warning"} style={{ marginRight: 0 }}>
                    {item.risk}
                  </Tag>
                </div>
              ))}
            </div>
          )}
          {state === "loading" && <Skeleton active paragraph={{ rows: 4 }} />}
          {state === "empty" && <Empty description="No flagged programs right now" />}
          {state === "error" && errorBlock("Program Watchlist")}
        </StoryboardCard>

        {/* Activity feed */}
        <StoryboardCard title="Recent Activity">
          {state === "normal" && (
            <div style={{ display: "grid", gap: 12 }}>
              {ACTIVITY.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <div>
                    <div style={{ fontSize: 13 }}>{item.actor}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{item.action}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {state === "loading" && (
            <div style={{ display: "grid", gap: 16 }}>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          )}
          {state === "empty" && <Empty description="No recent activity" />}
          {state === "error" && errorBlock("Recent Activity")}
        </StoryboardCard>
      </div>
    </div>
  );
}
