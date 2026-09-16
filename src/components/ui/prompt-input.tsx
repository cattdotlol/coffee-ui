import { useLayoutEffect, useRef } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { cn } from './cn.ts'
import IconButton from './icon-button.tsx'
import useControllableState from './use-controllable-state.ts'

export type PromptInputProps = Omit<ComponentProps<'textarea'>, 'children' | 'value' | 'defaultValue' | 'onSubmit'> & {
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit: (value: string) => void
  onStop?: () => void
  loading?: boolean
  actions?: ReactNode
  header?: ReactNode
  maxHeight?: number
}

export default function PromptInput({
  label, value, defaultValue = '', onValueChange, onSubmit, onStop, loading = false, actions, header, maxHeight = 200,
  rows = 1, disabled, className, onKeyDown, ...props
}: PromptInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
  const canSubmit = !loading && !disabled && current.trim() !== ''

  useLayoutEffect(() => {
    const textarea = ref.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [current, maxHeight])

  function submit() {
    if (!canSubmit) return
    onSubmit(current.trim())
    setCurrent('')
  }

  return (
    <div
      onClick={(event) => { if (event.target === event.currentTarget) ref.current?.focus() }}
      className={cn('ui-text-field flex cursor-text flex-col gap-1 rounded-panel bg-surface p-2 shadow-xs', disabled && 'cursor-not-allowed opacity-50', className)}
    >
      {header}
      <textarea
        {...props}
        ref={ref}
        aria-label={label}
        rows={rows}
        disabled={disabled}
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
          event.preventDefault()
          submit()
        }}
        className="w-full resize-none bg-transparent px-1.5 py-1 text-sm leading-6 text-foreground placeholder:text-muted/70 focus-visible:outline-none disabled:cursor-not-allowed"
      />
      <div className="flex items-center gap-1">
        {actions}
        {loading
          ? <IconButton aria-label="Stop generating" variant="primary" size="sm" className="ml-auto" onClick={onStop} disabled={!onStop}><Square className="fill-current" strokeWidth={1.5} /></IconButton>
          : <IconButton aria-label="Send message" variant="primary" size="sm" className="ml-auto" onClick={submit} disabled={!canSubmit}><ArrowUp strokeWidth={2} /></IconButton>}
      </div>
    </div>
  )
}
