import type { ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import Calendar from './calendar.tsx'
import type { CalendarProps } from './calendar.tsx'
import Field from './field.tsx'
import useAnchoredPopover from './use-anchored-popover.ts'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type DatePickerProps = Pick<CalendarProps, 'min' | 'max' | 'isDateDisabled' | 'weekStartsOn' | 'locale'> & {
  label: string
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (date: Date | null) => void
  hideLabel?: boolean
  placeholder?: string
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  required?: boolean
  name?: string
  formatOptions?: Intl.DateTimeFormatOptions
  className?: string
}

const toKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export default function DatePicker({
  label, value, defaultValue = null, onValueChange, hideLabel, placeholder = 'Pick a date', hint, error, disabled, required, name,
  formatOptions = { dateStyle: 'medium' }, className, locale, ...calendarProps
}: DatePickerProps) {
  const field = useField({ hint, error })
  const { id, triggerId, panelRef, open, setOpen, position, close } = useAnchoredPopover('start', field.inputId)
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange)

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
        className={cn('ui-text-field flex cursor-pointer items-center justify-between gap-2 bg-surface text-left shadow-xs disabled:cursor-not-allowed', !selected && 'text-muted', error && 'border-danger')}
      >
        {selected ? new Intl.DateTimeFormat(locale, formatOptions).format(selected) : placeholder}
        <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
      </button>
      {name && <input type="hidden" name={name} value={selected ? toKey(selected) : ''} />}
      <motion.div
        ref={panelRef}
        id={id}
        popover="auto"
        role="dialog"
        aria-label={`Choose ${label.toLowerCase()}`}
        onToggle={(event) => setOpen(event.currentTarget.matches(':popover-open'))}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className="fixed inset-auto m-0 origin-top max-w-[calc(100vw-1rem)] rounded-panel border border-border bg-surface p-3 text-foreground shadow-lg"
      >
        <Calendar
          key={String(open)}
          {...calendarProps}
          locale={locale}
          autoFocus={open}
          value={selected}
          onValueChange={(date) => { setSelected(date); close() }}
        />
      </motion.div>
    </Field>
  )
}
