import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatUnit } from "@/formatters/unit";
import { formatCurrency } from "@/formatters/currency";
import { Info } from "lucide-react";
import type { RecipeResponse } from "@marmitaria/schemas/recipe/recipeResponse.schema";

interface RecipeIngredientsTableProps {
  priceTypes: RecipeResponse["priceTypes"];
}

const rowClassName = "border-b-0 hover:bg-transparent bg-secondary/40";

export function RecipeIngredientsTable({
  priceTypes,
}: RecipeIngredientsTableProps) {
  const [activeSizeId, setActiveSizeId] = useState(priceTypes[0]?.id ?? "");
  const active = priceTypes.find((pt) => pt.id === activeSizeId) ?? priceTypes[0];

  if (!active) {
    return (
      <TableRow className={`${rowClassName} animate-in fade-in slide-in-from-top-1 duration-200`}>
        <TableCell />
        <TableCell colSpan={4} className="text-sm text-muted-foreground">
          Nenhum tamanho cadastrado.
        </TableCell>
        <TableCell />
      </TableRow>
    );
  }

  const ingredients = active.ingredients;

  return (
    <Fragment>
      {priceTypes.length > 1 && (
        <TableRow className={`${rowClassName} animate-in fade-in slide-in-from-top-1 duration-200`}>
          <TableCell />
          <TableCell colSpan={4} className="py-1.5">
            <div className="flex gap-1.5 flex-wrap">
              {priceTypes.map((pt) => (
                <Button
                  key={pt.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  data-selected={pt.id === active.id}
                  onClick={() => setActiveSizeId(pt.id)}
                  className="h-6 px-2 text-xs bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
                >
                  {pt.type} {pt.size}
                </Button>
              ))}
            </div>
          </TableCell>
          <TableCell />
        </TableRow>
      )}
      {ingredients.length === 0 ? (
        <TableRow className={`${rowClassName} animate-in fade-in slide-in-from-top-1 duration-200`}>
          <TableCell />
          <TableCell colSpan={4} className="text-sm text-muted-foreground">
            Nenhum ingrediente cadastrado para esse tamanho.
          </TableCell>
          <TableCell />
        </TableRow>
      ) : (
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
          <TableRow className={rowClassName}>
            <TableCell />
            <TableCell colSpan={2} className="py-1.5 text-sm font-medium">
              Custo médio — {active.type} {active.size}
            </TableCell>
            <TableCell colSpan={2} className="py-1.5 text-sm font-medium">
              {active.totalAverageCost == null ? (
                <span className="text-muted-foreground">—</span>
              ) : active.isPartialAverageCost ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 text-yellow-600 cursor-help">
                        {formatCurrency(active.totalAverageCost)}
                        <Info className="size-3.5" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Esse custo médio não é oficial — há ingredientes desse tamanho sem
                      histórico de compra cadastrado.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span>{formatCurrency(active.totalAverageCost)}</span>
              )}
            </TableCell>
            <TableCell />
          </TableRow>
        </Fragment>
      )}
    </Fragment>
  );
}
