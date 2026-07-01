"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IngredientSheet } from "@/components/modules/ingredients/IngredientSheet";
import { useIngredients, useDeleteIngredient } from "@/hooks/useIngredients";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UNIT_LABELS } from "@/constants/units";
import type { IngredientResponse } from "@marmitaria/schemas/ingredient/ingredientResponse.schema";
import { Pencil, Plus, Search, Trash } from "lucide-react";

export function IngredientsView() {
  const { data: ingredients = [], isLoading } = useIngredients();
  const deleteIngredient = useDeleteIngredient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<IngredientResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IngredientResponse | null>(
    null,
  );
  const [search, setSearch] = useState("");

  function openCreate() {
    setSelected(null);
    setSheetOpen(true);
  }

  function openEdit(ingredient: IngredientResponse) {
    setSelected(ingredient);
    setSheetOpen(true);
  }

  const filteredIngredients = [...ingredients]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full rounded-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card rounded-sm"
          />
        </div>
        <Button onClick={openCreate} className="rounded-sm">
          <Plus /> Novo ingrediente
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filteredIngredients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center bg-card">
          <p className="text-muted-foreground">
            {search
              ? "Nenhum ingrediente encontrado."
              : "Nenhum ingrediente cadastrado ainda."}
          </p>
          {!search && (
            <Button variant="outline" onClick={openCreate}>
              <Plus /> Cadastrar primeiro ingrediente
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-40" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">
                    {ingredient.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {UNIT_LABELS[ingredient.unit]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(ingredient)}
                        className="bg-transparent hover:bg-accent rounded-sm"
                      >
                        <Pencil size={16} />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-destructive hover:text-background hover:bg-destructive rounded-sm"
                        onClick={() => setDeleteTarget(ingredient)}
                      >
                        <Trash size={16} />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <IngredientSheet
        key={selected?.id ?? "new"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        ingredient={selected ?? undefined}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remover ingrediente?"
        description={
          <>
            <b>{deleteTarget?.name}</b> será removido do cadastro. Essa ação não
            pode ser desfeita.
          </>
        }
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteIngredient.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        isPending={deleteIngredient.isPending}
      />
    </div>
  );
}