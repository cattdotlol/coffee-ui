import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export default function Skeleton({ className, ...props }: Omit<ComponentProps<'div'>, 'children'>) {
  return <div {...props} aria-hidden="true" className={cn('rounded-control bg-primary-soft bg-[linear-gradient(90deg,transparent_25%,color-mix(in_srgb,var(--color-surface)_55%,transparent)_50%,transparent_75%)] bg-size-[200%_100%] motion-safe:animate-shimmer', className)} />
}
