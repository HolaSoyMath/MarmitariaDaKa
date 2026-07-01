"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IngredienteSelector } from "@/components/shared/IngredienteSelector";
import { IngredientSheet } from "@/components/modules/ingredients/IngredientSheet";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from "@/hooks/useRecipes";
import { X, Plus } from "lucide-react";
import type { RecipeResponse } from "@marmitaria/schemas/recipe/recipeResponse.schema";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newIngredientOpen, setNewIngredientOpen] = useState(false);

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const isSaving = createRecipe.isPending || updateRecipe.isPending;

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
    return trimmed.length > 0 && ingredients.length > 0;
  }

  async function handleSave() {
    if (!isValid()) return;
    const payload = { name: name.trim(), ingredients: buildIngredients() };
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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0 overflow-y-auto">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle>
              {isEditing ? "Editar receita" : "Nova receita"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-6 py-6 flex-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="recipe-name">Nome</Label>
              <Input
                id="recipe-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Frango grelhado"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Ingredientes</Label>
              <div className="flex flex-col gap-2">
                {rows.map((row, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <IngredienteSelector
                      value={row.ingredientId || null}
                      onChange={(id) => updateRow(i, { ingredientId: id })}
                      onCreateNew={() => setNewIngredientOpen(true)}
                      exclude={rows
                        .filter((_, j) => j !== i)
                        .map((r) => r.ingredientId)
                        .filter(Boolean)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={row.quantity}
                      onChange={(e) =>
                        updateRow(i, { quantity: e.target.value })
                      }
                      placeholder="Qtd."
                      className="w-24 h-full rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(i)}
                      disabled={rows.length === 1}
                    >
                      <X className="size-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed w-fit"
                onClick={addRow}
              >
                <Plus className="size-4 mr-1" /> Adicionar ingrediente
              </Button>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-row gap-2">
            {isEditing && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={() => setConfirmOpen(true)}
                disabled={deleteRecipe.isPending}
              >
                Remover
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!isValid() || isSaving}>
              Salvar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

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
