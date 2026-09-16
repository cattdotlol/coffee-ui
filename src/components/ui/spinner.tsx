import type { ComponentProps } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from './cn.ts'

export type SpinnerProps = Omit<ComponentProps<'span'>, 'children'> & {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'size-3.5', md: 'size-4', lg: 'size-6' }

export default function Spinner({ label = 'Loading', size = 'md', className, ...props }: SpinnerProps) {
  return (
    <span {...props} role="status" className={cn('inline-flex shrink-0 items-center', className)}>
      <LoaderCircle aria-hidden="true" className={cn('animate-spin motion-reduce:[animation-duration:3s]', sizes[size])} strokeWidth={1.5} />
      <span className="sr-only">{label}</span>
    </span>
  )
}
