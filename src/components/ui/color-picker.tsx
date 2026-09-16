import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type ColorPickerProps = {
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  swatches?: readonly string[]
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  className?: string
}

function normalize(text: string) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim())
  if (!match?.[1]) return null
  const hex = match[1].length === 3 ? [...match[1]].map((char) => char + char).join('') : match[1]
  return `#${hex.toLowerCase()}`
}

export default function ColorPicker({
  label, value, defaultValue = '#6f4e37', onValueChange, swatches, hideLabel, hint, error, disabled, required, name, id, className,
}: ColorPickerProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const invalid = draft !== null && normalize(draft) === null
  const message = error ?? (invalid ? 'Enter a hex color like #6f4e37.' : undefined)
  const field = useField({ id, hint, error: message })
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={message} errorId={field.errorId} className={className}>
      <div className="flex gap-1.5">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={normalize(current) ?? '#000000'}
          disabled={disabled}
          onChange={(event) => { setDraft(null); setCurrent(event.target.value.toLowerCase()) }}
          className="ui-color-input"
        />
        <input
          id={field.inputId}
          type="text"
          name={name}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={7}
          value={draft ?? current}
          disabled={disabled}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={message ? true : undefined}
          onChange={(event) => {
            setDraft(event.target.value)
            const next = normalize(event.target.value)
            if (next) setCurrent(next)
          }}
          onBlur={() => { if (!invalid) setDraft(null) }}
          className="ui-text-field font-mono uppercase"
        />
      </div>
      {swatches && (
        <div role="group" aria-label="Preset colors" className="flex flex-wrap gap-1.5 pt-1">
          {swatches.map((swatch) => {
            const color = normalize(swatch) ?? swatch
            const active = normalize(current) === color
            return (
              <button
                key={swatch}
                type="button"
                aria-label={color}
                aria-pressed={active}
                disabled={disabled}
                onClick={() => { setDraft(null); setCurrent(color) }}
                style={{ backgroundColor: color }}
                className={cn('size-6 cursor-pointer rounded-full border border-black/10 motion-safe:transition-shadow focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-primary)] disabled:cursor-not-allowed pointer-coarse:size-9', active && 'shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-primary)]')}
              />
            )
          })}
        </div>
      )}
    </Field>
  )
}
