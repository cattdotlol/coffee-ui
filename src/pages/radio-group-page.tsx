import { useState } from 'react'
import { RadioGroup } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const options = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom (unavailable)', disabled: true },
]

const code = `import { useState } from 'react'
import { RadioGroup } from '@catpkgs/coffee-ui'

function Preferences() {
  const [frequency, setFrequency] = useState('weekly')

  return (
    <RadioGroup
      label="Update frequency"
      name="frequency"
      hint="Choose how often you receive updates."
      value={frequency}
      onValueChange={setFrequency}
      options={[
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'custom', label: 'Custom', disabled: true },
      ]}
    />
  )
}`

export default function RadioGroupPage() {
  const [frequency, setFrequency] = useState('weekly')
  return (
    <PrimitivePage title="RadioGroup" description="Choose one option from a small set. Native radio inputs support Tab and arrow-key navigation. Use defaultValue for uncontrolled state, and disabled to disable the whole group." code={code}>
      <div className="space-y-4">
        <RadioGroup label="Update frequency" name="frequency" hint="Choose how often you receive updates." value={frequency} onValueChange={setFrequency} options={options} />
        <p role="status" className="text-sm text-muted">Selected: {frequency}.</p>
        <RadioGroup label="Managed preference" name="managedFrequency" defaultValue="weekly" options={options.slice(0, 2)} disabled />
      </div>
    </PrimitivePage>
  )
}
