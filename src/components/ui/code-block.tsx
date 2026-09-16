import type { ComponentProps } from 'react'
import { cn } from './cn.ts'
import CopyButton from './copy-button.tsx'

export type CodeBlockProps = Omit<ComponentProps<'figure'>, 'children'> & {
  code: string
  language?: string
  filename?: string
  label?: string
  showLineNumbers?: boolean
  copyable?: boolean
}

export default function CodeBlock({ code, language, filename, label, showLineNumbers = false, copyable = true, className, ...props }: CodeBlockProps) {
  const name = label ?? filename ?? (language ? `${language} code` : 'Code')
  const lines = code.replace(/\n$/, '').split('\n')
  const header = filename || language || copyable

  return (
    <figure {...props} className={cn('overflow-hidden rounded-panel border border-border bg-subtle', className)}>
      {header && (
        <figcaption className="flex min-h-9 items-center justify-between gap-3 border-b border-border py-1 pr-1 pl-4">
          <span className="truncate text-xs font-medium text-muted">{filename ?? language}</span>
          {copyable && <CopyButton value={code} size="sm" aria-label={`Copy ${name}`} />}
        </figcaption>
      )}
      <pre tabIndex={0} aria-label={name} className="ui-scroll-area overflow-x-auto p-4 text-xs leading-5">
        <code className={cn(showLineNumbers && 'grid grid-cols-[auto_1fr] gap-x-4')}>
          {showLineNumbers
            ? lines.map((line, index) => [
              <span key={`n${index}`} aria-hidden="true" className="text-right text-muted/70 tabular-nums select-none">{index + 1}</span>,
              <span key={`l${index}`}>{line || ' '}</span>,
            ])
            : code}
        </code>
      </pre>
    </figure>
  )
}
