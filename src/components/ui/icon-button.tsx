import { LoaderCircle } from 'lucide-react'
import { cn } from './cn.ts'
import Button from './button.tsx'
import type { ButtonProps } from './button.tsx'

export type IconButtonProps = Omit<ButtonProps, 'aria-label'> & {
  'aria-label': string
}

export default function IconButton({ variant = 'ghost', loading = false, disabled, className, children, ...props }: IconButtonProps) {
  return (
    <Button {...props} variant={variant} disabled={disabled || loading} aria-busy={loading || undefined} className={cn('ui-icon-button', className)}>
      <span aria-hidden="true" className="inline-flex size-4 items-center justify-center [&>svg]:size-full">
        {loading ? <LoaderCircle className="animate-spin motion-reduce:[animation-duration:3s]" strokeWidth={1.5} /> : children}
      </span>
    </Button>
  )
}
