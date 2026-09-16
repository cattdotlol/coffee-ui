import { useState } from 'react'
import { Textarea } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Textarea } from '@catpkgs/coffee-ui'

function Notes() {
  const [notes, setNotes] = useState('')

  return (
    <Textarea label="Notes" name="notes" rows={4}
      maxLength={200} value={notes}
      onValueChange={setNotes}
      hint={\`${'${notes.length}'} / 200 characters\`}
      placeholder="Write a note…" />
  )
}

<Textarea label="Feedback" error="Please add some detail." />
<Textarea label="Archived note" defaultValue="Read only." readOnly />`

export default function TextareaPage() {
  const [notes, setNotes] = useState('')
  return (
    <PrimitivePage title="Textarea" description="Multiline text with the same labels, hints, and errors as TextField. Resizes vertically and supports native props such as maxLength, required, and readOnly." code={code}>
      <div className="space-y-4">
        <Textarea label="Notes" name="notes" rows={4} maxLength={200} value={notes} onValueChange={setNotes} hint={`${notes.length} / 200 characters`} placeholder="Write a note…" />
        <Textarea label="Feedback (error example)" rows={2} error="Please add some detail." />
        <Textarea label="Managed note" rows={2} defaultValue="This field is disabled." disabled />
      </div>
    </PrimitivePage>
  )
}
