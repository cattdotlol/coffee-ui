import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import HoverCard from './hover-card.tsx'
import sourceHost from './source-host.ts'
import SourcePreview from './source-preview.tsx'
import type { Source } from './source-preview.tsx'

export type { Source }

export type SourcesProps = Omit<ComponentProps<'div'>, 'children'> & {
  sources: readonly Source[]
  label?: string
}

export default function Sources({ sources, label = 'Sources', className, ...props }: SourcesProps) {
  return (
    <div {...props} className={cn('text-xs', className)}>
      <p className="mb-1.5 font-medium text-muted">{label}</p>
      <ol aria-label={label} className="flex flex-wrap gap-1.5">
        {sources.map((source, index) => (
          <li key={source.url} className="min-w-0 max-w-full">
            <HoverCard content={<SourcePreview source={source} />}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-6 max-w-56 items-center gap-1.5 rounded-control border border-border bg-surface pr-2.5 pl-1 text-foreground hover:bg-subtle motion-safe:transition-colors"
              >
                <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center rounded-full bg-subtle text-[0.625rem] font-medium tabular-nums text-muted">{index + 1}</span>
                <span className="truncate">{sourceHost(source.url)}</span>
                <span className="sr-only">: {source.title} (opens in a new tab)</span>
              </a>
            </HoverCard>
          </li>
        ))}
      </ol>
    </div>
  )
}
