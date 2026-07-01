import { type ColumnDef } from '@tanstack/react-table'
import { UNIT_DECIMALS } from '@/constants/units'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'
import type { IngredientUnit } from '@/constants/units'
import { SearchSelect } from '@/components/shared/SearchSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

export type DraftPurchaseRow = {
  ingredientId: string
  unit: IngredientUnit | ''
  quantity: string
  totalValue: string
  location?: string
}

interface PurchaseItemColumnCallbacks {
  ingredients: IngredientResponse[]
  onChangeRow: (index: number, field: keyof DraftPurchaseRow, value: string) => void
  onRemoveRow: (index: number) => void
}

function computeUnitValue(row: DraftPurchaseRow): string | null {
  if (!row.unit) return null
  const qty = parseFloat(row.quantity.replace(',', '.'))
  const total = parseFloat(row.totalValue.replace(',', '.'))
  if (!qty || !total) return null
  const dec = UNIT_DECIMALS[row.unit as IngredientUnit]
  return (total / qty).toFixed(dec) + ' /' + row.unit
}

export function getPurchaseItemColumns({
  ingredients,
  onChangeRow,
  onRemoveRow,
}: PurchaseItemColumnCallbacks): ColumnDef<DraftPurchaseRow>[] {
  const options = ingredients.map((ing) => ({ value: ing.id, label: `${ing.name} — ${ing.unit}` }))

  return [
    {
      id: 'item',
      header: 'Item',
      cell: ({ row }) => {
        const idx = row.index
        return (
          <SearchSelect
            value={row.original.ingredientId}
            onValueChange={(val) => {
              const ing = ingredients.find((i) => i.id === val)
              onChangeRow(idx, 'ingredientId', val)
              if (ing) onChangeRow(idx, 'unit', ing.unit)
            }}
            options={options}
            placeholder="Selecionar..."
            className="min-w-42.5 text-[14.5px] rounded-sm shadow-none"
          />
        )
      },
      size: 190,
    },
    {
      id: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.unit || '—'}</span>
      ),
      size: 64,
    },
    {
      id: 'quantidade',
      header: 'Quantidade',
      cell: ({ row }) => {
        const idx = row.index
        const unit = row.original.unit
        return (
          <span className="inline-flex items-center border border-input rounded-sm bg-card">
            <Input
              type="number"
              min="0"
              value={row.original.quantity}
              placeholder="0"
              onChange={(e) => onChangeRow(idx, 'quantity', e.target.value)}
              className="w-16 border-0 shadow-none py-2 pl-3 pr-1 bg-transparent font-[inherit] text-[14.5px] text-foreground focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:opacity-35"
            />
            {unit && (
              <span className="text-muted-foreground text-[13px] pr-3">{unit}</span>
            )}
          </span>
        )
      },
      size: 130,
    },
    {
      id: 'valorTotal',
      header: 'Valor total',
      cell: ({ row }) => {
        const idx = row.index
        return (
          <span className="inline-flex items-center border border-input rounded-sm bg-card">
            <span className="text-muted-foreground text-[13px] pl-3">R$</span>
            <Input
              type="text"
              inputMode="decimal"
              value={row.original.totalValue}
              placeholder="0,00"
              onChange={(e) => onChangeRow(idx, 'totalValue', e.target.value)}
              className="w-22 border-0 shadow-none py-2 pl-1.5 pr-3 bg-transparent font-[inherit] text-[14.5px] text-foreground focus-visible:ring-0"
            />
          </span>
        )
      },
      size: 140,
    },
    {
      id: 'valorUnitario',
      header: 'Valor unitário',
      cell: ({ row }) => {
        const val = computeUnitValue(row.original)
        return val ? (
          <span className="text-pix font-heading font-extrabold text-[17px] whitespace-nowrap">
            R$ {val}
          </span>
        ) : (
          <span className="text-muted-foreground font-semibold">—</span>
        )
      },
      size: 140,
    },
    {
      id: 'remove',
      header: '',
      cell: ({ row }) => (
        <Button
          type="button"
          title="remover"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveRow(row.index)}
          className="size-7.5 border border-input rounded-lg text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="size-4" />
        </Button>
      ),
      size: 44,
    },
  ]
}
