import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, KeyboardEvent } from 'react'
import { cn } from './cn.ts'

export type ToolbarProps = ComponentProps<'div'> & {
  label: string
  orientation?: 'horizontal' | 'vertical'
}

const focusable = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"]):not([role="toolbar"]), [data-toolbar-item]'

export default function Toolbar({ label, orientation = 'horizontal', className, onKeyDown, onFocus, ...props }: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function items() {
    return Array.from(ref.current?.querySelectorAll<HTMLElement>(focusable) ?? []).filter((item) => !item.closest('[popover], dialog') && item.closest('[role="toolbar"]') === ref.current)
  }

  useEffect(() => {
    const list = items()
    const current = Math.min(active, list.length - 1)
    list.forEach((item, index) => {
      item.dataset.toolbarItem = ''
      item.tabIndex = index === current ? 0 : -1
    })
  })

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    const previous = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    if (![next, previous, 'Home', 'End'].includes(event.key)) return
    const list = items()
    const index = list.indexOf(document.activeElement as HTMLElement)
    if (index === -1) return
    event.preventDefault()
    const rtl = orientation === 'horizontal' && getComputedStyle(event.currentTarget).direction === 'rtl'
    const step = (event.key === next ? 1 : -1) * (rtl ? -1 : 1)
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : (index + step + list.length) % list.length
    list[target]?.focus()
  }

  return (
    <div
      {...props}
      ref={ref}
      role="toolbar"
      aria-label={label}
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        onFocus?.(event)
        const index = items().indexOf(event.target as HTMLElement)
        if (index !== -1) setActive(index)
      }}
      className={cn('inline-flex max-w-full items-center gap-1 rounded-control border border-border bg-surface p-1', orientation === 'vertical' && 'flex-col rounded-inner', className)}
    />
  )
}
