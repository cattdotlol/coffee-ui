import type { ComponentProps, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from './cn.ts'

export type TagProps = ComponentProps<'span'> & {
  variant?: 'default' | 'outline' | 'primary'
  icon?: ReactNode
  onRemove?: () => void
  removeLabel?: string
  removeTabIndex?: number
  disabled?: boolean
}

const variants = {
  default: 'border-transparent bg-subtle text-foreground',
  outline: 'border-border text-foreground',
  primary: 'border-transparent bg-primary-soft text-primary',
}

export default function Tag({ variant = 'default', icon, onRemove, removeLabel, removeTabIndex, disabled, className, children, ...props }: TagProps) {
  return (
    <span {...props} className={cn('inline-flex h-6 max-w-full items-center gap-1 rounded-control border text-xs font-medium [&_svg]:size-3 [&_svg]:shrink-0', icon ? 'pl-1.5' : 'pl-2', onRemove ? 'pr-0.5' : 'pr-2', variants[variant], disabled && 'opacity-50', className)}>
      {icon && <span aria-hidden="true" className="inline-flex shrink-0 opacity-80">{icon}</span>}
      <span className="min-w-0 truncate [&_svg]:mr-1 [&_svg]:inline-block [&_svg]:align-[-0.125em]">{children}</span>
      {onRemove && (
        <button
          type="button"
          tabIndex={removeTabIndex}
          aria-label={removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove')}
          disabled={disabled}
          onClick={onRemove}
          className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-foreground disabled:cursor-not-allowed"
        >
          <X aria-hidden="true" className="size-3" strokeWidth={1.5} />
        </button>
      )}
    </span>
  )
}
