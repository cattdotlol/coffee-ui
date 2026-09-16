import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { cn } from './cn.ts'

type TriggerProps = { 'aria-describedby'?: string }

export type TooltipProps = {
  content: string
  children: ReactElement<TriggerProps> | ((props: { 'aria-describedby': string | undefined }) => ReactNode)
  className?: string
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  const id = useId()
  const trigger = useRef<HTMLSpanElement>(null)
  const tooltip = useRef<HTMLSpanElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const open = (hovered || focused) && !dismissed

  function enter() {
    clearTimeout(timer.current)
    setDismissed(false)
    if (hovered) return
    timer.current = setTimeout(() => setHovered(true), 300)
  }

  function leave() {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHovered(false), 120)
  }

  function renderTrigger() {
    if (typeof children === 'function') return children({ 'aria-describedby': open ? id : undefined })
    if (!isValidElement(children)) return children
    const describedBy = [children.props['aria-describedby'], open && id].filter(Boolean).join(' ') || undefined
    return cloneElement(children, { 'aria-describedby': describedBy })
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return
    function dismiss(event: KeyboardEvent) {
      if (event.key === 'Escape') setDismissed(true)
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    function updatePosition() {
      const anchor = trigger.current?.getBoundingClientRect()
      const tip = tooltip.current?.getBoundingClientRect()
      if (!anchor || !tip) return
      setPosition({
        left: Math.max(8, Math.min(anchor.left + (anchor.width - tip.width) / 2, window.innerWidth - tip.width - 8)),
        top: anchor.top > tip.height + 16 ? anchor.top - tip.height - 8 : Math.max(8, Math.min(anchor.bottom + 8, window.innerHeight - tip.height - 8)),
      })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, content])

  return (
    <span
      ref={trigger}
      className="inline-flex"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={() => { setFocused(true); setDismissed(false) }}
      onBlur={() => setFocused(false)}
    >
      {renderTrigger()}
      {open && createPortal(
        <motion.span initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1, ease: 'easeOut' }} ref={tooltip} id={id} role="tooltip" onMouseEnter={enter} onMouseLeave={leave} style={position} className={cn('fixed z-50 max-w-[min(16rem,calc(100vw-1rem))] rounded-inner border border-border bg-foreground px-2.5 py-1.5 text-xs leading-5 text-background shadow-md', className)}>
          {content}
        </motion.span>,
        document.body,
      )}
    </span>
  )
}
