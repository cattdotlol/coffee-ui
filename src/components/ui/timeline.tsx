import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type TimelineItem = {
  title: string
  description?: ReactNode
  time?: string
  dateTime?: string
  icon?: ReactNode
  active?: boolean
}

export type TimelineProps = Omit<ComponentProps<'ol'>, 'children'> & {
  items: readonly TimelineItem[]
}

export default function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol {...props} className={cn('text-sm', className)}>
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="group relative flex gap-3 pb-5 last:pb-0">
          <span aria-hidden="true" className="absolute top-7 bottom-0 left-3 w-px -translate-x-1/2 bg-border group-last:hidden" />
          <span aria-hidden="true" className={cn('relative flex size-6 shrink-0 items-center justify-center rounded-full border [&>svg]:size-3.5', item.active ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface text-muted')}>
            {item.icon ?? <span className={cn('size-1.5 rounded-full', item.active ? 'bg-on-primary' : 'bg-muted')} />}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-medium">{item.title}</p>
              {item.time && <time dateTime={item.dateTime} className="text-xs text-muted">{item.time}</time>}
            </div>
            {item.description && <div className="mt-0.5 text-xs leading-5 text-muted">{item.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}
