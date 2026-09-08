"use client";

import { Button, Checkbox, Dropdown, Tooltip } from "antd";
import {
  SettingOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  MinusOutlined,
} from "@ant-design/icons";

import type { DataGridColumn } from "@/components/data-grid/types";

interface ColumnChooserProps<T> {
  columns: DataGridColumn<T>[];
  visibleKeys: Set<string>;
  onToggleVisibility: (key: string) => void;
  pinning: boolean;
  pinState: Record<string, "left" | "right" | undefined>;
  onChangePin: (key: string, pin: "left" | "right" | undefined) => void;
}

export function ColumnChooser<T>({
  columns,
  visibleKeys,
  onToggleVisibility,
  pinning,
  pinState,
  onChangePin,
}: ColumnChooserProps<T>) {
  const choosable = columns.filter((column) => !column.disableHide);

  return (
    <Dropdown
      trigger={["click"]}
      popupRender={() => (
        <div
          style={{
            minWidth: 260,
            maxHeight: 360,
            overflowY: "auto",
            background: "var(--ant-color-bg-elevated, #1f1f1f)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {choosable.map((column) => {
            const visible = visibleKeys.has(column.key);
            const pin = pinState[column.key];
            return (
              <div
                key={column.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 6,
                }}
              >
                <Checkbox checked={visible} onChange={() => onToggleVisibility(column.key)}>
                  {column.title}
                </Checkbox>
                {pinning && (
                  <div style={{ display: "flex", gap: 2 }}>
                    <Tooltip title="Pin left">
                      <Button
                        size="small"
                        type={pin === "left" ? "primary" : "text"}
                        icon={<VerticalAlignTopOutlined rotate={-90} />}
                        onClick={() => onChangePin(column.key, pin === "left" ? undefined : "left")}
                      />
                    </Tooltip>
                    <Tooltip title="Unpin">
                      <Button
                        size="small"
                        type={!pin ? "primary" : "text"}
                        icon={<MinusOutlined />}
                        onClick={() => onChangePin(column.key, undefined)}
                      />
                    </Tooltip>
                    <Tooltip title="Pin right">
                      <Button
                        size="small"
                        type={pin === "right" ? "primary" : "text"}
                        icon={<VerticalAlignBottomOutlined rotate={-90} />}
                        onClick={() => onChangePin(column.key, pin === "right" ? undefined : "right")}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    >
      <Button icon={<SettingOutlined />}>Columns</Button>
    </Dropdown>
  );
}
