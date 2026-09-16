import type { CSSProperties, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type RangeSliderProps = {
  label: string
  value?: [number, number]
  defaultValue?: [number, number]
  onValueChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  minDistance?: number
  formatValue?: (value: number) => string
  hideLabel?: boolean
  hint?: ReactNode
  disabled?: boolean
  name?: string
  id?: string
  className?: string
}

export default function RangeSlider({
  label, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, minDistance = 0, formatValue = String,
  hideLabel, hint, disabled, name, id, className,
}: RangeSliderProps) {
  const field = useField({ id, hint })
  const [[low, high], setRange] = useControllableState(value, defaultValue ?? [min, max], onValueChange)
  const percent = (item: number) => ((item - min) / (max - min)) * 100
  const thumbs = [
    { key: 'min', value: low, label: `Minimum ${label.toLowerCase()}`, onChange: (next: number) => setRange([Math.min(next, high - minDistance), high]) },
    { key: 'max', value: high, label: `Maximum ${label.toLowerCase()}`, onChange: (next: number) => setRange([low, Math.max(next, low + minDistance)]) },
  ]

  return (
    <Field
      label={label}
      labelId={field.labelId}
      hideLabel={hideLabel}
      hint={hint}
      hintId={field.hintId}
      aside={<output className="text-xs tabular-nums text-muted">{formatValue(low)} – {formatValue(high)}</output>}
      className={cn(disabled && 'opacity-50', className)}
    >
      <div role="group" aria-labelledby={field.labelId} aria-describedby={field.describedBy} className="relative h-5 pointer-coarse:h-11">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border" />
        <span aria-hidden="true" style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%` }} className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" />
        {thumbs.map((thumb) => (
          <input
            key={thumb.key}
            type="range"
            name={name ? `${name}-${thumb.key}` : undefined}
            aria-label={thumb.label}
            aria-valuetext={formatValue(thumb.value)}
            min={min}
            max={max}
            step={step}
            value={thumb.value}
            disabled={disabled}
            onChange={(event) => thumb.onChange(event.target.valueAsNumber)}
            // Keep the min thumb on top when both sit at the maximum so it can still be dragged.
            style={{ zIndex: thumb.key === 'min' && low > (min + max) / 2 ? 2 : 1 } as CSSProperties}
            className="ui-range-input"
          />
        ))}
      </div>
    </Field>
  )
}
