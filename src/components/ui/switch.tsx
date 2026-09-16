import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import useField from './use-field.ts'

export type SwitchProps = Omit<ComponentProps<'input'>, 'type' | 'role' | 'children'> & {
  label: string
  hint?: ReactNode
  onCheckedChange?: (checked: boolean) => void
}

export default function Switch({ label, hint, id, className, disabled, onChange, onCheckedChange, 'aria-describedby': describedBy, ...props }: SwitchProps) {
  const field = useField({ id, hint, describedBy })

  return (
    <label
      htmlFor={field.inputId}
      className={cn('flex min-h-9 items-center justify-between gap-3 text-sm pointer-coarse:min-h-11', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
    >
      <span className="py-1.5">
        <span className="block">{label}</span>
        {hint && <span id={field.hintId} className="mt-0.5 block text-xs leading-5 text-muted">{hint}</span>}
      </span>
      <input
        {...props}
        id={field.inputId}
        type="checkbox"
        role="switch"
        disabled={disabled}
        aria-describedby={field.describedBy}
        onChange={(event) => { onChange?.(event); onCheckedChange?.(event.target.checked) }}
        className={cn('ui-switch', className)}
      />
    </label>
  )
}
