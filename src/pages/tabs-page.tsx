import { useState } from 'react'
import { Tabs, TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { Tabs } from '@catpkgs/coffee-ui'

function Settings() {
  const [tab, setTab] = useState('profile')

  return (
    <Tabs label="Settings" value={tab} onValueChange={setTab}
      items={[
        { value: 'profile', label: 'Profile',
          content: <p>Your profile settings.</p> },
        { value: 'security', label: 'Security',
          content: <p>Your security settings.</p> },
        { value: 'billing', label: 'Billing', disabled: true,
          content: <p>Billing is unavailable.</p> },
      ]}
    />
  )
}`

export default function TabsPage() {
  const [tab, setTab] = useState('profile')
  return (
    <PrimitivePage title="Tabs" description="Switch between related panels. Arrow keys, Home, and End move between enabled tabs and activate them. Use defaultValue for uncontrolled state. Hidden panels retain their input state." code={code}>
      <Tabs label="Settings" value={tab} onValueChange={setTab} items={[
        { value: 'profile', label: 'Profile', content: <TextField label="Display name" defaultValue="Alex" hint="Try editing, then switch tabs and back." /> },
        { value: 'security', label: 'Security', content: <p className="text-muted">Manage your password and sign-in preferences here.</p> },
        { value: 'billing', label: 'Billing', disabled: true, content: <p>Billing is unavailable.</p> },
      ]} />
    </PrimitivePage>
  )
}
