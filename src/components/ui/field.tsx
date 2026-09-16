import type { ReactNode } from 'react'
import { cn } from './cn.ts'

export type FieldProps = {
  label: string
  htmlFor?: string
  labelId?: string
  hideLabel?: boolean
  required?: boolean
  hint?: ReactNode
  hintId?: string
  error?: ReactNode
  errorId?: string
  aside?: ReactNode
  className?: string
  children: ReactNode
}

export default function Field({ label, htmlFor, labelId, hideLabel, required, hint, hintId, error, errorId, aside, className, children }: FieldProps) {
  return (
    <div className={cn('grid gap-1.5 text-sm', className)}>
      <div className={cn('flex items-center justify-between gap-3', hideLabel && 'sr-only')}>
        <label id={labelId} htmlFor={htmlFor} className="font-medium">
          {label}
          {required && <span aria-hidden="true" className="text-muted"> *</span>}
        </label>
        {aside}
      </div>
      {children}
      {hint && <p id={hintId} className="text-xs leading-5 text-muted">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-xs leading-5 text-danger">{error}</p>}
    </div>
  )
}
