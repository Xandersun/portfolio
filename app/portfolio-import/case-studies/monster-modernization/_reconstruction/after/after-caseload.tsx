"use client";

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import type {
  CellKeyDownEvent,
  CellValueChangedEvent,
  ColDef,
  ColumnMovedEvent,
  ColumnResizedEvent,
  ColumnState,
  DefaultMenuItem,
  FilterChangedEvent,
  FilterModel,
  FilterOpenedEvent,
  GetContextMenuItemsParams,
  GridApi,
  MenuItemDef,
  PostProcessPopupParams,
} from "ag-grid-community";
import { DeleteOutlined, DownOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Checkbox, Dropdown, Input, Modal, Select, Skeleton, Tooltip } from "antd";
import { Bookmark, Columns3, Download, Layers, Pencil, Rows3, Settings2 } from "lucide-react";

import type { DataGridColumn } from "@/components/data-grid/types";
import { exportToCsv } from "@/components/data-grid/export-utils";
import type { Priority } from "@/lib/portfolio-v2/cases";
import { useSandboxNotify } from "../../_living-system/monster-notification-provider";

import { CASELOAD } from "../data";
import type { CaseloadRow } from "../types";
import { PatternsSection } from "./pattern-list";
import type { ThingsToTryItem } from "./things-to-try";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

/**
 * The caseload entry point, built on the same AG Grid + light Quartz theme
 * as the Living Design System's own Saved Views module
 * (app/portfolio-v2/lds/views/page.tsx) — reused directly, down to the
 * exact theme parameters — plus the Density Toggle module's row-density
 * concept (app/portfolio-v2/lds/density/page.tsx) applied to the grid,
 * and the shared CSV export utility (components/data-grid/export-utils)
 * already used by the Audit Trail module.
 *
 * Saved Views is folded directly into this grid's own toolbar rather than
 * living as a separate destination. The four built-in presets (My Active
 * Cases, Needs Attention, Due This Week, Recently Updated) filter the
 * underlying rowData array, matching the demo's existing named-segment
 * behavior. A user can also save the grid's CURRENT AG Grid column state
 * and filter model as a new named view — the same mechanism the LDS's own
 * Saved Views module uses — which is restored via the real
 * applyColumnState/setFilterModel APIs when reselected, not by filtering
 * rowData.
 *

 * Status / Category / Review are three demo-only editable columns layered
 * on top of the same CASELOAD data (not part of the historical Monster
 * record) so this module can also demonstrate AG Grid Enterprise's native
 * cell editing, range selection, and right-click bulk edit — real grid
 * capabilities, not a hand-rolled spreadsheet.
 */
type SavedViewId = "all" | "attention" | "due-this-week" | "recent";

const SAVED_VIEWS: { id: SavedViewId; label: string }[] = [
  { id: "all", label: "My Active Cases" },
  { id: "attention", label: "Needs Attention" },
  { id: "due-this-week", label: "Due This Week" },
  { id: "recent", label: "Recently Updated" },
];

const PRESET_VIEW_IDS = new Set<string>(SAVED_VIEWS.map((v) => v.id));

/**
 * A saved view a user creates from the grid's current working state —
 * same concept as the Living Design System's own Saved Views module
 * (app/portfolio-v2/lds/views/page.tsx: name + AG Grid columnState +
 * filterModel), folded into this grid's own toolbar instead of living as
 * a separate destination, so saved-view management reads as one more
 * ordinary capability of this data grid rather than a standalone feature.
 */
interface CustomSavedView {
  id: string;
  name: string;
  columnState: ColumnState[];
  filterModel: FilterModel;
  density: Density;
}

type Density = "comfortable" | "compact" | "dense";
const DENSITY_CONFIG: Record<Density, { label: string; rowHeight: number; fontSize: number }> = {
  comfortable: { label: "Comfortable", rowHeight: 48, fontSize: 14 },
  compact: { label: "Compact", rowHeight: 40, fontSize: 13 },
  dense: { label: "Dense", rowHeight: 32, fontSize: 12 },
};

