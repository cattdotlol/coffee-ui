import { useLayoutEffect, useRef, useState } from 'react'

export type ChartSeries<K extends string = string> = { key: K; label: string }

// Four validated categorical slots; charts never cycle or generate more colors.
export const MAX_SERIES = 4

export const seriesColor = (index: number) => `var(--color-chart-${index + 1})`

export function niceTicks(max: number, count = 4) {
  const raw = Math.max(max, 1) / count
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((multiple) => multiple * magnitude).find((candidate) => candidate >= raw) ?? raw
  const top = Math.ceil(max / step) * step || step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step)
}

export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry?.contentRect.width ?? 0)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

export function nextIndex(key: string, current: number | null, last: number) {
  const base = current ?? last
  if (key === 'ArrowLeft' || key === 'ArrowUp') return Math.max(0, base - 1)
  if (key === 'ArrowRight' || key === 'ArrowDown') return Math.min(last, base + 1)
  if (key === 'Home') return 0
  if (key === 'End') return last
  return null
}
