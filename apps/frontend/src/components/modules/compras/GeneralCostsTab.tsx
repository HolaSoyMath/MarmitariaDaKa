'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/formatters/currency'
import type { GeneralCostResponse } from '@marmitaria/schemas/generalCost/generalCostResponse.schema'
import { Check, Plus, X } from 'lucide-react'

interface GeneralCostsTabProps {
  costs: GeneralCostResponse[]
  ingredientTotalCents: number
  weekId: string
  onCreate: (description: string, valueCents: number) => void
  onUpdate: (id: string, description: string, valueCents: number) => void
  onDelete: (id: string) => void
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

interface EditState {
  description: string
  value: string
}

export function GeneralCostsTab({
  costs,
  ingredientTotalCents,
  weekId: _weekId,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: GeneralCostsTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({ description: '', value: '' })
  const [addingNew, setAddingNew] = useState(false)
  const [newCost, setNewCost] = useState<EditState>({ description: '', value: '' })

  const gasCost = costs.find((c) => c.automatic)
  const manualCosts = costs.filter((c) => !c.automatic)

  const grandTotalCents =
    ingredientTotalCents + costs.reduce((sum, c) => sum + c.value, 0)

  function startEdit(cost: GeneralCostResponse) {
    setEditingId(cost.id)
    setEditState({
      description: cost.description,
      value: (cost.value / 100).toFixed(2).replace('.', ','),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditState({ description: '', value: '' })
  }

  function saveEdit(id: string) {
    const cents = Math.round(parseFloat(editState.value.replace(',', '.')) * 100)
    if (!editState.description || isNaN(cents)) return
    onUpdate(id, editState.description, cents)
    setEditingId(null)
  }

  function saveNew() {
    const cents = Math.round(parseFloat(newCost.value.replace(',', '.')) * 100)
    if (!newCost.description || isNaN(cents)) return
    onCreate(newCost.description, cents)
    setNewCost({ description: '', value: '' })
    setAddingNew(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
      <div className="border border-border rounded-lg bg-card p-5.5">
        <b className="text-[18px]">Custos gerais da semana</b>
        <p className="text-sm text-muted-foreground mt-0.5 mb-3">lançados na mão · gás é automático</p>

        {manualCosts.map((cost) => (
          <div
            key={cost.id}
            className="flex items-center gap-3 py-2.75 border-b border-border last:border-b-0"
          >
            {editingId === cost.id ? (
              <>
                <Input
                  className="flex-1 rounded-sm text-[14.5px] min-w-0"
                  value={editState.description}
                  onChange={(e) => setEditState((s) => ({ ...s, description: e.target.value }))}
                />
                <span className="inline-flex items-center border border-input rounded-sm bg-card">
                  <span className="text-muted-foreground text-[13px] pl-3">R$</span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    className="w-20 border-0 bg-transparent shadow-none py-2 pl-1.5 pr-3 text-[14.5px] focus-visible:ring-0"
                    value={editState.value}
                    onChange={(e) => setEditState((s) => ({ ...s, value: e.target.value }))}
                  />
                </span>
                <Button
                  type="button"
                  title="salvar"
                  variant="ghost"
                  size="icon"
                  onClick={() => saveEdit(cost.id)}
                  disabled={isUpdating}
                  className="size-7.5 border border-input rounded-lg text-pix hover:bg-pix/10 hover:text-pix"
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  type="button"
                  title="cancelar"
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  className="size-7.5 border border-input rounded-lg text-muted-foreground hover:bg-secondary hover:text-muted-foreground"
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <span
                  className="flex-1 cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => startEdit(cost)}
                >
                  {cost.description}
                </span>
                <span className="inline-flex items-center border border-input rounded-sm bg-card">
                  <span className="text-muted-foreground text-[13px] pl-3">R$</span>
                  <span
                    className="w-20 py-2 pl-1.5 pr-3 text-[14.5px] cursor-pointer"
                    onClick={() => startEdit(cost)}
                  >
                    {(cost.value / 100).toFixed(2).replace('.', ',')}
                  </span>
                </span>
                <Button
                  type="button"
                  title="remover"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(cost.id)}
                  disabled={isDeleting}
                  className="size-7.5 border border-input rounded-lg text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="size-4" />
                </Button>
              </>
            )}
          </div>
        ))}

        {gasCost && (
          <div
            className="flex items-center gap-3 py-2.75 border-b border-border last:border-b-0 rounded-lg px-2"
            style={{ background: 'oklch(0.62 0.08 130 / 0.10)' }}
          >
            <span className="flex-1">
              Gás{' '}
              <span className="font-mono text-xs tracking-wide text-muted-foreground">
                (auto = 5% dos ingredientes)
              </span>
            </span>
            <span className="text-pix font-heading font-extrabold text-lg">
              {formatCurrency(gasCost.value)}
            </span>
          </div>
        )}

        {addingNew ? (
          <div className="flex items-center gap-3 py-2.75 border-t border-border mt-1">
            <Input
              className="flex-1 rounded-sm text-[14.5px] min-w-0"
              placeholder="Descrição"
              value={newCost.description}
              onChange={(e) => setNewCost((s) => ({ ...s, description: e.target.value }))}
              autoFocus
            />
            <span className="inline-flex items-center border border-input rounded-sm bg-card">
              <span className="text-muted-foreground text-[13px] pl-3">R$</span>
              <Input
                type="text"
                inputMode="decimal"
                className="w-20 border-0 bg-transparent shadow-none py-2 pl-1.5 pr-3 text-[14.5px] focus-visible:ring-0"
                placeholder="0,00"
                value={newCost.value}
                onChange={(e) => setNewCost((s) => ({ ...s, value: e.target.value }))}
              />
            </span>
            <Button
              type="button"
              title="adicionar"
              variant="ghost"
              size="icon"
              onClick={saveNew}
              disabled={isCreating}
              className="size-7.5 border border-input rounded-lg text-pix hover:bg-pix/10 hover:text-pix"
            >
              <Check className="size-4" />
            </Button>
            <Button
              type="button"
              title="cancelar"
              variant="ghost"
              size="icon"
              onClick={() => { setAddingNew(false); setNewCost({ description: '', value: '' }) }}
              className="size-7.5 border border-input rounded-lg text-muted-foreground hover:bg-secondary hover:text-muted-foreground"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5"
            onClick={() => setAddingNew(true)}
            type="button"
          >
            <Plus className="size-4" />
            Adicionar custo
          </Button>
        )}
      </div>

      <div className="border border-border rounded-lg bg-card p-5.5 flex flex-col justify-center gap-2">
        <span className="text-sm text-muted-foreground">Custo de ingredientes</span>
        <div className="font-heading font-extrabold leading-none tracking-tight text-[30px]">
          {formatCurrency(ingredientTotalCents)}
        </div>
        <span className="text-sm text-muted-foreground mt-2">+ custos gerais + gás</span>
        <div
          className="font-heading font-extrabold leading-none tracking-tight text-[30px]"
          style={{ color: 'var(--swile)' }}
        >
          {formatCurrency(grandTotalCents)}
        </div>
      </div>
    </div>
  )
}
