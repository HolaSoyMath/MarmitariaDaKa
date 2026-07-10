"use client";

import { memo } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import { TableRow, TableCell } from "@/components/ui/table";
import type { DraftPurchaseRow } from "@/types/columnDefs/purchaseItemColumns";

export const PurchaseRow = memo(
  function PurchaseRow({ row }: { row: Row<DraftPurchaseRow> }) {
    return (
      <TableRow className="hover:bg-secondary transition-colors">
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-3 py-2.5">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  },
  (prev, next) => prev.row.original === next.row.original,
);
