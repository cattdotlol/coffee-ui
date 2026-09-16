import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type RadioOption = { value: string; label: string; hint?: string; disabled?: boolean }

export type RadioGroupProps = Omit<ComponentProps<'fieldset'>, 'children' | 'defaultValue' | 'onChange'> & {
  label: string
  options: readonly RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  required?: boolean
  hint?: ReactNode
  error?: ReactNode
}

export default function RadioGroup({
  label, options, value, defaultValue, onValueChange, orientation = 'vertical', required, hint, error,
  name, disabled, className, 'aria-describedby': describedBy, ...props
}: RadioGroupProps) {
  const id = useId()
  const groupName = name ?? id
  const description = [describedBy, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <fieldset {...props} disabled={disabled} aria-describedby={description} aria-invalid={error ? true : undefined} className={cn('min-w-0 text-sm', disabled && 'opacity-50', className)}>
      <legend className="mb-2 font-medium">
        {label}
        {required && <span aria-hidden="true" className="text-muted"> *</span>}
      </legend>
      {hint && <p id={`${id}-hint`} className="mb-2 text-xs leading-5 text-muted">{hint}</p>}
      <div className={cn('flex', orientation === 'vertical' ? 'flex-col' : 'flex-wrap gap-x-5')}>
        {options.map((option, index) => (
          <label key={option.value} className={cn('flex min-h-9 items-center gap-2 py-1.5 pointer-coarse:min-h-11', disabled || option.disabled ? 'cursor-not-allowed' : 'cursor-pointer', option.disabled && 'opacity-50')}>
            <input
              type="radio"
              name={groupName}
              form={props.form}
              value={option.value}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={value === undefined ? defaultValue === option.value : undefined}
              onChange={(event) => onValueChange?.(event.target.value)}
              disabled={option.disabled}
              required={required}
              aria-describedby={option.hint ? `${id}-option-${index}-hint` : undefined}
              className="size-4 shrink-0 cursor-[inherit] accent-primary"
            />
            <span>
              <span className="block">{option.label}</span>
              {option.hint && <span id={`${id}-option-${index}-hint`} className="block text-xs leading-5 text-muted">{option.hint}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs leading-5 text-danger">{error}</p>}
    </fieldset>
  )
}
