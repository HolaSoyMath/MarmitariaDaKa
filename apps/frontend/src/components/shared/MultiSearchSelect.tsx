'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'

export interface MultiSearchSelectOption {
  value: string
  label: string
  group?: string
}

interface MultiSearchSelectProps {
  value: string[]
  onValueChange: (value: string[]) => void
  options: MultiSearchSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

export function MultiSearchSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Selecionar...',
  searchPlaceholder = 'Pesquisar...',
  emptyText = 'Nenhum resultado.',
  className,
}: MultiSearchSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = options.filter((o) => value.includes(o.value))
  const hasGroups = options.some((o) => !!o.group)

  const sorted = [...options].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))

  const grouped = sorted.reduce<Record<string, MultiSearchSelectOption[]>>((acc, opt) => {
    const key = opt.group ?? ''
    if (!acc[key]) acc[key] = []
    acc[key].push(opt)
    return acc
  }, {})

  function toggle(optValue: string) {
    onValueChange(
      value.includes(optValue) ? value.filter((v) => v !== optValue) : [...value, optValue],
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm shadow-xs transition-colors cursor-pointer',
            'hover:bg-accent',
            'bg-card',
            selected.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">
            {selected.length === 0 ? placeholder : selected.map((o) => o.label).join(', ')}
          </span>
          <ChevronDown className={cn('ml-2 size-4 shrink-0 opacity-50 duration-300', open && '-rotate-180')} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-(--radix-popover-trigger-width) p-0 overflow-hidden shadow-none rounded-sm"
        align="start"
      >
        <Command className="bg-clip-padding">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="overflow-y-auto scrollbar-thin [scrollbar-color:var(--border)_var(--muted)]">
            <CommandEmpty>{emptyText}</CommandEmpty>
            {hasGroups
              ? Object.entries(grouped).map(([group, items]) => (
                  <CommandGroup key={group} heading={group || undefined}>
                    {items.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => toggle(opt.value)}
                        data-checked={value.includes(opt.value)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              : sorted.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => toggle(opt.value)}
                    data-checked={value.includes(opt.value)}
                    className="cursor-pointer hover:bg-white/90"
                  >
                    {opt.label}
                  </CommandItem>
                ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
