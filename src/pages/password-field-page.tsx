import { useState } from 'react'
import { PasswordField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { PasswordField } from '@catpkgs/coffee-ui'

<PasswordField label="Password" />

// For sign-up forms, show a strength hint and use the new-password autocomplete.
<PasswordField
  label="New password"
  autoComplete="new-password"
  showStrength
  value={password}
  onValueChange={setPassword}
/>`

export default function PasswordFieldPage() {
  const [password, setPassword] = useState('')
  return (
    <PrimitivePage title="PasswordField" description="A password input with a show/hide toggle and an optional strength hint. The toggle is announced as a pressed button, and autocomplete defaults to current-password for password managers." code={code}>
      <div className="max-w-sm space-y-4">
        <PasswordField label="Current password" />
        <PasswordField label="New password" autoComplete="new-password" showStrength hint="Use 12 or more characters." value={password} onValueChange={setPassword} />
      </div>
    </PrimitivePage>
  )
}
