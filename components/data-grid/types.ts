import type { ReactNode } from "react";

export type FilterType = "text" | "select" | "numberRange" | "none";

export interface FilterOption {
  label: string;
  value: string;
}

export interface DataGridColumn<T> {
  /** Unique, stable identifier — independent of dataIndex so columns can be renamed safely. */
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
  /** Initial pin state; the column chooser lets viewers change this at runtime. */
  fixed?: "left" | "right";
  sortable?: boolean;
  /** Overrides the default string/number compare — e.g. for ordinal fields like a risk tier. */
  sorter?: (a: T, b: T) => number;
  filterType?: FilterType;
  /** Required when filterType is "select". */
  filterOptions?: FilterOption[];
  render?: (value: T[keyof T], record: T) => ReactNode;
  /** Plain-text value used for CSV/Excel/PDF export when `render` produces markup. */
  exportValue?: (record: T) => string | number;
  /** Always shown; excluded from the column chooser (e.g. a row-action column). */
  disableHide?: boolean;
  /** Excluded from CSV/Excel/PDF export (e.g. a row-action column with no real data). */
  disableExport?: boolean;
}

export interface BulkAction<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: (selectedRows: T[]) => void;
}

export type ExportFormat = "csv" | "excel" | "pdf";

export interface DataGridFeatures {
  pinning?: boolean;
  resizing?: boolean;
  reordering?: boolean;
  multiSort?: boolean;
  filtering?: boolean;
  selection?: boolean;
  columnChooser?: boolean;
  virtualScroll?: boolean;
  pagination?: boolean;
  /** false disables export entirely; an array picks which formats to offer. */
  export?: boolean | ExportFormat[];
}

export const DEFAULT_DATA_GRID_FEATURES: Required<DataGridFeatures> = {
  pinning: true,
  resizing: true,
  reordering: true,
  multiSort: true,
  filtering: true,
  selection: true,
  columnChooser: true,
  virtualScroll: true,
  pagination: true,
  export: ["csv", "excel", "pdf"],
};

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  /** Unset features fall back to DEFAULT_DATA_GRID_FEATURES (all on). */
  features?: DataGridFeatures;
  bulkActions?: BulkAction<T>[];
  /** Used for export filenames and the PDF title. */
  title?: string;
  pageSize?: number;
  /** Body scroll height in px; required for virtual scrolling. */
  height?: number;
  loading?: boolean;
}
