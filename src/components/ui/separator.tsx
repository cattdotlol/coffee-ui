import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type SeparatorProps = Omit<ComponentProps<'div'>, 'children'> & {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export default function Separator({ orientation = 'horizontal', decorative = true, className, ...props }: SeparatorProps) {
  return (
    <div
      {...props}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch', className)}
    />
  )
}
