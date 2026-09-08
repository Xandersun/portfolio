"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Modal, Typography } from "antd";
import type { InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useSandboxNotify } from "@/components/sandbox/notification-provider";
import { ACTIONS, CATEGORY_ORDER, type CommandAction } from "@/lib/sandbox-actions";

const { Text } = Typography;

/**
 * @design-spec Command palette modal.
 * Width: 560px · Top offset: 100px · Row height: ~37px (9px vertical padding)
 * · Active row bg: rgba(16,185,129,0.14) · Active icon: #10b981 · List max
 * height: 360px · Footer hint bar: 12px / rgba(255,255,255,0.45).
 */
export function CommandPaletteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const notify = useSandboxNotify();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<InputRef>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = ACTIONS.filter((a) =>
      q.length === 0
        ? true
        : a.label.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q),
    );
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: matches.filter((a) => a.category === category),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const flatItems = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // antd Modal mounts asynchronously; defer focus one tick.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const runAction = (action: CommandAction) => {
    onClose();
    action.run({ router, notify });
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = flatItems[activeIndex];
      if (target) runAction(target);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={560}
      style={{ top: 100 }}
      styles={{ body: { padding: 0 } }}
      destroyOnHidden
    >
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Input
          ref={inputRef}
          variant="borderless"
          size="large"
          prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
          placeholder="Type a command or search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      <div ref={listRef} style={{ maxHeight: 360, overflowY: "auto", padding: 6 }}>
        {flatItems.length === 0 && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <Text type="secondary">No commands match &ldquo;{query}&rdquo;</Text>
          </div>
        )}
        {filtered.map((group) => (
          <div key={group.category} style={{ marginBottom: 4 }}>
            <Text
              type="secondary"
              style={{
                display: "block",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                padding: "6px 10px",
              }}
            >
              {group.category}
            </Text>
            {group.items.map((action) => {
              const index = flatItems.indexOf(action);
              const active = index === activeIndex;
              return (
                <div
                  key={action.id}
                  data-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runAction(action)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: active ? "rgba(16, 185, 129, 0.14)" : "transparent",
                  }}
                >
                  <span style={{ color: active ? "#10b981" : "rgba(255,255,255,0.65)", fontSize: 15 }}>
                    {action.icon}
                  </span>
                  <span style={{ flex: 1 }}>
                    <Text style={{ display: "block" }}>{action.label}</Text>
                    {action.description && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {action.description}
                      </Text>
                    )}
                  </span>
                  {action.shortcut && <Text keyboard>{action.shortcut}</Text>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "8px 14px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
        }}
      >
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
