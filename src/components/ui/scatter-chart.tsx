import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from './cn.ts'
import ChartDataTable from './chart-data-table.tsx'
import ChartLegend from './chart-legend.tsx'
import ChartTooltip from './chart-tooltip.tsx'
import { MAX_SERIES, nextIndex, niceTicks, seriesColor, useElementWidth } from './chart-utils.ts'

export type ScatterChartProps<T extends Record<string, unknown>> = {
  label: string
  series: readonly { label: string; data: readonly T[] }[]
  x: keyof T & string
  y: keyof T & string
  xLabel: string
  yLabel: string
  getPointLabel?: (point: T) => string
  formatX?: (value: number) => string
  formatY?: (value: number) => string
  height?: number
  className?: string
}

const defaultFormat = (value: number) => value.toLocaleString()

export default function ScatterChart<T extends Record<string, unknown>>({
  label, series, x: xKey, y: yKey, xLabel, yLabel, getPointLabel, formatX = defaultFormat, formatY = defaultFormat, height = 280, className,
}: ScatterChartProps<T>) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const shown = series.slice(0, MAX_SERIES)
  const number = (point: T, key: string) => Number(point[key]) || 0
  const points = shown
    .flatMap((item, seriesIndex) => item.data.map((point) => ({ point, seriesIndex, xValue: number(point, xKey), yValue: number(point, yKey) })))
    .sort((a, b) => a.xValue - b.xValue || a.yValue - b.yValue)
  const xTicks = niceTicks(Math.max(0, ...points.map((item) => item.xValue)), 5)
  const yTicks = niceTicks(Math.max(0, ...points.map((item) => item.yValue)))
  const margin = { top: 12, right: 16, bottom: 44, left: 52 }
  const plotWidth = Math.max(width - margin.left - margin.right, 1)
  const plotHeight = height - margin.top - margin.bottom
  const toX = (amount: number) => margin.left + (amount / (xTicks.at(-1) || 1)) * plotWidth
  const toY = (amount: number) => margin.top + plotHeight - (amount / (yTicks.at(-1) || 1)) * plotHeight
  const focused = active === null ? undefined : points[active]
  const describe = (item: (typeof points)[number]) => `${getPointLabel ? `${getPointLabel(item.point)}, ` : ''}${shown[item.seriesIndex]!.label}: ${xLabel} ${formatX(item.xValue)}, ${yLabel} ${formatY(item.yValue)}`

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextIndex(event.key, active, points.length - 1)
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
        aria-label={`${label}. Use the arrow keys to read points from left to right.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive((current) => current ?? 0)}
        onBlur={() => setActive(null)}
        className="relative rounded-inner focus-visible:outline-offset-4"
        style={{ height }}
      >
        <p aria-live="polite" className="sr-only">{focused ? describe(focused) : ''}</p>
        {width > 0 && points.length > 0 && (
          <svg aria-hidden="true" width={width} height={height} className="block overflow-visible text-xs" onPointerLeave={() => setActive(null)}>
            {yTicks.map((tick) => (
              <g key={`y${tick}`}>
                <line x1={margin.left} x2={margin.left + plotWidth} y1={toY(tick)} y2={toY(tick)} stroke="var(--color-border)" strokeWidth={1} shapeRendering="crispEdges" />
                <text x={margin.left - 8} y={toY(tick)} dy="0.32em" textAnchor="end" className="fill-muted tabular-nums">{formatY(tick)}</text>
              </g>
            ))}
            {xTicks.map((tick, position) => (
              <text key={`x${tick}`} x={toX(tick)} y={margin.top + plotHeight + 18} textAnchor={position === 0 ? 'start' : position === xTicks.length - 1 ? 'end' : 'middle'} className="fill-muted tabular-nums">{formatX(tick)}</text>
            ))}
            <text x={margin.left + plotWidth / 2} y={height - 4} textAnchor="middle" className="fill-muted font-medium">{xLabel}</text>
            <text transform={`translate(12 ${margin.top + plotHeight / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted font-medium">{yLabel}</text>
            {focused && (
              <g>
                <line x1={toX(focused.xValue)} x2={toX(focused.xValue)} y1={toY(focused.yValue)} y2={toY(0)} stroke="var(--color-muted)" strokeOpacity={0.4} strokeDasharray="3 3" />
                <line x1={margin.left} x2={toX(focused.xValue)} y1={toY(focused.yValue)} y2={toY(focused.yValue)} stroke="var(--color-muted)" strokeOpacity={0.4} strokeDasharray="3 3" />
              </g>
            )}
            {points.map((item, position) => (
              <circle
                key={position}
                cx={toX(item.xValue)}
                cy={toY(item.yValue)}
                r={active === position ? 6 : 4.5}
                fill={seriesColor(item.seriesIndex)}
                fillOpacity={active === null || active === position ? 0.85 : 0.35}
                stroke="var(--color-surface)"
                strokeWidth={1.5}
                onPointerEnter={() => setActive(position)}
                className="motion-safe:transition-[fill-opacity]"
              />
            ))}
          </svg>
        )}
        {focused && (
          <ChartTooltip
            title={getPointLabel?.(focused.point) ?? shown[focused.seriesIndex]!.label}
            rows={[
              { label: xLabel, value: formatX(focused.xValue), color: seriesColor(focused.seriesIndex), shape: 'square' },
              { label: yLabel, value: formatY(focused.yValue), color: seriesColor(focused.seriesIndex), shape: 'square' },
            ]}
            style={{ left: toX(focused.xValue) + 172 > width ? Math.max(toX(focused.xValue) - 172, 0) : toX(focused.xValue) + 12, top: Math.max(0, toY(focused.yValue) - 64) }}
          />
        )}
      </div>
      <ChartDataTable
        caption={label}
        headers={['Point', 'Series', xLabel, yLabel]}
        rows={points.map((item, position) => [getPointLabel?.(item.point) ?? String(position + 1), shown[item.seriesIndex]!.label, formatX(item.xValue), formatY(item.yValue)])}
      />
    </figure>
  )
}
