import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, CircleAlert, Info, X } from 'lucide-react'
import Button from './button.tsx'
import IconButton from './icon-button.tsx'
import { ToastContext } from './use-toast.ts'
import type { ToastOptions } from './use-toast.ts'

type ToastEntry = ToastOptions & { id: number }

function ToastItem({ entry, dismiss }: { entry: ToastEntry; dismiss: (id: number) => void }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const remaining = useRef(entry.action ? 0 : entry.duration ?? 5000)

  useEffect(() => {
    const update = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (hovered || focused || hidden || remaining.current <= 0) return
    const started = Date.now()
    const timer = setTimeout(() => dismiss(entry.id), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(1, remaining.current - (Date.now() - started))
    }
  }, [hovered, focused, hidden, entry.id, dismiss])

  const Icon = entry.variant === 'error' ? CircleAlert : entry.variant === 'success' ? Check : Info
  const total = entry.action ? 0 : entry.duration ?? 5000
  const paused = hovered || focused || hidden
  return (
    <motion.li layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }} className="pointer-events-auto relative flex items-start gap-2.5 overflow-hidden rounded-panel border border-border bg-surface p-3 text-foreground shadow-lg">
      <span aria-hidden="true" className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full ${entry.variant === 'error' ? 'bg-danger/10 text-danger' : entry.variant === 'success' ? 'bg-primary-soft text-primary' : 'bg-subtle text-muted'}`}>
        <Icon className="size-3.5" strokeWidth={entry.variant === 'success' ? 2 : 1.5} />
      </span>
      <div className="min-w-0 flex-1 py-1">
        <div role={entry.variant === 'error' ? 'alert' : 'status'} aria-atomic="true">
          <p className="break-words text-sm font-medium">{entry.title}</p>
          {entry.description && <p className="mt-1 break-words text-xs leading-5 text-muted">{entry.description}</p>}
        </div>
        {entry.action && <Button variant="link" className="mt-1" onClick={() => { entry.action?.onClick(); dismiss(entry.id) }}>{entry.action.label}</Button>}
      </div>
      <IconButton aria-label={`Dismiss ${entry.title}`} size="sm" onClick={() => dismiss(entry.id)}><X strokeWidth={1.5} /></IconButton>
      {total > 0 && <span aria-hidden="true" style={{ animation: `toast-timer ${total}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary/40 motion-reduce:hidden" />}
    </motion.li>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ToastEntry[]>([])
  const nextId = useRef(0)
  const dismiss = useCallback((id: number) => setEntries((current) => current.filter((entry) => entry.id !== id)), [])
  const toast = useCallback((options: ToastOptions) => {
    const id = ++nextId.current
    setEntries((current) => [...current, { ...options, id }])
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <section aria-label="Notifications" className="pointer-events-none fixed right-4 bottom-4 z-50 max-h-[calc(100dvh-2rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto">
        <ol className="space-y-2 p-1"><AnimatePresence initial={false}>{entries.map((entry) => <ToastItem key={entry.id} entry={entry} dismiss={dismiss} />)}</AnimatePresence></ol>
      </section>
    </ToastContext.Provider>
  )
}
