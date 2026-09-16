import { useEffect, useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cn } from './cn.ts'
import Dialog from './dialog.tsx'
import Kbd from './kbd.tsx'
import type { TriggerElement } from './trigger.ts'
import useControllableState from './use-controllable-state.ts'

export type CommandItem = {
  label: string
  id?: string
  icon?: ReactNode
  shortcut?: string
  keywords?: readonly string[]
  disabled?: boolean
  onSelect: () => void
}

export type CommandGroup = { label: string; items: readonly CommandItem[] }

export type CommandPaletteProps = {
  groups: readonly CommandGroup[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: TriggerElement
  hotkey?: string | null
  label?: string
  placeholder?: string
  emptyText?: string
}

export default function CommandPalette({
  groups, open: openProp, defaultOpen = false, onOpenChange, trigger, hotkey = 'k',
  label = 'Command palette', placeholder = 'Type a command or search…', emptyText = 'No results found.',
}: CommandPaletteProps) {
  const id = useId()
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const [query, setQuery] = useState('')
  const [activeKey, setActiveKey] = useState<string>()
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const filtered = groups
    .map((group, groupIndex) => ({
      ...group,
      items: group.items
        .map((item, itemIndex) => ({ ...item, key: `${id}-${groupIndex}-${itemIndex}` }))
        .filter((item) => words.every((word) => [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase().includes(word))),
    }))
    .filter((group) => group.items.length)
  const enabled = filtered.flatMap((group) => group.items).filter((item) => !item.disabled)
  const active = enabled.find((item) => item.key === activeKey)?.key ?? enabled[0]?.key

  function changeOpen(next: boolean) {
    if (next) {
      setQuery('')
      setActiveKey(undefined)
    }
    setOpen(next)
  }

  useEffect(() => {
    if (!hotkey) return
    function handleHotkey(event: globalThis.KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== hotkey) return
      event.preventDefault()
      changeOpen(!open)
    }
    document.addEventListener('keydown', handleHotkey)
    return () => document.removeEventListener('keydown', handleHotkey)
  })

  useEffect(() => {
    if (open && active) document.getElementById(active)?.scrollIntoView({ block: 'nearest' })
  })

  function run(item: CommandItem) {
    if (item.disabled) return
    changeOpen(false)
    item.onSelect()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!enabled.length) return
      const index = enabled.findIndex((item) => item.key === active)
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveKey(enabled[(index + delta + enabled.length) % enabled.length]?.key)
    } else if (event.key === 'Enter') {
      const item = enabled.find((entry) => entry.key === active)
      if (!item) return
      event.preventDefault()
      run(item)
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen} trigger={trigger} title={label} hideTitle showCloseButton={false} className="max-w-lg p-0">
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search aria-hidden="true" className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
        <input
          type="text"
          role="combobox"
          aria-label={label}
          aria-expanded="true"
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={active}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveKey(undefined) }}
          onKeyDown={handleKeyDown}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>
      <div id={`${id}-listbox`} role="listbox" aria-label={label} className="max-h-80 overflow-y-auto p-1.5">
        {filtered.length ? filtered.map((group) => (
          <div key={group.label} role="group" aria-labelledby={`${id}-${group.label}`} className="pb-1">
            <p id={`${id}-${group.label}`} className="px-2.5 pt-2 pb-1 text-xs font-medium text-muted">{group.label}</p>
            {group.items.map((item) => (
              <div
                key={item.key}
                id={item.key}
                role="option"
                aria-selected={item.key === active}
                aria-disabled={item.disabled || undefined}
                onClick={() => run(item)}
                onMouseMove={() => { if (!item.disabled) setActiveKey(item.key) }}
                className={cn('flex min-h-9 items-center gap-2 rounded-control px-2.5 py-1.5 text-sm pointer-coarse:min-h-11', item.key === active && 'bg-subtle', item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
              >
                {item.icon && <span aria-hidden="true" className="inline-flex size-4 shrink-0 text-muted [&>svg]:size-full">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && <span aria-hidden="true" className="text-xs text-muted">{item.shortcut}</span>}
              </div>
            ))}
          </div>
        )) : <p role="status" className="px-2.5 py-6 text-center text-sm text-muted">{emptyText}</p>}
      </div>
      <div aria-hidden="true" className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-2 text-xs text-muted">
        <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> Navigate</span>
        <span className="flex items-center gap-1"><Kbd>↵</Kbd> Select</span>
        <span className="flex items-center gap-1"><Kbd>Esc</Kbd> Close</span>
      </div>
    </Dialog>
  )
}
