import { useEffect, useState } from 'react'
import { Button, FileUpload } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { FileUpload } from '@catpkgs/coffee-ui'

<FileUpload
  label="Attachments"
  hint="PNG, JPG or PDF up to 5 MB."
  accept="image/png,image/jpeg,.pdf"
  maxSize={5 * 1024 * 1024}
  multiple
  files={files}
  onFilesChange={setFiles}
  getProgress={(file) => progress[file.name]}
/>`

export default function FileUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [uploading, setUploading] = useState(false)
  const complete = files.every((file) => (progress[file.name] ?? 0) >= 100)
  const active = uploading && !complete

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => {
      setProgress((current) => Object.fromEntries(files.map((file) => [file.name, Math.min((current[file.name] ?? 0) + 20, 100)])))
    }, 300)
    return () => clearInterval(timer)
  }, [active, files])

  return (
    <PrimitivePage title="FileUpload" description="Drag and drop or browse for files. Validates type and size, lists selected files with optional progress, and keeps the native input in sync so it works inside forms." code={code}>
      <div className="space-y-3">
        <FileUpload
          label="Attachments"
          hint="PNG, JPG or PDF up to 5 MB."
          accept="image/png,image/jpeg,.pdf"
          maxSize={5 * 1024 * 1024}
          multiple
          files={files}
          onFilesChange={(next) => { setFiles(next); setProgress({}); setUploading(false) }}
          getProgress={(file) => progress[file.name]}
        />
        <Button disabled={!files.length} loading={active} onClick={() => { setProgress({}); setUploading(true) }}>Upload</Button>
      </div>
    </PrimitivePage>
  )
}
