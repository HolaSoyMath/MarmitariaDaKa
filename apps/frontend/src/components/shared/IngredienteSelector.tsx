'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDownIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'

interface IngredienteSelectorProps {
  value: string | null
  onChange: (id: string) => void
  onCreateNew: () => void
  className?: string
}

export function IngredienteSelector({
  value,
  onChange,
  onCreateNew,
  className,
}: IngredienteSelectorProps) {
  const { data: ingredients, isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const res = await api.get<IngredientResponse[]>('/ingredients')
      return res.data
    },
  })

  return (
    <div className={cn('relative', className)}>
      <select
        value={value ?? ''}
        disabled={isLoading}
        onChange={(e) => {
          if (e.target.value === '__create__') {
            onCreateNew()
            e.currentTarget.value = value ?? ''
          } else if (e.target.value) {
            onChange(e.target.value)
          }
        }}
        className="w-full min-h-10 appearance-none cursor-pointer rounded-md border-[1.5px] border-border-strong bg-card px-3 py-2 pr-8 text-[14.5px] text-foreground focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          {isLoading ? 'Carregando…' : 'Selecionar ingrediente'}
        </option>
        <option value="__create__">+ Cadastrar novo item</option>
        {ingredients?.map((ing) => (
          <option key={ing.id} value={ing.id}>
            {ing.name} — {ing.unit}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
    </div>
  )
}
