import { useId, useRef } from 'react'
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type ResizableProps = {
  label: string
  start: ReactNode
  end: ReactNode
  orientation?: 'horizontal' | 'vertical'
  size?: number
  defaultSize?: number
  onSizeChange?: (size: number) => void
  minSize?: number
  maxSize?: number
  className?: string
}

export default function Resizable({
  label, start, end, orientation = 'horizontal', size, defaultSize = 50, onSizeChange, minSize = 10, maxSize = 90, className,
}: ResizableProps) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useControllableState(size, defaultSize, onSizeChange)
  const horizontal = orientation === 'horizontal'

  function update(next: number) {
    setCurrent(Math.round(Math.min(Math.max(next, minSize), maxSize) * 10) / 10)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const box = containerRef.current?.getBoundingClientRect()
    if (!box) return
    const rtl = horizontal && getComputedStyle(event.currentTarget).direction === 'rtl'
    const offset = horizontal ? (rtl ? box.right - event.clientX : event.clientX - box.left) : event.clientY - box.top
    update((offset / (horizontal ? box.width : box.height)) * 100)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 2
    const decrease = horizontal ? 'ArrowLeft' : 'ArrowUp'
    const increase = horizontal ? 'ArrowRight' : 'ArrowDown'
    const rtl = horizontal && getComputedStyle(event.currentTarget).direction === 'rtl'
    let next: number | undefined
    if (event.key === decrease) next = current + (rtl ? step : -step)
    else if (event.key === increase) next = current + (rtl ? -step : step)
    else if (event.key === 'Home') next = minSize
    else if (event.key === 'End') next = maxSize
    if (next === undefined) return
    event.preventDefault()
    update(next)
  }

  return (
    <div ref={containerRef} className={cn('flex min-h-0 overflow-hidden rounded-panel border border-border', horizontal ? 'flex-row' : 'flex-col', className)}>
      <div id={`${id}-start`} style={{ flexBasis: `${current}%` }} className="min-h-0 min-w-0 shrink-0 overflow-auto">{start}</div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-controls={`${id}-start`}
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={current}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex shrink-0 touch-none items-center justify-center bg-border focus-visible:outline-offset-0',
          horizontal ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
        )}
      >
        <span className={cn('absolute', horizontal ? 'inset-y-0 -inset-x-2' : 'inset-x-0 -inset-y-2')} />
        <span aria-hidden="true" className={cn('z-10 rounded-full border border-border bg-surface group-hover:bg-subtle', horizontal ? 'h-6 w-1.5' : 'h-1.5 w-6')} />
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{end}</div>
    </div>
  )
}
