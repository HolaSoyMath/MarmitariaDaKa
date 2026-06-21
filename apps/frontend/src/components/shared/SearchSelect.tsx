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
import { ChevronsUpDown } from 'lucide-react'

export interface SearchSelectOption {
  value: string
  label: string
  group?: string
}

interface SearchSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SearchSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

export function SearchSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Selecionar...',
  searchPlaceholder = 'Pesquisar...',
  emptyText = 'Nenhum resultado.',
  className,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)
  const hasGroups = options.some((o) => !!o.group)

  const grouped = options.reduce<Record<string, SearchSelectOption[]>>((acc, opt) => {
    const key = opt.group ?? ''
    if (!acc[key]) acc[key] = []
    acc[key].push(opt)
    return acc
  }, {})

  function select(optValue: string) {
    onValueChange(optValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors cursor-pointer',
            'hover:bg-accent/50',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {hasGroups
              ? Object.entries(grouped).map(([group, items]) => (
                  <CommandGroup key={group} heading={group || undefined}>
                    {items.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => select(opt.value)}
                        data-checked={opt.value === value}
                      >
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              : options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => select(opt.value)}
                    data-checked={opt.value === value}
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
