"use client";

import { Card, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useCommandPalette } from "@/components/sandbox/command-palette-provider";
import { ACTIONS, CATEGORY_ORDER, isMacPlatform } from "@/lib/sandbox-actions";

const { Title, Paragraph, Text } = Typography;

export default function CommandPalettePage() {
  const { openPalette } = useCommandPalette();
  const shortcutLabel = isMacPlatform() ? "⌘K" : "Ctrl+K";

  return (
    <div style={{ padding: 32, maxWidth: 900, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Command Palette
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        Press <Text keyboard>{shortcutLabel}</Text> or <Text keyboard>/</Text> from{" "}
        <strong>any</strong> sandbox page to open the palette — it&apos;s mounted once at the
        sandbox layout level. Use <Text keyboard>↑</Text> <Text keyboard>↓</Text> to move,{" "}
        <Text keyboard>Enter</Text> to run, <Text keyboard>Esc</Text> to close. See{" "}
        <Text code>/sandbox/keyboard-shortcuts</Text> for the full reference.
      </Paragraph>

      <Card
        hoverable
        onClick={openPalette}
        style={{ marginBottom: 32, cursor: "pointer" }}
        styles={{ body: { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px" } }}
      >
        <SearchOutlined style={{ color: "rgba(255,255,255,0.45)" }} />
        <Text type="secondary" style={{ flex: 1 }}>
          Search actions and pages…
        </Text>
        <Text keyboard>{shortcutLabel}</Text>
      </Card>

      <Title level={4}>Available commands</Title>
      <div style={{ display: "grid", gap: 12 }}>
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {category}
            </Text>
            <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
              {ACTIONS.filter((a) => a.category === category).map((action) => (
                <div
                  key={action.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ color: "#10b981" }}>{action.icon}</span>
                  <span style={{ flex: 1 }}>{action.label}</span>
                  {action.shortcut && <Text keyboard>{action.shortcut}</Text>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
