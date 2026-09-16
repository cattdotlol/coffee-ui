export default function ChartLegend({ items, shape }: { items: readonly { label: string; color: string }[]; shape: 'line' | 'square' }) {
  return (
    <ul aria-hidden="true" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={shape === 'square' ? 'size-2.5 rounded-[3px]' : 'h-0.5 w-3.5 rounded-full'} style={{ backgroundColor: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