const FONT_STACK = 'system-ui, -apple-system, "Inter", sans-serif';

/**
 * Adds AG Grid's own built-in "Reset" button to the filterable text
 * columns — relabeled to "Clear filter" via the grid's `localeText` — so
 * removing an applied filter uses the exact same filter-model APIs as
 * everything else (the table, the header's active-filter indicator,
 * Saved Views) rather than a second, hand-rolled clear mechanism.
 * `closeOnApply` also closes the popover once it's clicked.
 */
const TEXT_FILTER_PARAMS = { buttons: ["reset"], closeOnApply: true } as const;

const lightTheme = themeQuartz.withParams({
  backgroundColor: "#FFFFFF",
  foregroundColor: "#0F172A",
  headerBackgroundColor: "#F1F5F9",
  headerTextColor: "#334155",
  oddRowBackgroundColor: "#F8FAFC",
  accentColor: "#0f766e",
  borderColor: "#E2E8F0",
  fontFamily: FONT_STACK,
});

const PRIORITY_HEX: Record<Priority, string> = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626" };

function PriorityCell({ value }: { value: Priority }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: PRIORITY_HEX[value], display: "inline-block" }} />
      {value}
    </span>
  );
}

/** Value + a subtle chevron so the three editable columns read as dropdowns even at rest, without a permanent background color. */
function EditableSelectCell({ value }: { value: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 6 }}>
      <span>{value}</span>
      <DownOutlined style={{ fontSize: 10, color: "#94A3B8", flexShrink: 0 }} />
    </span>
  );
}

/**
 * One icon-only control shared by every entry in the toolbar's right-hand
 * action cluster (View settings, Columns, Density, Export) so the group
 * reads as one consistent control instead of four differently-styled
 * buttons — the same "unified button group" pattern AG Grid, Salesforce
 * Lightning, and Shopify Polaris toolbars use for secondary actions.
 */
const ToolbarIconButton = forwardRef<HTMLButtonElement, { icon: React.ReactNode; label: string; onClick?: () => void }>(
  function ToolbarIconButton({ icon, label, onClick }, ref) {
    return (
      <Tooltip title={label}>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          onClick={onClick}
          className="flex h-9 w-9 cursor-pointer items-center justify-center bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1"
        >
          {icon}
        </button>
      </Tooltip>
    );
  },
);

/** The optional columns a user can hide via the toolbar's Columns panel — Case ID stays pinned and always visible. */
const OPTIONAL_COLUMNS: { field: keyof EditableCaseloadRow; headerName: string }[] = [
  { field: "statusLabel", headerName: "Case Status" },
  { field: "priority", headerName: "Priority" },
  { field: "status", headerName: "Status" },
  { field: "category", headerName: "Category" },
  { field: "review", headerName: "Review" },
  { field: "lastActivity", headerName: "Last Activity" },
];

/**
 * One additional row kept local to this demo (not added to the shared
 * ../data.ts CASELOAD, which before-caseload.tsx also renders) so this
 * grid's row count doesn't change the Before experience's row count too.
 */
const EXTRA_CASELOAD_ROWS: CaseloadRow[] = [
  {
    id: "PTC-04955",
    caseId: "CASE-4988",
    name: "Omar Reyes",
    program: "SNAP",
    assignedWorker: "R. Whitfield",
    statusLabel: "Benefits Active",
    priority: "Low",
    nextAction: "None — case in good standing",
    needsAttention: false,
    dueThisWeek: false,
    recentlyUpdated: false,
    openable: false,
    lastActivity: "May 12",
  },
];

/** The three adjacent, editable enterprise-style columns layered onto the caseload demo. */
const STATUS_VALUES = ["Open", "In Progress", "Complete"] as const;
const CATEGORY_VALUES = ["Standard", "Priority", "Exception"] as const;
const REVIEW_VALUES = ["Pending", "Approved", "Needs Review"] as const;

type EditableField = "status" | "category" | "review";

const EDITABLE_FIELD_VALUES: Record<EditableField, readonly string[]> = {
  status: STATUS_VALUES,
  category: CATEGORY_VALUES,
  review: REVIEW_VALUES,
};

