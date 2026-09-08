"use client";

import { useState } from "react";
import { message } from "antd";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { DataGrid } from "@/components/data-grid/data-grid";
import { exportToCsv } from "@/components/data-grid/export-utils";
import type { BulkAction, DataGridColumn } from "@/components/data-grid/types";
import { ExplainabilityDrawer } from "@/components/explainability-drawer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { programs, type Program, type RiskTier } from "@/lib/programs";

const RISK_RANK: Record<RiskTier, number> = { Low: 0, Medium: 1, High: 2 };

const RISK_BADGE_CLASS: Record<RiskTier, string> = {
  High: "border-red-500/30 bg-red-500/10 text-red-400",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

const AGENCY_OPTIONS = Array.from(new Set(programs.map((p) => p.agency))).map((agency) => ({
  label: agency,
  value: agency,
}));

const columns: DataGridColumn<Program>[] = [
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    width: 110,
    fixed: "left",
    sortable: true,
    filterType: "text",
    render: (value) => <span className="font-mono text-xs text-slate-400">{String(value)}</span>,
  },
  {
    key: "name",
    title: "Program Name",
    dataIndex: "name",
    width: 260,
    sortable: true,
    filterType: "text",
    render: (value) => <span className="font-medium text-slate-200">{String(value)}</span>,
  },
  {
    key: "agency",
    title: "Agency",
    dataIndex: "agency",
    width: 170,
    sortable: true,
    filterType: "select",
    filterOptions: AGENCY_OPTIONS,
    render: (value) => <span className="text-slate-300">{String(value)}</span>,
  },
  {
    key: "budget",
    title: "FY27 Request",
    dataIndex: "budget",
    width: 130,
    sortable: true,
    render: (value) => <span className="font-mono text-slate-200">{String(value)}</span>,
  },
  {
    key: "risk",
    title: "Risk Tier",
    dataIndex: "risk",
    width: 130,
    sortable: true,
    sorter: (a, b) => RISK_RANK[a.risk] - RISK_RANK[b.risk],
    filterType: "select",
    filterOptions: [
      { label: "High", value: "High" },
      { label: "Medium", value: "Medium" },
      { label: "Low", value: "Low" },
    ],
    render: (_value, record) => (
      <Badge variant="outline" className={RISK_BADGE_CLASS[record.risk]}>
        {record.risk}
      </Badge>
    ),
  },
  {
    key: "confidence",
    title: "AI Confidence",
    dataIndex: "confidence",
    width: 170,
    sortable: true,
    filterType: "numberRange",
    exportValue: (record) => `${record.confidence}%`,
    render: (_value, record) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-r-[4px] bg-emerald-400"
            style={{ width: `${record.confidence}%` }}
          />
        </div>
        <span className="font-mono text-xs text-slate-400">{record.confidence}%</span>
      </div>
    ),
  },
];

const exportableColumns = columns;

export default function DefenseDashboard() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const openExplanation = (program: Program) => {
    setSelectedProgram(program);
    setIsDrawerOpen(true);
  };

  const gridColumns: DataGridColumn<Program>[] = [
    ...columns,
    {
      key: "actions",
      title: "",
      dataIndex: "id",
      width: 56,
      fixed: "right",
      disableHide: true,
      disableExport: true,
      render: (_value, record) => (
        <button
          type="button"
          aria-label={`Explain the ${record.risk} risk score for ${record.name}`}
          onClick={() => openExplanation(record)}
          className="group flex size-6 items-center justify-center rounded transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <ChevronRight
            className="h-4 w-4 text-slate-600 transition-colors group-hover:text-emerald-400"
            aria-hidden
          />
        </button>
      ),
    },
  ];

  const bulkActions: BulkAction<Program>[] = [
    {
      key: "export-selected",
      label: "Export Selected (CSV)",
      icon: <Download className="size-3.5" />,
      onClick: (rows) => {
        exportToCsv(rows, exportableColumns, "selected-programs");
        messageApi.success(`Exported ${rows.length} program${rows.length === 1 ? "" : "s"} to CSV.`);
      },
    },
    {
      key: "flag",
      label: "Flag for Review",
      icon: <ShieldAlert className="size-3.5" />,
      onClick: (rows) => {
        messageApi.success(
          `Flagged ${rows.length} program${rows.length === 1 ? "" : "s"} for analyst review.`,
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-100">
      {contextHolder}
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 font-mono text-sm text-emerald-400">
              <ShieldAlert className="h-4 w-4" /> OBVIANT DEFENSE ACQUISITION INTELLIGENCE
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Program &amp; Budget Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            >
              <Database className="mr-1 h-3 w-3" /> 14,209 Fused Sources Active
            </Badge>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Tracked Portfolio Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4.97B</div>
              <p className="mt-1 text-xs text-slate-500">
                +12.4% from previous fiscal baseline
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                High Risk Anomalies
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 Program</div>
              <p className="mt-1 text-xs text-slate-500">
                Requires manual contract line review
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                AI Extraction Confidence
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.7%</div>
              <p className="mt-1 text-xs text-slate-500">
                Cross-referenced structured &amp; unstructured
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Data Grid */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <DataGrid<Program>
            columns={gridColumns}
            data={programs}
            rowKey="id"
            title="Program & Budget Intelligence"
            bulkActions={bulkActions}
            pageSize={10}
            height={420}
          />
        </div>

        <p className="text-xs text-slate-500">
          Select the chevron on any row to open the explainability audit for that score.
        </p>

        {/* Explainable AI Side Drawer */}
        <ExplainabilityDrawer
          program={selectedProgram}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      </div>
    </div>
  );
}
