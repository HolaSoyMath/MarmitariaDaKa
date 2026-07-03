"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function RecipeSheet({ open, onOpenChange, recipe }: Props) {
  const isEditing = !!recipe;

  const [name, setName] = useState(recipe?.name ?? "");
  const [rows, setRows] = useState<IngredientRow[]>(
    recipe?.ingredients.map((i) => ({
      ingredientId: i.ingredientId,
      quantity: String(i.quantity),
    })) ?? [{ ingredientId: "", quantity: "" }],
  );
  const [priceTypeIds, setPriceTypeIds] = useState<string[]>(
    recipe?.priceTypes.map((pt) => pt.id) ?? [],
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newIngredientOpen, setNewIngredientOpen] = useState(false);
  const [costByIngredient, setCostByIngredient] = useState<
    Record<string, number | null>
  >({});

  const { data: ingredients = [] } = useIngredients();
  const { data: priceTypes = [] } = usePriceTypes();

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const isSaving = createRecipe.isPending || updateRecipe.isPending;

  const handleEstimatedCostChange = useCallback(
    (ingredientId: string, costCents: number | null) => {
      if (!ingredientId) return;
      setCostByIngredient((prev) => ({ ...prev, [ingredientId]: costCents }));
    },
    [],
  );

  const totalCostCents = useMemo(
    () =>
      rows.reduce(
        (sum, row) => sum + (costByIngredient[row.ingredientId] ?? 0),
        0,
      ),
    [rows, costByIngredient],
  );

  function addRow() {
    setRows((r) => [...r, { ingredientId: "", quantity: "" }]);
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<IngredientRow>) {
    setRows((r) =>
      r.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function buildIngredients() {
    return rows
      .filter((r) => r.ingredientId && Number(r.quantity) > 0)
      .map((r) => ({
        ingredientId: r.ingredientId,
        quantity: Number(r.quantity),
      }));
  }

  function isValid() {
    const trimmed = name.trim();
    const ingredients = buildIngredients();
    return trimmed.length > 0 && ingredients.length > 0 && priceTypeIds.length > 0;
  }

  async function handleSave() {
    if (!isValid()) return;
    const payload = {
      name: name.trim(),
      ingredients: buildIngredients(),
      priceTypeIds,
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
          <div className="flex flex-col gap-4">
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
                      onClick={() =>
                        setPriceTypeIds((ids) =>
                          ids.includes(pt.id)
                            ? ids.filter((id) => id !== pt.id)
                            : [...ids, pt.id],
                        )
                      }
                      className="bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
                    >
                      {pt.type} {pt.size}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Ingredientes</Label>
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
                        updateRow(i, { ingredientId: val });
                      }}
                      onQuantityChange={(quantity) => updateRow(i, { quantity })}
                      onRemove={() => removeRow(i)}
                      removeDisabled={rows.length === 1}
                      onEstimatedCostChange={handleEstimatedCostChange}
                    />
                  );
                })}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed w-fit bg-card hover:bg-accent rounded-sm"
                onClick={addRow}
              >
                <Plus className="size-4 mr-1" /> Adicionar ingrediente
              </Button>
            </div>
          </div>
          <div className="rounded-sm p-2.5 text-center bg-terra-faint">
            <div className="font-mono text-[10px] uppercase tracking-widest text-terra/70">
              Custo Aproximado
            </div>
            <div className="font-heading font-extrabold text-2xl leading-tight text-terra">
              {totalCostCents > 0 ? formatCurrency(totalCostCents) : "-"}
            </div>
          </div>
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
