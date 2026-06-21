import { cn } from '@/lib/utils'

type StatusBadgeVariant = 'prod' | 'done' | 'pend' | 'ghost'

interface StatusBadgeProps {
  variant: StatusBadgeVariant
  label: string
  className?: string
}

const variantStyles: Record<StatusBadgeVariant, { badge: string; dot: string }> = {
  prod:  { badge: 'bg-mustard-faint text-mustard-dark',                                  dot: 'bg-mustard' },
  done:  { badge: 'bg-pix-faint text-pix',                                               dot: 'bg-pix' },
  pend:  { badge: 'bg-swile-faint text-swile',                                           dot: 'bg-terra' },
  ghost: { badge: 'border border-dashed border-border-strong text-ink-faint bg-transparent', dot: 'bg-ink-faint' },
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const { badge, dot } = variantStyles[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] rounded-pill px-[11px] py-[3px]',
        'text-[12.5px] font-semibold whitespace-nowrap',
        badge,
        className,
      )}
    >
      <span className={cn('size-[9px] flex-none rounded-full', dot)} />
      {label}
    </span>
  )
}
