import type { ComponentProps, ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = { label: string; href?: string }

export type BreadcrumbProps = Omit<ComponentProps<'nav'>, 'children'> & {
  items: readonly BreadcrumbItem[]
  renderLink?: (item: BreadcrumbItem & { href: string }, props: { className: string; children: ReactNode }) => ReactNode
}

const linkClass = 'rounded-control text-muted hover:text-foreground motion-safe:transition-colors'

export default function Breadcrumb({ items, renderLink, className, 'aria-label': label = 'Breadcrumb', ...props }: BreadcrumbProps) {
  return (
    <nav {...props} aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {last || !item.href
                ? <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-foreground' : 'text-muted'}>{item.label}</span>
                : renderLink ? renderLink({ ...item, href: item.href }, { className: linkClass, children: item.label }) : <a href={item.href} className={linkClass}>{item.label}</a>}
              {!last && <ChevronRight aria-hidden="true" className="size-3.5 text-muted" strokeWidth={1.5} />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
