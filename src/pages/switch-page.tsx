import { useState } from 'react'
import { Switch } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Switch } from '@catpkgs/coffee-ui'

function Preferences() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      label="Notifications"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  )
}

<Switch label="Automatic updates" defaultChecked />
<Switch label="Managed preference" disabled />`

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false)
  return (
    <PrimitivePage title="Switch" description="Toggle an on/off preference. Use checked and onChange for controlled state, or defaultChecked for an initial value. Click the label or press Space while focused." code={code}>
      <div className="max-w-sm space-y-2">
        <Switch label="Notifications" checked={enabled} onCheckedChange={setEnabled} />
        <Switch label="Automatic updates" defaultChecked />
        <Switch label="Managed preference" disabled />
        <p role="status" className="pt-2 text-sm text-muted">Notifications are {enabled ? 'on' : 'off'} in this preview.</p>
      </div>
    </PrimitivePage>
  )
}
