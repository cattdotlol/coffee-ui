import { cn } from './cn.ts'

export type LinkVariant = 'default' | 'muted' | 'plain'

const variants: Record<LinkVariant, string> = {
  default: 'font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground',
  muted: 'text-muted underline-offset-4 hover:text-foreground hover:underline',
  plain: 'text-foreground hover:underline underline-offset-4',
}

export function linkStyles({ variant = 'default', className }: { variant?: LinkVariant; className?: string } = {}) {
  return cn('inline-flex items-center gap-0.5 rounded-control motion-safe:transition-colors', variants[variant], className)
}
