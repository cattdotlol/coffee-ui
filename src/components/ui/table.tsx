import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type TableColumn<T> = {
  key: string
  header: string
  cell: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  align?: 'start' | 'end'
}

export type TableProps<T> = {
  caption: string
  columns: readonly TableColumn<T>[]
  rows: readonly T[]
  getRowKey: (row: T) => string
  empty?: ReactNode
  selectable?: boolean
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  getRowLabel?: (row: T) => string
  className?: string
}

type Sort = { key: string; direction: 'ascending' | 'descending' }

export default function Table<T>({ caption, columns, rows, getRowKey, empty = 'No results.', selectable = false, selectedKeys, defaultSelectedKeys = [], onSelectionChange, getRowLabel = getRowKey, className }: TableProps<T>) {
  const [selected, setSelected] = useControllableState(selectedKeys, defaultSelectedKeys, onSelectionChange)
  const [sort, setSort] = useState<Sort | null>(null)
  const sortValue = sort && columns.find((column) => column.key === sort.key)?.sortValue
  const sorted = sort && sortValue
    ? [...rows].sort((a, b) => {
      const x = sortValue(a)
      const y = sortValue(b)
      const result = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })
      return sort.direction === 'ascending' ? result : -result
    })
    : rows

  const visibleKeys = sorted.map(getRowKey)
  const allSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selected.includes(key))
  const someSelected = visibleKeys.some((key) => selected.includes(key))

  function toggleAll() {
    setSelected(allSelected ? selected.filter((key) => !visibleKeys.includes(key)) : [...new Set([...selected, ...visibleKeys])])
  }

  function toggleRow(key: string) {
    setSelected(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key])
  }

  function toggleSort(key: string) {
    setSort((current) => current?.key !== key ? { key, direction: 'ascending' } : current.direction === 'ascending' ? { key, direction: 'descending' } : null)
  }

  return (
    <div role="region" aria-label={caption} tabIndex={0} className={cn('overflow-x-auto rounded-panel border border-border', className)}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-subtle">
          <tr>
            {selectable && (
              <th scope="col" className="w-8 pl-3">
                <input type="checkbox" aria-label="Select all rows" checked={allSelected} disabled={!visibleKeys.length} onChange={toggleAll} ref={(node) => { if (node) node.indeterminate = someSelected && !allSelected }} className="size-3.5 cursor-pointer accent-primary disabled:cursor-not-allowed" />
              </th>
            )}
            {columns.map((column) => {
              const direction = sort?.key === column.key ? sort.direction : undefined
              const Icon = direction === 'ascending' ? ArrowUp : direction === 'descending' ? ArrowDown : ChevronsUpDown
              return (
                <th key={column.key} scope="col" aria-sort={direction} className={cn('h-10 px-3 text-xs font-medium whitespace-nowrap text-muted', column.align === 'end' ? 'text-end' : 'text-start')}>
                  {column.sortValue
                    ? <button type="button" onClick={() => toggleSort(column.key)} className={cn('-mx-1.5 inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-control px-1.5 hover:text-foreground focus-visible:-outline-offset-2 motion-safe:transition-colors pointer-coarse:min-h-11', direction ? 'text-foreground' : '', column.align === 'end' ? 'flex-row-reverse' : '')}>
                      {column.header}
                      <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                    </button>
                    : column.header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length ? sorted.map((row) => (
            <tr key={getRowKey(row)} className={cn('border-t border-border motion-safe:transition-colors', selected.includes(getRowKey(row)) ? 'bg-primary-soft/50' : 'hover:bg-subtle/60')}>
              {selectable && (
                <td className="w-8 pl-3">
                  <input type="checkbox" aria-label={`Select ${getRowLabel(row)}`} checked={selected.includes(getRowKey(row))} onChange={() => toggleRow(getRowKey(row))} className="size-3.5 cursor-pointer accent-primary" />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className={cn('px-3 py-2.5', column.align === 'end' ? 'text-end tabular-nums' : 'text-start')}>{column.cell(row)}</td>
              ))}
            </tr>
          )) : (
            <tr className="border-t border-border">
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-3 py-6 text-center text-muted">{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
