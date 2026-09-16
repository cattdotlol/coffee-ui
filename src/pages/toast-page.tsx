import { useState } from 'react'
import { Button, useToast } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Button, ToastProvider, useToast } from '@catpkgs/coffee-ui'

function SaveButton() {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast({
      title: 'Changes saved', variant: 'success',
      description: 'Your preferences are up to date.',
    })}>Show success</Button>
  )
}

<ToastProvider><SaveButton /></ToastProvider>`

export default function ToastPage() {
  const { toast } = useToast()
  const [archived, setArchived] = useState(false)
  return (
    <PrimitivePage title="Toast" description="Brief feedback without moving focus. Default, success, and error variants. Dismissal pauses on hover, focus, or a hidden browser tab. Action toasts stay until handled; set duration to 0 for other persistent messages. The app already includes ToastProvider." code={code}>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast({ title: 'Changes saved', description: 'Your preferences are up to date.', variant: 'success' })}>Success</Button>
        <Button variant="secondary" onClick={() => toast({ title: 'New update available', description: 'You can install it whenever you are ready.' })}>Information</Button>
        <Button variant="outline" onClick={() => toast({ title: 'Unable to save', description: 'Check your connection and try again.', variant: 'error' })}>Error</Button>
        <Button variant="ghost" disabled={archived} onClick={() => {
          setArchived(true)
          toast({ title: 'Item archived', action: { label: 'Undo', onClick: () => setArchived(false) } })
        }}>Archive with undo</Button>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Preview item: {archived ? 'archived' : 'active'}.</p>
    </PrimitivePage>
  )
}
