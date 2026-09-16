import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { cn } from './cn.ts'

export type HoverCardProps = {
  content: ReactNode
  children: ReactElement
  openDelay?: number
  closeDelay?: number
  className?: string
}

export default function HoverCard({ content, children, openDelay = 400, closeDelay = 150, className }: HoverCardProps) {
  const id = useId()
  const anchorRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  function schedule(next: boolean) {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), next ? openDelay : closeDelay)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return
    function dismiss(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    function update() {
      const anchor = anchorRef.current?.getBoundingClientRect()
      const card = cardRef.current?.getBoundingClientRect()
      if (!anchor || !card) return
      const below = window.innerHeight - anchor.bottom - 8
      const top = card.height > below && anchor.top > below ? anchor.top - card.height - 8 : anchor.bottom + 8
      setPosition({
        left: Math.max(8, Math.min(anchor.left, window.innerWidth - card.width - 8)),
        top: Math.max(8, Math.min(top, window.innerHeight - card.height - 8)),
      })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  return (
    <span
      ref={anchorRef}
      className="inline-flex"
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
      onFocus={() => schedule(true)}
      onBlur={() => schedule(false)}
    >
      {children}
      {open && createPortal(
        <motion.div
          ref={cardRef}
          id={id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onMouseEnter={() => schedule(true)}
          onMouseLeave={() => schedule(false)}
          style={position}
          className={cn('fixed z-50 w-72 max-w-[calc(100vw-1rem)] rounded-panel border border-border bg-surface p-4 text-sm text-foreground shadow-lg', className)}
        >
          {content}
        </motion.div>,
        document.body,
      )}
    </span>
  )
}
