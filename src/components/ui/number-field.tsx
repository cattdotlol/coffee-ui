import type { ComponentProps, ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import IconButton from './icon-button.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type NumberFieldProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
}

export default function NumberField({
  label, hideLabel, hint, error, value, defaultValue = null, onValueChange, min, max, step = 1,
  id, disabled, readOnly, required, className, onBlur, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: NumberFieldProps) {
  const field = useField({ id, hint, error, describedBy })
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
  const decimals = String(step).split('.')[1]?.length ?? 0
  const locked = disabled || readOnly

  function clamp(next: number) {
    return Math.min(Math.max(next, min ?? -Infinity), max ?? Infinity)
  }

  function increment(direction: 1 | -1) {
    setCurrent(clamp(Number(((current ?? min ?? 0) + direction * step).toFixed(decimals))))
  }

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId}>
      <div className="flex gap-1.5">
        <input
          {...props}
          id={field.inputId}
          type="number"
          inputMode={decimals ? 'decimal' : 'numeric'}
          min={min}
          max={max}
          step={step}
          value={current ?? ''}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={error ? true : invalid}
          onChange={(event) => setCurrent(Number.isNaN(event.target.valueAsNumber) ? null : event.target.valueAsNumber)}
          onBlur={(event) => { if (current !== null) setCurrent(clamp(current)); onBlur?.(event) }}
          className={cn('ui-text-field ui-number-field tabular-nums', className)}
        />
        <IconButton variant="outline" tabIndex={-1} aria-label={`Decrease ${label}`} disabled={locked || (min !== undefined && current !== null && current <= min)} onClick={() => increment(-1)}><Minus strokeWidth={1.5} /></IconButton>
        <IconButton variant="outline" tabIndex={-1} aria-label={`Increase ${label}`} disabled={locked || (max !== undefined && current !== null && current >= max)} onClick={() => increment(1)}><Plus strokeWidth={1.5} /></IconButton>
      </div>
    </Field>
  )
}
