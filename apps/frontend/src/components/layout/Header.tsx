'use client'

import { usePathname } from 'next/navigation'
import { WeekPicker } from '@/components/shared/WeekPicker'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/cardapio':   { title: 'Cardápio & Receitas', subtitle: 'monta a semana' },
  '/receitas':   { title: 'Receitas',             subtitle: 'cadastro de pratos' },
  '/ingredientes': { title: 'Ingredientes',       subtitle: 'cadastro de ingredientes' },
  '/clientes':   { title: 'Clientes',             subtitle: 'cadastro simples' },
  '/compras':    { title: 'Compras & Custos',     subtitle: 'mercado vira custo' },
  '/financeiro': { title: 'Financeiro',           subtitle: 'custo, faturamento e lucro' },
  '/pedidos':    { title: 'Pedidos',              subtitle: 'registrar e acompanhar' },
  '/precos':     { title: 'Preços',               subtitle: 'tabela de preços' },
  '/':           { title: 'Home',                 subtitle: 'o que precisa sair' },
}

function getPageMeta(pathname: string) {
  const sorted = Object.entries(PAGE_META).sort((a, b) => b[0].length - a[0].length)
  const match = sorted.find(([key]) => {
    if (key === '/') return pathname === '/'
    return pathname.startsWith(key)
  })
  return match?.[1] ?? { title: 'Marmitaria', subtitle: '' }
}

export function Header() {
  const pathname = usePathname()
  const { title, subtitle } = getPageMeta(pathname)

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3.5 border-b border-border px-[30px] py-[18px] bg-[color-mix(in_oklch,var(--background)_88%,transparent)] backdrop-blur-[8px]">
      <div className="flex flex-col">
        <h1 className="font-heading font-extrabold text-[25px] leading-tight tracking-tight whitespace-nowrap">
          {title}
        </h1>
        {subtitle && (
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-faint">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex-1" />
      <WeekPicker />
    </header>
  )
}
