import { useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type OtpInputProps = Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'maxLength' | 'children'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  length?: number
  alphanumeric?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
}

export default function OtpInput({
  label, hideLabel, hint, error, length = 6, alphanumeric = false, value, defaultValue = '', onValueChange, onComplete,
  id, disabled, required, className, onFocus, onBlur, 'aria-describedby': describedBy, ...props
}: OtpInputProps) {
  const field = useField({ id, hint, error, describedBy })
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
  const [focused, setFocused] = useState(false)
  const active = Math.min(current.length, length - 1)

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId}>
      <div className={cn('relative flex w-fit gap-1.5', disabled && 'opacity-50')}>
        {Array.from({ length }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              'flex size-10 items-center justify-center rounded-control border bg-surface text-base font-medium tabular-nums pointer-coarse:size-11 motion-safe:transition-colors',
              error ? 'border-danger' : 'border-border',
              focused && index === active && (error ? 'shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-danger)_18%,transparent)]' : 'border-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]'),
            )}
          >
            {current[index] ?? (focused && index === active && <span className="h-4 w-px bg-foreground motion-safe:animate-pulse" />)}
          </span>
        ))}
        <input
          {...props}
          id={field.inputId}
          type="text"
          inputMode={alphanumeric ? 'text' : 'numeric'}
          autoComplete="one-time-code"
          pattern={alphanumeric ? `[A-Za-z0-9]{${length}}` : `\\d{${length}}`}
          maxLength={length}
          value={current}
          disabled={disabled}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            const next = event.target.value.replace(alphanumeric ? /[^a-z0-9]/gi : /\D/g, '').slice(0, length)
            setCurrent(alphanumeric ? next.toUpperCase() : next)
            if (next.length === length && current.length !== length) onComplete?.(next)
          }}
          onSelect={(event) => {
            const input = event.currentTarget
            input.setSelectionRange(input.value.length, input.value.length)
          }}
          onFocus={(event) => { setFocused(true); onFocus?.(event) }}
          onBlur={(event) => { setFocused(false); onBlur?.(event) }}
          className={cn('absolute inset-0 w-full cursor-text bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed', className)}
        />
      </div>
    </Field>
  )
}
