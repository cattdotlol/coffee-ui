import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useField from './use-field.ts'

export type TextFieldProps = Omit<ComponentProps<'input'>, 'children' | 'type'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'
  onValueChange?: (value: string) => void
  leading?: ReactNode
  trailing?: ReactNode
}

export default function TextField({
  label, hideLabel, hint, error, id, type = 'text', required, disabled, className, onChange, onValueChange, leading, trailing,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: TextFieldProps) {
  const field = useField({ id, hint, error, describedBy })

  const input = (base: string) => (
    <input
      {...props}
      id={field.inputId}
      type={type}
      required={required}
      disabled={disabled}
      aria-describedby={field.describedBy}
      aria-invalid={error ? true : invalid}
      onChange={(event) => { onChange?.(event); onValueChange?.(event.target.value) }}
      className={cn(base, className)}
    />
  )

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId}>
      {leading || trailing ? (
        <div data-invalid={error ? true : undefined} className={cn('ui-text-field flex items-center gap-2 bg-surface shadow-xs', error && 'border-danger', disabled && 'cursor-not-allowed opacity-50')}>
          {leading && <span className="flex shrink-0 items-center text-muted [&>svg]:size-4">{leading}</span>}
          {input('min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/70 disabled:cursor-not-allowed')}
          {trailing && <span className="flex shrink-0 items-center text-muted [&>svg]:size-4">{trailing}</span>}
        </div>
      ) : input('ui-text-field')}
    </Field>
  )
}
