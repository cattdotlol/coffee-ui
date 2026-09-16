import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useField from './use-field.ts'

export type TimePickerProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'defaultValue' | 'step' | 'children'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  minuteStep?: number
}

export default function TimePicker({
  label, hideLabel, hint, error, value, defaultValue, onValueChange, minuteStep = 1, id, required, className, onChange,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: TimePickerProps) {
  const field = useField({ id, hint, error, describedBy })

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId}>
      <input
        {...props}
        id={field.inputId}
        type="time"
        step={minuteStep * 60}
        value={value}
        defaultValue={defaultValue}
        required={required}
        aria-describedby={field.describedBy}
        aria-invalid={error ? true : invalid}
        onChange={(event) => { onChange?.(event); onValueChange?.(event.target.value) }}
        className={cn('ui-text-field tabular-nums [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60', className)}
      />
    </Field>
  )
}
