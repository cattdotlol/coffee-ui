import { useState } from 'react'
import type { ComponentProps } from 'react'
import { Ellipsis } from 'lucide-react'
import { cn } from './cn.ts'
import DropdownMenu from './dropdown-menu.tsx'
import IconButton from './icon-button.tsx'
import type { MenuItem } from './menu-items.tsx'

export type Conversation = {
  id: string
  title: string
  updatedAt: Date
}

export type ConversationListProps = Omit<ComponentProps<'nav'>, 'children' | 'onSelect'> & {
  conversations: readonly Conversation[]
  selectedId?: string | null
  onSelect: (id: string) => void
  getActions?: (conversation: Conversation) => readonly MenuItem[]
  label?: string
  now?: Date
}

const day = 24 * 60 * 60 * 1000

function groupLabel(date: Date, today: number) {
  const days = Math.floor((today - new Date(date).setHours(0, 0, 0, 0)) / day)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return 'Previous 7 days'
  if (days < 30) return 'Previous 30 days'
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export default function ConversationList({ conversations, selectedId, onSelect, getActions, label = 'Conversations', now, className, ...props }: ConversationListProps) {
  const [mountedAt] = useState(() => new Date())
  const today = new Date(now ?? mountedAt).setHours(0, 0, 0, 0)
  const groups = new Map<string, Conversation[]>()
  for (const conversation of [...conversations].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())) {
    const key = groupLabel(conversation.updatedAt, today)
    groups.set(key, [...(groups.get(key) ?? []), conversation])
  }

  return (
    <nav {...props} aria-label={label} className={cn('space-y-4 text-sm', className)}>
      {[...groups].map(([group, items]) => (
        <section key={group} aria-label={group}>
          <h3 aria-hidden="true" className="mb-1 px-2.5 text-xs font-medium text-muted">{group}</h3>
          <ul className="space-y-0.5">
            {items.map((conversation) => {
              const actions = getActions?.(conversation)
              return (
                <li key={conversation.id} className="group relative flex items-center">
                  <button
                    type="button"
                    aria-current={conversation.id === selectedId || undefined}
                    onClick={() => onSelect(conversation.id)}
                    className={cn('flex min-h-9 w-full min-w-0 cursor-pointer items-center rounded-control px-2.5 py-1.5 text-left hover:bg-subtle aria-[current=true]:bg-primary-soft aria-[current=true]:font-medium pointer-coarse:min-h-11 motion-safe:transition-colors', actions?.length && 'pr-9')}
                  >
                    <span className="truncate">{conversation.title}</span>
                  </button>
                  {actions?.length ? (
                    <span className="absolute right-0.5 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 pointer-fine:has-aria-expanded:opacity-100">
                      <DropdownMenu align="end" items={actions} trigger={<IconButton aria-label={`Actions for ${conversation.title}`} size="sm" className="min-h-7 w-7"><Ellipsis strokeWidth={1.5} /></IconButton>} />
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}
