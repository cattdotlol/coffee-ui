import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type TypingIndicatorProps = Omit<ComponentProps<'span'>, 'children'> & {
  label?: string
  variant?: 'dots' | 'cursor'
}

export default function TypingIndicator({ label = 'Assistant is typing', variant = 'dots', className, ...props }: TypingIndicatorProps) {
  return (
    <span {...props} role="status" className={cn('inline-flex items-center', variant === 'dots' && 'h-6 gap-1', className)}>
      {variant === 'dots'
        ? [0, 1, 2].map((dot) => (
          <span key={dot} aria-hidden="true" style={{ animationDelay: `${dot * 160}ms` }} className="size-1.5 rounded-full bg-muted motion-safe:animate-typing" />
        ))
        : <span aria-hidden="true" className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.15em] rounded-full bg-current motion-safe:animate-caret" />}
      <span className="sr-only">{label}</span>
    </span>
  )
}
