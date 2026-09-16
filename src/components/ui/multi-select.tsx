import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useAnchoredList from './use-anchored-list.ts'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type MultiSelectOption = { value: string; label: string; disabled?: boolean }

export type MultiSelectProps = {
  label: string
  options: readonly MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  hideLabel?: boolean
  id?: string
  placeholder?: string
  hint?: ReactNode
  error?: ReactNode
  emptyText?: string
  maxSelected?: number
  disabled?: boolean
  required?: boolean
  name?: string
  className?: string
}

export default function MultiSelect({
  label, options, value, defaultValue = [], onValueChange, hideLabel, id: customId, placeholder, hint, error,
  emptyText = 'No results found.', maxSelected, disabled, required, name, className,
}: MultiSelectProps) {
  const field = useField({ id: customId, hint, error })
  const id = field.inputId
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeValue, setActiveValue] = useState<string>()
  const { anchorRef, listRef, position } = useAnchoredList(open)
  const full = maxSelected !== undefined && selected.length >= maxSelected
  const search = query.trim().toLowerCase()
  const filtered = search ? options.filter((option) => option.label.toLowerCase().includes(search)) : options
  const isDisabled = (option: MultiSelectOption) => option.disabled || (full && !selected.includes(option.value))
  const enabled = filtered.filter((option) => !isDisabled(option))
  const active = enabled.find((option) => option.value === activeValue)?.value
  const selectedOptions = selected.map((item) => options.find((option) => option.value === item)).filter((option) => option !== undefined)

  function optionId(optionValue: string) {
    return `${id}-option-${options.findIndex((option) => option.value === optionValue)}`
  }

  function close() {
    setOpen(false)
    setQuery('')
    setActiveValue(undefined)
  }

  function toggle(option: MultiSelectOption) {
    if (isDisabled(option)) return
    setSelected(selected.includes(option.value) ? selected.filter((item) => item !== option.value) : [...selected, option.value])
    setQuery('')
    setActiveValue(option.value)
  }

  function move(delta: 1 | -1) {
    if (!enabled.length) return
    const index = enabled.findIndex((option) => option.value === active)
    const next = index === -1 ? (delta > 0 ? enabled[0] : enabled.at(-1)) : enabled[(index + delta + enabled.length) % enabled.length]
    setActiveValue(next?.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActiveValue(enabled[0]?.value)
      } else move(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Enter' && open) {
      const option = enabled.find((item) => item.value === active)
      if (!option) return
      event.preventDefault()
      toggle(option)
    } else if (event.key === 'Backspace' && !query && selected.length) {
      setSelected(selected.slice(0, -1))
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      close()
    }
  }

  useEffect(() => {
    if (open && active) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' })
  })

  return (
    <Field label={label} htmlFor={id} labelId={field.labelId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={error} errorId={field.errorId} className={className}>
      <div
        ref={anchorRef}
        data-invalid={error ? true : undefined}
        onMouseDown={(event) => {
          if (disabled || event.target === inputRef.current) return
          event.preventDefault()
          inputRef.current?.focus()
          if (open) close()
          else setOpen(true)
        }}
        className={cn('ui-text-field relative flex min-h-9 cursor-text rounded-inner bg-surface shadow-xs flex-wrap items-center gap-1 py-1 pr-9 pl-1.5', error && 'border-danger', disabled && 'cursor-not-allowed opacity-50')}
      >
        {selectedOptions.map((option) => (
          <span key={option.value} className="inline-flex h-6 items-center gap-0.5 rounded-control bg-subtle pr-0.5 pl-1.5 text-xs font-medium">
            {option.label}
            <button
              type="button"
              tabIndex={-1}
              aria-label={`Remove ${option.label}`}
              disabled={disabled}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => setSelected(selected.filter((item) => item !== option.value))}
              className="inline-flex size-5 cursor-pointer items-center justify-center rounded-control text-muted hover:bg-primary-soft hover:text-foreground"
            >
              <X aria-hidden="true" className="size-3" strokeWidth={1.5} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={open && active ? optionId(active) : undefined}
          aria-describedby={[field.describedBy, `${id}-selection`].filter(Boolean).join(' ')}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          placeholder={selected.length ? undefined : placeholder}
          value={query}
          onChange={(event) => {
            const text = event.target.value.toLowerCase().trim()
            setQuery(event.target.value)
            setOpen(true)
            setActiveValue(options.find((option) => !isDisabled(option) && option.label.toLowerCase().includes(text))?.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          className="min-w-16 flex-1 bg-transparent px-1 outline-none placeholder:text-muted/70 disabled:cursor-not-allowed"
        />
        <ChevronsUpDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
      </div>
      <span id={`${id}-selection`} className="sr-only">{selectedOptions.length ? `Selected: ${selectedOptions.map((option) => option.label).join(', ')}.` : 'Nothing selected.'}</span>
      {name && selected.map((item) => <input key={item} type="hidden" name={name} value={item} />)}
      <motion.div
        ref={listRef}
        id={`${id}-listbox`}
        popover="manual"
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={field.labelId}
        onMouseDown={(event) => event.preventDefault()}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ ...position, visibility: open ? 'visible' : 'hidden' }}
        className="fixed inset-auto m-0 origin-top max-h-60 overflow-y-auto rounded-panel border border-border bg-surface p-1 text-foreground shadow-lg"
      >
        {filtered.length ? filtered.map((option) => (
          <div
            key={option.value}
            id={optionId(option.value)}
            role="option"
            aria-selected={selected.includes(option.value)}
            aria-disabled={isDisabled(option) || undefined}
            onClick={() => toggle(option)}
            onMouseMove={() => { if (!isDisabled(option)) setActiveValue(option.value) }}
            className={cn('flex min-h-9 items-center gap-2 rounded-control px-2.5 py-1.5 text-sm pointer-coarse:min-h-11', active === option.value && 'bg-subtle', isDisabled(option) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
          >
            <span aria-hidden="true" className={cn('flex size-4 shrink-0 items-center justify-center rounded-[0.25rem] border', selected.includes(option.value) ? 'border-primary bg-primary text-on-primary' : 'border-border')}>
              {selected.includes(option.value) && <Check className="size-3" strokeWidth={2} />}
            </span>
            {option.label}
          </div>
        )) : <p className="px-2.5 py-1.5 text-sm text-muted">{emptyText}</p>}
      </motion.div>
    </Field>
  )
}
