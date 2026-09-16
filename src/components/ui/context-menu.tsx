import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ComponentProps, MouseEvent } from 'react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import MenuItems from './menu-items.tsx'
import type { MenuItem } from './menu-items.tsx'
import useMenuKeyboard, { focusMenuItem } from './use-menu-keyboard.ts'

export type ContextMenuProps = Omit<ComponentProps<'div'>, 'onContextMenu'> & {
  label: string
  items: readonly MenuItem[]
  disabled?: boolean
  menuClassName?: string
}

export default function ContextMenu({ label, items, disabled, menuClassName, className, children, ...props }: ContextMenuProps) {
  const id = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ left: 0, top: 0 })

  function close() {
    panelRef.current?.hidePopover()
    returnFocus.current?.focus()
  }

  const handleKeyDown = useMenuKeyboard(close)

  function openMenu(event: MouseEvent<HTMLDivElement>) {
    if (disabled) return
    event.preventDefault()
    returnFocus.current = document.activeElement as HTMLElement | null
    // Keyboard-invoked context menus (Shift+F10) report 0,0, so anchor to the target instead.
    const fromKeyboard = event.clientX === 0 && event.clientY === 0
    const box = (event.target as HTMLElement).getBoundingClientRect()
    setPoint(fromKeyboard ? { x: box.left, y: box.bottom } : { x: event.clientX, y: event.clientY })
    const panel = panelRef.current
    if (panel?.matches(':popover-open')) panel.hidePopover()
    panel?.showPopover()
  }

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!open || !panel) return
    const box = panel.getBoundingClientRect()
    setPosition({
      left: Math.max(8, Math.min(point.x, window.innerWidth - box.width - 8)),
      top: Math.max(8, Math.min(point.y, window.innerHeight - box.height - 8)),
    })
  }, [open, point])

  useEffect(() => {
    if (open) focusMenuItem(panelRef.current, 'first')
  }, [open])

  return (
    <div {...props} onContextMenu={openMenu} className={className}>
      {children}
      <motion.div
        ref={panelRef}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        tabIndex={-1}
        onToggle={(event) => setOpen(event.currentTarget.matches(':popover-open'))}
        onKeyDown={handleKeyDown}
        onContextMenu={(event) => event.stopPropagation()}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className={cn('fixed inset-auto m-0 origin-top max-h-[calc(100dvh-1rem)] w-52 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-panel border border-border bg-surface p-1 text-foreground shadow-lg', menuClassName)}
      >
        <MenuItems items={items} close={close} />
      </motion.div>
    </div>
  )
}
