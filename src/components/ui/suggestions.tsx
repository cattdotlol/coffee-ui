import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn.ts'
import Button from './button.tsx'

export type Suggestion = string | { label: string; value?: string; icon?: ReactNode }

export type SuggestionsProps = Omit<ComponentProps<'div'>, 'children' | 'onSelect'> & {
  suggestions: readonly Suggestion[]
  onSelect: (value: string) => void
  label?: string
  layout?: 'wrap' | 'scroll'
  disabled?: boolean
}

export default function Suggestions({ suggestions, onSelect, label = 'Suggestions', layout = 'wrap', disabled, className, ...props }: SuggestionsProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cn('flex gap-2', layout === 'wrap' ? 'flex-wrap' : 'ui-scroll-area overflow-x-auto pb-1', className)}
    >
      {suggestions.map((suggestion) => {
        const item = typeof suggestion === 'string' ? { label: suggestion } : suggestion
        return (
          <Button key={item.label} variant="outline" size="sm" disabled={disabled} className="shrink-0" onClick={() => onSelect(item.value ?? item.label)}>
            {item.icon && <span aria-hidden="true" className="inline-flex size-3.5 text-muted [&>svg]:size-full">{item.icon}</span>}
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}
