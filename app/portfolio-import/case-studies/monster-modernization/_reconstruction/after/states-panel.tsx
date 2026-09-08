"use client";

/**
 * Monster-specific light-mode copy of the Component States page
 * (app/portfolio-v2/lds/states/page.tsx), forked here rather than reused
 * directly so it can render inside LdsLightEmbed's light theme without
 * touching the live /portfolio-v2/lds route. Structure and content are
 * unchanged — only the handful of hardcoded dark-mode text/border colors
 * needed light-safe replacements.
 */

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
  FileProtectOutlined,
  ReloadOutlined,
  RiseOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

type ViewState = "normal" | "loading" | "empty" | "error";

const ACTIVITY = [
  { id: 1, actor: "R. Whitfield", action: "reviewed eligibility factors for CASE-4796" },
  { id: 2, actor: "S. Boateng", action: "approved recertification for CASE-4821" },
  { id: 3, actor: "System", action: "re-scored CASE-4750 after a new document arrived" },
];

function StoryboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card title={title} style={{ minHeight: 280 }}>
      {children}
    </Card>
  );
}

export function StatesPanel() {
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
    <div style={{ padding: 24, maxWidth: 1100 }}>
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
        <StoryboardCard title="Caseload Stat">
          {state === "normal" && (
            <>
              <Statistic
                title="Active Cases"
                value={1284}
                styles={{ content: { color: "#15803d" } }}
              />
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <RiseOutlined style={{ color: "#15803d" }} />
                <span style={{ fontSize: 13, color: "#475569" }}>
                  +6.2% from last reporting period
                </span>
              </div>
            </>
          )}
          {state === "loading" && <Skeleton active title paragraph={{ rows: 2 }} />}
          {state === "empty" && <Empty description="No caseload data for this period" />}
          {state === "error" && errorBlock("Caseload Stat")}
        </StoryboardCard>

        {/* Cases requiring action */}
        <StoryboardCard title="Cases Requiring Action">
          {state === "normal" && (
            <div style={{ display: "grid" }}>
              {[
                { name: "T. Nakamura — TANF verification needed", priority: "High" },
                { name: "A. Okafor — Housing referral pending", priority: "Medium" },
                { name: "K. Vance — 30-day follow-up due", priority: "Medium" },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{ fontSize: 13 }}>
                    <FileProtectOutlined style={{ marginRight: 8, color: "#475569" }} />
                    {item.name}
                  </span>
                  <Tag color={item.priority === "High" ? "error" : "warning"} style={{ marginRight: 0 }}>
                    {item.priority}
                  </Tag>
                </div>
              ))}
            </div>
          )}
          {state === "loading" && <Skeleton active paragraph={{ rows: 4 }} />}
          {state === "empty" && <Empty description="No cases requiring action right now" />}
          {state === "error" && errorBlock("Cases Requiring Action")}
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
                    <div style={{ fontSize: 12, color: "#475569" }}>{item.action}</div>
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
