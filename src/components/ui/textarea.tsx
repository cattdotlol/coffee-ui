import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useField from './use-field.ts'

export type TextareaProps = Omit<ComponentProps<'textarea'>, 'children'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  onValueChange?: (value: string) => void
}

export default function Textarea({
  label, hideLabel, hint, error, id, rows = 4, required, className, onChange, onValueChange,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: TextareaProps) {
  const field = useField({ id, hint, error, describedBy })

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId}>
      <textarea
        {...props}
        id={field.inputId}
        rows={rows}
        required={required}
        aria-describedby={field.describedBy}
        aria-invalid={error ? true : invalid}
        onChange={(event) => { onChange?.(event); onValueChange?.(event.target.value) }}
        className={cn('ui-text-field rounded-inner resize-y', className)}
      />
    </Field>
  )
}
