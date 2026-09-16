import { useState } from 'react'
import { OtpInput } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { OtpInput } from '@catpkgs/coffee-ui'

<OtpInput
  label="Verification code"
  value={code}
  onValueChange={setCode}
  onComplete={verify}
/>

<OtpInput label="Recovery code" length={8} alphanumeric />`

export default function OtpInputPage() {
  const [value, setValue] = useState('')
  const [verified, setVerified] = useState<boolean | null>(null)
  return (
    <PrimitivePage title="OtpInput" description="Enter a one-time code in separate boxes. It's a single input underneath, so pasting, SMS autofill, and screen readers work as expected. onComplete fires once every box is filled." code={code}>
      <div className="space-y-5">
        <OtpInput
          label="Verification code"
          hint="Try 123456."
          value={value}
          onValueChange={(next) => { setValue(next); setVerified(null) }}
          onComplete={(code) => setVerified(code === '123456')}
          error={verified === false ? 'That code is incorrect.' : undefined}
        />
        <OtpInput label="Recovery code" length={8} alphanumeric />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{verified ? 'Code verified.' : 'Waiting for a code.'}</p>
    </PrimitivePage>
  )
}
