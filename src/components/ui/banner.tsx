import { useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from './cn.ts'

export type BannerProps = Omit<ComponentProps<'section'>, 'title'> & {
  label?: string
  title?: string
  icon?: ReactNode
  action?: ReactNode
  variant?: 'default' | 'primary' | 'destructive'
  dismissible?: boolean
  onDismiss?: () => void
}

const variants = {
  default: 'border-border bg-surface text-foreground',
  primary: 'border-transparent bg-primary text-on-primary',
  destructive: 'border-transparent bg-destructive text-on-destructive',
}

export default function Banner({ label = 'Announcement', title, icon, action, variant = 'default', dismissible = false, onDismiss, className, children, ...props }: BannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  const tinted = variant !== 'default'

  return (
    <section {...props} aria-label={label} className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 rounded-panel border py-2 pr-2 pl-4 text-sm sm:flex-nowrap', variants[variant], className)}>
      {icon && <span aria-hidden="true" className={cn('inline-flex size-4 shrink-0 [&>svg]:size-full', !tinted && 'text-muted')}>{icon}</span>}
      <p className="min-w-0 flex-1">
        {title && <span className="font-medium">{title} </span>}
        <span className={cn(!tinted && 'text-muted')}>{children}</span>
      </p>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => { setDismissed(true); onDismiss?.() }}
          className={cn('inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full motion-safe:transition-colors pointer-coarse:size-11', tinted ? 'hover:bg-white/15' : 'text-muted hover:bg-subtle hover:text-foreground')}
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </button>
      )}
    </section>
  )
}
