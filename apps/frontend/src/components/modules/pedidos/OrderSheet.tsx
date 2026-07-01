'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SearchSelect } from '@/components/shared/SearchSelect'
import { OrderItemRow } from '@/components/modules/pedidos/OrderItemRow'
import { ClientSheet } from '@/components/modules/clientes/ClientDialog'
import { GroupsDialog } from '@/components/modules/clientes/GroupsDialog'
import { useOrderSheet } from '@/hooks/useOrderSheet'
import { useWeek } from '@/context/WeekContext'
import { formatCurrency } from '@/formatters/currency'
import { Plus } from 'lucide-react'
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

  const clientOptions = Object.entries(clientsByGroup).flatMap(([group, clients]) =>
    clients.map((c) => ({ value: c.id, label: c.name, group })),
  )

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0 overflow-y-auto bg-card">
          <SheetHeader className="flex-row items-center gap-3 px-5.5 py-5 border-b">
            <SheetTitle className="flex-1 font-heading font-extrabold text-xl">
              {isEditing ? 'Editar pedido' : 'Novo pedido'}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-5.5 py-5 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-md font-semibold text-muted-foreground">Cliente</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto py-1 text-xs cursor-pointer hover:bg-primary"
                  onClick={() => setClientSheetOpen(true)}
                >
                  <Plus /> Novo
                </Button>
              </div>
              <SearchSelect
                value={clientId}
                onValueChange={setClientId}
                options={clientOptions}
                placeholder="Selecionar cliente"
                searchPlaceholder="Pesquisar cliente..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-md font-semibold text-muted-foreground">
                  Itens do pedido
                </p>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  semana {currentWeek?.number}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {rows.map((row, i) => (
                  <OrderItemRow
                    key={i}
                    row={row}
                    isOnly={rows.length === 1}
                    menuItems={menuItems}
                    priceTypes={priceTypes}
                    onRemove={() => removeRow(i)}
                    onUpdate={(patch) => updateRow(i, patch)}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addRow}
                className="justify-center text-sm text-muted-foreground hover:text-foreground mt-0.5 cursor-pointer bg-transparent hover:bg-accent"
              >
                <Plus className="size-3.5" />
                Adicionar item
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
