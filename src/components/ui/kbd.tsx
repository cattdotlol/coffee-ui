import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export default function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return <kbd {...props} className={cn('inline-flex h-5 min-w-5 items-center justify-center rounded-control border border-b-2 border-border bg-subtle px-1 font-sans text-[0.6875rem] font-medium leading-none text-muted', className)} />
}
