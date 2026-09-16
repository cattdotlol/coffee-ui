import type { ReactNode } from 'react'
import { Brain } from 'lucide-react'
import { cn } from './cn.ts'
import Collapsible from './collapsible.tsx'

export type ReasoningProps = {
  streaming?: boolean
  duration?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children: ReactNode
}

export default function Reasoning({ streaming = false, duration, open, defaultOpen, onOpenChange, className, children }: ReasoningProps) {
  const title = streaming ? 'Thinking…' : duration === undefined ? 'Reasoning' : `Thought for ${duration} ${duration === 1 ? 'second' : 'seconds'}`

  return (
    <Collapsible
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={cn('px-2.5', className)}
      title={
        <span className="flex items-center gap-2 font-normal text-muted">
          <Brain aria-hidden="true" className={cn('size-4 shrink-0', streaming && 'motion-safe:animate-pulse')} strokeWidth={1.5} />
          <span aria-live="polite">{title}</span>
        </span>
      }
    >
      <div className="border-l-2 border-border pl-3 text-xs leading-5 whitespace-pre-wrap text-muted">{children}</div>
    </Collapsible>
  )
}
