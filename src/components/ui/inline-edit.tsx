import { useEffect, useId, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import { cn } from './cn.ts'
import useControllableState from './use-controllable-state.ts'

export type InlineEditProps = {
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  validate?: (value: string) => string | null
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function InlineEdit({ label, value, defaultValue = '', onValueChange, validate, placeholder = 'Empty', disabled, className }: InlineEditProps) {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocus = useRef(false)
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)
  const [draft, setDraft] = useState<string | null>(null)
  const editing = draft !== null
  const problem = editing ? validate?.(draft) ?? null : null

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  useEffect(() => {
    if (draft !== null || !returnFocus.current) return
    returnFocus.current = false
    buttonRef.current?.focus()
  })

  function finish(save: boolean, refocus: boolean) {
    if (draft === null) return
    if (save && problem) return
    if (save) setCurrent(draft.trim())
    returnFocus.current = refocus
    setDraft(null)
  }

  if (draft !== null) {
    return (
      <span className={cn('inline-grid gap-1', className)}>
        <input
          ref={inputRef}
          type="text"
          aria-label={label}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? `${id}-error` : undefined}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') { event.preventDefault(); finish(true, true) }
            if (event.key === 'Escape') { event.preventDefault(); finish(false, true) }
          }}
          onBlur={() => finish(!problem, false)}
          className="ui-text-field -mx-2 min-h-8 w-[calc(100%+1rem)] px-2 py-1"
        />
        {problem && <span id={`${id}-error`} role="alert" className="text-xs text-danger">{problem}</span>}
      </span>
    )
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onClick={() => setDraft(current)}
      aria-label={`${label}: ${current || placeholder}. Edit`}
      className={cn('group -mx-2 inline-flex min-h-8 max-w-full cursor-text items-center gap-1.5 rounded-control px-2 text-left hover:bg-subtle disabled:cursor-not-allowed disabled:hover:bg-transparent motion-safe:transition-colors', className)}
    >
      <span className={cn('truncate', !current && 'text-muted')}>{current || placeholder}</span>
      {!disabled && <Pencil aria-hidden="true" className="size-3.5 shrink-0 text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" strokeWidth={1.5} />}
    </button>
  )
}
