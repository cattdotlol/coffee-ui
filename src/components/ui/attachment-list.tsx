import type { ComponentProps } from 'react'
import { FileText, ImageIcon, X } from 'lucide-react'
import { cn } from './cn.ts'
import formatBytes from './format-bytes.ts'

export type Attachment = {
  id: string
  name: string
  size?: number
  type?: string
  previewUrl?: string
  progress?: number
  error?: string
}

export type AttachmentListProps = Omit<ComponentProps<'ul'>, 'children'> & {
  attachments: readonly Attachment[]
  onRemove?: (id: string) => void
  label?: string
}

export default function AttachmentList({ attachments, onRemove, label = 'Attachments', className, ...props }: AttachmentListProps) {
  if (!attachments.length) return null

  return (
    <ul {...props} aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {attachments.map((attachment) => {
        const uploading = attachment.progress !== undefined && attachment.progress < 100 && !attachment.error
        const image = attachment.type?.startsWith('image/')
        const meta = attachment.error ?? (uploading ? `Uploading ${Math.round(attachment.progress!)}%` : attachment.size === undefined ? undefined : formatBytes(attachment.size))
        return (
          <li
            key={attachment.id}
            className={cn('relative flex max-w-60 items-center gap-2 overflow-hidden rounded-inner border bg-surface p-1.5 pr-2', attachment.error ? 'border-danger' : 'border-border')}
          >
            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[calc(var(--radius-inner)-0.25rem)] bg-subtle text-muted">
              {attachment.previewUrl
                ? <img src={attachment.previewUrl} alt="" className="size-full object-cover" />
                : image ? <ImageIcon className="size-4" strokeWidth={1.5} /> : <FileText className="size-4" strokeWidth={1.5} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium">{attachment.name}</span>
              {meta && <span className={cn('block truncate text-xs tabular-nums', attachment.error ? 'text-danger' : 'text-muted')}>{meta}</span>}
            </span>
            {onRemove && (
              <button
                type="button"
                aria-label={`Remove ${attachment.name}`}
                onClick={() => onRemove(attachment.id)}
                className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-foreground pointer-coarse:size-9 motion-safe:transition-colors"
              >
                <X aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              </button>
            )}
            {uploading && (
              <span role="progressbar" aria-label={`Uploading ${attachment.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(attachment.progress!)} className="absolute inset-x-0 bottom-0 h-0.5 bg-border">
                <span className="block h-full bg-primary motion-safe:transition-[width]" style={{ width: `${attachment.progress}%` }} />
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
