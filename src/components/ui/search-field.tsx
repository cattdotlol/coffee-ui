import { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from './cn.ts'
import TextField from './text-field.tsx'
import type { TextFieldProps } from './text-field.tsx'
import useControllableState from './use-controllable-state.ts'

export type SearchFieldProps = Omit<TextFieldProps, 'type' | 'leading' | 'trailing' | 'value' | 'defaultValue'> & {
  value?: string
  defaultValue?: string
  onSearch?: (value: string) => void
}

export default function SearchField({ value, defaultValue = '', onValueChange, onSearch, onKeyDown, className, placeholder = 'Search…', ...props }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)

  return (
    <TextField
      {...props}
      ref={inputRef}
      type="search"
      enterKeyHint="search"
      placeholder={placeholder}
      value={current}
      onValueChange={setCurrent}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.key === 'Enter') onSearch?.(current)
        if (event.key === 'Escape' && current) {
          event.preventDefault()
          setCurrent('')
        }
      }}
      leading={<Search aria-hidden="true" strokeWidth={1.5} />}
      trailing={current && !props.disabled ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => { setCurrent(''); inputRef.current?.focus() }}
          className="-mr-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-subtle hover:text-foreground"
        >
          <X aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        </button>
      ) : undefined}
      className={cn('[&::-webkit-search-cancel-button]:appearance-none', className)}
    />
  )
}
