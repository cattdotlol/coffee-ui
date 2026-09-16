import { useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import Button from './button.tsx'
import MenuItems from './menu-items.tsx'
import type { MenuItem } from './menu-items.tsx'
import { withTriggerProps } from './trigger.ts'
import type { TriggerElement } from './trigger.ts'
import useAnchoredPopover from './use-anchored-popover.ts'
import useMenuKeyboard, { focusMenuItem } from './use-menu-keyboard.ts'

export type DropdownMenuItem = MenuItem

export type DropdownMenuProps = {
  trigger: string | TriggerElement
  items: readonly DropdownMenuItem[]
  align?: 'start' | 'end'
  className?: string
}

export default function DropdownMenu({ trigger, items, align = 'start', className }: DropdownMenuProps) {
  const custom = typeof trigger === 'string' ? undefined : trigger.props.id
  const { id, triggerId, panelRef, open, setOpen, position, close } = useAnchoredPopover(align, custom)
  const handleKeyDown = useMenuKeyboard(close)

  useEffect(() => {
    if (!open) return
    const trigger = document.getElementById(triggerId)
    focusMenuItem(panelRef.current, trigger?.dataset.focusLast ? 'last' : 'first')
    delete trigger?.dataset.focusLast
  }, [open, panelRef, triggerId])

  function openFromKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    if (event.key === 'ArrowUp') event.currentTarget.dataset.focusLast = 'true'
    event.currentTarget.click()
  }

  const triggerProps = {
    id: triggerId,
    popoverTarget: id,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': id,
    onKeyDown: openFromKeyboard,
  } as const

  return (
    <>
      {typeof trigger === 'string'
        ? <Button variant="outline" {...triggerProps}>{trigger}<ChevronDown aria-hidden="true" className="size-4" strokeWidth={1.5} /></Button>
        : withTriggerProps(trigger, triggerProps)}
      <motion.div
        ref={panelRef}
        id={id}
        popover="auto"
        role="menu"
        aria-labelledby={triggerId}
        tabIndex={-1}
        onToggle={(event) => setOpen(event.currentTarget.matches(':popover-open'))}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.hidePopover()
        }}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className={cn('fixed inset-auto m-0 origin-top max-h-[calc(100dvh-1rem)] w-52 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-panel border border-border bg-surface p-1 text-foreground shadow-lg', className)}
      >
        <MenuItems items={items} close={close} />
      </motion.div>
    </>
  )
}
