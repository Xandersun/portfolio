"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

import { useCommandPalette } from "@/components/sandbox/command-palette-provider";
import { useSandboxNotify } from "@/components/sandbox/notification-provider";
import { ACTIONS, CATEGORY_ORDER, getActionById, isMacPlatform } from "@/lib/sandbox-actions";

const { Title, Paragraph, Text } = Typography;

interface GlobalBinding {
  keys: string[];
  description: string;
  trigger: (ctx: { openPalette: () => void; router: ReturnType<typeof useRouter>; notify: ReturnType<typeof useSandboxNotify> }) => void;
  scope: "Suite-wide" | "Inside palette";
}

const GLOBAL_BINDINGS: GlobalBinding[] = [
  {
    keys: ["⌘K / Ctrl K"],
    description: "Toggle the command palette",
    scope: "Suite-wide",
    trigger: ({ openPalette }) => openPalette(),
  },
  {
    keys: ["/"],
    description: "Open the command palette (ignored while typing in a field)",
    scope: "Suite-wide",
    trigger: ({ openPalette }) => openPalette(),
  },
  {
    keys: ["Alt N"],
    description: "Run “New Program Intake” directly, no palette needed",
    scope: "Suite-wide",
    trigger: ({ router, notify }) => getActionById("action-new-intake")?.run({ router, notify }),
  },
  {
    keys: ["↑", "↓"],
    description: "Move the highlighted row while the palette is open",
    scope: "Inside palette",
    trigger: ({ openPalette }) => openPalette(),
  },
  {
    keys: ["Enter"],
    description: "Run the highlighted command",
    scope: "Inside palette",
    trigger: ({ openPalette }) => openPalette(),
  },
  {
    keys: ["Esc"],
    description: "Close the palette",
    scope: "Inside palette",
    trigger: ({ openPalette }) => openPalette(),
  },
];

function KeyChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 4,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 12,
        padding: "2px 8px",
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      {label}
    </span>
  );
}

export default function KeyboardShortcutsPage() {
  const router = useRouter();
  const notify = useSandboxNotify();
  const { openPalette } = useCommandPalette();
  const shortcutLabel = isMacPlatform() ? "⌘K" : "Ctrl K";

  return (
    <div style={{ padding: 32, maxWidth: 980, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Keyboard Shortcuts
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        Every shortcut available across the sandbox suite. &ldquo;Suite-wide&rdquo; bindings work
        from any sandbox page right now — try pressing <Text keyboard>{shortcutLabel}</Text> while
        reading this. Click <Text keyboard>Trigger</Text> on any row to fire it without touching
        the keyboard.
      </Paragraph>

      <Title level={4}>Global bindings</Title>
      <div style={{ display: "grid", gap: 8, marginBottom: 32 }}>
        {GLOBAL_BINDINGS.map((binding) => (
          <Card key={binding.description} styles={{ body: { padding: "12px 16px" } }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", gap: 4, minWidth: 96 }}>
                {binding.keys.map((k) => (
                  <KeyChip key={k} label={k} />
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <Text style={{ display: "block" }}>{binding.description}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {binding.scope}
                </Text>
              </div>
              <Button
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => binding.trigger({ openPalette, router, notify })}
              >
                Trigger
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Title level={4}>All commands</Title>
      <Paragraph type="secondary" style={{ marginTop: -8, marginBottom: 16 }}>
        Reachable via the command palette; a few also have a direct shortcut.
      </Paragraph>
      <div style={{ display: "grid", gap: 20 }}>
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
                  <span style={{ flex: 1 }}>
                    <Text style={{ display: "block" }}>{action.label}</Text>
                    {action.description && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {action.description}
                      </Text>
                    )}
                  </span>
                  {action.shortcut && <KeyChip label={action.shortcut} />}
                  <Button size="small" onClick={() => action.run({ router, notify })}>
                    Run
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
