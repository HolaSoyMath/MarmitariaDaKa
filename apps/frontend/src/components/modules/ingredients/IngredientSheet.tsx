"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
  useIngredientSearch,
} from "@/hooks/useIngredients";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { IngredientUnitEnum } from "@marmitaria/schemas/enums";
import type { IngredientResponse } from "@marmitaria/schemas/ingredient/ingredientResponse.schema";
import type { IngredientUnit } from "@marmitaria/schemas/enums";
import { SheetBase } from "@/components/ui/SheetBase";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatches(name: string, terms: string[]) {
  if (terms.length === 0) return name;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return name
    .split(pattern)
    .map((part, i) =>
      terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
        <strong key={i}>{part}</strong>
      ) : (
        part
      )
    );
}

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debouncedSetSearch = useDebouncedCallback(setDebouncedSearch, 300);

  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();
  const ingredientSearch = useIngredientSearch(debouncedSearch);

  const isSaving = createIngredient.isPending || updateIngredient.isPending;

  const searchTerms = debouncedSearch.trim().split(/\s+/).filter(Boolean);
  const similarIngredients = (ingredientSearch.data ?? []).filter(
    (i) => i.id !== ingredient?.id
  );

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
      <SheetBase
        resetKey={ingredient?.id ?? "new"}
        open={open}
        onOpenChange={onOpenChange}
        title={isEditing ? "Editar ingrediente" : "Novo ingrediente"}
        onSave={handleSave}
        onCancel={() => {}}
        onDelete={isEditing ? () => setConfirmOpen(true) : undefined}
        deleteButtonDisabled={deleteIngredient.isPending}
        saveButtonDisabled={!form.name.trim() || isSaving}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="ing-name">Nome</Label>
          <Input
            id="ing-name"
            value={form.name}
            onChange={(e) => {
              const value = e.target.value;
              setForm((f) => ({ ...f, name: value }));
              debouncedSetSearch(value);
            }}
            placeholder="ex: Requeijão"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="bg-card rounded-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Tipo</Label>
          <div className="flex gap-2 flex-wrap">
            {IngredientUnitEnum.options.map((u) => (
              <Button
                key={u}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setForm((f) => ({ ...f, unit: u }))}
                data-selected={form.unit === u}
                className="bg-card hover:bg-accent rounded-sm w-9 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
              >
                {u}
              </Button>
            ))}
          </div>
        </div>

        {similarIngredients.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label>Ingredientes semelhantes</Label>
            <div className="flex flex-col gap-1 bg-card rounded-sm p-2">
              {similarIngredients.map((i) => (
                <span key={i.id} className="text-sm">
                  {highlightMatches(i.name, searchTerms)} - {i.unit}
                </span>
              ))}
            </div>
          </div>
        )}
      </SheetBase>

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
