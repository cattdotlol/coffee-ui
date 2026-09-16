import { useLayoutEffect, useRef, useState } from 'react'

// Keeps a manual popover list open in sync with `open` and anchored below (or above) its field.
export default function useAnchoredList(open: boolean) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 })

  useLayoutEffect(() => {
    const list = listRef.current
    const anchor = anchorRef.current
    if (!list || !anchor) return
    if (!open) {
      if (list.matches(':popover-open')) list.hidePopover()
      return
    }
    if (!list.matches(':popover-open')) list.showPopover()

    function update() {
      const box = anchor!.getBoundingClientRect()
      const height = list!.getBoundingClientRect().height
      const below = window.innerHeight - box.bottom - 8
      const top = height > below && box.top > below ? box.top - height - 4 : box.bottom + 4
      setPosition({
        left: Math.max(8, Math.min(box.left, window.innerWidth - box.width - 8)),
        top: Math.max(8, Math.min(top, window.innerHeight - height - 8)),
        width: box.width,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(list)
    observer.observe(anchor)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  return { anchorRef, listRef, position }
}
