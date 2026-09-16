import { useId } from 'react'
import type { ComponentProps } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from './cn.ts'

export type ProgressProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string
  value?: number
  max?: number
  showValue?: boolean
  hideLabel?: boolean
}

export default function Progress({ label, value, max = 100, showValue = true, hideLabel = false, className, ...props }: ProgressProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()
  const clamped = value === undefined ? undefined : Math.min(Math.max(value, 0), max)
  const percent = clamped === undefined ? undefined : Math.round((clamped / max) * 100)

  return (
    <div {...props} className={cn('grid gap-1.5 text-sm', className)}>
      <div className={cn('flex items-center justify-between gap-3', hideLabel && 'sr-only')}>
        <span id={`${id}-label`} className="font-medium">{label}</span>
        {showValue && percent !== undefined && <span aria-hidden="true" className="text-xs tabular-nums text-muted">{percent}%</span>}
      </div>
      <div role="progressbar" aria-labelledby={`${id}-label`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={clamped} className="relative h-1.5 overflow-hidden rounded-full bg-border">
        {percent === undefined
          ? <motion.div className="absolute inset-y-0 w-2/5 rounded-full bg-primary" initial={{ left: reducedMotion ? '30%' : '-40%' }} animate={reducedMotion ? undefined : { left: '100%' }} transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }} />
          : <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: `${percent}%` }} transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }} />}
      </div>
    </div>
  )
}
