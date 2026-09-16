import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import useField from './use-field.ts'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'children'> & {
  label: string
  hint?: ReactNode
  error?: ReactNode
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export default function Checkbox({
  label, hint, error, indeterminate = false, id, disabled, className, ref, onChange, onCheckedChange,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...props
}: CheckboxProps) {
  const field = useField({ id, hint, error, describedBy })

  return (
    <div className="py-1.5 text-sm">
      <label htmlFor={field.inputId} className={cn('flex min-h-6 items-center gap-2 pointer-coarse:min-h-8', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}>
        <input
          {...props}
          ref={(node) => {
            if (node) node.indeterminate = indeterminate
            if (typeof ref === 'function') return ref(node)
            if (ref) ref.current = node
          }}
          id={field.inputId}
          type="checkbox"
          disabled={disabled}
          aria-describedby={field.describedBy}
          aria-invalid={error ? true : invalid}
          onChange={(event) => { onChange?.(event); onCheckedChange?.(event.target.checked) }}
          className={cn('size-4 shrink-0 cursor-[inherit] accent-primary', className)}
        />
        {label}
      </label>
      {hint && <p id={field.hintId} className="mt-1 ml-6 text-xs leading-5 text-muted">{hint}</p>}
      {error && <p id={field.errorId} role="alert" className="mt-1 ml-6 text-xs leading-5 text-danger">{error}</p>}
    </div>
  )
}
