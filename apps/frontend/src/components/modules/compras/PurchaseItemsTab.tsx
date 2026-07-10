"use client";

import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
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
import { PurchaseRow } from "@/components/modules/compras/PurchaseRow";
import { MultiSearchSelect } from "@/components/shared/MultiSearchSelect";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useRecipes } from "@/hooks/useRecipes";
import { useLastPurchasePrices } from "@/hooks/usePurchases";
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
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);

  const hydratedWeekRef = useRef<string | null>(null);
  const skipNextAutoSaveRef = useRef(false);
  const lastSavedPayloadRef = useRef<string | null>(null);
  const loadedRecipeIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (purchase === undefined) return;
    if (hydratedWeekRef.current === weekId) return;
    hydratedWeekRef.current = weekId;
    skipNextAutoSaveRef.current = true;
    setSelectedRecipeIds([]);
    loadedRecipeIdsRef.current = new Set();
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
  }, [purchase, weekId]);

  const { data: recipes = [] } = useRecipes();
  const lastPrices = useLastPurchasePrices();

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

  const handleRecipeSelectionChange = useCallback(
    (values: string[]) => {
      const newRecipeIds = values.filter((id) => !loadedRecipeIdsRef.current.has(id));
      newRecipeIds.forEach((id) => loadedRecipeIdsRef.current.add(id));
      setSelectedRecipeIds(values);

      if (newRecipeIds.length === 0) return;

      const existingIngredientIds = new Set(rows.map((r) => r.ingredientId));
      const newIngredientIds: string[] = [];
      newRecipeIds.forEach((recipeId) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        recipe?.ingredients.forEach((ri) => {
          if (!existingIngredientIds.has(ri.ingredientId)) {
            existingIngredientIds.add(ri.ingredientId);
            newIngredientIds.push(ri.ingredientId);
          }
        });
      });

      if (newIngredientIds.length === 0) return;

      lastPrices.mutate(newIngredientIds, {
        onSuccess: (data) => {
          const lastByIngredient = new Map(data.map((d) => [d.ingredientId, d]));
          const newRows: DraftPurchaseRow[] = newIngredientIds.map((ingredientId) => {
            const ingredient = ingredients.find((i) => i.id === ingredientId);
            const last = lastByIngredient.get(ingredientId);
            return {
              ingredientId,
              unit: (ingredient?.unit as IngredientUnit) ?? "",
              quantity: last ? String(last.quantity) : "",
              totalValue: last
                ? (last.totalValue / 100).toFixed(2).replace(".", ",")
                : "",
              location: last?.location ?? undefined,
            };
          });
          setRows((prev) => [...prev, ...newRows]);
        },
      });
    },
    [rows, recipes, ingredients, lastPrices],
  );

  const [ingredientSheetOpen, setIngredientSheetOpen] = useState(false);

  const validItems = useMemo(
    () =>
      rows
        .filter((r) => r.ingredientId && r.quantity && r.totalValue)
        .map((r) => ({
          ingredientId: r.ingredientId,
          quantity: parseFloat(r.quantity.replace(",", ".")),
          totalValue: Math.round(
            parseFloat(r.totalValue.replace(",", ".")) * 100,
          ),
          location: r.location || undefined,
        })),
    [rows],
  );

  const debouncedSave = useDebouncedCallback(
    (items: PurchaseInput["items"]) => onSave({ weekId, items }),
    1000,
  );

  useEffect(() => {
    if (skipNextAutoSaveRef.current) {
      skipNextAutoSaveRef.current = false;
      lastSavedPayloadRef.current = JSON.stringify(validItems);
      return;
    }
    if (validItems.length === 0) return;
    const payload = JSON.stringify(validItems);
    if (payload === lastSavedPayloadRef.current) return;
    lastSavedPayloadRef.current = payload;
    debouncedSave(validItems);
  }, [validItems, debouncedSave]);

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

  const recipeOptions = useMemo(
    () => recipes.map((r) => ({ value: r.id, label: r.name })),
    [recipes],
  );

  return (
    <div>
      <div className="mb-4 max-w-sm">
        <MultiSearchSelect
          value={selectedRecipeIds}
          onValueChange={handleRecipeSelectionChange}
          options={recipeOptions}
          placeholder="Selecionar receitas..."
          searchPlaceholder="Pesquisar receita..."
          className="rounded-sm"
        />
      </div>
      <div className="flex gap-3 mb-4.5 flex-wrap">
        <div className="border border-border rounded-sm flex flex-col gap-1.5 p-5.5 w-60 bg-card">
          <span className="text-sm text-muted-foreground">
            Total Ingredientes
          </span>
          <div className="font-heading font-extrabold leading-none tracking-tight text-[30px]">
            {formatCurrency(ingredientTotalCents)}
          </div>
        </div>
        <div className="border border-border rounded-sm flex flex-col gap-1.5 p-5.5 w-60 bg-card">
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
      <div className="border border-border rounded-sm bg-card overflow-x-auto mb-4 p-1.5">
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
              table
                .getRowModel()
                .rows.map((row) => <PurchaseRow key={row.id} row={row} />)
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
          className="gap-1.5 rounded-sm"
        >
          <Plus className="size-4" />
          Adicionar item
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIngredientSheetOpen(true)}
          type="button"
          className="gap-1.5 rounded-sm"
        >
          <Plus className="size-4" />
          Novo ingrediente
        </Button>
        {validItems.length > 0 && (
          <span className="text-sm text-muted-foreground ml-auto">
            {isSaving ? "Salvando…" : "Salvo"}
          </span>
        )}
      </div>

      <IngredientSheet
        open={ingredientSheetOpen}
        onOpenChange={setIngredientSheetOpen}
      />
    </div>
  );
}