interface EditableCaseloadRow extends CaseloadRow {
  status: (typeof STATUS_VALUES)[number];
  category: (typeof CATEGORY_VALUES)[number];
  review: (typeof REVIEW_VALUES)[number];
}

function seedEditableRows(rows: CaseloadRow[]): EditableCaseloadRow[] {
  return rows.map((row, i) => ({
    ...row,
    status: STATUS_VALUES[i % STATUS_VALUES.length],
    category: CATEGORY_VALUES[(i + 1) % CATEGORY_VALUES.length],
    review: REVIEW_VALUES[(i + 2) % REVIEW_VALUES.length],
  }));
}

/**
 * The four concise explanatory cards shown below the grid — same shape,
 * visual treatment, and stacked layout as Navigation & Hierarchy's own
 * "Navigation patterns" cards (see OVERVIEW_ITEMS in navigation-panel.tsx),
 * reused here so the two sections read as parts of the same system.
 */
const DATA_PATTERNS_ITEMS: { title: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Editable Data",
    description: "Update controlled values directly in the table.",
    icon: <Pencil className="size-4" />,
  },
  {
    title: "Bulk Editing",
    description: "Apply the same change across multiple selected cells.",
    icon: <Layers className="size-4" />,
  },
  {
    title: "Flexible Views",
    description: "Save filters and table settings for repeated work.",
    icon: <Bookmark className="size-4" />,
  },
  {
    title: "Information Density",
    description: "Adjust the table for different amounts of data.",
    icon: <Rows3 className="size-4" />,
  },
];

const EXPORT_COLUMNS: DataGridColumn<EditableCaseloadRow>[] = [
  { key: "caseId", title: "Case ID", dataIndex: "caseId" },
  { key: "statusLabel", title: "Case Status", dataIndex: "statusLabel" },
  { key: "priority", title: "Priority", dataIndex: "priority" },
  { key: "status", title: "Status", dataIndex: "status" },
  { key: "category", title: "Category", dataIndex: "category" },
  { key: "review", title: "Review", dataIndex: "review" },
  { key: "lastActivity", title: "Last Activity", dataIndex: "lastActivity" },
];

