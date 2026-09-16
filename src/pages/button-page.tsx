import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Plus } from 'lucide-react'
import { Button } from '@catpkgs/coffee-ui'

<Button onClick={save}>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
<Button variant="ghost">More options</Button>
<Button variant="link">Show details</Button>
<Button variant="destructive">Delete item</Button>

<Button size="sm">Small</Button>
<Button size="lg"><Plus className="size-4" />Large</Button>

// loading disables the button and shows a spinner.
<Button loading={saving}>Save</Button>

// className overrides defaults without conflicts.
<Button className="w-full">Full width</Button>`

export default function ButtonPage() {
  const [message, setMessage] = useState('Try a button to see its response.')
  const [saving, setSaving] = useState(false)

  function save() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setMessage('Saved after loading.') }, 1500)
  }

  return (
    <PrimitivePage title="Button" description="Seven variants, three sizes, and a loading state. Reserve destructive for actions that remove data. The link variant styles an action; use a real link for navigation." code={code}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setMessage('Changes saved.')}>Save changes</Button>
          <Button variant="secondary" onClick={() => setMessage('Changes cancelled.')}>Cancel</Button>
          <Button variant="outline" onClick={() => setMessage('Outline: a bordered alternative action.')}>Edit</Button>
          <Button variant="ghost" onClick={() => setMessage('Ghost: a subtle action with a background on hover.')}>More options</Button>
          <Button variant="link" onClick={() => setMessage('Link: a text-style action. Use a real link for navigation.')}>Show details</Button>
          <Button variant="destructive" onClick={() => setMessage('Destructive preview only. Nothing was deleted.')}>Delete item</Button>
          <Button disabled>Unavailable</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline">Small</Button>
          <Button variant="outline">Medium</Button>
          <Button size="lg" variant="outline"><Plus aria-hidden="true" className="size-4" strokeWidth={1.5} />Large</Button>
          <Button loading={saving} onClick={save}>{saving ? 'Saving…' : 'Save with loading'}</Button>
        </div>
      </div>
      <p role="status" className="mt-5 text-sm text-muted">{message}</p>
    </PrimitivePage>
  )
}
