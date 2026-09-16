import { useState } from 'react'
import { DescriptionList, InlineEdit } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { InlineEdit } from '@catpkgs/coffee-ui'

<InlineEdit
  label="Project name"
  value={name}
  onValueChange={setName}
  validate={(value) => value.trim() ? null : 'Name is required.'}
/>`

export default function InlineEditPage() {
  const [name, setName] = useState('Coffee UI')
  return (
    <PrimitivePage title="InlineEdit" description="Text that turns into an input when clicked. Enter or clicking away saves, Escape cancels, and focus returns to the text afterwards. Use validate to block invalid values." code={code}>
      <DescriptionList className="max-w-md" items={[
        { label: 'Project name', value: <InlineEdit label="Project name" value={name} onValueChange={setName} validate={(value) => (value.trim() ? null : 'Name is required.')} /> },
        { label: 'Description', value: <InlineEdit label="Description" placeholder="Add a description" /> },
        { label: 'Owner', value: <InlineEdit label="Owner" defaultValue="Ada Lovelace" disabled /> },
      ]} />
      <p role="status" className="mt-4 text-sm text-muted">Saved name: {name}</p>
    </PrimitivePage>
  )
}
