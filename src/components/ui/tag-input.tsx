import { useRef, useState } from 'react'
import type { ClipboardEvent, KeyboardEvent, ReactNode } from 'react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import Tag from './tag.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type TagInputProps = {
  label: string
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  validate?: (tag: string) => string | null
  maxTags?: number
  placeholder?: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  className?: string
}

export default function TagInput({
  label, value, defaultValue = [], onValueChange, validate, maxTags, placeholder, hideLabel, hint, error, disabled, required, name, id, className,
}: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [tags, setTags] = useControllableState(value, defaultValue, onValueChange)
  const [draft, setDraft] = useState('')
  const [problem, setProblem] = useState<string | null>(null)
  const message = error ?? problem ?? undefined
  const field = useField({ id, hint, error: message })
  const full = maxTags !== undefined && tags.length >= maxTags

  function add(text: string) {
    const candidates = text.split(',').map((item) => item.trim()).filter(Boolean)
    const next = [...tags]
    for (const candidate of candidates) {
      if (maxTags !== undefined && next.length >= maxTags) {
        setProblem(`You can add up to ${maxTags} tags.`)
        break
      }
      const invalid = validate?.(candidate)
      if (invalid) {
        setProblem(invalid)
        return
      }
      if (!next.some((tag) => tag.toLowerCase() === candidate.toLowerCase())) next.push(candidate)
    }
    setTags(next)
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if ((event.key === 'Enter' || event.key === ',') && draft.trim()) {
      event.preventDefault()
      add(draft)
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      setTags(tags.slice(0, -1))
      setProblem(null)
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData('text')
    if (!text.includes(',')) return
    event.preventDefault()
    add(draft + text)
  }

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={message} errorId={field.errorId} className={className}>
      <div
        data-invalid={message ? true : undefined}
        onMouseDown={(event) => {
          if (event.target === inputRef.current || (event.target as HTMLElement).closest('button')) return
          event.preventDefault()
          inputRef.current?.focus()
        }}
        className={cn('ui-text-field flex min-h-9 cursor-text flex-wrap items-center gap-1 rounded-inner bg-surface py-1 pl-1.5 shadow-xs', message && 'border-danger', disabled && 'cursor-not-allowed opacity-50')}
      >
        {tags.map((tag) => (
          <Tag key={tag} removeTabIndex={-1} disabled={disabled} onRemove={() => { setTags(tags.filter((item) => item !== tag)); setProblem(null) }}>{tag}</Tag>
        ))}
        <input
          ref={inputRef}
          id={field.inputId}
          type="text"
          enterKeyHint="done"
          disabled={disabled || full}
          placeholder={tags.length ? undefined : placeholder}
          value={draft}
          aria-describedby={[field.describedBy, `${field.inputId}-tags`].filter(Boolean).join(' ')}
          aria-invalid={message ? true : undefined}
          onChange={(event) => { setDraft(event.target.value); setProblem(null) }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => { if (draft.trim()) add(draft) }}
          className="min-w-20 flex-1 bg-transparent px-1 outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
        />
      </div>
      <span id={`${field.inputId}-tags`} className="sr-only">{tags.length ? `${tags.length} tags: ${tags.join(', ')}. Press Backspace to remove the last tag.` : 'No tags. Press Enter or comma to add a tag.'}</span>
      {name && tags.map((tag) => <input key={tag} type="hidden" name={name} value={tag} />)}
    </Field>
  )
}
