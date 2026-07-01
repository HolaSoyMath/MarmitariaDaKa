"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useIngredients } from "@/hooks/useIngredients";
import { UNIT_LABELS } from "@/constants/units";
import type { IngredientResponse } from "@marmitaria/schemas/ingredient/ingredientResponse.schema";
import { Plus } from "lucide-react";

export function IngredientsView() {
  const { data: ingredients = [], isLoading } = useIngredients();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<IngredientResponse | null>(null);

  function openCreate() {
    setSelected(null);
    setSheetOpen(true);
  }

  function openEdit(ingredient: IngredientResponse) {
    setSelected(ingredient);
    setSheetOpen(true);
  }

  return (
    <div className="p-7.5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          ingredientes cadastrados para usar em receitas e compras
        </p>
        <Button onClick={openCreate}>
          <Plus /> Novo ingrediente
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : ingredients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">
            Nenhum ingrediente cadastrado ainda.
          </p>
          <Button variant="outline" onClick={openCreate}>
            <Plus /> Cadastrar primeiro ingrediente
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-25" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(ingredient)}
                    >
                      Editar
                    </Button>
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
    </div>
  );
}
