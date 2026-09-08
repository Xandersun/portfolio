import type { DataGridColumn } from "@/components/data-grid/types";

function getExportRows<T>(data: T[], columns: DataGridColumn<T>[]) {
  return data.map((record) =>
    columns.map((column) => {
      if (column.exportValue) return column.exportValue(record);
      const value = record[column.dataIndex];
      return value == null ? "" : String(value);
    }),
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToCsv<T>(data: T[], columns: DataGridColumn<T>[], filename: string) {
  const headers = columns.map((column) => column.title);
  const rows = getExportRows(data, columns);
  const escape = (cell: unknown) => {
    const str = String(cell ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${filename}.csv`);
}

export async function exportToExcel<T>(data: T[], columns: DataGridColumn<T>[], filename: string) {
  const XLSX = await import("xlsx");
  const headers = columns.map((column) => column.title);
  const rows = getExportRows(data, columns);
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export async function exportToPdf<T>(
  data: T[],
  columns: DataGridColumn<T>[],
  filename: string,
  title?: string,
) {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });

  if (title) {
    doc.setFontSize(14);
    doc.text(title, 14, 16);
  }

  autoTable(doc, {
    head: [columns.map((column) => column.title)],
    body: getExportRows(data, columns).map((row) => row.map((cell) => String(cell))),
    startY: title ? 22 : 10,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [16, 24, 39] },
  });

  doc.save(`${filename}.pdf`);
}
