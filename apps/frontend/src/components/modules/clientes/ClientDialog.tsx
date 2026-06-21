'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { useGroups } from '@/hooks/useGroups'
import type { ClientResponse } from '@marmitaria/schemas/client/clientResponse.schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: ClientResponse
  onOpenGroups: () => void
}

export function ClientSheet({ open, onOpenChange, client, onOpenGroups }: Props) {
  const isEditing = !!client

  const [form, setForm] = useState({ name: client?.name ?? '', groupId: client?.groupId ?? '' })

  const { data: groups = [] } = useGroups()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()

  const isSaving = createClient.isPending || updateClient.isPending

  async function handleSave() {
    const name = form.name.trim()
    if (!name || !form.groupId) return
    if (isEditing) {
      await updateClient.mutateAsync({ id: client.id, data: { name, groupId: form.groupId } })
    } else {
      await createClient.mutateAsync({ name, groupId: form.groupId })
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle>{isEditing ? 'Editar cliente' : 'Novo cliente'}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-6 py-6 flex-1">
          <div className="flex flex-col gap-2">
            <Label htmlFor="client-name">Nome</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="ex: Dona Lúcia"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Grupo</Label>
            <div className="flex gap-2 flex-wrap">
              {groups.map(group => (
                <Button
                  key={group.id}
                  type="button"
                  variant={form.groupId === group.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setForm(f => ({ ...f, groupId: group.id }))}
                >
                  {group.name}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed"
                onClick={onOpenGroups}
              >
                + Grupo
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.name.trim() || !form.groupId || isSaving}
          >
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
