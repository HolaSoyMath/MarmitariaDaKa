'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { useGroups } from '@/hooks/useGroups'
import type { ClientResponse } from '@marmitaria/schemas/client/clientResponse.schema'
import { SheetBase } from '@/components/ui/SheetBase'

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
    <SheetBase
      resetKey={client?.id ?? 'new'}
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar cliente' : 'Novo cliente'}
      onSave={handleSave}
      onCancel={() => {}}
      saveButtonDisabled={!form.name.trim() || !form.groupId || isSaving}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="client-name">Nome</Label>
        <Input
          id="client-name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="ex: Dona Lúcia"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="bg-card rounded-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Grupo</Label>
        <div className="flex gap-2 flex-wrap">
          {groups.map(group => (
            <Button
              key={group.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setForm(f => ({ ...f, groupId: group.id }))}
              data-selected={form.groupId === group.id}
              className="bg-card hover:bg-accent rounded-sm data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary"
            >
              {group.name}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-dashed rounded-sm"
            onClick={onOpenGroups}
          >
            + Grupo
          </Button>
        </div>
      </div>
    </SheetBase>
  )
}
