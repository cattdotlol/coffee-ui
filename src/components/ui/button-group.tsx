import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type ButtonGroupProps = ComponentProps<'div'> & {
  label: string
  orientation?: 'horizontal' | 'vertical'
}

export default function ButtonGroup({ label, orientation = 'horizontal', className, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex [&>*]:relative [&>*:focus-visible]:z-10',
        orientation === 'horizontal'
          ? 'flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none'
          : 'flex-col [&>*]:rounded-inner [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
        className,
      )}
    />
  )
}
