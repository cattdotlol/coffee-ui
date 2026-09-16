import { useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { cn } from './cn.ts'
import ChartDataTable from './chart-data-table.tsx'
import ChartLegend from './chart-legend.tsx'
import ChartTooltip from './chart-tooltip.tsx'
import { MAX_SERIES, nextIndex, niceTicks, seriesColor, useElementWidth } from './chart-utils.ts'
import type { ChartSeries } from './chart-utils.ts'

export type LineChartProps<T extends Record<string, unknown>> = {
  label: string
  data: readonly T[]
  index: keyof T & string
  series: readonly ChartSeries<keyof T & string>[]
  formatValue?: (value: number) => string
  formatTick?: (value: number) => string
  formatIndex?: (value: T[keyof T], format: 'short' | 'long') => string
  area?: boolean
  height?: number
  className?: string
}

const defaultFormat = (value: number) => value.toLocaleString()

export default function LineChart<T extends Record<string, unknown>>({
  label, data, index, series, formatValue = defaultFormat, formatTick, formatIndex = (value) => String(value), area = false, height = 240, className,
}: LineChartProps<T>) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const shown = series.slice(0, MAX_SERIES)
  const multiple = shown.length > 1
  const value = (row: T, key: string) => Number(row[key]) || 0
  const ticks = niceTicks(Math.max(0, ...data.flatMap((row) => shown.map((item) => value(row, item.key)))))
  const top = ticks.at(-1) ?? 1
  const last = data.length - 1
  const margin = { top: 12, bottom: 28, left: 48 }
  const baseHeight = height - margin.top - margin.bottom
  const y = (amount: number) => margin.top + baseHeight - (amount / top) * baseHeight
  const endYs = shown.map((item) => (data[last] ? y(value(data[last], item.key)) : 0))
  const sortedEnds = [...endYs].sort((a, b) => a - b)
  // Converging end labels would detach from their lines, so fall back to the legend and tooltip.
  const endLabels = data.length > 0 && sortedEnds.every((end, position) => position === 0 || end - sortedEnds[position - 1]! >= 14)
  const right = endLabels ? (multiple ? 88 : 72) : 16
  const plotWidth = Math.max(width - margin.left - right, 1)
  const x = (position: number) => margin.left + (last > 0 ? (position / last) * plotWidth : plotWidth / 2)
  const tickEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(plotWidth / 88))))
  const activeRow = active === null ? undefined : data[active]

  function handlePointerMove(event: PointerEvent<SVGRectElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    setActive(Math.min(last, Math.max(0, Math.round(((event.clientX - box.left) / box.width) * last))))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextIndex(event.key, active, last)
    if (next === null) return
    event.preventDefault()
    setActive(next)
  }

  return (
    <figure className={cn('grid gap-3', className)}>
      {multiple && <ChartLegend shape="line" items={shown.map((item, position) => ({ label: item.label, color: seriesColor(position) }))} />}
      <div
        ref={ref}
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the arrow keys to read values.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive((current) => current ?? last)}
        onBlur={() => setActive(null)}
        className="relative rounded-inner focus-visible:outline-offset-4"
        style={{ height }}
      >
        <p aria-live="polite" className="sr-only">
          {activeRow ? `${formatIndex(activeRow[index], 'long')}: ${shown.map((item) => `${item.label} ${formatValue(value(activeRow, item.key))}`).join(', ')}` : ''}
        </p>
        {width > 0 && data.length > 0 && (
          <svg aria-hidden="true" width={width} height={height} className="block overflow-visible text-xs">
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={margin.left} x2={margin.left + plotWidth} y1={y(tick)} y2={y(tick)} stroke="var(--color-border)" strokeWidth={1} shapeRendering="crispEdges" />
                <text x={margin.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted tabular-nums">{(formatTick ?? formatValue)(tick)}</text>
              </g>
            ))}
            {data.map((row, position) => (position % tickEvery === 0 && last - position >= tickEvery / 2) || position === last ? (
              <text key={position} x={x(position)} y={height - 8} textAnchor={position === 0 ? 'start' : position === last ? 'end' : 'middle'} className="fill-muted tabular-nums">{formatIndex(row[index], 'short')}</text>
            ) : null)}
            {shown.map((item, seriesIndex) => {
              const path = data.map((row, position) => `${position ? 'L' : 'M'}${x(position)},${y(value(row, item.key))}`).join(' ')
              return (
                <g key={item.key}>
                  {area && !multiple && <path d={`${path} L${x(last)},${y(0)} L${x(0)},${y(0)} Z`} fill={seriesColor(seriesIndex)} fillOpacity={0.1} />}
                  <path d={path} fill="none" stroke={seriesColor(seriesIndex)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx={x(last)} cy={endYs[seriesIndex]} r={4} fill={seriesColor(seriesIndex)} stroke="var(--color-surface)" strokeWidth={2} />
                  {endLabels && (
                    <text x={x(last) + 10} y={endYs[seriesIndex]} dy="0.32em" className="fill-foreground font-medium tabular-nums">
                      {multiple ? item.label : formatValue(value(data[last]!, item.key))}
                    </text>
                  )}
                </g>
              )
            })}
            {activeRow && active !== null && (
              <g>
                <line x1={x(active)} x2={x(active)} y1={margin.top} y2={y(0)} stroke="var(--color-muted)" strokeOpacity={0.5} strokeWidth={1} shapeRendering="crispEdges" />
                {shown.map((item, seriesIndex) => (
                  <circle key={item.key} cx={x(active)} cy={y(value(activeRow, item.key))} r={4.5} fill={seriesColor(seriesIndex)} stroke="var(--color-surface)" strokeWidth={2} />
                ))}
              </g>
            )}
            <rect x={margin.left} y={margin.top} width={plotWidth} height={baseHeight} fill="transparent" onPointerMove={handlePointerMove} onPointerLeave={() => setActive(null)} />
          </svg>
        )}
        {activeRow && active !== null && (
          <ChartTooltip
            title={formatIndex(activeRow[index], 'long')}
            rows={shown.map((item, seriesIndex) => ({ label: item.label, value: formatValue(value(activeRow, item.key)), color: seriesColor(seriesIndex) }))}
            style={{ left: x(active) + 172 > width ? Math.max(x(active) - 172, 0) : x(active) + 12, top: margin.top }}
          />
        )}
      </div>
      <ChartDataTable
        caption={label}
        headers={[index, ...shown.map((item) => item.label)]}
        rows={data.map((row) => [formatIndex(row[index], 'long'), ...shown.map((item) => formatValue(value(row, item.key)))])}
      />
    </figure>
  )
}
