import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from './cn.ts'
import Field from './field.tsx'
import useAnchoredList from './use-anchored-list.ts'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type ComboboxOption = { value: string; label: string; disabled?: boolean }

export type ComboboxProps = {
  label: string
  hideLabel?: boolean
  id?: string
  required?: boolean
  options: readonly ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  hint?: ReactNode
  error?: ReactNode
  emptyText?: string
  disabled?: boolean
  name?: string
  className?: string
}

export default function Combobox({
  label, hideLabel, id: customId, required, options, value, defaultValue, onValueChange, placeholder, hint, error,
  emptyText = 'No results found.', disabled, name, className,
}: ComboboxProps) {
  const field = useField({ id: customId, hint, error })
  const id = field.inputId
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedValue, setSelectedValue] = useControllableState(value, defaultValue, (next) => { if (next !== undefined) onValueChange?.(next) })
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const [activeValue, setActiveValue] = useState<string>()
  const { anchorRef, listRef, position } = useAnchoredList(open)
  const selected = options.find((option) => option.value === selectedValue)
  const filtered = filterOptions(query)
  const enabled = filtered.filter((option) => !option.disabled)
  const active = enabled.find((option) => option.value === activeValue)?.value

  function filterOptions(text: string | null) {
    const search = text?.trim().toLowerCase()
    return search ? options.filter((option) => option.label.toLowerCase().includes(search)) : options
  }

  function optionId(optionValue: string) {
    return `${id}-option-${options.findIndex((option) => option.value === optionValue)}`
  }

  function openList() {
    setOpen(true)
    setActiveValue(selected && !selected.disabled ? selected.value : enabled[0]?.value)
  }

  function close() {
    setOpen(false)
    setQuery(null)
    setActiveValue(undefined)
  }

  function commit(option: ComboboxOption) {
    if (option.disabled) return
    setSelectedValue(option.value)
    close()
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
      if (open) move(event.key === 'ArrowDown' ? 1 : -1)
      else openList()
    } else if (event.key === 'Enter' && open) {
      const option = enabled.find((item) => item.value === active)
      if (!option) return
      event.preventDefault()
      commit(option)
    } else if (event.key === 'Escape' && (open || query !== null)) {
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
      <div ref={anchorRef} className="relative">
        <input
          ref={inputRef}
          id={id}
          required={required}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={open && active ? optionId(active) : undefined}
          aria-describedby={field.describedBy}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={query ?? selected?.label ?? ''}
          onChange={(event) => {
            const text = event.target.value
            setQuery(text)
            setOpen(true)
            setActiveValue(filterOptions(text).find((option) => !option.disabled)?.value)
          }}
          onClick={() => { if (!open) openList() }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          className="ui-text-field pr-9"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => { inputRef.current?.focus(); if (open) close(); else openList() }}
          className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted disabled:cursor-not-allowed"
        >
          <ChevronsUpDown className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}
      <p role="status" className="sr-only">{open && query !== null ? `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} available.` : ''}</p>
      <motion.div
        ref={listRef}
        id={`${id}-listbox`}
        popover="manual"
        role="listbox"
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
            aria-selected={option.value === selectedValue}
            aria-disabled={option.disabled || undefined}
            onClick={() => commit(option)}
            onMouseMove={() => { if (!option.disabled) setActiveValue(option.value) }}
            className={cn('flex min-h-9 items-center gap-2 rounded-control px-2.5 py-1.5 text-sm pointer-coarse:min-h-11', active === option.value && 'bg-subtle', option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
          >
            <Check aria-hidden="true" className={cn('size-4 shrink-0', option.value !== selectedValue && 'invisible')} strokeWidth={1.5} />
            {option.label}
          </div>
        )) : <p className="px-2.5 py-1.5 text-sm text-muted">{emptyText}</p>}
      </motion.div>
    </Field>
  )
}
