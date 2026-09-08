"use client";

import { Button, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import type { BulkAction } from "@/components/data-grid/types";

interface BulkActionBarProps<T> {
  selectedRows: T[];
  actions: BulkAction<T>[];
  onClear: () => void;
}

export function BulkActionBar<T>({ selectedRows, actions, onClear }: BulkActionBarProps<T>) {
  if (selectedRows.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 12px",
        borderRadius: 8,
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
      }}
    >
      <span style={{ fontSize: 13 }}>
        <strong>{selectedRows.length}</strong> row{selectedRows.length === 1 ? "" : "s"} selected
      </span>
      <Space>
        {actions.map((action) => (
          <Button
            key={action.key}
            size="small"
            danger={action.danger}
            icon={action.icon}
            onClick={() => action.onClick(selectedRows)}
          >
            {action.label}
          </Button>
        ))}
        <Button size="small" type="text" icon={<CloseOutlined />} onClick={onClear}>
          Clear
        </Button>
      </Space>
    </div>
  );
}
