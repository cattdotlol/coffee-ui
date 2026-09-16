import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

export function focusMenuItem(panel: HTMLElement | null, position: 'first' | 'last') {
  const items = panel?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
  const target = items?.[position === 'last' ? items.length - 1 : 0]
  ;(target ?? panel)?.focus()
}

export default function useMenuKeyboard(close: () => void) {
  const search = useRef({ text: '', time: 0 })

  return function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
      return
    }
    if (event.key === 'Tab') {
      close()
      return
    }
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'))
    if (!items.length) return
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    let next: HTMLButtonElement | undefined
    if (event.key === 'Home') next = items[0]
    else if (event.key === 'End') next = items.at(-1)
    else if (event.key === 'ArrowDown') next = items[(current + 1) % items.length]
    else if (event.key === 'ArrowUp') next = items[(current - 1 + items.length) % items.length]
    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now()
      const previous = now - search.current.time < 700 ? search.current.text : ''
      const text = previous + event.key.toLowerCase()
      search.current = { text, time: now }
      const query = [...text].every((letter) => letter === text[0]) ? text[0] : text
      const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)]
      next = ordered.find((item) => item.dataset.label?.toLowerCase().startsWith(query))
    } else return
    event.preventDefault()
    next?.focus()
  }
}
