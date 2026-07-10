import { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SearchSelect,
  type SearchSelectOption,
} from "@/components/shared/SearchSelect";
import { useIngredientPriceSeries } from "@/hooks/useIngredientCosts";
import { formatCurrency } from "@/formatters/currency";
import { X } from "lucide-react";

const MAX_RECENT_PURCHASES = 5;

interface Props {
  ingredientId: string;
  quantity: string;
  options: SearchSelectOption[];
  onIngredientChange: (ingredientId: string) => void;
  onQuantityChange: (quantity: string) => void;
  onRemove: () => void;
  removeDisabled: boolean;
  onEstimatedCostChange: (ingredientId: string, costCents: number | null) => void;
}

export function RecipeIngredientRow({
  ingredientId,
  quantity,
  options,
  onIngredientChange,
  onQuantityChange,
  onRemove,
  removeDisabled,
  onEstimatedCostChange,
}: Props) {
  const { data: priceSeries, isLoading: isPriceSeriesLoading } =
    useIngredientPriceSeries(ingredientId || null);

  const hasQuantity = Number(quantity) > 0;

  const estimatedCostCents = useMemo(() => {
    if (!priceSeries || priceSeries.length === 0) return null;
    if (!hasQuantity) return null;

    const recent = priceSeries.slice(-MAX_RECENT_PURCHASES);
    const avgUnitValue =
      recent.reduce((sum, p) => sum + p.unitValue, 0) / recent.length;
    return avgUnitValue * Number(quantity);
  }, [priceSeries, quantity, hasQuantity]);

  const showEmptyState =
    !!ingredientId &&
    hasQuantity &&
    !isPriceSeriesLoading &&
    (priceSeries?.length ?? 0) === 0;

  useEffect(() => {
    onEstimatedCostChange(ingredientId, ingredientId ? estimatedCostCents : null);
  }, [ingredientId, estimatedCostCents, onEstimatedCostChange]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <SearchSelect
          value={ingredientId}
          onValueChange={onIngredientChange}
          options={options}
          placeholder="Selecionar ingrediente"
          searchPlaceholder="Buscar ingrediente..."
          emptyText="Nenhum ingrediente encontrado."
          className="flex-1 min-w-0 rounded-sm shadow-none"
        />
        <Input
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder="Qtd."
          className="w-24 shrink-0 h-full bg-card rounded-sm"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={removeDisabled}
          className="rounded-sm shrink-0"
        >
          <X className="size-4 text-red-500" />
        </Button>
      </div>
      {estimatedCostCents != null && (
        <span className="text-xs text-muted-foreground pl-0.5">
          ≈ {formatCurrency(estimatedCostCents)} — média das últimas{" "}
          {Math.min(priceSeries?.length ?? 0, MAX_RECENT_PURCHASES)} compra
          {Math.min(priceSeries?.length ?? 0, MAX_RECENT_PURCHASES) !== 1 ? "s" : ""}
        </span>
      )}
      {showEmptyState && (
        <span className="text-xs text-muted-foreground pl-0.5">
          sem histórico de compra ainda para esse ingrediente
        </span>
      )}
    </div>
  );
}
