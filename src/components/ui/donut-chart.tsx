import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from './cn.ts'
import { MAX_SERIES, nextIndex, seriesColor } from './chart-utils.ts'

export type DonutChartProps = {
  label: string
  data: readonly { label: string; value: number }[]
  formatValue?: (value: number) => string
  totalLabel?: string
  size?: number
  className?: string
}

const OTHER = 'var(--color-muted)'

function arc(cx: number, cy: number, inner: number, outer: number, start: number, end: number) {
  const point = (radius: number, angle: number) => `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`
  const large = end - start > Math.PI ? 1 : 0
  return `M${point(outer, start)} A${outer},${outer} 0 ${large} 1 ${point(outer, end)} L${point(inner, end)} A${inner},${inner} 0 ${large} 0 ${point(inner, start)} Z`
}

export default function DonutChart({ label, data, formatValue = (value) => value.toLocaleString(), totalLabel = 'Total', size = 176, className }: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const positive = data.filter((item) => item.value > 0)
  // Past four slots the tail folds into a neutral "Other" instead of inventing new hues.
  const segments = positive.length > MAX_SERIES
    ? [...[...positive].sort((a, b) => b.value - a.value).slice(0, MAX_SERIES - 1), { label: 'Other', value: [...positive].sort((a, b) => b.value - a.value).slice(MAX_SERIES - 1).reduce((sum, item) => sum + item.value, 0) }]
    : positive
  const colors = segments.map((item, position) => (item.label === 'Other' && positive.length > MAX_SERIES ? OTHER : seriesColor(position)))
  const total = segments.reduce((sum, item) => sum + item.value, 0)
  const center = size / 2
  const outer = center - 4
  const inner = outer * 0.66
  const pad = segments.length > 1 ? 2 / ((outer + inner) / 2) : 0
  const focused = active === null ? undefined : segments[active]
  const starts = segments.map((_, position) => -Math.PI / 2 + (segments.slice(0, position).reduce((sum, item) => sum + item.value, 0) / (total || 1)) * Math.PI * 2)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextIndex(event.key, active, segments.length - 1)
    if (next === null) return
    event.preventDefault()
    setActive(next)
  }

  return (
    <figure className={cn('flex flex-wrap items-center gap-5', className)}>
      <div
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the arrow keys to read segments.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive((current) => current ?? 0)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="relative shrink-0 rounded-full focus-visible:outline-offset-4"
        style={{ width: size, height: size }}
      >
        <p aria-live="polite" className="sr-only">{focused ? `${focused.label}: ${formatValue(focused.value)}, ${Math.round((focused.value / total) * 100)}%` : ''}</p>
        <svg aria-hidden="true" width={size} height={size} className="block">
          {total === 0 && <circle cx={center} cy={center} r={(outer + inner) / 2} fill="none" stroke="var(--color-border)" strokeWidth={outer - inner} />}
          {segments.map((item, position) => {
            const sweep = (item.value / total) * Math.PI * 2
            const start = starts[position]! + pad / 2
            const end = starts[position]! + sweep - pad / 2
            if (end <= start) return null
            return (
              <path
                key={item.label}
                d={arc(center, center, inner, active === position ? outer + 3 : outer, start, Math.min(end, start + Math.PI * 2 - 0.0001))}
                fill={colors[position]}
                fillOpacity={active === null || active === position ? 1 : 0.45}
                onPointerMove={() => setActive(position)}
                className="motion-safe:transition-[fill-opacity]"
              />
            )
          })}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-semibold tracking-tight">{formatValue(focused ? focused.value : total)}</span>
          <span className="max-w-[60%] truncate text-xs text-muted">{focused ? focused.label : totalLabel}</span>
        </div>
      </div>
      <table className="min-w-40 flex-1 text-sm">
        <caption className="sr-only">{label}</caption>
        <tbody>
          {segments.map((item, position) => (
            <tr key={item.label} onPointerEnter={() => setActive(position)} onPointerLeave={() => setActive(null)} className={cn('motion-safe:transition-opacity', active !== null && active !== position && 'opacity-60')}>
              <th scope="row" className="py-1 pr-3 text-left font-normal">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: colors[position] }} />
                  <span className="truncate">{item.label}</span>
                </span>
              </th>
              <td className="py-1 pr-3 text-right font-medium tabular-nums">{formatValue(item.value)}</td>
              <td className="py-1 text-right text-muted tabular-nums">{total ? Math.round((item.value / total) * 100) : 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
