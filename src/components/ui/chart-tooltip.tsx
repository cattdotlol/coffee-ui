import type { CSSProperties } from 'react'

export type ChartTooltipRow = { label: string; value: string; color: string; shape?: 'line' | 'square' }

export default function ChartTooltip({ title, rows, style }: { title: string; rows: readonly ChartTooltipRow[]; style: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className="pointer-events-none absolute z-10 min-w-32 rounded-inner border border-border bg-surface px-2.5 py-2 shadow-md">
      <p className="mb-1 text-xs text-muted">{title}</p>
      <ul className="space-y-0.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2 text-xs">
            <span className={row.shape === 'square' ? 'size-2 shrink-0 rounded-[2px]' : 'h-0.5 w-3 shrink-0 rounded-full'} style={{ backgroundColor: row.color }} />
            <span className="font-semibold tabular-nums text-foreground">{row.value}</span>
            <span className="truncate text-muted">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
