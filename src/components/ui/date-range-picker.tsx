import { useState } from 'react'
import type { ReactNode } from 'react'
import { CalendarRange } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import Calendar from './calendar.tsx'
import type { CalendarProps } from './calendar.tsx'
import Field from './field.tsx'
import useAnchoredPopover from './use-anchored-popover.ts'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type DateRange = { start: Date | null; end: Date | null }

export type DateRangePickerProps = Pick<CalendarProps, 'min' | 'max' | 'isDateDisabled' | 'weekStartsOn' | 'locale'> & {
  label: string
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange) => void
  hideLabel?: boolean
  placeholder?: string
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  required?: boolean
  startName?: string
  endName?: string
  formatOptions?: Intl.DateTimeFormatOptions
  className?: string
}

const toKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const empty: DateRange = { start: null, end: null }

export default function DateRangePicker({
  label, value, defaultValue = empty, onValueChange, hideLabel, placeholder = 'Pick a date range', hint, error, disabled, required,
  startName, endName, formatOptions = { dateStyle: 'medium' }, className, locale, ...calendarProps
}: DateRangePickerProps) {
  const field = useField({ hint, error })
  const { id, triggerId, panelRef, open, setOpen, position, close } = useAnchoredPopover('start', field.inputId)
  const [range, setRange] = useControllableState(value, defaultValue, onValueChange)
  const [anchor, setAnchor] = useState<Date | null>(null)
  const [hovered, setHovered] = useState<Date | null>(null)
  const format = new Intl.DateTimeFormat(locale, formatOptions)
  const preview = anchor
    ? { start: hovered && hovered < anchor ? hovered : anchor, end: hovered && hovered > anchor ? hovered : anchor }
    : range

  function pick(date: Date) {
    if (!anchor) {
      setAnchor(date)
      return
    }
    setRange(date < anchor ? { start: date, end: anchor } : { start: anchor, end: date })
    setAnchor(null)
    close()
  }

  return (
    <Field label={label} htmlFor={triggerId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId} className={className}>
      <button
        type="button"
        id={triggerId}
        popoverTarget={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={field.describedBy}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        className={cn('ui-text-field flex cursor-pointer items-center justify-between gap-2 bg-surface text-left shadow-xs disabled:cursor-not-allowed', !range.start && 'text-muted')}
      >
        <span className="truncate">{range.start && range.end ? format.formatRange(range.start, range.end) : placeholder}</span>
        <CalendarRange aria-hidden="true" className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
      </button>
      {startName && <input type="hidden" name={startName} value={range.start ? toKey(range.start) : ''} />}
      {endName && <input type="hidden" name={endName} value={range.end ? toKey(range.end) : ''} />}
      <motion.div
        ref={panelRef}
        id={id}
        popover="auto"
        role="dialog"
        aria-label={`Choose ${label.toLowerCase()}`}
        onToggle={(event) => {
          const next = event.currentTarget.matches(':popover-open')
          setOpen(next)
          if (!next) {
            setAnchor(null)
            setHovered(null)
          }
        }}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className="fixed inset-auto m-0 origin-top max-w-[calc(100vw-1rem)] rounded-panel border border-border bg-surface p-3 text-foreground shadow-lg"
      >
        <p aria-live="polite" className="mb-2 px-1 text-xs text-muted">{anchor ? 'Now choose an end date.' : 'Choose a start date.'}</p>
        <Calendar
          key={String(open)}
          {...calendarProps}
          locale={locale}
          autoFocus={open}
          value={null}
          range={preview}
          onDateHover={setHovered}
          onValueChange={pick}
        />
      </motion.div>
    </Field>
  )
}
