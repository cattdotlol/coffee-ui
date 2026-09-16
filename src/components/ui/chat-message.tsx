import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import Avatar from './avatar.tsx'

export type ChatMessageProps = ComponentProps<'div'> & {
  author: string
  avatarSrc?: string
  variant?: 'incoming' | 'outgoing'
  time?: string
  dateTime?: string
  status?: string
  grouped?: boolean
}

export default function ChatMessage({ author, avatarSrc, variant = 'incoming', time, dateTime, status, grouped = false, className, children, ...props }: ChatMessageProps) {
  const outgoing = variant === 'outgoing'

  return (
    <div {...props} className={cn('flex gap-2.5', outgoing && 'flex-row-reverse', grouped ? '-mt-1.5' : 'mt-1 first:mt-0', className)}>
      {!outgoing && (grouped ? <span aria-hidden="true" className="w-7 shrink-0" /> : <Avatar alt={author} src={avatarSrc} size="sm" className="mt-5" />)}
      <div className={cn('flex min-w-0 max-w-[80%] flex-col gap-1', outgoing ? 'items-end' : 'items-start')}>
        <p className={cn('px-1 text-xs font-medium text-muted', (grouped || outgoing) && 'sr-only')}>{author}</p>
        <div className={cn('rounded-inner px-3.5 py-2 text-sm leading-6 whitespace-pre-wrap wrap-break-word', outgoing ? 'bg-primary text-on-primary' : 'bg-subtle text-foreground')}>
          {children}
        </div>
        {(time || status) && (
          <p className="flex gap-1.5 px-1 text-xs text-muted">
            {time && <time dateTime={dateTime}>{time}</time>}
            {time && status && <span aria-hidden="true">·</span>}
            {status && <span>{status}</span>}
          </p>
        )}
      </div>
    </div>
  )
}
