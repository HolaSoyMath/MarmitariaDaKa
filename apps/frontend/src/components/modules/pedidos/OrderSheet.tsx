'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ClientSheet } from '@/components/modules/clientes/ClientDialog'
import { GroupsDialog } from '@/components/modules/clientes/GroupsDialog'
import { useOrderSheet } from '@/hooks/useOrderSheet'
import { useWeek } from '@/context/WeekContext'
import { formatCurrency } from '@/formatters/currency'
import { X, Plus, Minus } from 'lucide-react'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: OrderResponse
}

export function OrderSheet({ open, onOpenChange, order }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [clientSheetOpen, setClientSheetOpen] = useState(false)
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false)

  const { currentWeek } = useWeek()

  const {
    isEditing,
    clientId,
    setClientId,
    rows,
    addRow,
    removeRow,
    updateRow,
    isValid,
    isSaving,
    pixTotal,
    swileTotal,
    handleSave,
    handleDelete,
    clientsByGroup,
    menuItems,
    priceTypes,
    deleteOrder,
  } = useOrderSheet(order, onOpenChange)

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0 overflow-y-auto">
          <SheetHeader className="flex-row items-center gap-3 px-5.5 py-5 border-b">
            <SheetTitle className="flex-1 font-heading font-extrabold text-xl">
              {isEditing ? 'Editar pedido' : 'Novo pedido'}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-5.5 py-5 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-semibold text-muted-foreground">Cliente</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto py-1 text-xs cursor-pointer"
                  onClick={() => setClientSheetOpen(true)}
                >
                  <Plus /> Novo
                </Button>
              </div>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(clientsByGroup).map(([group, groupClients]) => (
                    <div key={group}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {group}
                      </div>
                      {groupClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-semibold text-muted-foreground">
                  Itens do pedido
                </Label>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  semana {currentWeek?.number}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {rows.map((row, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-md p-3.5 flex flex-col gap-3 bg-card"
                  >
                    <div className="flex gap-2 items-center">
                      <Select
                        value={row.menuItemId}
                        onValueChange={(v) => updateRow(i, { menuItemId: v })}
                      >
                        <SelectTrigger className="flex-1 min-w-0">
                          <SelectValue placeholder="Prato" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.recipe.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRow(i)}
                        disabled={rows.length === 1}
                        className="w-7.5 h-7.5 flex-none rounded-lg text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex border border-border rounded-lg overflow-hidden">
                        {priceTypes.map((pt) => (
                          <Button
                            key={pt.id}
                            type="button"
                            variant={row.priceTypeId === pt.id ? 'default' : 'ghost'}
                            onClick={() => updateRow(i, { priceTypeId: pt.id })}
                            className="rounded-none border-r border-border last:border-r-0 h-auto py-1.5 text-[13px] font-semibold cursor-pointer"
                          >
                            {pt.size}
                          </Button>
                        ))}
                      </div>

                      <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            updateRow(i, {
                              quantity: String(Math.max(0, Number(row.quantity) - 1)),
                            })
                          }
                          className="w-8 h-8.5 rounded-none p-0 cursor-pointer"
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-9 text-center font-heading font-extrabold text-lg border-l border-r border-border h-8.5 grid place-items-center">
                          {row.quantity === '' ? '0' : row.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            updateRow(i, { quantity: String(Number(row.quantity) + 1) })
                          }
                          className="w-8 h-8.5 rounded-none p-0 cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={addRow}
                className="justify-start text-sm text-muted-foreground hover:text-foreground mt-0.5 cursor-pointer"
              >
                <Plus className="size-3.5" />
                adicionar item
              </Button>
            </div>
          </div>

          <div className="px-5.5 py-4 border-t">
            <div className="flex gap-3.5">
              <div className="flex-1 rounded-md p-2.5 text-center bg-pix-faint">
                <div className="font-mono text-[10px] uppercase tracking-widest text-pix/70">
                  Total Pix
                </div>
                <div className="font-heading font-extrabold text-2xl leading-tight text-pix">
                  {formatCurrency(pixTotal)}
                </div>
              </div>
              <div className="flex-1 rounded-md p-2.5 text-center bg-swile-faint">
                <div className="font-mono text-[10px] uppercase tracking-widest text-swile/70">
                  Total Swile
                </div>
                <div className="font-heading font-extrabold text-2xl leading-tight text-swile">
                  {formatCurrency(swileTotal)}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5.5 py-4 border-t flex flex-col gap-3">
            {isEditing && order?.status === 'pending' && (
              <Button
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
                disabled={deleteOrder.isPending}
              >
                Remover pedido
              </Button>
            )}
            <div className="flex gap-2.5">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={!isValid() || isSaving}
              >
                Salvar pedido
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover pedido?"
        description={
          <>
            O pedido de <b>{order?.client.name}</b> será removido. Essa ação não pode ser
            desfeita.
          </>
        }
        onConfirm={handleDelete}
        isPending={deleteOrder.isPending}
      />

      <ClientSheet
        open={clientSheetOpen}
        onOpenChange={setClientSheetOpen}
        onOpenGroups={() => setGroupsDialogOpen(true)}
      />

      <GroupsDialog open={groupsDialogOpen} onOpenChange={setGroupsDialogOpen} />
    </>
  )
}
