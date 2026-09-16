import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from './cn.ts'
import ChartDataTable from './chart-data-table.tsx'

export type HeatmapProps = {
  label: string
  rows: readonly string[]
  columns: readonly string[]
  values: readonly (readonly (number | null)[])[]
  formatValue?: (value: number) => string
  labelEvery?: number
  className?: string
}

export default function Heatmap({ label, rows, columns, values, formatValue = (value) => value.toLocaleString(), labelEvery = 1, className }: HeatmapProps) {
  const [active, setActive] = useState<{ row: number; column: number } | null>(null)
  const numbers = values.flat().filter((value): value is number => value !== null)
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  const cell = (row: number, column: number) => values[row]?.[column] ?? null
  const activeValue = active ? cell(active.row, active.column) : null
  const description = active ? `${rows[active.row]}, ${columns[active.column]}: ${activeValue === null ? 'No data' : formatValue(activeValue)}` : ''

  function color(value: number | null) {
    if (value === null) return 'transparent'
    const share = max === min ? 1 : (value - min) / (max - min)
    return `color-mix(in srgb, var(--color-chart-1) ${Math.round(8 + share * 92)}%, var(--color-subtle))`
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = active ?? { row: 0, column: 0 }
    const moves: Record<string, { row: number; column: number }> = {
      ArrowLeft: { row: current.row, column: Math.max(0, current.column - 1) },
      ArrowRight: { row: current.row, column: Math.min(columns.length - 1, current.column + 1) },
      ArrowUp: { row: Math.max(0, current.row - 1), column: current.column },
      ArrowDown: { row: Math.min(rows.length - 1, current.row + 1), column: current.column },
      Home: { row: current.row, column: 0 },
      End: { row: current.row, column: columns.length - 1 },
    }
    const next = moves[event.key]
    if (!next) return
    event.preventDefault()
    setActive(next)
  }

  return (
    <figure className={cn('grid gap-3 text-xs', className)}>
      <div
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the arrow keys to read cells.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive((current) => current ?? { row: 0, column: 0 })}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="ui-scroll-area overflow-x-auto rounded-inner focus-visible:outline-offset-4"
      >
        <p aria-live="polite" className="sr-only">{description}</p>
        <div aria-hidden="true" className="grid min-w-max gap-1" style={{ gridTemplateColumns: `auto repeat(${columns.length}, minmax(1.25rem, 1fr))` }}>
          <span />
          {columns.map((column, columnIndex) => (
            <span key={column} className="truncate pb-0.5 text-center text-muted">{columnIndex % labelEvery === 0 ? column : ''}</span>
          ))}
          {rows.map((row, rowIndex) => [
            <span key={`${row}-label`} className="flex items-center pr-2 text-muted">{row}</span>,
            ...columns.map((column, columnIndex) => {
              const value = cell(rowIndex, columnIndex)
              const selected = active?.row === rowIndex && active.column === columnIndex
              return (
                <span
                  key={`${row}-${column}`}
                  onPointerEnter={() => setActive({ row: rowIndex, column: columnIndex })}
                  style={{ backgroundColor: color(value) }}
                  className={cn('h-6 rounded-[4px]', value === null && 'border border-dashed border-border', selected && 'ring-2 ring-foreground ring-offset-1 ring-offset-surface')}
                />
              )
            }),
          ])}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-muted">
        <p aria-hidden="true" className="min-h-4 tabular-nums text-foreground">{description}</p>
        {numbers.length > 0 && (
          <div aria-hidden="true" className="flex items-center gap-2 tabular-nums">
            <span>{formatValue(min)}</span>
            <span className="h-2 w-24 rounded-full" style={{ background: `linear-gradient(to right, ${color(min)}, ${color(max)})` }} />
            <span>{formatValue(max)}</span>
          </div>
        )}
      </div>
      <ChartDataTable
        caption={label}
        headers={['', ...columns]}
        rows={rows.map((row, rowIndex) => [row, ...columns.map((_, columnIndex) => {
          const value = cell(rowIndex, columnIndex)
          return value === null ? 'No data' : formatValue(value)
        })])}
      />
    </figure>
  )
}
