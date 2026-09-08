"use client";

/**
 * @design-spec DataGrid — enterprise table shell.
 * Default column width: 150px · Header/cell font: 14px / 400 (antd default
 * fontSize token) · Toolbar row: 8px gap, 12px margin-bottom · Selected row
 * bg: rgba(16,185,129,0.18) w/ #ffffff text (WCAG AA-verified, see
 * components/layout/app-shell.tsx Menu.itemSelectedBg note for the same
 * pattern) · Border: 1px solid rgba(255,255,255,0.08) · Resize handle: 8px
 * hit target, cursor col-resize · Bulk action bar: rgba(16,185,129,0.1) bg,
 * 1px solid rgba(16,185,129,0.3) border, 8px radius.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Key, ReactNode } from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

import { BulkActionBar } from "@/components/data-grid/bulk-action-bar";
import { ColumnChooser } from "@/components/data-grid/column-chooser";
import { ExportMenu } from "@/components/data-grid/export-menu";
import {
  numberRangeOnFilter,
  renderNumberRangeFilterDropdown,
  renderTextFilterDropdown,
  textOnFilter,
} from "@/components/data-grid/filter-dropdowns";
import { ResizableTitle } from "@/components/data-grid/resizable-title";
import {
  DEFAULT_DATA_GRID_FEATURES,
  type DataGridColumn,
  type DataGridProps,
  type ExportFormat,
} from "@/components/data-grid/types";

const DEFAULT_COLUMN_WIDTH = 150;

function compareValues<T>(dataIndex: keyof T) {
  return (a: T, b: T) => {
    const av = a[dataIndex];
    const bv = b[dataIndex];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""));
  };
}

export function DataGrid<T extends object>({
  columns,
  data,
  rowKey,
  features,
  bulkActions = [],
  title,
  pageSize = 10,
  height = 480,
  loading,
}: DataGridProps<T>) {
  const resolvedFeatures = { ...DEFAULT_DATA_GRID_FEATURES, ...features };

  const getRowKey = useCallback(
    (record: T): string => (typeof rowKey === "function" ? rowKey(record) : String(record[rowKey])),
    [rowKey],
  );

  // Static per-column sort priority (primary/secondary...), derived once from the
  // order columns were *defined* in — kept stable so reordering columns visually
  // never silently reassigns which field is the primary sort key.
  const sortPriorityByKey = useMemo(() => {
    const sortableKeys = columns.filter((c) => c.sortable).map((c) => c.key);
    const map = new Map<string, number>();
    sortableKeys.forEach((key, index) => map.set(key, sortableKeys.length - index));
    return map;
  }, [columns]);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(
    () => new Set(columns.map((c) => c.key)),
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((c) => c.key));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [pinState, setPinState] = useState<Record<string, "left" | "right" | undefined>>(
    () => Object.fromEntries(columns.map((c) => [c.key, c.fixed])),
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [currentDataSource, setCurrentDataSource] = useState<T[]>(data);

  useEffect(() => {
    setCurrentDataSource(data);
  }, [data]);

  const draggedColumnKeyRef = useRef<string | null>(null);

  const columnsByKey = useMemo(() => {
    const map = new Map<string, DataGridColumn<T>>();
    columns.forEach((c) => map.set(c.key, c));
    return map;
  }, [columns]);

  const orderedVisibleColumns = useMemo(() => {
    return columnOrder
      .map((key) => columnsByKey.get(key))
      .filter((c): c is DataGridColumn<T> => Boolean(c) && (c!.disableHide || visibleKeys.has(c!.key)));
  }, [columnOrder, columnsByKey, visibleKeys]);

  const handleResize = useCallback((key: string, width: number) => {
    setColumnWidths((prev) => ({ ...prev, [key]: width }));
  }, []);

  const handleTogglePin = useCallback((key: string, pin: "left" | "right" | undefined) => {
    setPinState((prev) => ({ ...prev, [key]: pin }));
  }, []);

  const handleToggleVisibility = useCallback((key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const antColumns: ColumnsType<T> = useMemo(() => {
    return orderedVisibleColumns.map((column) => {
      const width = columnWidths[column.key] ?? column.width ?? DEFAULT_COLUMN_WIDTH;

      const filterProps: Partial<ColumnsType<T>[number]> = {};
      if (resolvedFeatures.filtering && column.filterType && column.filterType !== "none") {
        if (column.filterType === "text") {
          filterProps.filterDropdown = renderTextFilterDropdown(`Search ${column.title}`);
          filterProps.onFilter = textOnFilter<T>(column.dataIndex);
        } else if (column.filterType === "select") {
          filterProps.filters = column.filterOptions?.map((o) => ({ text: o.label, value: o.value }));
          filterProps.onFilter = (value, record) => String(record[column.dataIndex]) === String(value);
        } else if (column.filterType === "numberRange") {
          filterProps.filterDropdown = renderNumberRangeFilterDropdown;
          filterProps.onFilter = numberRangeOnFilter<T>(column.dataIndex);
        }
      }

      const compare = column.sorter ?? compareValues<T>(column.dataIndex);
      const sortProps: Partial<ColumnsType<T>[number]> = column.sortable
        ? {
            sorter: resolvedFeatures.multiSort
              ? { compare, multiple: sortPriorityByKey.get(column.key) }
              : compare,
          }
        : {};

      return {
        key: column.key,
        title: column.title,
        dataIndex: column.dataIndex as string,
        width,
        align: column.align,
        fixed: resolvedFeatures.pinning ? pinState[column.key] : undefined,
        render: column.render as never,
        onHeaderCell: () => ({
          width,
          onResize: resolvedFeatures.resizing ? (next: number) => handleResize(column.key, next) : undefined,
          draggable: resolvedFeatures.reordering,
          onDragStart: resolvedFeatures.reordering
            ? () => {
                draggedColumnKeyRef.current = column.key;
              }
            : undefined,
          onDragOver: resolvedFeatures.reordering ? (e: React.DragEvent) => e.preventDefault() : undefined,
          onDrop: resolvedFeatures.reordering
            ? () => {
                const draggedKey = draggedColumnKeyRef.current;
                if (!draggedKey || draggedKey === column.key) return;
                setColumnOrder((prev) => {
                  const next = [...prev];
                  const from = next.indexOf(draggedKey);
                  const to = next.indexOf(column.key);
                  if (from === -1 || to === -1) return prev;
                  next.splice(from, 1);
                  next.splice(to, 0, draggedKey);
                  return next;
                });
              }
            : undefined,
        }),
        ...sortProps,
        ...filterProps,
      };
    });
  }, [
    orderedVisibleColumns,
    columnWidths,
    resolvedFeatures.filtering,
    resolvedFeatures.multiSort,
    resolvedFeatures.pinning,
    resolvedFeatures.resizing,
    resolvedFeatures.reordering,
    pinState,
    sortPriorityByKey,
    handleResize,
  ]);

  const handleChange: TableProps<T>["onChange"] = (_pagination, _filters, _sorter, extra) => {
    setCurrentDataSource(extra.currentDataSource);
  };

  // Plain single-row toggles. Shift-click range selection is handled natively by
  // antd (see onSelectMultiple below) — it intercepts shift-clicks before they
  // ever reach onSelect, so no shiftKey detection belongs here.
  const handleSelect = (record: T, selected: boolean) => {
    const key = getRowKey(record);
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (selected) next.add(key);
      else next.delete(key);
      return Array.from(next);
    });
  };

  const handleSelectAll = (selected: boolean, _selectedRows: T[], changeRows: T[]) => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      changeRows.forEach((r) => {
        const k = getRowKey(r);
        if (selected) next.add(k);
        else next.delete(k);
      });
      return Array.from(next);
    });
  };

  // antd's own shift-click range logic (rc-table useSelection) reports its result
  // here rather than through onSelect — selectedRows is the authoritative new set.
  const handleSelectMultiple = (_selected: boolean, selectedRows: T[]) => {
    setSelectedRowKeys(selectedRows.map(getRowKey));
  };

  const selectedRowKeySet = useMemo(() => new Set(selectedRowKeys.map(String)), [selectedRowKeys]);
  const selectedRows = useMemo(
    () => data.filter((r) => selectedRowKeySet.has(getRowKey(r))),
    [data, selectedRowKeySet, getRowKey],
  );

  const totalColumnWidth = useMemo(
    () => orderedVisibleColumns.reduce((sum, c) => sum + (columnWidths[c.key] ?? c.width ?? DEFAULT_COLUMN_WIDTH), 0),
    [orderedVisibleColumns, columnWidths],
  );

  const exportableColumns = useMemo(
    () => orderedVisibleColumns.filter((c) => !c.disableExport),
    [orderedVisibleColumns],
  );

  const exportFormats: ExportFormat[] =
    resolvedFeatures.export === false
      ? []
      : resolvedFeatures.export === true
        ? ["csv", "excel", "pdf"]
        : resolvedFeatures.export;

  const toolbar: ReactNode = (resolvedFeatures.columnChooser || exportFormats.length > 0) && (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
      {resolvedFeatures.columnChooser && (
        <ColumnChooser
          columns={columns}
          visibleKeys={visibleKeys}
          onToggleVisibility={handleToggleVisibility}
          pinning={resolvedFeatures.pinning}
          pinState={pinState}
          onChangePin={handleTogglePin}
        />
      )}
      {exportFormats.length > 0 && (
        <ExportMenu
          formats={exportFormats}
          data={currentDataSource}
          columns={exportableColumns}
          filename={(title ?? "export").toLowerCase().replace(/\s+/g, "-")}
          title={title}
        />
      )}
    </div>
  );

  return (
    <div>
      {toolbar}
      {resolvedFeatures.selection && bulkActions.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <BulkActionBar
            selectedRows={selectedRows}
            actions={bulkActions}
            onClear={() => setSelectedRowKeys([])}
          />
        </div>
      )}
      <Table<T>
        components={{ header: { cell: ResizableTitle } }}
        rowKey={getRowKey}
        columns={antColumns}
        dataSource={data}
        loading={loading}
        onChange={handleChange}
        scroll={{
          x: resolvedFeatures.virtualScroll ? totalColumnWidth : resolvedFeatures.pinning ? "max-content" : undefined,
          y: resolvedFeatures.virtualScroll ? height : undefined,
        }}
        virtual={resolvedFeatures.virtualScroll}
        pagination={resolvedFeatures.pagination ? { pageSize, showSizeChanger: true } : false}
        rowSelection={
          resolvedFeatures.selection
            ? {
                type: "checkbox",
                selectedRowKeys,
                onSelect: handleSelect,
                onSelectAll: handleSelectAll,
                onSelectMultiple: handleSelectMultiple,
              }
            : undefined
        }
      />
    </div>
  );
}
