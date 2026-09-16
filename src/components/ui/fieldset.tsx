import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type FieldsetProps = Omit<ComponentProps<'fieldset'>, 'children'> & {
  legend: string
  description?: ReactNode
  children: ReactNode
}

export default function Fieldset({ legend, description, className, children, ...props }: FieldsetProps) {
  const id = useId()

  return (
    <fieldset {...props} aria-describedby={description ? `${id}-description` : undefined} className={cn('min-w-0 disabled:opacity-50', className)}>
      <legend className="text-sm font-semibold">{legend}</legend>
      {description && <p id={`${id}-description`} className="mt-0.5 text-xs leading-5 text-muted">{description}</p>}
      <div className="mt-3 grid gap-3">{children}</div>
    </fieldset>
  )
}
