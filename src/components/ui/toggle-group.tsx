import type { ReactNode } from 'react'
import { cn } from './cn.ts'
import Toggle from './toggle.tsx'
import useControllableState from './use-controllable-state.ts'

export type ToggleGroupItem = { value: string; label: string; icon?: ReactNode; disabled?: boolean }

export type ToggleGroupProps = {
  label: string
  items: readonly ToggleGroupItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  iconOnly?: boolean
  disabled?: boolean
  className?: string
}

export default function ToggleGroup({ label, items, value, defaultValue = [], onValueChange, iconOnly = false, disabled, className }: ToggleGroupProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange)

  return (
    <div role="group" aria-label={label} className={cn('inline-flex max-w-full flex-wrap gap-1 rounded-control bg-subtle p-1', className)}>
      {items.map((item) => (
        <Toggle
          key={item.value}
          pressed={selected.includes(item.value)}
          onPressedChange={(pressed) => setSelected(pressed ? [...selected, item.value] : selected.filter((entry) => entry !== item.value))}
          disabled={disabled || item.disabled}
          aria-label={iconOnly ? item.label : undefined}
          className={cn('min-h-8 enabled:hover:bg-primary-soft', iconOnly && 'ui-icon-button w-8')}
        >
          {item.icon && <span aria-hidden="true" className="inline-flex size-4 shrink-0 [&>svg]:size-full">{item.icon}</span>}
          {!iconOnly && item.label}
        </Toggle>
      ))}
    </div>
  )
}
