import { useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from './cn.ts'
import ChartDataTable from './chart-data-table.tsx'
import ChartLegend from './chart-legend.tsx'
import ChartTooltip from './chart-tooltip.tsx'
import { MAX_SERIES, nextIndex, niceTicks, seriesColor } from './chart-utils.ts'
import type { ChartSeries } from './chart-utils.ts'

export type RadarChartProps<T extends Record<string, unknown>> = {
  label: string
  data: readonly T[]
  index: keyof T & string
  series: readonly ChartSeries<keyof T & string>[]
  formatValue?: (value: number) => string
  formatIndex?: (value: T[keyof T]) => string
  size?: number
  className?: string
}

export default function RadarChart<T extends Record<string, unknown>>({
  label, data, index, series, formatValue = (value) => value.toLocaleString(), formatIndex = (value) => String(value), size = 300, className,
}: RadarChartProps<T>) {
  const [active, setActive] = useState<number | null>(null)
  const shown = series.slice(0, MAX_SERIES)
  const value = (row: T, key: string) => Math.max(0, Number(row[key]) || 0)
  const ticks = niceTicks(Math.max(0, ...data.flatMap((row) => shown.map((item) => value(row, item.key)))), 4)
  const top = ticks.at(-1) || 1
  const center = size / 2
  const radius = center - 44
  const angle = (position: number) => -Math.PI / 2 + (position / Math.max(data.length, 1)) * Math.PI * 2
  const point = (position: number, amount: number) => {
    const distance = (amount / top) * radius
    return [center + Math.cos(angle(position)) * distance, center + Math.sin(angle(position)) * distance] as const
  }
  const polygon = (amounts: readonly number[]) => amounts.map((amount, position) => point(position, amount).join(',')).join(' ')
  const activeRow = active === null ? undefined : data[active]

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    const scale = size / box.width
    const turn = Math.atan2((event.clientY - box.top) * scale - center, (event.clientX - box.left) * scale - center) + Math.PI / 2
    const normalized = (turn + Math.PI * 2) % (Math.PI * 2)
    setActive(Math.round((normalized / (Math.PI * 2)) * data.length) % data.length)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextIndex(event.key, active, data.length - 1)
    if (next === null) return
    event.preventDefault()
    setActive(next)
  }

  return (
    <figure className={cn('grid justify-items-center gap-3', className)}>
      {shown.length > 1 && <ChartLegend shape="square" items={shown.map((item, position) => ({ label: item.label, color: seriesColor(position) }))} />}
      <div
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the arrow keys to read values.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive((current) => current ?? 0)}
        onBlur={() => setActive(null)}
        className="relative aspect-square w-full rounded-inner focus-visible:outline-offset-4"
        style={{ maxWidth: size }}
      >
        <p aria-live="polite" className="sr-only">
          {activeRow ? `${formatIndex(activeRow[index])}: ${shown.map((item) => `${item.label} ${formatValue(value(activeRow, item.key))}`).join(', ')}` : ''}
        </p>
        {data.length > 2 && (
          <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} className="block size-full overflow-visible text-xs" onPointerMove={handlePointerMove} onPointerLeave={() => setActive(null)}>
            {ticks.slice(1).map((tick) => (
              <polygon key={tick} points={polygon(data.map(() => tick))} fill="none" stroke="var(--color-border)" strokeWidth={1} />
            ))}
            {data.map((row, position) => {
              const [edgeX, edgeY] = point(position, top)
              const labelX = center + Math.cos(angle(position)) * (radius + 14)
              const labelY = center + Math.sin(angle(position)) * (radius + 14)
              const cos = Math.cos(angle(position))
              return (
                <g key={position}>
                  <line x1={center} y1={center} x2={edgeX} y2={edgeY} stroke={active === position ? 'var(--color-muted)' : 'var(--color-border)'} strokeWidth={1} />
                  <text x={labelX} y={labelY} dy="0.32em" textAnchor={Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end'} className={active === position ? 'fill-foreground font-medium' : 'fill-muted'}>
                    {formatIndex(row[index])}
                  </text>
                </g>
              )
            })}
            {ticks.slice(1).map((tick) => (
              <text key={`t${tick}`} x={center + 4} y={point(0, tick)[1]} dy="-0.3em" className="fill-muted tabular-nums">{formatValue(tick)}</text>
            ))}
            {shown.map((item, seriesIndex) => (
              <polygon
                key={item.key}
                points={polygon(data.map((row) => value(row, item.key)))}
                fill={seriesColor(seriesIndex)}
                fillOpacity={0.14}
                stroke={seriesColor(seriesIndex)}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
            {activeRow && active !== null && shown.map((item, seriesIndex) => {
              const [cx, cy] = point(active, value(activeRow, item.key))
              return <circle key={item.key} cx={cx} cy={cy} r={4} fill={seriesColor(seriesIndex)} stroke="var(--color-surface)" strokeWidth={2} />
            })}
          </svg>
        )}
        {activeRow && (
          <ChartTooltip
            title={formatIndex(activeRow[index])}
            rows={shown.map((item, seriesIndex) => ({ label: item.label, value: formatValue(value(activeRow, item.key)), color: seriesColor(seriesIndex), shape: 'square' }))}
            style={{ right: 0, top: 0 }}
          />
        )}
      </div>
      <ChartDataTable
        caption={label}
        headers={[index, ...shown.map((item) => item.label)]}
        rows={data.map((row) => [formatIndex(row[index]), ...shown.map((item) => formatValue(value(row, item.key)))])}
      />
    </figure>
  )
}
