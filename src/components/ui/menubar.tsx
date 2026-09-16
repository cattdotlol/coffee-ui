import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import MenuItems from './menu-items.tsx'
import type { MenuItem } from './menu-items.tsx'
import useAnchoredPopover from './use-anchored-popover.ts'
import useMenuKeyboard, { focusMenuItem } from './use-menu-keyboard.ts'

export type MenubarMenu = {
  label: string
  items: readonly MenuItem[]
  disabled?: boolean
}

export type MenubarProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string
  menus: readonly MenubarMenu[]
}

type Step = 1 | -1 | 'first' | 'last'

type MenuProps = {
  menu: MenubarMenu
  index: number
  active: boolean
  anyOpen: boolean
  onFocus: (index: number) => void
  onOpenChange: (index: number, open: boolean) => void
  onNavigate: (from: HTMLElement | null, step: Step, open: boolean) => void
}

function Menu({ menu, index, active, anyOpen, onFocus, onOpenChange, onNavigate }: MenuProps) {
  const { id, triggerId, panelRef, open, setOpen, position, close } = useAnchoredPopover('start')
  const handleKeyDown = useMenuKeyboard(close)

  useEffect(() => {
    if (!open) return
    const trigger = document.getElementById(triggerId)
    focusMenuItem(panelRef.current, trigger?.dataset.focusLast ? 'last' : 'first')
    delete trigger?.dataset.focusLast
  }, [open, panelRef, triggerId])

  function horizontalStep(event: KeyboardEvent<HTMLElement>): Step | undefined {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    if (event.key === 'ArrowRight') return rtl ? -1 : 1
    if (event.key === 'ArrowLeft') return rtl ? 1 : -1
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const step = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : horizontalStep(event)
    if (step) {
      event.preventDefault()
      onNavigate(event.currentTarget, step, false)
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    if (event.key === 'ArrowUp') event.currentTarget.dataset.focusLast = 'true'
    if (!open) event.currentTarget.click()
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = horizontalStep(event)
    if (!step) {
      handleKeyDown(event)
      return
    }
    event.preventDefault()
    onNavigate(document.getElementById(triggerId), step, true)
  }

  return (
    <>
      <button
        type="button"
        id={triggerId}
        role="menuitem"
        popoverTarget={id}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        tabIndex={active ? 0 : -1}
        disabled={menu.disabled}
        data-menubar-trigger=""
        onFocus={() => onFocus(index)}
        onKeyDown={handleTriggerKeyDown}
        onPointerEnter={(event) => {
          if (!anyOpen || open || event.pointerType !== 'mouse') return
          event.currentTarget.focus()
          event.currentTarget.click()
        }}
        className="inline-flex min-h-8 cursor-pointer items-center rounded-control px-3 text-sm font-medium text-foreground enabled:hover:bg-subtle aria-expanded:bg-subtle disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11 motion-safe:transition-colors"
      >
        {menu.label}
      </button>
      <motion.div
        ref={panelRef}
        id={id}
        popover="auto"
        role="menu"
        aria-labelledby={triggerId}
        tabIndex={-1}
        onToggle={(event) => {
          const isOpen = event.currentTarget.matches(':popover-open')
          setOpen(isOpen)
          onOpenChange(index, isOpen)
        }}
        onKeyDown={handlePanelKeyDown}
        onBlur={(event) => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.hidePopover()
        }}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className="fixed inset-auto m-0 origin-top max-h-[calc(100dvh-1rem)] w-56 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-panel border border-border bg-surface p-1 text-foreground shadow-lg"
      >
        <MenuItems items={menu.items} close={close} />
      </motion.div>
    </>
  )
}

export default function Menubar({ label, menus, className, ...props }: MenubarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(() => Math.max(0, menus.findIndex((menu) => !menu.disabled)))
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function navigate(from: HTMLElement | null, step: Step, open: boolean) {
    const triggers = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[data-menubar-trigger]:not(:disabled)') ?? [])
    const current = triggers.indexOf(from as HTMLButtonElement)
    const target = step === 'first' ? triggers[0] : step === 'last' ? triggers.at(-1) : triggers[(current + step + triggers.length) % triggers.length]
    if (!target) return
    target.focus()
    if (open) target.click()
  }

  return (
    <div
      {...props}
      ref={ref}
      role="menubar"
      aria-label={label}
      aria-orientation="horizontal"
      className={cn('inline-flex max-w-full items-center gap-1 rounded-control border border-border bg-surface p-1', className)}
    >
      {menus.map((menu, index) => (
        <Menu
          key={menu.label}
          menu={menu}
          index={index}
          active={index === active}
          anyOpen={openIndex !== null}
          onFocus={setActive}
          onOpenChange={(index, open) => setOpenIndex((current) => open ? index : current === index ? null : current)}
          onNavigate={navigate}
        />
      ))}
    </div>
  )
}
