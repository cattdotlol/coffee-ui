import { useState } from 'react'
import { Button, Dialog } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Button, Dialog } from '@catpkgs/coffee-ui'

// No state needed: pass a trigger and use close in the footer.
<Dialog
  trigger={<Button>Open dialog</Button>}
  title="Confirm your choice"
  description="Review the action before continuing."
  footer={({ close }) => <>
    <Button variant="secondary" onClick={close}>Cancel</Button>
    <Button onClick={() => { confirm(); close() }}>Confirm</Button>
  </>}
/>

// Or control it yourself with open and onOpenChange.
<Dialog open={open} onOpenChange={setOpen} title="Settings">…</Dialog>`

export default function DialogPage() {
  const [message, setMessage] = useState('Open the dialog to try it.')
  return (
    <PrimitivePage title="Dialog" description="A focused modal with a title, optional description, content, and footer. Pass a trigger for zero-state usage, or control it with open and onOpenChange. Escape and the close button dismiss it; focus returns to the trigger." code={code}>
      <Dialog
        trigger={<Button>Open dialog</Button>}
        title="Confirm your choice"
        description="This is a preview. Confirming updates the message on this page."
        footer={({ close }) => <>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button onClick={() => { setMessage('Choice confirmed.'); close() }}>Confirm</Button>
        </>}
      />
      <p role="status" className="mt-4 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
