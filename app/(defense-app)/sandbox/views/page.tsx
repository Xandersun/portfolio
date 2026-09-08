"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, colorSchemeDark, themeQuartz } from "ag-grid-community";
import type { ColDef, ColumnState, FilterModel, GridReadyEvent } from "ag-grid-community";
import { Button, Input, Modal, Popconfirm, Select, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";

import { useSandboxNotify } from "@/components/sandbox/notification-provider";
import { programs, type Program, type RiskTier } from "@/lib/programs";

ModuleRegistry.registerModules([AllCommunityModule]);

const { Title, Paragraph } = Typography;

const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  backgroundColor: "#0f172a",
  foregroundColor: "rgba(255,255,255,0.85)",
  headerBackgroundColor: "#0b1220",
  oddRowBackgroundColor: "rgba(255,255,255,0.02)",
  accentColor: "#10b981",
  borderColor: "rgba(255,255,255,0.08)",
  fontFamily: "var(--font-geist-sans)",
});

const RISK_COLOR: Record<RiskTier, string> = { Low: "#34d399", Medium: "#fbbf24", High: "#f87171" };

function RiskCell({ value }: { value: RiskTier }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: RISK_COLOR[value],
          display: "inline-block",
        }}
      />
      {value}
    </span>
  );
}

const columnDefs: ColDef<Program>[] = [
  { field: "id", headerName: "ID", pinned: "left", width: 110, filter: "agTextColumnFilter" },
  { field: "name", headerName: "Program Name", flex: 1.6, filter: "agTextColumnFilter" },
  { field: "agency", headerName: "Agency", width: 180, filter: "agTextColumnFilter" },
  { field: "budget", headerName: "FY27 Request", width: 130, filter: "agTextColumnFilter" },
  {
    field: "risk",
    headerName: "Risk Tier",
    width: 130,
    filter: "agTextColumnFilter",
    cellRenderer: RiskCell,
  },
  {
    field: "confidence",
    headerName: "AI Confidence",
    width: 150,
    filter: "agNumberColumnFilter",
    valueFormatter: (p) => `${p.value}%`,
  },
];

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,
};

interface SavedView {
  id: string;
  name: string;
  columnState: ColumnState[];
  filterModel: FilterModel;
}

const DEFAULT_VIEW_ID = "__default__";

export default function ViewsPage() {
  const gridRef = useRef<AgGridReact<Program>>(null);
  const notify = useSandboxNotify();
  const [views, setViews] = useState<SavedView[]>([]);
  const [activeViewId, setActiveViewId] = useState<string>(DEFAULT_VIEW_ID);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [quickFilter, setQuickFilter] = useState("");

  const theme = useMemo(() => darkTheme, []);

  const seedDefaultViews = useCallback((api: NonNullable<GridReadyEvent<Program>["api"]>) => {
    api.setFilterModel({ risk: { filterType: "text", type: "equals", filter: "High" } });
    const highRiskFilter = api.getFilterModel();
    api.setFilterModel(null);

    api.applyColumnState({ state: [{ colId: "confidence", sort: "asc" }], defaultState: { sort: null } });
    const lowConfidenceState = api.getColumnState();
    api.applyColumnState({ state: [], defaultState: { sort: null } });
    api.setFilterModel(null);

    setViews([
      { id: "view-high-risk", name: "High Risk Only", columnState: [], filterModel: highRiskFilter },
      {
        id: "view-low-confidence",
        name: "Lowest Confidence First",
        columnState: lowConfidenceState,
        filterModel: {},
      },
    ]);
  }, []);

  const onGridReady = useCallback(
    (event: GridReadyEvent<Program>) => {
      seedDefaultViews(event.api);
    },
    [seedDefaultViews],
  );

  const applyView = useCallback((viewId: string) => {
    const api = gridRef.current?.api;
    if (!api) return;
    setActiveViewId(viewId);
    if (viewId === DEFAULT_VIEW_ID) {
      api.applyColumnState({ defaultState: { sort: null } });
      api.setFilterModel(null);
      return;
    }
    const view = views.find((v) => v.id === viewId);
    if (!view) return;
    if (view.columnState.length > 0) {
      api.applyColumnState({ state: view.columnState, applyOrder: true, defaultState: { sort: null } });
    } else {
      api.applyColumnState({ defaultState: { sort: null } });
    }
    api.setFilterModel(view.filterModel);
  }, [views]);

  const handleSaveView = () => {
    const api = gridRef.current?.api;
    if (!api) return;
    const name = newViewName.trim();
    if (!name) return;
    const id = `view-${Date.now()}`;
    const newView: SavedView = {
      id,
      name,
      columnState: api.getColumnState(),
      filterModel: api.getFilterModel(),
    };
    setViews((prev) => [...prev, newView]);
    setActiveViewId(id);
    setSaveModalOpen(false);
    setNewViewName("");
    notify("success", "Saved view updated", `"${name}" now reflects the current filter and sort.`);
  };

  const handleDeleteView = () => {
    const target = views.find((v) => v.id === activeViewId);
    setViews((prev) => prev.filter((v) => v.id !== activeViewId));
    setActiveViewId(DEFAULT_VIEW_ID);
    gridRef.current?.api?.applyColumnState({ defaultState: { sort: null } });
    gridRef.current?.api?.setFilterModel(null);
    if (target) notify("info", "View deleted", `"${target.name}" was removed from Saved Views.`);
  };

  const handleQuickFilterChange = (value: string) => {
    setQuickFilter(value);
    gridRef.current?.api?.setGridOption("quickFilterText", value);
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Saved Views
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        An AG Grid table with a preset toolbar — save the current filter/sort configuration as a
        named view, switch between views, or delete one you no longer need.
      </Paragraph>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <Select
          value={activeViewId}
          onChange={applyView}
          style={{ width: 220 }}
          options={[
            { label: "Default (unfiltered)", value: DEFAULT_VIEW_ID },
            ...views.map((v) => ({ label: v.name, value: v.id })),
          ]}
        />
        <Button icon={<SaveOutlined />} onClick={() => setSaveModalOpen(true)}>
          Save current view
        </Button>
        <Popconfirm
          title="Delete this saved view?"
          onConfirm={handleDeleteView}
          disabled={activeViewId === DEFAULT_VIEW_ID}
        >
          <Button icon={<DeleteOutlined />} danger disabled={activeViewId === DEFAULT_VIEW_ID}>
            Delete view
          </Button>
        </Popconfirm>
        <Input.Search
          placeholder="Quick filter…"
          value={quickFilter}
          onChange={(e) => handleQuickFilterChange(e.target.value)}
          style={{ width: 220, marginLeft: "auto" }}
          allowClear
        />
      </div>

      <div style={{ height: 480 }}>
        <AgGridReact<Program>
          ref={gridRef}
          theme={theme}
          rowData={programs}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows
          rowSelection={{ mode: "multiRow" }}
        />
      </div>

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
    </div>
  );
}
