import { useState } from 'react'
import { Button, SegmentedControl, Sheet, Switch, TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Sheet, Button } from '@catpkgs/coffee-ui'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit profile</Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Edit profile"
        description="Changes are visible to your team."
        side="right" // or "left", "bottom"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </>}
      >
        {/* form fields */}
      </Sheet>
    </>
  )
}`

export default function SheetPage() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<'left' | 'right' | 'bottom'>('right')
  const [name, setName] = useState('Ada Lovelace')
  const [draft, setDraft] = useState(name)

  function openSheet() {
    setDraft(name)
    setOpen(true)
  }

  return (
    <PrimitivePage title="Sheet" description="A modal panel that slides in from the edge of the screen for secondary tasks like editing details. Focus stays inside while open; Escape or the close button dismisses it." code={code}>
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl label="Side" value={side} onValueChange={setSide} options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'bottom', label: 'Bottom' }]} />
        <Button onClick={openSheet}>Edit profile</Button>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Display name: {name}</p>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        side={side}
        title="Edit profile"
        description="Changes are visible to your team."
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={!draft.trim()} onClick={() => { setName(draft.trim()); setOpen(false) }}>Save</Button>
        </>}
      >
        <div className="space-y-4">
          <TextField label="Display name" value={draft} onValueChange={setDraft} />
          <Switch label="Show online status" defaultChecked />
        </div>
      </Sheet>
    </PrimitivePage>
  )
}
