import { useState } from 'react'
import { TagInput } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { TagInput } from '@catpkgs/coffee-ui'

<TagInput
  label="Invite by email"
  value={emails}
  onValueChange={setEmails}
  maxTags={5}
  validate={(email) => email.includes('@') ? null : \`\${email} isn't a valid email.\`}
/>`

export default function TagInputPage() {
  const [emails, setEmails] = useState(['ada@acme.com'])
  return (
    <PrimitivePage title="TagInput" description="Type free-form values and turn them into tags with Enter or a comma. Pasting a comma-separated list adds each item, Backspace removes the last tag, and validate rejects bad values with a message." code={code}>
      <div className="max-w-sm space-y-4">
        <TagInput label="Invite by email" hint="Up to 5 addresses." placeholder="name@company.com" value={emails} onValueChange={setEmails} maxTags={5} validate={(email) => (/^\S+@\S+\.\S+$/.test(email) ? null : `${email} isn't a valid email.`)} />
        <TagInput label="Keywords" placeholder="Add keywords" defaultValue={['coffee', 'roast']} />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{emails.length} {emails.length === 1 ? 'invite' : 'invites'} ready.</p>
    </PrimitivePage>
  )
}
