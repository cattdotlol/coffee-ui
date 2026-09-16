import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import Spinner from './spinner.tsx'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'plain'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      {...props}
      type={type}
      disabled={disabled || loading}
      data-variant={variant}
      data-size={size}
      className={cn('ui-button', className)}
    >
      {loading && <Spinner size="sm" label="Loading" />}
      {children}
    </button>
  )
}
