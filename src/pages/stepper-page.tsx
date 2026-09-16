import { useState } from 'react'
import { Button, Stepper } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Stepper } from '@catpkgs/coffee-ui'

<Stepper
  current={step}
  onStepClick={setStep}
  steps={[
    { label: 'Account', description: 'Your details' },
    { label: 'Workspace' },
    { label: 'Invite' },
  ]}
/>

<Stepper orientation="vertical" current={1} steps={steps} />`

const steps = [
  { label: 'Account', description: 'Your details' },
  { label: 'Workspace', description: 'Name and URL' },
  { label: 'Invite', description: 'Add teammates' },
]

export default function StepperPage() {
  const [step, setStep] = useState(1)
  return (
    <PrimitivePage title="Stepper" description="Shows progress through a multi-step flow. The current step is marked with aria-current. Pass onStepClick to let people return to completed steps." code={code}>
      <div className="space-y-6">
        <Stepper aria-label="Setup progress" current={step} onStepClick={setStep} steps={steps} />
        <div className="flex gap-2">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          <Button disabled={step === steps.length} onClick={() => setStep(step + 1)}>{step >= steps.length - 1 ? 'Finish' : 'Continue'}</Button>
        </div>
        <Stepper aria-label="Order status" orientation="vertical" current={1} steps={[
          { label: 'Order placed', description: 'Sep 14' },
          { label: 'Shipped', description: 'On its way' },
          { label: 'Delivered' },
        ]} />
      </div>
    </PrimitivePage>
  )
}
