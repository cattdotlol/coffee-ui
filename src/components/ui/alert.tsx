import type { ComponentProps, ReactNode } from 'react'
import { CircleAlert, Info } from 'lucide-react'
import { cn } from './cn.ts'

export type AlertProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: string
  variant?: 'default' | 'destructive'
  icon?: ReactNode
}

export default function Alert({ title, variant = 'default', icon, className, children, ...props }: AlertProps) {
  const destructive = variant === 'destructive'
  const Icon = destructive ? CircleAlert : Info

  return (
    <div {...props} className={cn('flex gap-2.5 rounded-panel border bg-surface p-3 text-sm text-foreground', destructive ? 'border-danger/50' : 'border-border', className)}>
      <span aria-hidden="true" className={cn('mt-0.5 inline-flex size-4 shrink-0 [&>svg]:size-full', destructive ? 'text-danger' : 'text-muted')}>
        {icon ?? <Icon strokeWidth={1.5} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('font-medium', destructive ? 'text-danger' : '')}>{title}</p>
        {children && <div className="mt-1 text-xs leading-5 text-muted">{children}</div>}
      </div>
    </div>
  )
}
