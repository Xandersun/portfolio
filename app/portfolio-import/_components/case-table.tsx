import type { ReactNode } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * portfolio-import — shared case-study comparison-table treatment.
 * Wraps the existing shadcn Table primitives (unmodified — this file only
 * adds the container/header/row/cell styling around them) so every
 * editorial table across every case study shares one restrained, flat
 * look: small radius, no drop shadow, a subtle bordered container, a
 * quiet tinted header, and clear row separators. Previously each case
 * study re-declared its own TABLE_HEAD_CLASS/TABLE_CELL_CLASS/
 * TABLE_ROW_CLASS constants and its own container div — centralizing them
 * here is what fixes the styling everywhere at once (and had already let
 * two real inconsistencies creep in: Marriott's header had no background
 * tint, and its rows had no `last:border-0`; both are corrected simply by
 * routing through this shared component).
 *
 * Not used for genuinely data-dense/sortable/filterable data: that's
 * AG Grid's job (see app/(defense-app)/sandbox/views, outside
 * portfolio-import). These are small, static, editorial comparison
 * tables — a handful of rows the reader scans, not a product data grid —
 * so the plain Table primitives are the right fit per the project's own
 * "Table vs. AG Grid" split.
 */

export function CaseTable({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[800px] overflow-hidden rounded-sm border border-[#E2E8F0] bg-white text-[15px] shadow-none",
        className,
      )}
    >
      <Table>{children}</Table>
    </div>
  );
}

export function CaseTableHeader({ children }: { children: ReactNode }) {
  return (
    <TableHeader>
      <TableRow className="border-[#E2E8F0] hover:bg-transparent">{children}</TableRow>
    </TableHeader>
  );
}

export function CaseTableHead({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <TableHead
      className={cn(
        "h-auto whitespace-normal bg-[#F8F9FA] px-4 py-3.5 text-[13px] font-bold tracking-[0.05em] text-[#64748B] uppercase",
        className,
      )}
    >
      {children}
    </TableHead>
  );
}

export function CaseTableBody({ children }: { children: ReactNode }) {
  return <TableBody>{children}</TableBody>;
}

export function CaseTableRow({ children }: { children: ReactNode }) {
  return <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent last:border-0">{children}</TableRow>;
}

export function CaseTableCell({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <TableCell className={cn("whitespace-normal px-4 py-3.5 align-top text-[15px] leading-[1.4] text-[#334155]", className)}>
      {children}
    </TableCell>
  );
}