export function AfterCaseload({ onSelect }: { onSelect: (caseId: string) => void }) {
  const notify = useSandboxNotify();
  const gridRef = useRef<AgGridReact<EditableCaseloadRow>>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const theme = useMemo(() => lightTheme, []);
  // The context menu, column menus, and other AG Grid popups render inside
  // this component by default, so they get clipped by the same
  // overflow-hidden ancestors that make the accordion collapse animation
  // and the grid's own scroll body work (the accordion root and content,
  // and the grid's internal viewport). Pointing popupParent at <body>
  // (AG Grid's own supported mechanism for this) renders them there
  // instead, outside every one of those boundaries, without touching any
  // of that overflow.
  const popupParent = useMemo(() => (typeof document !== "undefined" ? document.body : undefined), []);
  const [savedView, setSavedView] = useState<string>("all");
  const [customViews, setCustomViews] = useState<CustomSavedView[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [density, setDensity] = useState<Density>("compact");
  const [quickFilter, setQuickFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(OPTIONAL_COLUMNS.map((c) => [c.field, true])),
  );
  const [switching, setSwitching] = useState(false);
  const [editableRows, setEditableRows] = useState<EditableCaseloadRow[]>(() =>
    seedEditableRows([...CASELOAD, ...EXTRA_CASELOAD_ROWS]),
  );

  // "Things to try" completion flags — each is set once by a real grid
  // interaction and never reset for the rest of the session.
  const [hasEditedCell, setHasEditedCell] = useState(false);
  const [hasBulkEdited, setHasBulkEdited] = useState(false);
  const [hasResizedColumn, setHasResizedColumn] = useState(false);
  const [hasReorderedColumn, setHasReorderedColumn] = useState(false);
  const [hasAppliedAdvancedFilter, setHasAppliedAdvancedFilter] = useState(false);
  const [hasChangedDensity, setHasChangedDensity] = useState(false);

  const rows = useMemo(() => {
    switch (savedView) {
      case "attention":
        return editableRows.filter((r) => r.needsAttention);
      case "due-this-week":
        return editableRows.filter((r) => r.dueThisWeek);
      case "recent":
        return editableRows.filter((r) => r.recentlyUpdated);
      default:
        return editableRows;
    }
  }, [savedView, editableRows]);

  const handleViewChange = (value: string) => {
    const api = gridRef.current?.api;
    const customView = customViews.find((v) => v.id === value);

    if (customView) {
      // Custom saved views restore real AG Grid column/filter state
      // directly, the same way the Living Design System's own Saved
      // Views module does — no rowData-array filtering involved.
      setSavedView(value);
      setDensity(customView.density);
      api?.applyColumnState({ state: customView.columnState, applyOrder: true, defaultState: { sort: null } });
      api?.setFilterModel(customView.filterModel);
      return;
    }

    // Built-in preset views filter the underlying rowData array, so
    // switching to (or away from) one also clears any leftover AG Grid
    // column/filter state a custom view may have applied.
    api?.applyColumnState({ defaultState: { sort: null } });
    api?.setFilterModel(null);
    setSwitching(true);
    setSavedView(value);
    window.setTimeout(() => setSwitching(false), 280);
  };

  const handleSaveView = () => {
    const api = gridRef.current?.api;
    if (!api) return;
    const name = newViewName.trim();
    if (!name) return;
    const id = `custom-${Date.now()}`;
    const view: CustomSavedView = {
      id,
      name,
      columnState: api.getColumnState(),
      filterModel: api.getFilterModel(),
      density,
    };
    setCustomViews((prev) => [...prev, view]);
    setSavedView(id);
    setSaveModalOpen(false);
    setNewViewName("");
    notify("success", "Saved view created", `"${name}" now reflects the current filter, sort, and density.`);
  };

  const handleDeleteView = () => {
    const target = customViews.find((v) => v.id === savedView);
    if (!target) return;
    setCustomViews((prev) => prev.filter((v) => v.id !== savedView));
    handleViewChange("all");
    notify("info", "View deleted", `"${target.name}" was removed from Saved Views.`);
  };

  const handleQuickFilterChange = (value: string) => {
    setQuickFilter(value);
    gridRef.current?.api?.setGridOption("quickFilterText", value);
  };

  const handleCellValueChanged = useCallback((event: CellValueChangedEvent<EditableCaseloadRow>) => {
    const field = event.colDef.field as EditableField | undefined;
    if (!field || !(field in EDITABLE_FIELD_VALUES)) return;
    if (event.newValue === event.oldValue) return;
    const rowId = event.data.id;
    setEditableRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, [field]: event.newValue } : r)));
    setHasEditedCell(true);
  }, []);

  const handleColumnResized = useCallback((event: ColumnResizedEvent<EditableCaseloadRow>) => {
    if (event.finished) setHasResizedColumn(true);
  }, []);

  const handleColumnMoved = useCallback((event: ColumnMovedEvent<EditableCaseloadRow>) => {
    if (event.finished) setHasReorderedColumn(true);
  }, []);

  // Pressing Escape while a cell is focused should dismiss it entirely —
  // not just cancel an in-progress edit (AG Grid already does that part on
  // its own), but also clear the focus ring / range-selection outline that
  // otherwise lingers on the cell indefinitely once it's no longer editing.
  const handleCellKeyDown = useCallback((event: CellKeyDownEvent<EditableCaseloadRow>) => {
    if ((event.event as KeyboardEvent | undefined)?.key !== "Escape") return;
    event.api.stopEditing(true);
    event.api.clearFocusedCell();
    event.api.clearRangeSelection();
  }, []);

  // AG Grid intentionally keeps a cell's focus ring and range-selection
  // outline visible even after the grid itself loses focus — by design, so
  // keyboard navigation can resume where it left off — so clicking anywhere
  // outside the grid (the page canvas, the toolbar, a modal) or on the
  // grid's own header never clears it on its own. This restores that
  // dismissal using the grid's own clearFocusedCell/clearRangeSelection
  // APIs, scoped so it never reaches into AG Grid's own popups (cell
  // editors, filters, column menus), which render as descendants of this
  // same wrapper and must keep working exactly as before.
  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      const wrapper = gridWrapperRef.current;
      const api = gridRef.current?.api;
      if (!wrapper || !api) return;
      const target = event.target as Node;
      const clickedInsideGrid = wrapper.contains(target);
      const clickedHeader = clickedInsideGrid && target instanceof Element && !!target.closest(".ag-header");
      if (clickedInsideGrid && !clickedHeader) return;
      api.clearFocusedCell();
      api.clearRangeSelection();
    }
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, []);

  // The native "Clear filter" (AG Grid's built-in Reset button, relabeled
  // via localeText) should read as disabled — not merely styled that way —
  // whenever the open filter's column has no active filter, since a plain
  // CSS override wouldn't stop it from actually firing. AG Grid's own
  // filter-model APIs are the only source of truth here; this just toggles
  // the real `disabled` attribute on the button AG Grid already rendered.
  const activeFilterGuiRef = useRef<HTMLElement | null>(null);
  const activeFilterColIdRef = useRef<string | null>(null);

  const updateClearFilterButtonState = useCallback((api: GridApi<EditableCaseloadRow>) => {
    const gui = activeFilterGuiRef.current;
    const colId = activeFilterColIdRef.current;
    if (!gui || !colId) return;
    const hasFilter = api.getColumnFilterModel(colId) != null;
    const button = Array.from(gui.querySelectorAll<HTMLButtonElement>(".ag-filter-apply-panel-button")).find(
      (btn) => btn.textContent?.trim() === "Clear filter",
    );
    if (!button) return;
    button.disabled = !hasFilter;
    // Neither `closeOnApply` nor `api.hidePopupMenu()` closes this specific
    // popover for the Reset button in this AG Grid version (`hidePopupMenu`
    // is documented for the context/column menu, not the filter popup).
    // Escape is AG Grid's own standard dismissal for this popup, so
    // dispatch that once its own reset handler has run — the same
    // dismissal path a real Escape press would trigger, not a separate
    // close mechanism. Bound once per popup-open session (button is a
    // fresh DOM node each time it opens).
    if (!button.dataset.clearFilterBound) {
      button.dataset.clearFilterBound = "true";
      button.addEventListener("click", () => {
        queueMicrotask(() => {
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }));
        });
      });
    }
  }, []);

  const handleFilterOpened = useCallback(
    (event: FilterOpenedEvent<EditableCaseloadRow>) => {
      activeFilterGuiRef.current = event.eGui;
      activeFilterColIdRef.current = "getColId" in event.column ? event.column.getColId() : null;
      // With popupParent set, this filter popup renders under <body> rather
      // than inside .after-caseload-grid, so the "Clear filter" button
      // styling and the z-index rule below can no longer be scoped by DOM
      // ancestry — this marker class (also applied to every other popup
      // type via postProcessPopup below; harmless to add repeatedly) gives
      // the CSS a stable hook regardless of where AG Grid mounts a popup.
      event.eGui.classList.add("after-caseload-popup");
      updateClearFilterButtonState(event.api);
    },
    [updateClearFilterButtonState],
  );

  // Covers every other popup type this grid can show (context menu, column
  // menu, the bulk-edit sub-menu, popup cell editors) with the same marker
  // — AG Grid's own generic hook for post-processing a popup once it's
  // created, so nothing here needs its own bespoke open-event handler.
  const handlePostProcessPopup = useCallback((params: PostProcessPopupParams<EditableCaseloadRow>) => {
    params.ePopup.classList.add("after-caseload-popup");
  }, []);

  const handleFilterChanged = useCallback(
    (event: FilterChangedEvent<EditableCaseloadRow>) => {
      const model = event.api.getFilterModel();
      const hasMultiCondition = Object.values(model).some(
        (m) => m && typeof m === "object" && Array.isArray((m as { conditions?: unknown[] }).conditions) && (m as { conditions: unknown[] }).conditions.length >= 2,
      );
      if (hasMultiCondition) setHasAppliedAdvancedFilter(true);
      updateClearFilterButtonState(event.api);
    },
    [updateClearFilterButtonState],
  );

  const applyBulkValue = useCallback((field: EditableField, value: string, rowIds: Set<string>) => {
    setEditableRows((prev) => prev.map((r) => (rowIds.has(r.id) ? { ...r, [field]: value } : r)));
    setHasBulkEdited(true);
  }, []);

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<EditableCaseloadRow>) => {
      const api = params.api;
      const ranges = api.getCellRanges() ?? [];
      const fieldToRowIds = new Map<EditableField, Set<string>>();

      ranges.forEach((range) => {
        const rangeFields = range.columns
          .map((col) => col.getColDef().field as EditableField | undefined)
          .filter((f): f is EditableField => !!f && f in EDITABLE_FIELD_VALUES);
        if (rangeFields.length === 0) return;

        const startIdx = Math.min(range.startRow?.rowIndex ?? 0, range.endRow?.rowIndex ?? 0);
        const endIdx = Math.max(range.startRow?.rowIndex ?? 0, range.endRow?.rowIndex ?? 0);
        for (let i = startIdx; i <= endIdx; i++) {
          const rowNode = api.getDisplayedRowAtIndex(i);
          const id = rowNode?.data?.id;
          if (!id) continue;
          rangeFields.forEach((field) => {
            if (!fieldToRowIds.has(field)) fieldToRowIds.set(field, new Set());
            fieldToRowIds.get(field)!.add(id);
          });
        }
      });

      const bulkItems: MenuItemDef[] = Array.from(fieldToRowIds.entries())
        .filter(([, rowIds]) => rowIds.size > 0)
        .map(([field, rowIds]) => ({
          name: `Set ${field[0].toUpperCase()}${field.slice(1)} to`,
          subMenu: EDITABLE_FIELD_VALUES[field].map((value) => ({
            name: value,
            action: () => applyBulkValue(field, value, rowIds),
          })),
        }));

      if (bulkItems.length === 0) return params.defaultItems ?? [];
      const separator: DefaultMenuItem = "separator";
      return [...bulkItems, separator, ...(params.defaultItems ?? [])];
    },
    [applyBulkValue],
  );

  const columnDefs: ColDef<EditableCaseloadRow>[] = [
    {
      field: "caseId",
      headerName: "Case ID",
      pinned: "left",
      width: 120,
      filter: "agTextColumnFilter",
      filterParams: TEXT_FILTER_PARAMS,
      cellClass: "tabular-nums",
    },
    {
      field: "statusLabel",
      headerName: "Case Status",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      filterParams: TEXT_FILTER_PARAMS,
      hide: !columnVisibility.statusLabel,
    },
    { field: "priority", headerName: "Priority", width: 110, cellRenderer: PriorityCell, sort: "desc", hide: !columnVisibility.priority },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: STATUS_VALUES },
      cellClass: "editable-cell",
      cellRenderer: EditableSelectCell,
      hide: !columnVisibility.status,
    },
    {
      field: "category",
      headerName: "Category",
      width: 140,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: CATEGORY_VALUES },
      cellClass: "editable-cell",
      cellRenderer: EditableSelectCell,
      hide: !columnVisibility.category,
    },
    {
      field: "review",
      headerName: "Review",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: REVIEW_VALUES },
      cellClass: "editable-cell",
      cellRenderer: EditableSelectCell,
      hide: !columnVisibility.review,
    },
    { field: "lastActivity", headerName: "Last Activity", width: 130, hide: !columnVisibility.lastActivity },
  ];

  const rowHeight = DENSITY_CONFIG[density].rowHeight;

  const CHECKLIST: ThingsToTryItem[] = [
    {
      key: "edit-cell",
      label: "Edit a cell",
      description: "Click an editable cell and change its value.",
      complete: hasEditedCell,
    },
    {
      key: "bulk-edit",
      label: "Bulk edit cells",
      description: "Drag across multiple editable cells, then right-click to update the selection.",
      complete: hasBulkEdited,
    },
    {
      key: "resize-column",
      label: "Resize a column",
      description: "Drag a column boundary to change its width.",
      complete: hasResizedColumn,
    },
    {
      key: "reorder-columns",
      label: "Reorder columns",
      description: "Drag a column header to move it to a new position.",
      complete: hasReorderedColumn,
    },
    {
      key: "advanced-filter",
      label: "Apply an advanced filter",
      description: "Open a column menu and create a multi-condition filter.",
      complete: hasAppliedAdvancedFilter,
    },
    {
      key: "change-density",
      label: "Change the density",
      description: "Switch between Comfortable, Compact, and Dense.",
      complete: hasChangedDensity,
    },
  ];

  return (
    <div style={{ fontFamily: FONT_STACK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        {/* Far left: saved views / dataset selector */}
        <Select<string>
          value={savedView}
          onChange={handleViewChange}
          style={{ width: 190, flexShrink: 0 }}
          options={[
            { label: "Views", options: SAVED_VIEWS.map((v) => ({ label: v.label, value: v.id })) },
            ...(customViews.length > 0
              ? [{ label: "My Views", options: customViews.map((v) => ({ label: v.name, value: v.id })) }]
              : []),
          ]}
        />

        {/* Center: global search / quick filter */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
          <Input
            placeholder="Search cases…"
            prefix={<SearchOutlined style={{ color: "#475569" }} />}
            value={quickFilter}
            onChange={(e) => handleQuickFilterChange(e.target.value)}
            style={{ width: "100%", maxWidth: 360 }}
            allowClear
          />
        </div>

        {/* Right: action cluster — view utilities, columns, density, export, grouped as one unified control */}
        <div
          className="flex items-center divide-x divide-slate-200 overflow-hidden rounded-lg border border-slate-200"
          style={{ flexShrink: 0 }}
        >
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                { key: "save", label: "Save current view…", icon: <SaveOutlined /> },
                {
                  key: "delete",
                  label: "Delete this view",
                  icon: <DeleteOutlined />,
                  danger: true,
                  disabled: PRESET_VIEW_IDS.has(savedView),
                },
              ],
              onClick: ({ key }) => {
                if (key === "save") setSaveModalOpen(true);
                if (key === "delete") {
                  const target = customViews.find((v) => v.id === savedView);
                  Modal.confirm({
                    title: "Delete this saved view?",
                    content: target ? `"${target.name}" will be removed from Saved Views.` : undefined,
                    okText: "Delete",
                    okButtonProps: { danger: true },
                    onOk: handleDeleteView,
                  });
                }
              },
            }}
          >
            <ToolbarIconButton icon={<Settings2 className="size-4" />} label="View settings" />
          </Dropdown>

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            popupRender={() => (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.12)",
                  padding: 10,
                  minWidth: 180,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", padding: "2px 6px 6px" }}>Show columns</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {OPTIONAL_COLUMNS.map((col) => (
                    <label
                      key={col.field}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#334155" }}
                    >
                      <Checkbox
                        checked={columnVisibility[col.field]}
                        onChange={(e) =>
                          setColumnVisibility((prev) => ({ ...prev, [col.field]: e.target.checked }))
                        }
                      />
                      {col.headerName}
                    </label>
                  ))}
                </div>
              </div>
            )}
          >
            <ToolbarIconButton icon={<Columns3 className="size-4" />} label="Columns" />
          </Dropdown>

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: (Object.keys(DENSITY_CONFIG) as Density[]).map((key) => ({
                key,
                label: DENSITY_CONFIG[key].label,
              })),
              selectedKeys: [density],
              onClick: ({ key }) => {
                const next = key as Density;
                if (next !== density) setHasChangedDensity(true);
                setDensity(next);
              },
            }}
          >
            <ToolbarIconButton icon={<Rows3 className="size-4" />} label={`Density: ${DENSITY_CONFIG[density].label}`} />
          </Dropdown>

          <ToolbarIconButton
            icon={<Download className="size-4" />}
            label="Export CSV"
            onClick={() => exportToCsv(rows, EXPORT_COLUMNS, "caseload")}
          />
        </div>
      </div>

      <div ref={gridWrapperRef} className="after-caseload-grid" style={{ position: "relative" }}>
        {switching ? (
          <div style={{ padding: 16 }}>
            <Skeleton active title={false} paragraph={{ rows: 6 }} />
          </div>
        ) : (
          <AgGridReact<EditableCaseloadRow>
            ref={gridRef}
            theme={theme}
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={{ sortable: true, resizable: true }}
            getRowId={(params) => params.data.id}
            popupParent={popupParent}
            postProcessPopup={handlePostProcessPopup}
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            cellSelection
            getContextMenuItems={getContextMenuItems}
            onCellValueChanged={handleCellValueChanged}
            onColumnResized={handleColumnResized}
            onColumnMoved={handleColumnMoved}
            onCellKeyDown={handleCellKeyDown}
            onFilterChanged={handleFilterChanged}
            onFilterOpened={handleFilterOpened}
            localeText={{ resetFilter: "Clear filter" }}
            rowHeight={rowHeight}
            headerHeight={36}
            domLayout="autoHeight"
            animateRows
            onRowClicked={(e) => e.data?.openable && onSelect(e.data.id)}
            getRowClass={(p) => (p.data?.openable ? "ag-row--clickable" : undefined)}
            overlayNoRowsTemplate="<span style='color:#475569;font-size:15px;'>No cases match this view/filter.</span>"
          />
        )}
      </div>

      <PatternsSection heading="Data patterns" items={DATA_PATTERNS_ITEMS} checklist={CHECKLIST} gap={80} />

      <Modal
        title="Save current view"
        open={saveModalOpen}
        onOk={handleSaveView}
        onCancel={() => setSaveModalOpen(false)}
        okButtonProps={{ icon: <PlusOutlined />, disabled: !newViewName.trim() }}
        okText="Save"
        destroyOnHidden
      >
        <Input
          autoFocus
          placeholder="e.g. My Weekly Review"
          value={newViewName}
          onChange={(e) => setNewViewName(e.target.value)}
          onPressEnter={handleSaveView}
        />
      </Modal>

      <style jsx global>{`
        .ag-row--clickable {
          cursor: pointer;
        }
        .after-caseload-grid .ag-cell,
        .after-caseload-grid .ag-header-cell-text {
          font-size: ${DENSITY_CONFIG[density].fontSize}px;
        }
        .after-caseload-grid .editable-cell {
          background-color: #ffffff;
        }
        .after-caseload-grid .editable-cell:hover {
          background-color: #f8fafc;
          cursor: pointer;
        }
        .after-caseload-popup .ag-filter-apply-panel {
          justify-content: flex-start !important;
          border-top: 1px solid #e2e8f0;
          margin-top: 4px;
        }
        .after-caseload-popup .ag-filter-apply-panel-button {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #334155 !important;
          font-weight: 500;
          padding-inline: 8px;
          border-radius: 6px;
        }
        .after-caseload-popup .ag-filter-apply-panel-button:hover:not(:disabled) {
          background: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .after-caseload-popup .ag-filter-apply-panel-button:disabled {
          color: #94a3b8 !important;
          cursor: not-allowed;
        }
        .after-caseload-popup .ag-filter-apply-panel-button:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0d9488 !important;
        }
        /*
         * popupParent renders this grid's popups under <body>, past the
         * sticky primary nav (z-40) and case-study section nav (z-39) —
         * scoped to .after-caseload-popup (applied to every popup this
         * grid creates via postProcessPopup/onFilterOpened above) so it
         * doesn't affect any other grid's popups on the page.
         */
        .after-caseload-popup {
          z-index: 50 !important;
        }
      `}</style>
    </div>
  );
}
