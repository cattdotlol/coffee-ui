import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from './cn.ts'
import ChartDataTable from './chart-data-table.tsx'
import ChartLegend from './chart-legend.tsx'
import ChartTooltip from './chart-tooltip.tsx'
import { MAX_SERIES, nextIndex, niceTicks, seriesColor, useElementWidth } from './chart-utils.ts'
import type { ChartSeries } from './chart-utils.ts'

export type BarChartProps<T extends Record<string, unknown>> = {
  label: string
  data: readonly T[]
  index: keyof T & string
  series: readonly ChartSeries<keyof T & string>[]
  layout?: 'grouped' | 'stacked'
  showValues?: boolean
  formatValue?: (value: number) => string
  formatTick?: (value: number) => string
  formatIndex?: (value: T[keyof T]) => string
  height?: number
  className?: string
}

const GAP = 2
const MAX_BAR = 24

function column(x: number, y: number, width: number, height: number, rounded: boolean) {
  const r = rounded ? Math.min(4, width / 2, height) : 0
  return `M${x},${y + height} V${y + r} Q${x},${y} ${x + r},${y} H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${y + height} Z`
}

export default function BarChart<T extends Record<string, unknown>>({
  label, data, index, series, layout = 'grouped', showValues = false, formatValue = (value) => value.toLocaleString(), formatTick,
  formatIndex = (value) => String(value), height = 240, className,
}: BarChartProps<T>) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const shown = series.slice(0, MAX_SERIES)
  const stacked = layout === 'stacked' && shown.length > 1
  const value = (row: T, key: string) => Math.max(0, Number(row[key]) || 0)
  const total = (row: T) => shown.reduce((sum, item) => sum + value(row, item.key), 0)
  const ticks = niceTicks(Math.max(0, ...data.map((row) => (stacked ? total(row) : Math.max(...shown.map((item) => value(row, item.key)))))))
  const top = ticks.at(-1) ?? 1
  const margin = { top: showValues ? 20 : 12, right: 8, bottom: 28, left: 48 }
  const plotWidth = Math.max(width - margin.left - margin.right, 1)
  const plotHeight = height - margin.top - margin.bottom
  const y = (amount: number) => margin.top + plotHeight - (amount / top) * plotHeight
  const band = plotWidth / Math.max(data.length, 1)
  const barWidth = stacked
    ? Math.min(MAX_BAR, band * 0.6)
    : Math.max(2, Math.min(MAX_BAR, (band * 0.72 - GAP * (shown.length - 1)) / shown.length))
  const groupWidth = stacked ? barWidth : barWidth * shown.length + GAP * (shown.length - 1)
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(plotWidth / 56))))
  const last = data.length - 1
  const activeRow = active === null ? undefined : data[active]

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextIndex(event.key, active, last)
    if (next === null) return
    event.preventDefault()
    setActive(next)
  }

  return (
    <figure className={cn('grid gap-3', className)}>
      {shown.length > 1 && <ChartLegend shape="square" items={shown.map((item, position) => ({ label: item.label, color: seriesColor(position) }))} />}
      <div
        ref={ref}
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the arrow keys to read values.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive((current) => current ?? 0)}
        onBlur={() => setActive(null)}
        className="relative rounded-inner focus-visible:outline-offset-4"
        style={{ height }}
      >
        <p aria-live="polite" className="sr-only">
          {activeRow ? `${formatIndex(activeRow[index])}: ${shown.map((item) => `${item.label} ${formatValue(value(activeRow, item.key))}`).join(', ')}` : ''}
        </p>
        {width > 0 && data.length > 0 && (
          <svg aria-hidden="true" width={width} height={height} className="block overflow-visible text-xs" onPointerLeave={() => setActive(null)}>
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={margin.left} x2={margin.left + plotWidth} y1={y(tick)} y2={y(tick)} stroke="var(--color-border)" strokeWidth={1} shapeRendering="crispEdges" />
                <text x={margin.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted tabular-nums">{(formatTick ?? formatValue)(tick)}</text>
              </g>
            ))}
            {data.map((row, position) => {
              const bandX = margin.left + position * band
              const startX = bandX + (band - groupWidth) / 2
              const topKey = [...shown].reverse().find((item) => value(row, item.key) > 0)?.key
              return (
                <g key={position}>
                  {active === position && <rect x={bandX + 2} y={margin.top} width={band - 4} height={plotHeight} rx={6} fill="var(--color-subtle)" fillOpacity={0.7} />}
                  {shown.map((item, seriesIndex) => {
                    const amount = value(row, item.key)
                    if (!amount) return null
                    if (stacked) {
                      const base = shown.slice(0, seriesIndex).reduce((sum, previous) => sum + value(row, previous.key), 0)
                      const bottom = y(base) - (base > 0 ? GAP : 0)
                      const segmentTop = y(base + amount)
                      return bottom - segmentTop > 0
                        ? <path key={item.key} d={column(startX, segmentTop, barWidth, bottom - segmentTop, item.key === topKey)} fill={seriesColor(seriesIndex)} />
                        : null
                    }
                    const barX = startX + seriesIndex * (barWidth + GAP)
                    return <path key={item.key} d={column(barX, y(amount), barWidth, y(0) - y(amount), true)} fill={seriesColor(seriesIndex)} />
                  })}
                  {showValues && shown.length === 1 && (
                    <text x={startX + barWidth / 2} y={y(value(row, shown[0]!.key)) - 6} textAnchor="middle" className="fill-foreground font-medium tabular-nums">{formatValue(value(row, shown[0]!.key))}</text>
                  )}
                  {(position % labelEvery === 0) && (
                    <text x={bandX + band / 2} y={height - 8} textAnchor="middle" className="fill-muted">{formatIndex(row[index])}</text>
                  )}
                  <rect x={bandX} y={margin.top} width={band} height={plotHeight} fill="transparent" onPointerMove={() => setActive(position)} />
                </g>
              )
            })}
            <line x1={margin.left} x2={margin.left + plotWidth} y1={y(0)} y2={y(0)} stroke="var(--color-muted)" strokeOpacity={0.4} strokeWidth={1} shapeRendering="crispEdges" />
          </svg>
        )}
        {activeRow && active !== null && (
          <ChartTooltip
            title={formatIndex(activeRow[index]) + (stacked ? ` · ${formatValue(total(activeRow))} total` : '')}
            rows={shown.map((item, seriesIndex) => ({ label: item.label, value: formatValue(value(activeRow, item.key)), color: seriesColor(seriesIndex), shape: 'square' }))}
            style={{
              left: margin.left + (active + 1) * band + 164 > width ? Math.max(margin.left + active * band - 164, 0) : margin.left + (active + 1) * band + 4,
              top: margin.top,
            }}
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
