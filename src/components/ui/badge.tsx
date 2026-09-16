import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type BadgeProps = ComponentProps<'span'> & {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  dot?: boolean
}

const variants = {
  default: 'border-transparent bg-primary text-on-primary',
  secondary: 'border-transparent bg-subtle text-foreground',
  outline: 'border-border text-foreground',
  destructive: 'border-transparent bg-destructive text-on-destructive',
}

export default function Badge({ variant = 'secondary', dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span {...props} className={cn('inline-flex items-center gap-1 rounded-control border px-1.5 py-0.5 text-xs font-medium leading-4 tabular-nums whitespace-nowrap [&>svg]:size-3', variants[variant], className)}>
      {dot && <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', variant === 'outline' || variant === 'secondary' ? 'bg-primary' : 'bg-current')} />}
      {children}
    </span>
  )
}
