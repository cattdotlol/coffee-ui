import type { ComponentProps } from 'react'
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import Button from './button.tsx'
import IconButton from './icon-button.tsx'

export type PaginationProps = Omit<ComponentProps<'nav'>, 'children'> & {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getItems(page: number, count: number, siblings: number): (number | 'start-gap' | 'end-gap')[] {
  if (count <= siblings * 2 + 5) return range(1, count)
  const left = Math.max(page - siblings, 1)
  const right = Math.min(page + siblings, count)
  const startGap = left > 3
  const endGap = right < count - 2
  if (!startGap) return [...range(1, 3 + siblings * 2), 'end-gap', count]
  if (!endGap) return [1, 'start-gap', ...range(count - 2 - siblings * 2, count)]
  return [1, 'start-gap', ...range(left, right), 'end-gap', count]
}

export default function Pagination({ page, pageCount, onPageChange, siblingCount = 1, className, 'aria-label': label = 'Pagination', ...props }: PaginationProps) {
  const current = Math.min(Math.max(page, 1), Math.max(pageCount, 1))

  return (
    <nav {...props} aria-label={label} className={className}>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <IconButton aria-label="Previous page" disabled={current <= 1} onClick={() => onPageChange(current - 1)}><ChevronLeft strokeWidth={1.5} /></IconButton>
        </li>
        {getItems(current, pageCount, siblingCount).map((item) => (
          <li key={item}>
            {typeof item === 'number'
              ? <Button variant={item === current ? 'outline' : 'ghost'} aria-current={item === current ? 'page' : undefined} aria-label={`Page ${item}`} onClick={() => onPageChange(item)} className="px-2 tabular-nums">{item}</Button>
              : <span aria-hidden="true" className="inline-flex min-h-9 w-9 items-center justify-center text-muted pointer-coarse:min-h-11"><Ellipsis className="size-4" strokeWidth={1.5} /></span>}
          </li>
        ))}
        <li>
          <IconButton aria-label="Next page" disabled={current >= pageCount} onClick={() => onPageChange(current + 1)}><ChevronRight strokeWidth={1.5} /></IconButton>
        </li>
      </ul>
    </nav>
  )
}
