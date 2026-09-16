import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useField from './use-field.ts'

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type SelectProps = ComponentProps<'select'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  options?: readonly SelectOption[]
  placeholder?: string
  onValueChange?: (value: string) => void
}

export default function Select({
  label, hideLabel, hint, error, options, placeholder, id, required, className, children, onChange, onValueChange,
  value, defaultValue, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: SelectProps) {
  const field = useField({ id, hint, error, describedBy })

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId}>
      <select
        {...props}
        id={field.inputId}
        required={required}
        value={value}
        defaultValue={value === undefined && placeholder !== undefined ? defaultValue ?? '' : defaultValue}
        aria-describedby={field.describedBy}
        aria-invalid={error ? true : invalid}
        onChange={(event) => { onChange?.(event); onValueChange?.(event.target.value) }}
        className={cn('ui-text-field', className)}
      >
        {placeholder !== undefined && <option value="" disabled>{placeholder}</option>}
        {options?.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        {children}
      </select>
    </Field>
  )
}
