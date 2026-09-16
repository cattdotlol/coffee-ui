import { useState } from 'react'
import { AtSign, Search } from 'lucide-react'
import { TextField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { TextField } from '@catpkgs/coffee-ui'

<TextField label="Display name" value={name} onValueChange={setName} />
<TextField label="Email" type="email" required error="Enter a valid email address." />

// hideLabel keeps the label for screen readers only.
<TextField label="Search" hideLabel type="search" placeholder="Search…" />

// leading and trailing add icons or text inside the field.
<TextField label="Website" leading="https://" trailing=".com" />
<TextField label="Search" leading={<Search />} />`

export default function TextFieldPage() {
  const [name, setName] = useState('')
  return (
    <PrimitivePage title="TextField" description="A labeled input with optional hint and error text. Labels and descriptions are linked automatically. Use onValueChange for the string value, hideLabel for visually hidden labels, and native props for everything else." code={code}>
      <div className="max-w-sm space-y-4">
        <TextField label="Display name" name="displayName" autoComplete="nickname" value={name} onValueChange={setName} hint="Choose a name people will recognize." />
        <TextField label="Email" type="email" required error="Enter a valid email address." />
        <TextField label="Search" hideLabel type="search" placeholder="Search…" leading={<Search strokeWidth={1.5} />} />
        <TextField label="Website" leading="https://" trailing=".com" placeholder="coffee" />
        <TextField label="Username" leading={<AtSign strokeWidth={1.5} />} defaultValue="ada" />
        <TextField label="Workspace" defaultValue="Personal" disabled />
      </div>
    </PrimitivePage>
  )
}
