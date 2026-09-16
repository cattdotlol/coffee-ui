import { useId } from 'react'
import type { KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type SegmentedControlOption<T extends string = string> = { value: T; label: string; disabled?: boolean }

export type SegmentedControlProps<T extends string = string> = {
  label: string
  options: readonly SegmentedControlOption<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  className?: string
}

const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']

export default function SegmentedControl<T extends string = string>({ label, options, value, defaultValue, onValueChange, className }: SegmentedControlProps<T>) {
  const id = useId()
  const [requested, setRequested] = useControllableState<T | undefined>(value, defaultValue, (next) => { if (next !== undefined) onValueChange?.(next) })
  const selected = options.find((option) => option.value === requested && !option.disabled)?.value
  const focusable = selected ?? options.find((option) => !option.disabled)?.value

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!keys.includes(event.key)) return
    const radios = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'))
    const index = radios.indexOf(document.activeElement as HTMLButtonElement)
    if (index === -1) return
    event.preventDefault()
    const direction = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1
    const step = event.key === 'ArrowRight' ? direction : event.key === 'ArrowLeft' ? -direction : event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? radios.length - 1 : (index + step + radios.length) % radios.length
    const next = radios[nextIndex]
    const option = options.find((item) => item.value === next?.dataset.value)
    if (!next || !option) return
    next.focus()
    setRequested(option.value)
  }

  return (
    <div role="radiogroup" aria-label={label} onKeyDown={handleKeyDown} className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-control bg-subtle p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          data-value={option.value}
          aria-checked={selected === option.value}
          tabIndex={focusable === option.value ? 0 : -1}
          disabled={option.disabled}
          onClick={() => setRequested(option.value)}
          className={cn('ui-segment relative isolate min-h-8 shrink-0 cursor-pointer rounded-control px-3 py-1 text-sm font-medium focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11 motion-safe:transition-colors', selected === option.value ? 'text-foreground' : 'text-muted enabled:hover:text-foreground')}
        >
          {selected === option.value && <motion.span aria-hidden="true" layoutId={`${id}-selection`} className="ui-segment-indicator absolute inset-0 -z-10 rounded-control bg-surface shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          {option.label}
        </button>
      ))}
    </div>
  )
}
