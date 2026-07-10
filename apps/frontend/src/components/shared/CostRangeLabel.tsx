import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCostRange } from "@/formatters/recipeCost";
import { Info } from "lucide-react";

interface CostRangeLabelProps {
  sizes: { totalAverageCost?: number | null; isPartialAverageCost?: boolean }[];
  partialMessage: string;
  emptyFallback?: ReactNode;
}

export function CostRangeLabel({
  sizes,
  partialMessage,
  emptyFallback = <span className="text-muted-foreground">—</span>,
}: CostRangeLabelProps) {
  const { label, hasPartialCost } = getCostRange(sizes);

  if (label == null) return <>{emptyFallback}</>;

  if (!hasPartialCost) return <span>{label}</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1 text-yellow-600 cursor-help">
            {label}
            <Info className="size-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>{partialMessage}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
