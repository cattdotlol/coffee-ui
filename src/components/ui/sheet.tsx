import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import IconButton from './icon-button.tsx'
import { renderWithClose, withTriggerProps } from './trigger.ts'
import type { TriggerElement } from './trigger.ts'
import useControllableState from './use-controllable-state.ts'

const sides = {
  right: 'inset-y-0 right-0 left-auto h-dvh max-h-dvh w-[calc(100%-3rem)] max-w-sm rounded-l-panel border-l',
  left: 'inset-y-0 right-auto left-0 h-dvh max-h-dvh w-[calc(100%-3rem)] max-w-sm rounded-r-panel border-r',
  bottom: 'inset-x-0 top-auto bottom-0 max-h-[85dvh] w-full max-w-none rounded-t-panel border-t',
}

type Content = ReactNode | ((props: { close: () => void }) => ReactNode)

export type SheetProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: TriggerElement
  title: string
  description?: string
  side?: 'left' | 'right' | 'bottom'
  footer?: Content
  children?: Content
  className?: string
}

export default function Sheet({ open: openProp, defaultOpen = false, onOpenChange, trigger, title, description, side = 'right', footer, children, className }: SheetProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  const close = () => setOpen(false)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog?.open) dialog?.showModal()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  return (
    <>
      {trigger && withTriggerProps(trigger, { 'aria-haspopup': 'dialog', onClick: () => setOpen(true) })}
      <motion.dialog
        initial={false}
        animate={side === 'bottom' ? { opacity: open ? 1 : 0, y: open ? 0 : 24 } : { opacity: open ? 1 : 0, x: open ? 0 : side === 'right' ? 24 : -24 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onAnimationComplete={() => { if (!open) ref.current?.close() }}
        data-open={open}
        ref={ref}
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        onCancel={(event) => { event.preventDefault(); close() }}
        onClose={(event) => { if (!event.currentTarget.open) close() }}
        className={cn('ui-dialog fixed m-0 flex-col border-border bg-surface p-0 text-foreground shadow-xl open:flex', sides[side], className)}
      >
        {side === 'bottom' && <span aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border" />}
        <header className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id={`${id}-title`} className="text-base font-semibold">{title}</h2>
            <IconButton aria-label="Close sheet" onClick={close}><X strokeWidth={1.5} /></IconButton>
          </div>
          {description && <p id={`${id}-description`} className="mt-1 text-sm leading-5 text-muted">{description}</p>}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{renderWithClose(children, close)}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3">{renderWithClose(footer, close)}</footer>}
      </motion.dialog>
    </>
  )
}
