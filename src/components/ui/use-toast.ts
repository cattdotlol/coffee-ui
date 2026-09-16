import { createContext, useContext } from 'react'

export type ToastOptions = {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
  duration?: number
  action?: { label: string; onClick: () => void }
}

export const ToastContext = createContext<{ toast: (options: ToastOptions) => number; dismiss: (id: number) => void } | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
