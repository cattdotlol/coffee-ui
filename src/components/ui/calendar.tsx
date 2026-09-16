import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './cn.ts'
import IconButton from './icon-button.tsx'
import useControllableState from './use-controllable-state.ts'

export type CalendarProps = {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (date: Date) => void
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  weekStartsOn?: 0 | 1
  locale?: string
  autoFocus?: boolean
  range?: { start: Date | null; end: Date | null }
  onDateHover?: (date: Date | null) => void
  className?: string
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
const sameDay = (a: Date | null | undefined, b: Date) => !!a && a.toDateString() === b.toDateString()
const toKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

function addMonths(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

export default function Calendar({ value, defaultValue = null, onValueChange, min, max, isDateDisabled, weekStartsOn = 0, locale, autoFocus = false, range, onDateHover, className }: CalendarProps) {
  const id = useId()
  const gridRef = useRef<HTMLTableElement>(null)
  const shouldFocus = useRef(autoFocus)
  const [selected, setSelected] = useControllableState<Date | null>(value, defaultValue, (date) => { if (date) onValueChange?.(date) })
  const [focused, setFocused] = useState(() => startOfDay(selected ?? new Date()))
  const today = startOfDay(new Date())
  const first = new Date(focused.getFullYear(), focused.getMonth(), 1)
  const gridStart = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7))
  const days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7))
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(focused)
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })

  const disabled = (date: Date) =>
    (!!min && date < startOfDay(min)) || (!!max && date > startOfDay(max)) || (isDateDisabled?.(date) ?? false)

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toKey(focused)}"]`)?.focus()
  })

  function focusDate(date: Date) {
    shouldFocus.current = true
    setFocused(date)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1
    const weekday = (focused.getDay() - weekStartsOn + 7) % 7
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -rtl),
      ArrowRight: () => addDays(focused, rtl),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -weekday),
      End: () => addDays(focused, 6 - weekday),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    focusDate(move())
  }

  return (
    <div className={cn('w-fit text-sm', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <IconButton aria-label="Previous month" size="sm" onClick={() => setFocused(addMonths(focused, -1))}><ChevronLeft strokeWidth={1.5} /></IconButton>
        <h2 id={`${id}-month`} aria-live="polite" className="font-medium">{monthLabel}</h2>
        <IconButton aria-label="Next month" size="sm" onClick={() => setFocused(addMonths(focused, 1))}><ChevronRight strokeWidth={1.5} /></IconButton>
      </div>
      <table ref={gridRef} role="grid" aria-labelledby={`${id}-month`} onKeyDown={handleKeyDown} onMouseLeave={() => onDateHover?.(null)} className="border-collapse">
        <thead>
          <tr>
            {weeks[0]?.map((date) => (
              <th key={date.getDay()} scope="col" abbr={new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date)} className="size-9 text-xs font-medium text-muted pointer-coarse:size-11">
                {new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toKey(week[0]!)}>
              {week.map((date) => {
                const isSelected = sameDay(selected, date) || sameDay(range?.start, date) || sameDay(range?.end, date)
                const inRange = !isSelected && !!range?.start && !!range.end && date > range.start && date < range.end
                const outside = date.getMonth() !== focused.getMonth()
                const unavailable = disabled(date)
                return (
                  <td key={toKey(date)} aria-selected={isSelected || inRange} className="p-0">
                    <button
                      type="button"
                      data-date={toKey(date)}
                      tabIndex={sameDay(focused, date) ? 0 : -1}
                      aria-label={fullDate.format(date)}
                      aria-current={sameDay(today, date) ? 'date' : undefined}
                      disabled={unavailable}
                      onClick={() => { setSelected(date); setFocused(date) }}
                      onMouseEnter={() => onDateHover?.(date)}
                      onFocus={() => onDateHover?.(date)}
                      className={cn(
                        'relative flex size-9 cursor-pointer items-center justify-center rounded-control tabular-nums focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through pointer-coarse:size-11 motion-safe:transition-colors',
                        isSelected ? 'bg-primary font-medium text-on-primary' : inRange ? 'bg-primary-soft' : 'enabled:hover:bg-subtle',
                        !isSelected && outside && 'text-muted',
                        sameDay(today, date) && !isSelected && 'font-semibold after:absolute after:bottom-1.5 after:size-1 after:rounded-full after:bg-primary',
                      )}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
