"use client";

import type { ReactNode } from "react";
import { Button, Dropdown, message } from "antd";
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";

import { exportToCsv, exportToExcel, exportToPdf } from "@/components/data-grid/export-utils";
import type { DataGridColumn, ExportFormat } from "@/components/data-grid/types";

interface ExportMenuProps<T> {
  formats: ExportFormat[];
  data: T[];
  columns: DataGridColumn<T>[];
  filename: string;
  title?: string;
}

const FORMAT_META: Record<ExportFormat, { label: string; icon: ReactNode }> = {
  csv: { label: "Export CSV", icon: <FileTextOutlined /> },
  excel: { label: "Export Excel", icon: <FileExcelOutlined /> },
  pdf: { label: "Export PDF", icon: <FilePdfOutlined /> },
};

export function ExportMenu<T>({ formats, data, columns, filename, title }: ExportMenuProps<T>) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleExport = async (format: ExportFormat) => {
    if (data.length === 0) {
      messageApi.warning("No rows to export in the current view.");
      return;
    }
    try {
      if (format === "csv") exportToCsv(data, columns, filename);
      else if (format === "excel") await exportToExcel(data, columns, filename);
      else await exportToPdf(data, columns, filename, title);
    } catch {
      messageApi.error(`Export to ${format.toUpperCase()} failed.`);
    }
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        trigger={["click"]}
        menu={{
          items: formats.map((format) => ({
            key: format,
            label: FORMAT_META[format].label,
            icon: FORMAT_META[format].icon,
          })),
          onClick: ({ key }) => {
            void handleExport(key as ExportFormat);
          },
        }}
      >
        <Button icon={<DownloadOutlined />}>Export</Button>
      </Dropdown>
    </>
  );
}
