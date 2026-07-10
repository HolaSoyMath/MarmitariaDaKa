"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type SearchSelectOption } from "@/components/shared/SearchSelect";
import { IngredientSheet } from "@/components/modules/ingredients/IngredientSheet";
import { RecipeIngredientRow } from "@/components/modules/receitas/RecipeIngredientRow";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SheetBase } from "@/components/ui/SheetBase";
import {
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from "@/hooks/useRecipes";
import { useIngredients } from "@/hooks/useIngredients";
import { usePriceTypes } from "@/hooks/usePriceTypes";
import { formatCurrency } from "@/formatters/currency";
import { Plus } from "lucide-react";
import type { RecipeResponse } from "@marmitaria/schemas/recipe/recipeResponse.schema";

const CREATE_NEW_INGREDIENT = "__create__";

interface IngredientRow {
  ingredientId: string;
  quantity: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: RecipeResponse;
}

function emptyRow(): IngredientRow {
  return { ingredientId: "", quantity: "" };
}

export function RecipeSheet({ open, onOpenChange, recipe }: Props) {
  const isEditing = !!recipe;

  const [name, setName] = useState(recipe?.name ?? "");
  const [priceTypeIds, setPriceTypeIds] = useState<string[]>(
    recipe?.priceTypes.map((pt) => pt.id) ?? [],
  );
  const [rowsByPriceType, setRowsByPriceType] = useState<
    Record<string, IngredientRow[]>
  >(() =>
    Object.fromEntries(
      (recipe?.priceTypes ?? []).map((pt) => [
        pt.id,
        pt.ingredients.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: String(i.quantity),
        })),
      ]),
    ),
  );
  const [activeTab, setActiveTab] = useState<string>(
    recipe?.priceTypes[0]?.id ?? "",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newIngredientOpen, setNewIngredientOpen] = useState(false);
  const [costByPriceType, setCostByPriceType] = useState<
    Record<string, Record<string, number | null>>
  >({});

  const { data: ingredients = [] } = useIngredients();
  const { data: priceTypes = [] } = usePriceTypes();

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const isSaving = createRecipe.isPending || updateRecipe.isPending;

  const handleEstimatedCostChange = useCallback(
    (priceTypeId: string, ingredientId: string, costCents: number | null) => {
      if (!ingredientId) return;
      setCostByPriceType((prev) => ({
        ...prev,
        [priceTypeId]: { ...prev[priceTypeId], [ingredientId]: costCents },
      }));
    },
    [],
  );

  // Stable per-size callback identity — RecipeIngredientRow depends on this reference
  // inside a useEffect, so an inline arrow here would recreate it every render and loop.
  const costChangeHandlers = useMemo(() => {
    const handlers: Record<string, (ingredientId: string, cost: number | null) => void> = {};
    priceTypeIds.forEach((id) => {
      handlers[id] = (ingredientId, cost) => handleEstimatedCostChange(id, ingredientId, cost);
    });
    return handlers;
  }, [priceTypeIds, handleEstimatedCostChange]);

  function rowsFor(ptId: string): IngredientRow[] {
    return rowsByPriceType[ptId] ?? [emptyRow()];
  }

  function totalCostFor(ptId: string): number {
    const costs = costByPriceType[ptId] ?? {};
    return rowsFor(ptId).reduce(
      (sum, row) => sum + (costs[row.ingredientId] ?? 0),
      0,
    );
  }

  function toggleSize(id: string) {
    setPriceTypeIds((ids) => {
      if (ids.includes(id)) {
        const next = ids.filter((i) => i !== id);
        setRowsByPriceType((prev) => {
          const rest = { ...prev };
          delete rest[id];
          return rest;
        });
        setActiveTab((current) => (current === id ? next[0] ?? "" : current));
        return next;
      }

      setRowsByPriceType((prev) => {
        if (prev[id]) return prev;
        const sourceId = ids[0];
        const sourceRows = sourceId ? prev[sourceId] : undefined;
        return {
          ...prev,
          [id]:
            sourceRows && sourceRows.length > 0
              ? sourceRows.map((r) => ({ ...r }))
              : [emptyRow()],
        };
      });
      setActiveTab(id);
      return [...ids, id];
    });
  }

  function addRow(ptId: string) {
    setRowsByPriceType((prev) => ({
      ...prev,
      [ptId]: [...rowsFor(ptId), emptyRow()],
    }));
  }

  function removeRow(ptId: string, index: number) {
    setRowsByPriceType((prev) => ({
      ...prev,
      [ptId]: rowsFor(ptId).filter((_, i) => i !== index),
    }));
  }

  function updateRow(ptId: string, index: number, patch: Partial<IngredientRow>) {
    setRowsByPriceType((prev) => ({
      ...prev,
      [ptId]: rowsFor(ptId).map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));
  }

  function buildIngredientsFor(ptId: string) {
    return rowsFor(ptId)
      .filter((r) => r.ingredientId && Number(r.quantity) > 0)
      .map((r) => ({
        ingredientId: r.ingredientId,
        quantity: Number(r.quantity),
      }));
  }

  function isValid() {
    const trimmed = name.trim();
    if (trimmed.length === 0 || priceTypeIds.length === 0) return false;
    return priceTypeIds.every((id) => buildIngredientsFor(id).length > 0);
  }

  async function handleSave() {
    if (!isValid()) return;
    const payload = {
      name: name.trim(),
      sizes: priceTypeIds.map((id) => ({
        priceTypeId: id,
        ingredients: buildIngredientsFor(id),
      })),
    };
    if (isEditing) {
      await updateRecipe.mutateAsync({ id: recipe.id, data: payload });
    } else {
      await createRecipe.mutateAsync(payload);
    }
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!recipe) return;
    await deleteRecipe.mutateAsync(recipe.id);
    setConfirmOpen(false);
    onOpenChange(false);
  }

  const selectedPriceTypes = useMemo(
    () => priceTypeIds.map((id) => priceTypes.find((pt) => pt.id === id)).filter(
      (pt): pt is (typeof priceTypes)[number] => !!pt,
    ),
    [priceTypeIds, priceTypes],
  );

  const activePriceType = selectedPriceTypes.find((pt) => pt.id === activeTab);

  return (
    <>
      <SheetBase
        resetKey={recipe?.id ?? "new"}
        open={open}
        onOpenChange={onOpenChange}
        title={isEditing ? "Editar receita" : "Nova receita"}
        onSave={handleSave}
        onCancel={() => {}}
        onDelete={isEditing ? () => setConfirmOpen(true) : undefined}
        deleteButtonDisabled={deleteRecipe.isPending}
        saveButtonDisabled={!isValid() || isSaving}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 flex-1 min-h-0 mb-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="recipe-name">Nome</Label>
              <Input
                id="recipe-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Frango grelhado"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="bg-card rounded-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tamanhos</Label>
              {priceTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum tipo de preço cadastrado.{" "}
                  <Link href="/precos" className="underline">
                    Cadastre um tamanho primeiro
                  </Link>
                  .
                </p>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {priceTypes.map((pt) => (
                    <Button
                      key={pt.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      data-selected={priceTypeIds.includes(pt.id)}
                      onClick={() => toggleSize(pt.id)}
                      className="bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
                    >
                      {pt.type} {pt.size}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {selectedPriceTypes.length > 0 && (
              <div className="flex flex-col gap-2 flex-1 min-h-0">
                <Label>Ingredientes</Label>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-1 min-h-0"
                >
                  <TabsList>
                    {selectedPriceTypes.map((pt) => (
                      <TabsTrigger
                        key={pt.id}
                        value={pt.id}
                        className="cursor-pointer data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary"
                      >
                        {pt.type} {pt.size}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {selectedPriceTypes.map((pt) => {
                    const rows = rowsFor(pt.id);
                    return (
                      <TabsContent
                        key={pt.id}
                        value={pt.id}
                        className="flex flex-col gap-3 overflow-y-auto"
                      >
                        <div className="flex flex-col gap-2">
                          {rows.map((row, i) => {
                            const excludedIds = rows
                              .filter((_, j) => j !== i)
                              .map((r) => r.ingredientId)
                              .filter(Boolean);
                            const options: SearchSelectOption[] = [
                              { value: CREATE_NEW_INGREDIENT, label: "+ Cadastrar novo item" },
                              ...ingredients
                                .filter((ing) => !excludedIds.includes(ing.id))
                                .map((ing) => ({
                                  value: ing.id,
                                  label: `${ing.name} — ${ing.unit}`,
                                })),
                            ];
                            return (
                              <RecipeIngredientRow
                                key={i}
                                ingredientId={row.ingredientId}
                                quantity={row.quantity}
                                options={options}
                                onIngredientChange={(val) => {
                                  if (val === CREATE_NEW_INGREDIENT) {
                                    setNewIngredientOpen(true);
                                    return;
                                  }
                                  updateRow(pt.id, i, { ingredientId: val });
                                }}
                                onQuantityChange={(quantity) =>
                                  updateRow(pt.id, i, { quantity })
                                }
                                onRemove={() => removeRow(pt.id, i)}
                                removeDisabled={rows.length === 1}
                                onEstimatedCostChange={costChangeHandlers[pt.id]}
                              />
                            );
                          })}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-dashed w-fit bg-card hover:bg-accent rounded-sm"
                          onClick={() => addRow(pt.id)}
                        >
                          <Plus className="size-4 mr-1" /> Adicionar ingrediente
                        </Button>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            )}
          </div>
          {activePriceType && (
            <div className="rounded-sm p-2.5 text-center bg-terra-faint">
              <div className="font-mono text-[10px] uppercase tracking-widest text-terra/70">
                Custo Aproximado — {activePriceType.type} {activePriceType.size}
              </div>
              <div className="font-heading font-extrabold text-2xl leading-tight text-terra">
                {totalCostFor(activePriceType.id) > 0
                  ? formatCurrency(totalCostFor(activePriceType.id))
                  : "-"}
              </div>
            </div>
          )}
        </div>
      </SheetBase>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover receita?"
        description={
          <>
            <b>{recipe?.name}</b> será removida do cadastro. Essa ação não pode
            ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        isPending={deleteRecipe.isPending}
      />

      <IngredientSheet
        open={newIngredientOpen}
        onOpenChange={setNewIngredientOpen}
      />
    </>
  );
}
