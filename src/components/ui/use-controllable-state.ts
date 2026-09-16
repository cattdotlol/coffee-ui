import { useState } from 'react'

export default function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : internal

  function setValue(next: T) {
    if (Object.is(next, current)) return
    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  return [current, setValue] as const
}
