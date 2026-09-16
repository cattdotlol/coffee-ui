import { useEffect, useState } from 'react'
import { Paperclip } from 'lucide-react'
import { IconButton, PromptInput } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Paperclip } from 'lucide-react'
import { IconButton, PromptInput } from '@catpkgs/coffee-ui'

<PromptInput
  label="Message the assistant"
  placeholder="Ask anything"
  loading={isGenerating}
  onSubmit={send}
  onStop={stop}
  actions={<IconButton aria-label="Attach file" size="sm"><Paperclip /></IconButton>}
/>`

export default function PromptInputPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Press Enter to send, or Shift+Enter for a new line.')

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => { setLoading(false); setMessage('Response finished.') }, 3000)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <PrimitivePage title="PromptInput" description="A chat composer that grows with its content. Enter sends, Shift+Enter adds a new line, and the send button becomes a stop button while a response is generating. Add attachments or model pickers through actions." code={code}>
      <PromptInput
        label="Message the assistant"
        placeholder="Ask anything"
        className="max-w-lg"
        loading={loading}
        onSubmit={(value) => { setLoading(true); setMessage(`Sent: “${value}”`) }}
        onStop={() => { setLoading(false); setMessage('Generation stopped.') }}
        actions={<IconButton aria-label="Attach file" size="sm"><Paperclip strokeWidth={1.5} /></IconButton>}
      />
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
