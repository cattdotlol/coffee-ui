import type { ComponentProps } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from './cn.ts'

export type CircularProgressProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

const sizes = {
  sm: { box: 'size-6', stroke: 5, text: '' },
  md: { box: 'size-12', stroke: 4, text: 'text-xs' },
  lg: { box: 'size-20', stroke: 3.5, text: 'text-base' },
}

export default function CircularProgress({ label, value, max = 100, size = 'md', showValue = size !== 'sm', className, ...props }: CircularProgressProps) {
  const reducedMotion = useReducedMotion()
  const clamped = value === undefined ? undefined : Math.min(Math.max(value, 0), max)
  const percent = clamped === undefined ? undefined : Math.round((clamped / max) * 100)
  const { box, stroke, text } = sizes[size]
  const radius = 20 - stroke / 2

  return (
    <div
      {...props}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={cn('relative inline-flex shrink-0 items-center justify-center', box, className)}
    >
      <svg aria-hidden="true" viewBox="0 0 40 40" className={cn('size-full -rotate-90', percent === undefined && 'animate-spin motion-reduce:[animation-duration:3s]')}>
        <circle cx="20" cy="20" r={radius} fill="none" strokeWidth={stroke} className="stroke-border" />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-primary"
          initial={false}
          animate={{ pathLength: percent === undefined ? 0.3 : percent / 100 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        />
      </svg>
      {showValue && percent !== undefined && <span aria-hidden="true" className={cn('absolute font-medium tabular-nums', text)}>{percent}%</span>}
    </div>
  )
}
