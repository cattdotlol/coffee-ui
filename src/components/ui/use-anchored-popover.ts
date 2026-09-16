import { useId, useLayoutEffect, useRef, useState } from 'react'

export default function useAnchoredPopover(align: 'start' | 'end', customTriggerId?: string) {
  const id = useId()
  const triggerId = customTriggerId ?? `${id}-trigger`
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useLayoutEffect(() => {
    if (!open) return
    const trigger = document.getElementById(triggerId)
    const panel = panelRef.current
    if (!trigger || !panel) return

    function update() {
      const anchor = trigger!.getBoundingClientRect()
      const box = panel!.getBoundingClientRect()
      const left = align === 'end' ? anchor.right - box.width : anchor.left
      const below = window.innerHeight - anchor.bottom - 8
      const top = box.height > below && anchor.top > below ? anchor.top - box.height - 6 : anchor.bottom + 6
      setPosition({
        left: Math.max(8, Math.min(left, window.innerWidth - box.width - 8)),
        top: Math.max(8, Math.min(top, window.innerHeight - box.height - 8)),
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(panel)
    observer.observe(trigger)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, align, triggerId])

  function close() {
    panelRef.current?.hidePopover()
    document.getElementById(triggerId)?.focus()
  }

  return { id, triggerId, panelRef, open, setOpen, position, close }
}
