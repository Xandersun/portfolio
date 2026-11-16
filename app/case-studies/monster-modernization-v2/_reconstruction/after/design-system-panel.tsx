"use client";

/**
 * Monster-specific light-mode copy of the Design System page
 * (app/portfolio-v2/lds/design-system/page.tsx), forked here rather than
 * reused directly so it can render inside LdsLightEmbed's light theme
 * without touching the live /portfolio-v2/lds route. Structure and
 * content are unchanged — only the one hardcoded dark-mode swatch border
 * needed a light-safe replacement.
 */

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Skeleton,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  HeartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { useToken } = theme;

function SectionTitle({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Title level={3} style={{ marginBottom: 4 }}>
        {children}
      </Title>
      {description && (
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {description}
        </Paragraph>
      )}
    </div>
  );
}

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: 168 }}>
      <div
        style={{
          height: 64,
          borderRadius: 8,
          background: value,
          border: "1px solid #E2E8F0",
        }}
      />
      <div style={{ marginTop: 8 }}>
        <Text style={{ display: "block", fontSize: 13, fontWeight: 500 }}>{label}</Text>
        <Text type="secondary" style={{ fontSize: 12, fontFamily: "var(--font-geist-mono)" }}>
          {value}
        </Text>
      </div>
    </div>
  );
}

const BUTTON_TYPES = ["primary", "default", "dashed", "text", "link"] as const;

export function DesignSystemPanel() {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const semanticColors = [
    { label: "colorPrimary", value: token.colorPrimary },
    { label: "colorSuccess", value: token.colorSuccess },
    { label: "colorWarning", value: token.colorWarning },
    { label: "colorError", value: token.colorError },
    { label: "colorInfo", value: token.colorInfo },
  ];

  const surfaceColors = [
    { label: "colorBgLayout", value: token.colorBgLayout },
    { label: "colorBgContainer", value: token.colorBgContainer },
    { label: "colorBgElevated", value: token.colorBgElevated },
    { label: "colorBorder", value: token.colorBorder },
    { label: "colorBorderSecondary", value: token.colorBorderSecondary },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Design System
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        Live reference for typography, color tokens (read directly from{" "}
        <Text code>theme.useToken()</Text>), button states, and card containers.
      </Paragraph>

      {/* Typography */}
      <SectionTitle description="antd Typography components at each heading level, plus text variants.">
        Typography
      </SectionTitle>
      <Card style={{ marginBottom: 40 }}>
        <Title level={1} style={{ marginTop: 0 }}>
          Heading 1 — Eligibility Intelligence
        </Title>
        <Title level={2}>Heading 2 — Caseload Overview</Title>
        <Title level={3}>Heading 3 — Section Title</Title>
        <Title level={4}>Heading 4 — Subsection</Title>
        <Title level={5}>Heading 5 — Minor Label</Title>
        <Paragraph>
          Body paragraph text. Verification documents are cross-referenced against structured and
          unstructured records to produce a defensible eligibility-confidence score for every
          active case.
        </Paragraph>
        <Space size="middle" wrap>
          <Text>Default text</Text>
          <Text type="secondary">Secondary text</Text>
          <Text type="success">Success text</Text>
          <Text type="warning">Warning text</Text>
          <Text type="danger">Danger text</Text>
          <Text disabled>Disabled text</Text>
          <Text mark>Marked text</Text>
          <Text underline>Underlined</Text>
          <Text delete>Deleted</Text>
          <Text strong>Strong</Text>
          <Text italic>Italic</Text>
          <Text code>Inline code</Text>
        </Space>
      </Card>

      {/* Color tokens */}
      <SectionTitle description="Actual resolved values from the active ConfigProvider theme — not hardcoded hex.">
        Color Tokens
      </SectionTitle>
      <Card style={{ marginBottom: 40 }}>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          Semantic
        </Text>
        <Space size={16} wrap style={{ marginBottom: 24 }}>
          {semanticColors.map((c) => (
            <ColorSwatch key={c.label} {...c} />
          ))}
        </Space>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          Surface
        </Text>
        <Space size={16} wrap>
          {surfaceColors.map((c) => (
            <ColorSwatch key={c.label} {...c} />
          ))}
        </Space>
      </Card>

      {/* Buttons */}
      <SectionTitle description="Every button type across default, disabled, and loading states.">
        Buttons
      </SectionTitle>
      <Card style={{ marginBottom: 40 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 12px", color: token.colorTextSecondary }}>
                  Type
                </th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: token.colorTextSecondary }}>
                  Default
                </th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: token.colorTextSecondary }}>
                  With Icon
                </th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: token.colorTextSecondary }}>
                  Disabled
                </th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: token.colorTextSecondary }}>
                  Loading
                </th>
              </tr>
            </thead>
            <tbody>
              {BUTTON_TYPES.map((type) => (
                <tr key={type} style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{type}</td>
                  <td style={{ padding: "12px" }}>
                    <Button type={type}>Button</Button>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Button type={type} icon={<DownloadOutlined />}>
                      Export
                    </Button>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Button type={type} disabled>
                      Button
                    </Button>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Button type={type} loading>
                      Loading
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Divider style={{ margin: "20px 0" }} />
        <Space align="center">
          <Button type="primary" icon={<HeartOutlined />} loading={loading} onClick={handleLoadingDemo}>
            {loading ? "Submitting…" : "Click to simulate async loading"}
          </Button>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Real click-driven state, not just the static <Text code>loading</Text> prop.
          </Text>
        </Space>
      </Card>

      {/* Cards */}
      <SectionTitle description="Bordered, hoverable, loading-skeleton, and status-accented card variants.">
        Cards
      </SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        <Card title="Bordered Card" variant="outlined">
          <Paragraph style={{ marginBottom: 0 }}>
            Standard bordered container for grouping related content.
          </Paragraph>
        </Card>

        <Card title="Hoverable Card" hoverable>
          <Paragraph style={{ marginBottom: 0 }}>
            Lifts slightly on hover — try moving your cursor over this card.
          </Paragraph>
        </Card>

        <Card title="Loading Skeleton">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>

        <Card
          title={
            <Space>
              <CheckCircleOutlined style={{ color: token.colorSuccess }} />
              Status Card
            </Space>
          }
          extra={<Tag color="success">Low Priority</Tag>}
        >
          <Paragraph style={{ marginBottom: 0 }}>
            Cards commonly pair a header icon with a status tag for at-a-glance triage.
          </Paragraph>
        </Card>
      </div>

      <Alert
        style={{ marginTop: 32 }}
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        title="This page reads its palette live from ConfigProvider"
        description="Changing the theme token object in LdsLightEmbed updates every swatch and component on this page automatically."
      />
    </div>
  );
}
