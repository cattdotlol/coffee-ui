import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type DescriptionListItem = { label: string; value: ReactNode }

export type DescriptionListProps = Omit<ComponentProps<'dl'>, 'children'> & {
  items: readonly DescriptionListItem[]
  orientation?: 'horizontal' | 'vertical'
}

export default function DescriptionList({ items, orientation = 'horizontal', className, ...props }: DescriptionListProps) {
  return (
    <dl {...props} className={cn('divide-y divide-border text-sm', className)}>
      {items.map((item) => (
        <div key={item.label} className={cn('py-2.5', orientation === 'horizontal' ? 'grid gap-1 sm:grid-cols-[minmax(8rem,1fr)_2fr] sm:gap-4' : 'grid gap-1')}>
          <dt className="text-muted">{item.label}</dt>
          <dd className="min-w-0 break-words text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
