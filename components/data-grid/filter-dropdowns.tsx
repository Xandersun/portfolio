"use client";

import { Button, Input, InputNumber, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";

export function renderTextFilterDropdown(placeholder: string) {
  return ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
      <Input
        placeholder={placeholder}
        value={selectedKeys[0] as string | undefined}
        onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: "block", width: 200 }}
      />
      <Space>
        <Button type="primary" size="small" icon={<SearchOutlined />} onClick={() => confirm()}>
          Search
        </Button>
        <Button
          size="small"
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
        >
          Reset
        </Button>
      </Space>
    </div>
  );
}

export function textOnFilter<T>(dataIndex: keyof T) {
  return (value: boolean | React.Key, record: T) =>
    String(record[dataIndex] ?? "")
      .toLowerCase()
      .includes(String(value).toLowerCase());
}

export function renderNumberRangeFilterDropdown({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}: FilterDropdownProps) {
  const [minStr, maxStr] = (selectedKeys[0] as string | undefined)?.split("|") ?? ["", ""];

  const update = (nextMin: string, nextMax: string) => {
    setSelectedKeys(nextMin || nextMax ? [`${nextMin}|${nextMax}`] : []);
  };

  return (
    <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
      <Space>
        <InputNumber
          placeholder="Min"
          value={minStr ? Number(minStr) : undefined}
          onChange={(value) => update(value == null ? "" : String(value), maxStr)}
          style={{ width: 90 }}
        />
        <InputNumber
          placeholder="Max"
          value={maxStr ? Number(maxStr) : undefined}
          onChange={(value) => update(minStr, value == null ? "" : String(value))}
          style={{ width: 90 }}
        />
      </Space>
      <div style={{ marginTop: 8 }}>
        <Space>
          <Button type="primary" size="small" onClick={() => confirm()}>
            Apply
          </Button>
          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    </div>
  );
}

export function numberRangeOnFilter<T>(dataIndex: keyof T) {
  return (value: boolean | React.Key, record: T) => {
    const [minStr, maxStr] = String(value).split("|");
    const num = Number(record[dataIndex]);
    if (Number.isNaN(num)) return false;
    if (minStr && num < Number(minStr)) return false;
    if (maxStr && num > Number(maxStr)) return false;
    return true;
  };
}
