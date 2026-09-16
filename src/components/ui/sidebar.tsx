import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'

export type SidebarItem = {
  label: string
  href?: string
  icon?: ReactNode
  badge?: ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export type SidebarGroup = { label?: string; items: readonly SidebarItem[] }

export type SidebarLinkProps = {
  className: string
  children: ReactNode
  'aria-current'?: 'page'
}

export type SidebarProps = Omit<ComponentProps<'aside'>, 'children'> & {
  groups: readonly SidebarGroup[]
  header?: ReactNode
  footer?: ReactNode
  label?: string
  renderLink?: (item: SidebarItem & { href: string }, props: SidebarLinkProps) => ReactNode
}

const itemClass = 'group flex min-h-9 w-full items-center gap-2 rounded-control px-2.5 py-1.5 text-left text-sm motion-safe:transition-colors hover:bg-primary-soft hover:text-primary-hover aria-[current=page]:bg-primary-soft aria-[current=page]:font-medium aria-[current=page]:text-primary disabled:pointer-events-none disabled:opacity-50 pointer-coarse:min-h-11'

export default function Sidebar({ groups, header, footer, label = 'Main navigation', renderLink, className, ...props }: SidebarProps) {
  return (
    <aside {...props} className={cn('flex shrink-0 flex-col rounded-panel border border-border bg-subtle p-4', className)}>
      {header && <div className="mb-4">{header}</div>}
      <nav aria-label={label} className="flex flex-col gap-5">
        {groups.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex}>
            {group.label && <p className="mb-1 px-2.5 text-xs font-medium text-muted">{group.label}</p>}
            <ul className="flex flex-wrap gap-1 sm:flex-col">
              {group.items.map((item) => {
                const content = <>
                  {item.icon && <span aria-hidden="true" className="inline-flex size-4 shrink-0 text-muted motion-safe:transition-colors group-hover:text-current group-aria-[current=page]:text-primary [&>svg]:size-full">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.badge}
                </>
                const linkProps: SidebarLinkProps = { className: itemClass, children: content, 'aria-current': item.active ? 'page' : undefined }
                return (
                  <li key={item.href ?? item.label}>
                    {item.href && !item.disabled
                      ? renderLink ? renderLink({ ...item, href: item.href }, linkProps) : <a href={item.href} {...linkProps} />
                      : <button type="button" disabled={item.disabled} onClick={item.onClick} className={cn(itemClass, 'cursor-pointer')} aria-current={linkProps['aria-current']}>{content}</button>}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="mt-auto pt-4">{footer}</div>}
    </aside>
  )
}
