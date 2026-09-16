import { useState } from 'react'
import { Accordion, Switch } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Accordion } from '@catpkgs/coffee-ui'

<Accordion defaultValue={['details']} items={[
  { value: 'details', title: 'Project details',
    content: <p>Information about your project.</p> },
  { value: 'settings', title: 'Settings',
    content: <p>Your project preferences.</p> },
  { value: 'billing', title: 'Billing', disabled: true,
    content: <p>Not available yet.</p> },
]} />

// Add multiple to allow several open sections.
// Use value and onValueChange for controlled state.`

export default function AccordionPage() {
  const [multiple, setMultiple] = useState(false)
  return (
    <PrimitivePage title="Accordion" description="Expandable sections for supporting details. Enter or Space toggles the focused header. Supports disabled sections, controlled values, and multiple open sections. Content stays mounted to preserve form state." code={code}>
      <div className="mb-3 max-w-xs"><Switch label="Allow multiple open sections" checked={multiple} onCheckedChange={setMultiple} /></div>
      <Accordion multiple={multiple} defaultValue={['details']} items={[
        { value: 'details', title: 'Project details', content: <p>Keep project context here and reveal it when needed.</p> },
        { value: 'settings', title: 'Settings', content: <Switch label="Email updates" defaultChecked /> },
        { value: 'billing', title: 'Billing (unavailable)', disabled: true, content: <p>Not available yet.</p> },
      ]} />
    </PrimitivePage>
  )
}
