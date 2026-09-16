import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type TreeItem = {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  children?: readonly TreeItem[]
}

export type TreeViewProps = {
  label: string
  items: readonly TreeItem[]
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  selected?: string | null
  defaultSelected?: string | null
  onSelectedChange?: (id: string | null) => void
  className?: string
}

type Visible = { item: TreeItem; parentId?: string }

function flatten(items: readonly TreeItem[], expanded: string[], parentId?: string): Visible[] {
  return items.flatMap((item) => [
    { item, parentId },
    ...(item.children && expanded.includes(item.id) ? flatten(item.children, expanded, item.id) : []),
  ])
}

export default function TreeView({
  label, items, expanded: expandedProp, defaultExpanded = [], onExpandedChange,
  selected: selectedProp, defaultSelected = null, onSelectedChange, className,
}: TreeViewProps) {
  const treeRef = useRef<HTMLUListElement>(null)
  const shouldFocus = useRef(false)
  const [expanded, setExpanded] = useControllableState(expandedProp, defaultExpanded, onExpandedChange)
  const [selected, setSelected] = useControllableState(selectedProp, defaultSelected, onSelectedChange)
  const [focusedId, setFocusedId] = useState<string>()
  const visible = flatten(items, expanded)
  const focused = visible.find((entry) => entry.item.id === focusedId)?.item.id
    ?? visible.find((entry) => entry.item.id === selected)?.item.id
    ?? visible[0]?.item.id

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    treeRef.current?.querySelector<HTMLElement>(`[data-tree-id="${CSS.escape(focused ?? '')}"]`)?.focus()
  })

  function focus(id: string | undefined) {
    if (!id) return
    shouldFocus.current = true
    setFocusedId(id)
  }

  function toggle(id: string) {
    setExpanded(expanded.includes(id) ? expanded.filter((item) => item !== id) : [...expanded, id])
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const index = visible.findIndex((entry) => entry.item.id === focused)
    const current = visible[index]
    if (!current) return
    const { item, parentId } = current
    const open = expanded.includes(item.id)
    const actions: Record<string, () => void> = {
      ArrowDown: () => focus(visible[index + 1]?.item.id),
      ArrowUp: () => focus(visible[index - 1]?.item.id),
      Home: () => focus(visible[0]?.item.id),
      End: () => focus(visible.at(-1)?.item.id),
      ArrowRight: () => {
        if (!item.children?.length) return
        if (open) focus(item.children[0]?.id)
        else toggle(item.id)
      },
      ArrowLeft: () => {
        if (item.children?.length && open) toggle(item.id)
        else focus(parentId)
      },
      Enter: () => { if (!item.disabled) setSelected(item.id) },
      ' ': () => { if (!item.disabled) setSelected(item.id) },
    }
    const action = actions[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  function renderItems(list: readonly TreeItem[], level: number): ReactNode {
    return list.map((item, index) => {
      const hasChildren = !!item.children?.length
      const open = expanded.includes(item.id)
      return (
        <li
          key={item.id}
          role="treeitem"
          data-tree-id={item.id}
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={index + 1}
          aria-expanded={hasChildren ? open : undefined}
          aria-selected={selected === item.id}
          aria-disabled={item.disabled || undefined}
          tabIndex={focused === item.id ? 0 : -1}
          onFocus={(event) => { if (event.target === event.currentTarget) setFocusedId(item.id) }}
          className="ui-tree-item outline-none"
        >
          <div
            onClick={(event) => {
              ;(event.currentTarget.parentElement as HTMLElement).focus()
              if (!item.disabled) setSelected(item.id)
            }}
            style={{ paddingInlineStart: `calc(var(--spacing) * ${2 + (level - 1) * 5})` }}
            className={cn('ui-tree-row flex min-h-8 items-center gap-1.5 rounded-control pe-2.5 text-sm pointer-coarse:min-h-11', item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-subtle')}
          >
            {hasChildren
              ? <span aria-hidden="true" onClick={(event) => { event.stopPropagation(); toggle(item.id) }} className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted hover:text-foreground">
                <ChevronRight className={cn('size-3.5 motion-safe:transition-transform rtl:-scale-x-100', open && 'rotate-90 rtl:rotate-90')} strokeWidth={1.5} />
              </span>
              : <span aria-hidden="true" className="size-4 shrink-0" />}
            {item.icon && <span aria-hidden="true" className="inline-flex size-4 shrink-0 text-muted [&>svg]:size-full">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
          </div>
          {hasChildren && open && <ul role="group">{renderItems(item.children!, level + 1)}</ul>}
        </li>
      )
    })
  }

  return (
    <ul ref={treeRef} role="tree" aria-label={label} onKeyDown={handleKeyDown} className={cn('ui-tree text-foreground', className)}>
      {renderItems(items, 1)}
    </ul>
  )
}
