import { Fragment } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatUnit } from "@/formatters/unit";
import { formatCurrency } from "@/formatters/currency";
import type { RecipeResponse } from "@marmitaria/schemas/recipe/recipeResponse.schema";

interface RecipeIngredientsTableProps {
  ingredients: RecipeResponse["ingredients"];
}

const rowClassName = "border-b-0 hover:bg-transparent bg-secondary/40";

export function RecipeIngredientsTable({
  ingredients,
}: RecipeIngredientsTableProps) {
  if (ingredients.length === 0) {
    return (
      <TableRow className={`${rowClassName} animate-in fade-in slide-in-from-top-1 duration-200`}>
        <TableCell />
        <TableCell colSpan={4} className="text-sm text-muted-foreground">
          Nenhum ingrediente cadastrado.
        </TableCell>
        <TableCell />
      </TableRow>
    );
  }

  return (
    <Fragment>
      <TableRow className={`${rowClassName} animate-in fade-in slide-in-from-top-1 duration-200`}>
        <TableCell />
        <TableCell className="py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
          Ingrediente
        </TableCell>
        <TableCell className="py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
          Quantidade
        </TableCell>
        <TableCell className="py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
          Valor unitário
        </TableCell>
        <TableCell className="py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
          Valor na receita
        </TableCell>
        <TableCell />
      </TableRow>
      {ingredients.map((item) => (
        <TableRow key={item.ingredientId} className={rowClassName}>
          <TableCell />
          <TableCell className="py-1.5 font-medium text-sm">
            {item.ingredient.name}
          </TableCell>
          <TableCell className="py-1.5 text-sm text-muted-foreground">
            {formatUnit(item.quantity, item.ingredient.unit)}
          </TableCell>
          {item.averageUnitCost != null ? (
            <>
              <TableCell className="py-1.5 text-sm text-muted-foreground">
                {formatCurrency(item.averageUnitCost)}
              </TableCell>
              <TableCell className="py-1.5 text-sm text-muted-foreground">
                {formatCurrency(item.averageCost!)}
              </TableCell>
            </>
          ) : (
            <>
              <TableCell className="py-1.5 text-sm text-muted-foreground">
                Sem registro
              </TableCell>
              <TableCell className="py-1.5 text-sm text-muted-foreground">
                Sem registro
              </TableCell>
            </>
          )}
          <TableCell />
        </TableRow>
      ))}
    </Fragment>
  );
}
