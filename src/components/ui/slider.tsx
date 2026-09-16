import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type SliderProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  formatValue?: (value: number) => string
  min?: number
  max?: number
  step?: number
}

export default function Slider({
  label, hideLabel, hint, error, value, defaultValue, onValueChange, formatValue, min = 0, max = 100, step = 1,
  id, disabled, className, 'aria-describedby': describedBy, ...props
}: SliderProps) {
  const field = useField({ id, hint, error, describedBy })
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange)
  const fill = max > min ? Math.min(Math.max(((current - min) / (max - min)) * 100, 0), 100) : 0
  const text = formatValue ? formatValue(current) : String(current)

  return (
    <Field
      label={label}
      htmlFor={field.inputId}
      hideLabel={hideLabel}
      hint={hint}
      hintId={field.hintId}
      error={error}
      errorId={field.errorId}
      aside={<output htmlFor={field.inputId} className="text-xs tabular-nums text-muted">{text}</output>}
      className={cn(disabled && 'opacity-50')}
    >
      <input
        {...props}
        id={field.inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        aria-describedby={field.describedBy}
        aria-valuetext={formatValue ? text : undefined}
        onChange={(event) => setCurrent(event.target.valueAsNumber)}
        style={{ '--fill': `${fill}%` } as CSSProperties}
        className={cn('ui-slider', className)}
      />
    </Field>
  )
}
