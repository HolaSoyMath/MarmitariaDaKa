"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/formatters/currency";
import {
  getPurchaseItemColumns,
  type DraftPurchaseRow,
} from "@/types/columnDefs/purchaseItemColumns";
import { IngredientSheet } from "@/components/modules/ingredients/IngredientSheet";
import type { PurchaseResponse } from "@marmitaria/schemas/purchase/purchaseResponse.schema";
import type { PurchaseInput } from "@marmitaria/schemas/purchase/purchaseInput.schema";
import type { IngredientResponse } from "@marmitaria/schemas/ingredient/ingredientResponse.schema";
import type { GeneralCostResponse } from "@marmitaria/schemas/generalCost/generalCostResponse.schema";
import type { IngredientUnit } from "@/constants/units";
import { Plus } from "lucide-react";

interface PurchaseItemsTabProps {
  purchase: PurchaseResponse | null | undefined;
  ingredients: IngredientResponse[];
  costs: GeneralCostResponse[];
  weekId: string;
  onSave: (input: PurchaseInput) => void;
  isSaving: boolean;
}

export function PurchaseItemsTab({
  purchase,
  ingredients,
  costs,
  weekId,
  onSave,
  isSaving,
}: PurchaseItemsTabProps) {
  const [rows, setRows] = useState<DraftPurchaseRow[]>([]);

  useEffect(() => {
    if (purchase === undefined) return;
    setRows(
      purchase
        ? purchase.items.map((item) => ({
            ingredientId: item.ingredientId,
            unit: item.ingredient.unit as IngredientUnit,
            quantity: String(item.quantity),
            totalValue: (item.totalValue / 100).toFixed(2).replace(".", ","),
            location: item.location ?? undefined,
          }))
        : [],
    );
  }, [purchase]);

  const handleChangeRow = useCallback(
    (index: number, field: keyof DraftPurchaseRow, value: string) => {
      setRows((prev) =>
        prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
      );
    },
    [],
  );

  const handleRemoveRow = useCallback((index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        ingredientId: "",
        unit: "",
        quantity: "",
        totalValue: "",
        location: undefined,
      },
    ]);
  };

  const [ingredientSheetOpen, setIngredientSheetOpen] = useState(false);

  const handleSave = () => {
    const items = rows
      .filter((r) => r.ingredientId && r.quantity && r.totalValue)
      .map((r) => ({
        ingredientId: r.ingredientId,
        quantity: parseFloat(r.quantity.replace(",", ".")),
        totalValue: Math.round(
          parseFloat(r.totalValue.replace(",", ".")) * 100,
        ),
        location: r.location || undefined,
      }));

    if (items.length === 0) return;
    onSave({ weekId, items });
  };

  const columns = useMemo(
    () =>
      getPurchaseItemColumns({
        ingredients,
        onChangeRow: handleChangeRow,
        onRemoveRow: handleRemoveRow,
      }),
    [ingredients, handleChangeRow, handleRemoveRow],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const ingredientTotalCents = rows.reduce((sum, r) => {
    const val = parseFloat(r.totalValue.replace(",", "."));
    return sum + (isNaN(val) ? 0 : Math.round(val * 100));
  }, 0);

  const grandTotalCents =
    ingredientTotalCents + costs.reduce((sum, c) => sum + c.value, 0);

  return (
    <div>
      <div className="border border-border rounded-lg bg-card shadow-sm overflow-x-auto mb-4 p-1.5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint px-3"
                    style={
                      header.column.columnDef.size
                        ? { width: header.column.columnDef.size }
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  Nenhum item ainda. Clique em &quot;+ Adicionar item&quot; para
                  começar.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-secondary transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRow}
          type="button"
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Adicionar item
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIngredientSheetOpen(true)}
          type="button"
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Novo ingrediente
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={
            isSaving ||
            rows.filter((r) => r.ingredientId && r.quantity && r.totalValue)
              .length === 0
          }
          type="button"
        >
          {isSaving ? "Salvando…" : "Salvar compra"}
        </Button>
      </div>

      <div className="flex gap-3 mt-4.5 flex-wrap">
        <div className="border border-border rounded-lg shadow-sm flex flex-col gap-1.5 p-5.5 w-60 bg-card">
          <span className="text-sm text-muted-foreground">
            Total Ingredientes
          </span>
          <div className="font-heading font-extrabold leading-none tracking-tight text-[30px]">
            {formatCurrency(ingredientTotalCents)}
          </div>
        </div>
        <div className="border border-border rounded-lg shadow-sm flex flex-col gap-1.5 p-5.5 w-60 bg-card">
          <span className="text-sm text-muted-foreground">
            Total geral (Ingred. + custo)
          </span>
          <div
            className="font-heading font-extrabold leading-none tracking-tight text-[30px]"
            style={{ color: "var(--swile)" }}
          >
            {formatCurrency(grandTotalCents)}
          </div>
        </div>
      </div>

      <IngredientSheet
        open={ingredientSheetOpen}
        onOpenChange={setIngredientSheetOpen}
      />
    </div>
  );
}
