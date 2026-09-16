import { useEffect, useRef, useState } from 'react'
import type { DragEvent, ReactNode } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { cn } from './cn.ts'
import Button from './button.tsx'
import Field from './field.tsx'
import IconButton from './icon-button.tsx'
import Progress from './progress.tsx'
import useControllableState from './use-controllable-state.ts'
import useField from './use-field.ts'

export type FileUploadProps = {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  name?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  required?: boolean
  files?: File[]
  defaultFiles?: File[]
  onFilesChange?: (files: File[]) => void
  getProgress?: (file: File) => number | undefined
  className?: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  return accept.split(',').map((rule) => rule.trim().toLowerCase()).some((rule) =>
    rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
      : rule.endsWith('/*') ? file.type.startsWith(rule.slice(0, -1))
        : file.type === rule)
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

export default function FileUpload({
  label, hideLabel, hint, error, name, accept, multiple = false, maxSize, maxFiles, disabled, required,
  files, defaultFiles = [], onFilesChange, getProgress, className,
}: FileUploadProps) {
  const field = useField({ hint, error })
  const inputRef = useRef<HTMLInputElement>(null)
  const [current, setCurrent] = useControllableState(files, defaultFiles, onFilesChange)
  const [dragging, setDragging] = useState(false)
  const [rejected, setRejected] = useState<string[]>([])
  const messages = error ?? (rejected.length ? rejected.join(' ') : undefined)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const transfer = new DataTransfer()
    current.forEach((file) => transfer.items.add(file))
    input.files = transfer.files
  }, [current])

  function add(list: FileList | null) {
    if (!list?.length) return
    const errors: string[] = []
    const accepted = Array.from(list).filter((file) => {
      if (!matchesAccept(file, accept)) errors.push(`${file.name} is not an accepted file type.`)
      else if (maxSize !== undefined && file.size > maxSize) errors.push(`${file.name} is larger than ${formatBytes(maxSize)}.`)
      else return true
      return false
    })
    let next = multiple ? [...current, ...accepted.filter((file) => !current.some((item) => fileKey(item) === fileKey(file)))] : accepted.slice(0, 1)
    if (maxFiles !== undefined && next.length > maxFiles) {
      errors.push(`You can upload up to ${maxFiles} files.`)
      next = next.slice(0, maxFiles)
    }
    setRejected(errors)
    setCurrent(next)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    if (!disabled) add(event.dataTransfer.files)
  }

  return (
    <Field label={label} htmlFor={field.inputId} hideLabel={hideLabel} required={required} hint={hint} hintId={field.hintId} error={messages} errorId={field.errorId} className={className}>
      <div
        data-dragging={dragging || undefined}
        onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true) }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false) }}
        onDrop={handleDrop}
        className={cn('flex flex-col items-center rounded-panel border border-dashed px-6 py-8 text-center motion-safe:transition-colors', dragging ? 'border-primary bg-subtle' : 'border-border', messages && 'border-danger', disabled && 'opacity-50')}
      >
        <span aria-hidden="true" className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-subtle text-muted"><Upload className="size-5" strokeWidth={1.5} /></span>
        <p className="font-medium">Drag and drop {multiple ? 'files' : 'a file'} here</p>
        <p className="mt-1 text-xs leading-5 text-muted">or</p>
        <Button variant="outline" size="sm" className="mt-2" disabled={disabled} aria-describedby={field.describedBy} onClick={() => inputRef.current?.click()}>
          Browse {multiple ? 'files' : 'file'}
        </Button>
        <input
          ref={inputRef}
          id={field.inputId}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required && !current.length}
          tabIndex={-1}
          onChange={(event) => { add(event.target.files); event.target.value = '' }}
          className="sr-only"
        />
      </div>
      {current.length > 0 && (
        <ul aria-label="Selected files" className="divide-y divide-border rounded-panel border border-border">
          {current.map((file) => {
            const progress = getProgress?.(file)
            return (
              <li key={fileKey(file)} className="flex items-center gap-3 px-3 py-2">
                <FileText aria-hidden="true" className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate">{file.name}</p>
                    <p className="shrink-0 text-xs tabular-nums text-muted">{formatBytes(file.size)}</p>
                  </div>
                  {progress !== undefined && <Progress label={`Uploading ${file.name}`} hideLabel value={progress} className="mt-1.5" />}
                </div>
                <IconButton aria-label={`Remove ${file.name}`} size="sm" disabled={disabled} onClick={() => setCurrent(current.filter((item) => item !== file))}><X strokeWidth={1.5} /></IconButton>
              </li>
            )
          })}
        </ul>
      )}
    </Field>
  )
}
