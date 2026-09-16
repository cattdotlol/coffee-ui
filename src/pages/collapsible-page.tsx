import { useState } from 'react'
import { Collapsible, Switch } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Collapsible } from '@catpkgs/coffee-ui'

<Collapsible title="Advanced settings">
  <Switch label="Enable beta features" />
</Collapsible>

// Controlled
<Collapsible title="Details" open={open} onOpenChange={setOpen}>…</Collapsible>`

export default function CollapsiblePage() {
  const [open, setOpen] = useState(false)
  return (
    <PrimitivePage title="Collapsible" description="A single section that shows and hides its content. Use Accordion for a list of related sections. Content stays mounted so form values persist." code={code}>
      <div className="max-w-sm">
        <Collapsible title="Advanced settings" open={open} onOpenChange={setOpen}>
          <Switch label="Enable beta features" />
          <Switch label="Send diagnostics" defaultChecked />
        </Collapsible>
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Advanced settings are {open ? 'shown' : 'hidden'}.</p>
    </PrimitivePage>
  )
}
