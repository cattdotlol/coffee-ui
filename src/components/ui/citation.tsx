import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import HoverCard from './hover-card.tsx'
import SourcePreview from './source-preview.tsx'
import type { Source } from './source-preview.tsx'

export type CitationProps = Omit<ComponentProps<'a'>, 'children' | 'href'> & {
  index: number
  source: Source
}

export default function Citation({ index, source, className, ...props }: CitationProps) {
  return (
    <HoverCard content={<SourcePreview source={source} />}>
      <a
        {...props}
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-full bg-subtle px-1 align-middle text-[0.625rem] font-medium leading-none tabular-nums text-muted no-underline hover:bg-primary hover:text-on-primary motion-safe:transition-colors', className)}
      >
        <span aria-hidden="true">{index}</span>
        <span className="sr-only">Source {index}: {source.title} (opens in a new tab)</span>
      </a>
    </HoverCard>
  )
}
