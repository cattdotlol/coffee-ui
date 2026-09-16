import { useId } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type TabItem = {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
}

export type TabsProps = {
  label: string
  items: readonly TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export default function Tabs({ label, items, value, defaultValue, onValueChange, className }: TabsProps) {
  const id = useId()
  const [requestedValue, setRequestedValue] = useControllableState(value, defaultValue ?? items.find((item) => !item.disabled)?.value, (next) => { if (next !== undefined) onValueChange?.(next) })
  const selected = items.find((item) => item.value === requestedValue && !item.disabled)?.value
    ?? items.find((item) => !item.disabled)?.value

  function select(next: string) {
    if (next !== selected) setRequestedValue(next)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'))
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (index === -1) return
    event.preventDefault()
    const direction = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1
    const step = event.key === 'ArrowRight' ? direction : -direction
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + step + tabs.length) % tabs.length
    tabs[next]?.focus()
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} aria-orientation="horizontal" onKeyDown={handleKeyDown} className="flex gap-1 overflow-x-auto rounded-control bg-subtle p-1">
        {items.map((item, index) => (
          <button
            key={item.value}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={selected === item.value}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={selected === item.value ? 0 : -1}
            disabled={item.disabled}
            onFocus={() => select(item.value)}
            onClick={() => select(item.value)}
            className={cn('ui-tab relative isolate min-h-8 shrink-0 cursor-pointer rounded-control px-3 py-1 text-sm font-medium focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11 motion-safe:transition-colors', selected === item.value ? 'text-foreground' : 'text-muted enabled:hover:text-foreground')}
          >
            {selected === item.value && <motion.span aria-hidden="true" layoutId={`${id}-selection`} className="ui-tab-indicator absolute inset-0 -z-10 rounded-control bg-surface shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div key={item.value} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={selected !== item.value} tabIndex={0} className="mt-4 rounded-inner text-sm leading-5">
          {item.content}
        </div>
      ))}
    </div>
  )
}
