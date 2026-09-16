import { useId } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type AccordionItem = { value: string; title: string; content: ReactNode; disabled?: boolean }

export type AccordionProps = {
  items: readonly AccordionItem[]
  multiple?: boolean
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  className?: string
}

export default function Accordion({ items, multiple = false, value, defaultValue = [], onValueChange, className }: AccordionProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange)
  const expanded = multiple ? selected : selected.slice(0, 1)

  function toggle(next: string) {
    setSelected(expanded.includes(next) ? expanded.filter((item) => item !== next) : multiple ? [...expanded, next] : [next])
  }

  return (
    <div className={cn('divide-y divide-border', className)}>
      {items.map((item, index) => {
        const open = expanded.includes(item.value)
        return (
          <div key={item.value}>
            <h3>
              <button id={`${id}-trigger-${index}`} type="button" aria-expanded={open} aria-controls={`${id}-panel-${index}`} disabled={item.disabled} onClick={() => toggle(item.value)} className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-control py-2 text-left text-sm font-medium focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:min-h-11">
                {item.title}
                <motion.span aria-hidden="true" animate={{ rotate: open ? 180 : 0 }} className="shrink-0"><ChevronDown className="size-4" strokeWidth={1.5} /></motion.span>
              </button>
            </h3>
            <motion.div
              id={`${id}-panel-${index}`}
              aria-labelledby={`${id}-trigger-${index}`}
              role="region"
              aria-hidden={!open}
              inert={!open}
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pb-3 pr-6 text-sm leading-5 text-muted">{item.content}</div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
