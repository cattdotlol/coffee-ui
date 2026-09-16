import { Children, isValidElement } from 'react'
import type { ComponentProps, CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from './cn.ts'

type HeadingLevel = 2 | 3 | 4 | 5 | 6

const sizes = {
  sm: '[--card-padding:calc(var(--spacing)*3.5)]',
  md: '[--card-padding:calc(var(--spacing)*5)]',
  lg: '[--card-padding:calc(var(--spacing)*7)]',
}

const variants = {
  default: 'border-border bg-surface shadow-xs',
  elevated: 'border-border/60 bg-surface shadow-md',
  outline: 'border-border bg-transparent',
  subtle: 'border-transparent bg-subtle',
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="card-header" className={cn('grid grid-cols-[1fr_auto] items-start gap-x-3 px-(--card-padding) pt-(--card-padding) last:pb-(--card-padding)', className)} />
}

export function CardTitle({ level = 3, href, className, children, ...props }: ComponentProps<'h3'> & { level?: HeadingLevel; href?: string }) {
  const Heading = `h${level}` as ElementType
  return (
    <Heading {...props} data-slot="card-title" className={cn('col-start-1 text-base leading-snug font-semibold tracking-tight', className)}>
      {href
        ? <a href={href} data-card-link="" className="after:absolute after:inset-0 after:rounded-panel focus-visible:outline-none">{children}</a>
        : children}
    </Heading>
  )
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p {...props} data-slot="card-description" className={cn('col-start-1 mt-1 text-sm leading-5 text-muted', className)} />
}

export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="card-action" className={cn('relative z-10 col-start-2 row-span-2 row-start-1 -mt-1 -mr-1 flex items-center gap-1 self-start', className)} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="card-content" className={cn('p-(--card-padding) [[data-slot=card-header]+&]:pt-4', className)} />
}

export function CardFooter({ align = 'end', divider = true, className, ...props }: ComponentProps<'div'> & { align?: 'start' | 'end' | 'between'; divider?: boolean }) {
  return (
    <div
      {...props}
      data-slot="card-footer"
      className={cn(
        'relative z-10 mt-auto flex flex-wrap items-center gap-2 px-(--card-padding)',
        divider ? 'border-t border-border py-3' : 'pb-(--card-padding) [[data-slot=card-content]+&]:-mt-1',
        align === 'end' && 'justify-end',
        align === 'between' && 'justify-between',
        className,
      )}
    />
  )
}

export function CardMedia({ ratio, className, style, ...props }: ComponentProps<'div'> & { ratio?: number }) {
  return (
    <div
      {...props}
      data-slot="card-media"
      style={{ aspectRatio: ratio, ...style } as CSSProperties}
      className={cn('relative overflow-hidden first:rounded-t-[calc(var(--radius-panel)-1px)] [&>img]:size-full [&>img]:object-cover', className)}
    />
  )
}

const parts = new Set<unknown>([CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, CardMedia])

export type CardProps = Omit<ComponentProps<'div'>, 'title'> & {
  as?: 'div' | 'section' | 'article' | 'li'
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  media?: ReactNode
  mediaRatio?: number
  footer?: ReactNode
  footerAlign?: 'start' | 'end' | 'between'
  href?: string
  headingLevel?: HeadingLevel
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export default function Card({
  as = 'div', title, description, action, media, mediaRatio, footer, footerAlign = 'end', href, headingLevel = 3,
  variant = 'default', size = 'md', className, children, ...props
}: CardProps) {
  // Children built from Card parts manage their own padding; anything else gets wrapped in CardContent.
  const Root = as as ElementType
  const composed = Children.toArray(children).some((child) => isValidElement(child) && parts.has(child.type))

  return (
    <Root
      {...props}
      data-variant={variant}
      className={cn(
        'relative flex flex-col rounded-panel border text-foreground',
        sizes[size],
        variants[variant],
        href && 'motion-safe:transition-[border-color,box-shadow] has-[[data-card-link]:hover]:border-muted/40 has-[[data-card-link]:hover]:shadow-md has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-3 has-[[data-card-link]:focus-visible]:outline-primary',
        className,
      )}
    >
      {media && <CardMedia ratio={mediaRatio}>{media}</CardMedia>}
      {(title || description || action) && (
        <CardHeader>
          {title && <CardTitle level={headingLevel} href={href}>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      {children && (composed ? children : <CardContent>{children}</CardContent>)}
      {footer && <CardFooter align={footerAlign}>{footer}</CardFooter>}
    </Root>
  )
}
