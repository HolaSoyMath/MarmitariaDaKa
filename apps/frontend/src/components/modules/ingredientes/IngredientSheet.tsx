'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateIngredient, useUpdateIngredient, useDeleteIngredient } from '@/hooks/useIngredients'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'
import type { IngredientUnit } from '@/constants/units'

const UNITS: IngredientUnit[] = ['g', 'kg', 'ml', 'L', 'un']

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: IngredientResponse
}

export function IngredientSheet({ open, onOpenChange, ingredient }: Props) {
  const isEditing = !!ingredient

  const [name, setName] = useState('')
  const [unit, setUnit] = useState<IngredientUnit>('g')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const createIngredient = useCreateIngredient()
  const updateIngredient = useUpdateIngredient()
  const deleteIngredient = useDeleteIngredient()

  const isSaving = createIngredient.isPending || updateIngredient.isPending

  useEffect(() => {
    if (open) {
      setName(ingredient?.name ?? '')
      setUnit(ingredient?.unit ?? 'g')
      setConfirmOpen(false)
    }
  }, [open, ingredient])

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    if (isEditing) {
      await updateIngredient.mutateAsync({ id: ingredient.id, data: { name: trimmed, unit } })
    } else {
      await createIngredient.mutateAsync({ name: trimmed, unit })
    }
    onOpenChange(false)
  }

  async function handleDelete() {
    if (!ingredient) return
    await deleteIngredient.mutateAsync(ingredient.id)
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle>{isEditing ? 'Editar ingrediente' : 'Novo ingrediente'}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-6 py-6 flex-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ing-name">Nome</Label>
              <Input
                id="ing-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ex: Requeijão"
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo</Label>
              <div className="flex gap-2 flex-wrap">
                {UNITS.map(u => (
                  <Button
                    key={u}
                    type="button"
                    variant={unit === u ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUnit(u)}
                  >
                    {u}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-row gap-2">
            {isEditing && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={() => setConfirmOpen(true)}
                disabled={deleteIngredient.isPending}
              >
                Remover
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
              Salvar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover ingrediente?</DialogTitle>
            <DialogDescription>
              <b>{ingredient?.name}</b> será removido do cadastro. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteIngredient.isPending}
            >
              Sim, remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
