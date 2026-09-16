import { useId } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type CollapsibleProps = {
  title: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  children: ReactNode
}

export default function Collapsible({ title, open: openProp, defaultOpen = false, onOpenChange, disabled, className, children }: CollapsibleProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="-mx-2.5 flex min-h-9 w-[calc(100%+1.25rem)] cursor-pointer items-center justify-between gap-3 rounded-control px-2.5 py-1.5 text-left text-sm font-medium enabled:hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11 motion-safe:transition-colors"
      >
        {title}
        <motion.span aria-hidden="true" animate={{ rotate: open ? 180 : 0 }} className="shrink-0"><ChevronDown className="size-4" strokeWidth={1.5} /></motion.span>
      </button>
      <motion.div
        id={id}
        aria-hidden={!open}
        inert={!open}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <div className={cn('pt-2 pb-1 text-sm leading-5')}>{children}</div>
      </motion.div>
    </div>
  )
}
