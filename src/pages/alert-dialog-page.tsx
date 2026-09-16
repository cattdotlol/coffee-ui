import { useState } from 'react'
import { AlertDialog, Button } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { AlertDialog, Button } from '@catpkgs/coffee-ui'

<AlertDialog
  trigger={<Button variant="destructive">Delete draft</Button>}
  title="Delete this draft?"
  description="This can't be undone."
  confirmLabel="Delete draft"
  destructive
  onConfirm={async () => {
    await deleteDraft() // Throwing shows an error and allows retry.
  }}
/>`

export default function AlertDialogPage() {
  const [deleted, setDeleted] = useState(false)
  return (
    <PrimitivePage title="AlertDialog" description="Confirm consequential actions with explicit Cancel and Confirm buttons. Cancel receives initial focus. Async confirmations show a loading state and block dismissal; rejected promises display an error and allow retry." code={code}>
      <div className="flex flex-wrap gap-2">
        <AlertDialog
          trigger={<Button variant="destructive" disabled={deleted}>Delete draft</Button>}
          title="Delete this draft?"
          description="This removes the draft from this preview. You can restore it with Reset preview."
          confirmLabel="Delete draft"
          destructive
          onConfirm={() => new Promise<void>((resolve) => setTimeout(() => { setDeleted(true); resolve() }, 800))}
        />
        {deleted && <Button variant="secondary" onClick={() => setDeleted(false)}>Reset preview</Button>}
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{deleted ? 'Preview draft deleted.' : 'Preview draft available.'}</p>
    </PrimitivePage>
  )
}
