import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from './cn.ts'
import Button from './button.tsx'
import IconButton from './icon-button.tsx'
import { renderWithClose, withTriggerProps } from './trigger.ts'
import type { TriggerElement } from './trigger.ts'
import useAnchoredPopover from './use-anchored-popover.ts'

export type PopoverProps = {
  trigger: string | TriggerElement
  title: string
  description?: string
  align?: 'start' | 'end'
  showCloseButton?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children: ReactNode | ((props: { close: () => void }) => ReactNode)
}

export default function Popover({ trigger, title, description, align = 'start', showCloseButton = true, onOpenChange, className, children }: PopoverProps) {
  const custom = typeof trigger === 'string' ? undefined : trigger.props.id
  const { id, triggerId, panelRef, open, setOpen, position, close } = useAnchoredPopover(align, custom)
  const triggerProps = { id: triggerId, popoverTarget: id, 'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': id } as const

  return (
    <>
      {typeof trigger === 'string' ? <Button variant="outline" {...triggerProps}>{trigger}</Button> : withTriggerProps(trigger, triggerProps)}
      <motion.div
        ref={panelRef}
        id={id}
        popover="auto"
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        onToggle={(event) => {
          const next = event.currentTarget.matches(':popover-open')
          setOpen(next)
          onOpenChange?.(next)
        }}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className={cn('fixed inset-auto m-0 origin-top max-h-[calc(100dvh-1rem)] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-panel border border-border bg-surface p-4 text-foreground shadow-lg', className)}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id={`${id}-title`} className="text-sm font-semibold">{title}</h2>
          {showCloseButton && <IconButton aria-label="Close popover" onClick={close}><X strokeWidth={1.5} /></IconButton>}
        </div>
        {description && <p id={`${id}-description`} className="mb-4 text-xs leading-5 text-muted">{description}</p>}
        {renderWithClose(children, close)}
      </motion.div>
    </>
  )
}
