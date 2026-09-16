import type { ReactNode } from 'react'
import { cn } from './cn.ts'
import Separator from './separator.tsx'

export type MenuItem = {
  label: string
  id?: string
  icon?: ReactNode
  shortcut?: string
  disabled?: boolean
  destructive?: boolean
  separatorBefore?: boolean
  onSelect?: () => void
}

export default function MenuItems({ items, close }: { items: readonly MenuItem[]; close: () => void }) {
  return items.map((item) => (
    <div key={item.id ?? item.label} role="none">
      {item.separatorBefore && <Separator decorative={false} className="my-1" />}
      <button
        type="button"
        role="menuitem"
        tabIndex={-1}
        data-label={item.label}
        disabled={item.disabled}
        onClick={() => { close(); item.onSelect?.() }}
        className={cn('group flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-control px-2.5 py-1.5 text-left text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11 motion-safe:transition-colors', item.destructive ? 'text-danger enabled:hover:bg-danger/10 focus-visible:bg-danger/10' : 'text-foreground enabled:hover:bg-subtle focus-visible:bg-subtle')}
      >
        {item.icon && <span aria-hidden="true" className={cn('inline-flex size-4 shrink-0 motion-safe:transition-colors [&>svg]:size-full', !item.destructive && 'text-muted group-hover:text-foreground group-focus-visible:text-foreground')}>{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && <span aria-hidden="true" className="ml-3 text-xs tracking-widest text-muted">{item.shortcut}</span>}
      </button>
    </div>
  ))
}
