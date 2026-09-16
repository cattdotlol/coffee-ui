import type { ComponentProps, ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from './cn.ts'
import Sparkline from './sparkline.tsx'

export type StatProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string
  value: ReactNode
  delta?: number
  deltaLabel?: string
  comparison?: string
  goodDirection?: 'up' | 'down'
  trend?: readonly number[]
}

export default function Stat({ label, value, delta, deltaLabel, comparison, goodDirection = 'up', trend, className, ...props }: StatProps) {
  const up = (delta ?? 0) >= 0
  const good = up === (goodDirection === 'up')
  const Icon = up ? TrendingUp : TrendingDown

  return (
    <div {...props} className={cn('rounded-panel border border-border bg-surface p-4 shadow-xs', className)}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {delta !== undefined && (
        <p className={cn('mt-1 flex flex-wrap items-center gap-1 text-xs font-medium', good ? 'text-primary' : 'text-danger')}>
          <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
          <span className="sr-only">{up ? 'Up' : 'Down'}</span>
          {deltaLabel ?? `${up ? '+' : '−'}${Math.abs(delta).toFixed(1)}%`}
          {comparison && <span className="font-normal text-muted">{comparison}</span>}
        </p>
      )}
      {trend && trend.length > 1 && <Sparkline values={trend} className="mt-3" />}
    </div>
  )
}
