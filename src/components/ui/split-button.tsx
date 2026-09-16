import { ChevronDown } from 'lucide-react'
import { cn } from './cn.ts'
import Button from './button.tsx'
import type { ButtonProps } from './button.tsx'
import DropdownMenu from './dropdown-menu.tsx'
import type { MenuItem } from './menu-items.tsx'

export type SplitButtonProps = Omit<ButtonProps, 'variant'> & {
  items: readonly MenuItem[]
  variant?: 'primary' | 'secondary' | 'outline'
  menuLabel?: string
}

export default function SplitButton({ items, variant = 'primary', size = 'md', menuLabel = 'More options', disabled, className, children, ...props }: SplitButtonProps) {
  return (
    <div role="group" aria-label={typeof children === 'string' ? children : undefined} className={cn('inline-flex [&>*:focus-visible]:relative [&>*:focus-visible]:z-10', className)}>
      <Button {...props} variant={variant} size={size} disabled={disabled} className="rounded-r-none">{children}</Button>
      <DropdownMenu
        align="end"
        items={items}
        trigger={
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={menuLabel}
            className={cn('ui-icon-button rounded-l-none', variant === 'outline' ? '-ml-px' : 'border-l-current/20')}
          >
            <ChevronDown aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </Button>
        }
      />
    </div>
  )
}
