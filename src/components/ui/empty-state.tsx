import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type EmptyStateProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export default function EmptyState({ title, description, icon, action, className, ...props }: EmptyStateProps) {
  return (
    <div {...props} className={cn('flex flex-col items-center rounded-panel border border-dashed border-border px-6 py-10 text-center', className)}>
      {icon && <span aria-hidden="true" className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-subtle text-muted [&>svg]:size-5">{icon}</span>}
      <h3 className="text-sm font-medium">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-xs leading-5 text-muted">{description}</p>}
      {action && <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}
