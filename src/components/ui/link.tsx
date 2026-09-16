import type { ComponentProps } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { linkStyles } from './link-styles.ts'
import type { LinkVariant } from './link-styles.ts'

export type LinkProps = ComponentProps<'a'> & {
  variant?: LinkVariant
  external?: boolean
}

export default function Link({ variant = 'default', external = false, className, children, ...props }: LinkProps) {
  return (
    <a
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
      className={linkStyles({ variant, className })}
    >
      {children}
      {external && <>
        <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.5} />
        <span className="sr-only"> (opens in a new tab)</span>
      </>}
    </a>
  )
}
