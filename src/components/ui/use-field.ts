import { useId } from 'react'
import type { ReactNode } from 'react'

type UseFieldOptions = {
  id?: string
  hint?: ReactNode
  error?: ReactNode
  describedBy?: string
}

export default function useField({ id, hint, error, describedBy }: UseFieldOptions) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return {
    inputId,
    labelId: `${inputId}-label`,
    hintId,
    errorId,
    describedBy: [describedBy, hintId, errorId].filter(Boolean).join(' ') || undefined,
  }
}
