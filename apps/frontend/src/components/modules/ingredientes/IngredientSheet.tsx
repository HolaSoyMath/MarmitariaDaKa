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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from "@/hooks/useIngredients";
import { IngredientUnitEnum } from "@marmitaria/schemas/enums";
import type { IngredientResponse } from "@marmitaria/schemas/ingredient/ingredientResponse.schema";
import type { IngredientUnit } from "@marmitaria/schemas/enums";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient?: IngredientResponse;
}

export function IngredientSheet({ open, onOpenChange, ingredient }: Props) {
  const isEditing = !!ingredient;

  const [form, setForm] = useState<{ name: string; unit: IngredientUnit }>({
    name: ingredient?.name ?? "",
    unit: ingredient?.unit ?? "g",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();

  const isSaving = createIngredient.isPending || updateIngredient.isPending;

  async function handleSave() {
    const name = form.name.trim();
    if (!name) return;
    if (isEditing) {
      await updateIngredient.mutateAsync({
        id: ingredient.id,
        data: { name, unit: form.unit },
      });
    } else {
      await createIngredient.mutateAsync({ name, unit: form.unit });
    }
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!ingredient) return;
    await deleteIngredient.mutateAsync(ingredient.id);
    setConfirmOpen(false);
    onOpenChange(false);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle>
              {isEditing ? "Editar ingrediente" : "Novo ingrediente"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-6 py-6 flex-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ing-name">Nome</Label>
              <Input
                id="ing-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="ex: Requeijão"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo</Label>
              <div className="flex gap-2 flex-wrap">
                {IngredientUnitEnum.options.map((u) => (
                  <Button
                    key={u}
                    type="button"
                    variant={form.unit === u ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm((f) => ({ ...f, unit: u }))}
                  >
                    {u}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-row gap-2">
            {isEditing && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={() => setConfirmOpen(true)}
                disabled={deleteIngredient.isPending}
              >
                Remover
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name.trim() || isSaving}
            >
              Salvar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover ingrediente?"
        description={
          <>
            <b>{ingredient?.name}</b> será removido do cadastro. Essa ação não
            pode ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        isPending={deleteIngredient.isPending}
      />
    </>
  );
}
