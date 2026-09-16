import { cn } from './cn.ts'
import { useElementWidth } from './chart-utils.ts'

export type SparklineProps = {
  values: readonly number[]
  label?: string
  height?: number
  className?: string
}

export default function Sparkline({ values, label, height = 32, className }: SparklineProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = 5
  const x = (index: number) => pad + (index / Math.max(values.length - 1, 1)) * (width - pad * 2)
  const y = (value: number) => pad + (1 - (value - min) / Math.max(max - min, Number.EPSILON)) * (height - pad * 2)
  const points = values.map((value, index) => `${x(index)},${y(value)}`)
  const last = values.length - 1

  return (
    <div ref={ref} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn('w-full', className)} style={{ height }}>
      {width > 0 && values.length > 1 && (
        <svg aria-hidden="true" width={width} height={height} className="block overflow-visible">
          <polyline points={points.slice(0, -1).join(' ')} fill="none" stroke="var(--color-muted)" strokeOpacity={0.45} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={points.slice(-2).join(' ')} fill="none" stroke="var(--color-chart-1)" strokeWidth={2} strokeLinecap="round" />
          <circle cx={x(last)} cy={y(values[last]!)} r={4} fill="var(--color-chart-1)" stroke="var(--color-surface)" strokeWidth={2} />
        </svg>
      )}
    </div>
  )
}
