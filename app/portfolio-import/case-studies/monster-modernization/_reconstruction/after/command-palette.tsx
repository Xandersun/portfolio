"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppstoreOutlined, SearchOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Modal, Typography } from "antd";
import type { InputRef } from "antd";

const { Text } = Typography;

/**
 * A small, Monster-scoped command palette — same visual/interaction
 * pattern as the Living Design System's own command palette
 * (components/sandbox/command-palette-modal.tsx: grouped list, arrow-key
 * navigation, active-row highlight, footer key hints) rebuilt with its
 * own action list rather than reusing that component directly, since its
 * actions are hardcoded to the defense-analytics sandbox routes
 * (lib/sandbox-actions.tsx). Deliberately NOT bound to a global window
 * keydown listener — Ctrl/Cmd+K only fires while focus is inside this
 * reconstruction, so it can't hijack the shortcut on the rest of the
 * portfolio page. A visible trigger button covers discoverability.
 */
export interface PaletteAction {
  id: string;
  label: string;
  description?: string;
  category: string;
  icon: React.ReactNode;
  run: () => void;
}

export function useMonsterCommandPalette(actions: PaletteAction[]) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return { open, setOpen, containerRef, onKeyDownCapture, actions };
}

export function MonsterCommandPalette({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: PaletteAction[];
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<InputRef>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return actions.filter((a) => (q.length === 0 ? true : a.label.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)));
  }, [actions, query]);

  const grouped = useMemo(() => {
    const categories = Array.from(new Set(filtered.map((a) => a.category)));
    return categories.map((category) => ({ category, items: filtered.filter((a) => a.category === category) }));
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const run = (action: PaletteAction) => {
    onClose();
    action.run();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) run(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} closable={false} width={480} style={{ top: 100 }} styles={{ body: { padding: 0 } }} destroyOnHidden>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>
        <Input
          ref={inputRef}
          variant="borderless"
          size="large"
          prefix={<SearchOutlined style={{ color: "#475569" }} />}
          placeholder="Jump to a case or view…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div style={{ maxHeight: 300, overflowY: "auto", padding: 6 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <Text type="secondary">No matches</Text>
          </div>
        )}
        {grouped.map((group) => (
          <div key={group.category} style={{ marginBottom: 4 }}>
            <Text type="secondary" style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, padding: "6px 10px", color: "#475569" }}>
              {group.category}
            </Text>
            {group.items.map((action) => {
              const index = filtered.indexOf(action);
              return (
                <div
                  key={action.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => run(action)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: index === activeIndex ? "#F0FDFA" : "transparent",
                  }}
                >
                  <span style={{ color: index === activeIndex ? "#115e59" : "#475569", fontSize: 15 }}>{action.icon}</span>
                  <span style={{ flex: 1 }}>
                    <Text style={{ display: "block", color: index === activeIndex ? "#115e59" : "#0F172A" }}>{action.label}</Text>
                    {action.description && (
                      <Text type="secondary" style={{ fontSize: 12, color: "#475569" }}>
                        {action.description}
                      </Text>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, padding: "8px 14px", borderTop: "1px solid #E2E8F0", fontSize: 12, color: "#475569" }}>
        <span>
          <Text keyboard>↑</Text> <Text keyboard>↓</Text> navigate
        </span>
        <span>
          <Text keyboard>↵</Text> select
        </span>
        <span>
          <Text keyboard>esc</Text> close
        </span>
      </div>
    </Modal>
  );
}

export const PALETTE_ICONS = { app: <AppstoreOutlined />, user: <UserOutlined />, team: <TeamOutlined /> };
