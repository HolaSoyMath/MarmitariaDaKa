'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ClipboardListIcon,
  CalendarDaysIcon,
  ChefHatIcon,
  PackageIcon,
  UserIcon,
  TagIcon,
  ShoppingCartIcon,
  BarChart2Icon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/',           label: 'Home',               icon: HomeIcon },
  { href: '/pedidos',    label: 'Pedidos',             icon: ClipboardListIcon },
  { href: '/cardapio',   label: 'Cardápio da semana',  icon: CalendarDaysIcon },
  { href: '/receitas',      label: 'Receitas',              icon: ChefHatIcon },
  { href: '/ingredientes', label: 'Ingredientes',        icon: PackageIcon },
  { href: '/clientes',     label: 'Clientes',            icon: UserIcon },
  { href: '/precos',     label: 'Tipos & Preços',      icon: TagIcon },
  { href: '/compras',    label: 'Compras & Custos',    icon: ShoppingCartIcon },
  { href: '/financeiro', label: 'Financeiro',          icon: BarChart2Icon },
] as const

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 flex h-screen w-61 flex-none flex-col gap-1 bg-sidebar px-4 py-6 text-sidebar-foreground">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-3 px-1.5">
        <div className="grid size-12 flex-none place-items-center rounded-md bg-primary text-primary-foreground font-heading font-extrabold text-[22px]">
          Ká
        </div>
        <div>
          <b className="block font-heading font-extrabold text-[18px] leading-[1.05] tracking-tight text-white">
            Marmitaria<br />da Ká
          </b>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-sm px-3 py-2 text-[14.5px] font-semibold transition-colors',
              isActive(href)
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'hover:bg-white/6',
            )}
          >
            <span className="grid size-5 flex-none place-items-center">
              <Icon size={19} strokeWidth={1.7} />
            </span>
            {label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-sidebar-border pt-3">
        <p className="font-mono text-[10.5px] leading-[1.6] tracking-[0.04em] text-sidebar-faint">
          uso interno · Marmitaria da Ká
        </p>
      </div>
    </nav>
  )
}
