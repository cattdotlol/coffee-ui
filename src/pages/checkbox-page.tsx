import { useState } from 'react'
import { Checkbox } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Checkbox } from '@catpkgs/coffee-ui'

<Checkbox label="Email updates" checked={checked} onCheckedChange={setChecked} />
<Checkbox label="Remember me" hint="Stays signed in for 30 days." defaultChecked />
<Checkbox label="Accept terms" required error="You must accept the terms." />

// indeterminate for "select all" patterns.
<Checkbox label="Select all" checked={allSelected} indeterminate={someSelected} onCheckedChange={selectAll} />`

const topics = ['Product news', 'Security alerts', 'Tips and tutorials']

export default function CheckboxPage() {
  const [selected, setSelected] = useState(['Security alerts'])
  const all = selected.length === topics.length
  return (
    <PrimitivePage title="Checkbox" description="Select independent options. Use onCheckedChange for a boolean callback, indeterminate for partial selections, and hint or error for extra context. Click the label or press Space while focused." code={code}>
      <div>
        <Checkbox label="All topics" checked={all} indeterminate={selected.length > 0 && !all} onCheckedChange={(checked) => setSelected(checked ? topics : [])} />
        <div className="ml-6">
          {topics.map((topic) => (
            <Checkbox key={topic} label={topic} checked={selected.includes(topic)} onCheckedChange={(checked) => setSelected(checked ? [...selected, topic] : selected.filter((item) => item !== topic))} />
          ))}
        </div>
        <Checkbox label="Remember my preferences" hint="Applies on this device only." defaultChecked />
        <Checkbox label="Accept terms" error="You must accept the terms to continue." />
        <Checkbox label="Managed preference" defaultChecked disabled />
        <p role="status" className="pt-2 text-sm text-muted">{selected.length} of {topics.length} topics selected.</p>
      </div>
    </PrimitivePage>
  )
}
