import { cn } from './cn.ts'
import Tooltip from './tooltip.tsx'

export type BarListProps = {
  label: string
  items: readonly { label: string; value: number }[]
  formatValue?: (value: number) => string
  className?: string
}

export default function BarList({ label, items, formatValue = (value) => value.toLocaleString(), className }: BarListProps) {
  const max = Math.max(...items.map((item) => item.value), 1)
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <ul aria-label={label} className={cn('space-y-2.5', className)}>
      {items.map((item) => (
        <li key={item.label} className="[&>span]:flex">
          <Tooltip content={`${formatValue(item.value)} · ${total ? Math.round((item.value / total) * 100) : 0}% of total`}>
            <div tabIndex={0} className="group grid w-full grid-cols-[minmax(5rem,8rem)_1fr] items-center gap-3 rounded-inner text-sm focus-visible:outline-offset-2">
              <span className="truncate text-muted">{item.label}</span>
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-5 min-w-1 rounded-r-[4px] bg-chart-1 motion-safe:transition-opacity group-hover:opacity-80 group-focus-visible:opacity-80" style={{ width: `calc((100% - 4.5rem) * ${item.value / max})` }} />
                <span className="shrink-0 font-medium tabular-nums">{formatValue(item.value)}</span>
              </span>
            </div>
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}
