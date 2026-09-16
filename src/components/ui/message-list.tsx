import { useLayoutEffect, useRef } from 'react'
import type { ComponentProps } from 'react'
import { cn } from './cn.ts'

export type MessageListProps = ComponentProps<'div'> & {
  label: string
}

export default function MessageList({ label, className, children, onScroll, ...props }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pinned = useRef(true)

  useLayoutEffect(() => {
    const list = ref.current
    if (list && pinned.current) list.scrollTop = list.scrollHeight
  }, [children])

  return (
    <div
      {...props}
      ref={ref}
      role="log"
      aria-label={label}
      tabIndex={0}
      onScroll={(event) => {
        onScroll?.(event)
        const list = event.currentTarget
        // Only follow new messages while the reader is already at the bottom.
        pinned.current = list.scrollHeight - list.scrollTop - list.clientHeight < 32
      }}
      className={cn('ui-scroll-area flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-4', className)}
    >
      {children}
    </div>
  )
}
