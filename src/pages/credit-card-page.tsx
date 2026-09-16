import { useState } from 'react'
import { CreditCard, SegmentedControl, Switch } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { CreditCard } from '@catpkgs/coffee-ui'

<CreditCard
  number="4242 4242 4242 4242"
  name="Ada Lovelace"
  expiry="08 / 28"
  theme="espresso" // "caramel" | "midnight" | "forest"
/>

// Show the back with the security code.
<CreditCard number={number} cvc="123" flipped />`

const samples = [
  { number: '4242 4242 4242 4242', name: 'Ada Lovelace', expiry: '08 / 28', cvc: '123', theme: 'espresso' },
  { number: '5555 5555 5555 4444', name: 'Grace Hopper', expiry: '11 / 27', cvc: '456', theme: 'midnight' },
  { number: '3782 822463 10005', name: 'Alan Turing', expiry: '03 / 29', cvc: '7890', theme: 'forest' },
  { number: '6011 1111 1111 1117', name: 'Katherine Johnson', expiry: '06 / 30', cvc: '321', theme: 'caramel' },
] as const

export default function CreditCardPage() {
  const [flipped, setFlipped] = useState(false)
  const [masked, setMasked] = useState(true)
  const [theme, setTheme] = useState<'espresso' | 'caramel' | 'midnight' | 'forest'>('espresso')
  return (
    <PrimitivePage title="CreditCard" description="A visual payment card with chip, brand mark, and a flip to the back. Numbers are masked to the last four digits by default, and the whole card is announced as a short summary like “Visa ending in 4242, expires 08/28”. Brand marks are simplified wordmarks, not official logos." code={code}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl label="Theme" value={theme} onValueChange={setTheme} options={[{ value: 'espresso', label: 'Espresso' }, { value: 'caramel', label: 'Caramel' }, { value: 'midnight', label: 'Midnight' }, { value: 'forest', label: 'Forest' }]} />
          <div className="w-36"><Switch label="Show back" checked={flipped} onCheckedChange={setFlipped} /></div>
          <div className="w-36"><Switch label="Mask number" checked={masked} onCheckedChange={setMasked} /></div>
        </div>
        <CreditCard {...samples[0]} theme={theme} flipped={flipped} masked={masked} />
        <div className="grid gap-4 sm:grid-cols-3">
          {samples.slice(1).map((sample) => <CreditCard key={sample.number} {...sample} masked={masked} />)}
        </div>
      </div>
    </PrimitivePage>
  )
}
