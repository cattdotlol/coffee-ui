import type { ComponentProps } from 'react'
import { Check } from 'lucide-react'
import { cn } from './cn.ts'

export type StepperStep = { label: string; description?: string }

export type StepperProps = Omit<ComponentProps<'ol'>, 'children'> & {
  steps: readonly StepperStep[]
  current: number
  orientation?: 'horizontal' | 'vertical'
  onStepClick?: (index: number) => void
}

export default function Stepper({ steps, current, orientation = 'horizontal', onStepClick, className, ...props }: StepperProps) {
  const horizontal = orientation === 'horizontal'

  return (
    <ol {...props} className={cn('flex text-sm', horizontal ? 'flex-col gap-3 sm:flex-row sm:gap-2' : 'flex-col', className)}>
      {steps.map((step, index) => {
        const status = index < current ? 'complete' : index === current ? 'current' : 'upcoming'
        const clickable = onStepClick && status === 'complete'
        const marker = (
          <span aria-hidden="true" className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums', status === 'complete' && 'border-primary bg-primary text-on-primary', status === 'current' && 'border-primary text-foreground', status === 'upcoming' && 'border-border text-muted')}>
            {status === 'complete' ? <Check className="size-3.5" strokeWidth={2} /> : index + 1}
          </span>
        )
        const text = (
          <span className="min-w-0 text-left">
            <span className={cn('block font-medium', status === 'upcoming' && 'text-muted')}>{step.label}</span>
            {step.description && <span className="block text-xs leading-5 text-muted">{step.description}</span>}
            <span className="sr-only">{status === 'complete' ? ', completed' : status === 'current' ? ', current step' : ''}</span>
          </span>
        )
        const last = index === steps.length - 1

        return (
          <li key={step.label} aria-current={status === 'current' ? 'step' : undefined} className={cn('flex min-w-0', horizontal ? 'items-center gap-2 sm:flex-1' : 'relative gap-3 pb-6 last:pb-0')}>
            {clickable
              ? <button type="button" onClick={() => onStepClick(index)} className="-m-1 flex cursor-pointer items-start gap-2 rounded-inner p-1 hover:bg-subtle motion-safe:transition-colors">{marker}{text}</button>
              : <span className={cn('flex gap-2', horizontal ? 'items-start' : 'items-start gap-3')}>{marker}{text}</span>}
            {!last && <span aria-hidden="true" className={cn(horizontal ? 'hidden h-px flex-1 sm:block' : 'absolute top-8 bottom-1 left-3.5 w-px', index < current ? 'bg-primary' : 'bg-border')} />}
          </li>
        )
      })}
    </ol>
  )
}
