import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type ScrollAreaProps = ComponentProps<'div'> & {
  label?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
}

export default function ScrollArea({ label, orientation = 'vertical', className, ...props }: ScrollAreaProps) {
  return (
    <div
      role={label ? 'region' : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
      {...props}
      className={cn(
        'ui-scroll-area',
        orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
        orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
        orientation === 'both' && 'overflow-auto',
        className,
      )}
    />
  )
}
