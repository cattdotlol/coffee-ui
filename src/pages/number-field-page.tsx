import { useState } from 'react'
import { NumberField } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { useState } from 'react'
import { NumberField } from '@catpkgs/coffee-ui'

function Seats() {
  const [seats, setSeats] = useState<number | null>(5)

  return (
    <NumberField
      label="Seats"
      min={1}
      max={50}
      value={seats}
      onValueChange={setSeats}
    />
  )
}

<NumberField label="Price" step={0.01} min={0} defaultValue={9.99} />`

export default function NumberFieldPage() {
  const [seats, setSeats] = useState<number | null>(5)
  return (
    <PrimitivePage title="NumberField" description="A numeric input with decrement and increment buttons. Arrow keys step the value, and it's clamped to min and max when the field loses focus. An empty field has a value of null." code={code}>
      <div className="max-w-xs space-y-4">
        <NumberField label="Seats" hint="Between 1 and 50." min={1} max={50} value={seats} onValueChange={setSeats} error={seats === null ? 'Enter a number of seats.' : undefined} />
        <NumberField label="Price" step={0.01} min={0} defaultValue={9.99} />
        <NumberField label="Locked" defaultValue={3} disabled />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Seats: {seats ?? 'none'}</p>
    </PrimitivePage>
  )
}
