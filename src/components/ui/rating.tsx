import { useId, useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type RatingProps = {
  label: string
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  readOnly?: boolean
  disabled?: boolean
  hideLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  name?: string
  className?: string
}

const sizes = { sm: 'size-3.5', md: 'size-5', lg: 'size-6' }

export default function Rating({ label, value, defaultValue = 0, onValueChange, max = 5, readOnly = false, disabled, hideLabel, size = 'md', name, className }: RatingProps) {
  const id = useId()
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
  const [hovered, setHovered] = useState<number | null>(null)
  const shown = hovered ?? current
  const star = (index: number) => <Star aria-hidden="true" className={cn(sizes[size], index <= shown ? 'fill-current text-primary' : 'text-border')} strokeWidth={1.5} />

  if (readOnly) {
    return (
      <div role="img" aria-label={`${label}: ${current} out of ${max}`} className={cn('inline-flex gap-0.5', className)}>
        {Array.from({ length: max }, (_, index) => <span key={index}>{star(index + 1)}</span>)}
      </div>
    )
  }

  return (
    <fieldset disabled={disabled} className={cn('min-w-0 text-sm', disabled && 'opacity-50', className)}>
      <legend className={cn('mb-1.5 font-medium', hideLabel && 'sr-only')}>{label}</legend>
      <div className="inline-flex" onMouseLeave={() => setHovered(null)}>
        {Array.from({ length: max }, (_, index) => {
          const rating = index + 1
          return (
            <label
              key={rating}
              onMouseEnter={() => { if (!disabled) setHovered(rating) }}
              className={cn('flex rounded-full p-0.5 motion-safe:transition-colors has-[:focus-visible]:bg-primary-soft', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
            >
              <input
                type="radio"
                name={name ?? id}
                value={rating}
                checked={current === rating}
                onChange={() => setCurrent(rating)}
                aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                className="sr-only"
              />
              {star(rating)}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
