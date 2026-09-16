import { useState } from 'react'
import { AttachmentList, PromptInput } from '@catpkgs/coffee-ui'
import type { Attachment } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { AttachmentList, PromptInput } from '@catpkgs/coffee-ui'

<PromptInput
  label="Message"
  onSubmit={send}
  header={<AttachmentList attachments={files} onRemove={remove} />}
/>`

const initial: Attachment[] = [
  { id: '1', name: 'espresso-notes.pdf', size: 184_000, type: 'application/pdf' },
  { id: '2', name: 'latte-art.jpg', size: 2_400_000, type: 'image/jpeg', progress: 62 },
  { id: '3', name: 'inventory-export.csv', size: 52_000_000, type: 'text/csv', error: 'File is larger than 25 MB' },
]

export default function AttachmentListPage() {
  const [attachments, setAttachments] = useState(initial)
  const remove = (id: string) => setAttachments((current) => current.filter((attachment) => attachment.id !== id))
  return (
    <PrimitivePage title="AttachmentList" description="Files attached to a message, with size, upload progress, errors, and remove buttons. Place it inside PromptInput with the header slot, or show it on a sent message without onRemove." code={code}>
      <div className="max-w-lg space-y-6">
        <AttachmentList attachments={attachments} onRemove={remove} />
        <PromptInput label="Message" placeholder="Ask about these files" onSubmit={() => setAttachments([])} header={<AttachmentList attachments={attachments} onRemove={remove} className="px-1 pt-1" />} />
      </div>
    </PrimitivePage>
  )
}
