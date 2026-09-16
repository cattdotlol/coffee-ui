import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import IconButton from './icon-button.tsx'
import { renderWithClose, withTriggerProps } from './trigger.ts'
import type { TriggerElement } from './trigger.ts'
import useControllableState from './use-controllable-state.ts'

type Content = ReactNode | ((props: { close: () => void }) => ReactNode)

export type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: TriggerElement
  title: string
  description?: string
  footer?: Content
  children?: Content
  role?: 'dialog' | 'alertdialog'
  showCloseButton?: boolean
  hideTitle?: boolean
  className?: string
}

export default function Dialog({ open: openProp, defaultOpen = false, onOpenChange, trigger, title, description, footer, children, role = 'dialog', showCloseButton = true, hideTitle = false, className }: DialogProps) {
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
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97, y: open ? 0 : 6 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => { if (!open) ref.current?.close() }}
        data-open={open}
        ref={ref}
        role={role}
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        onCancel={(event) => { event.preventDefault(); close() }}
        onClose={(event) => { if (!event.currentTarget.open) close() }}
        className={cn('ui-dialog fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-panel border border-border bg-surface p-5 text-foreground shadow-xl', className)}
      >
        <div className={cn('mb-3 flex items-center justify-between gap-3', hideTitle && 'sr-only')}>
          <h2 id={`${id}-title`} className="text-base font-semibold">{title}</h2>
          {showCloseButton && <IconButton aria-label="Close dialog" onClick={close}><X strokeWidth={1.5} /></IconButton>}
        </div>
        {description && <p id={`${id}-description`} className={cn('mb-4 text-sm leading-5 text-muted', hideTitle && 'sr-only')}>{description}</p>}
        {renderWithClose(children, close)}
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{renderWithClose(footer, close)}</div>}
      </motion.dialog>
    </>
  )
}
