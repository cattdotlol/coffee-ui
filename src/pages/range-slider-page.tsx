import { useState } from 'react'
import { RangeSlider } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { RangeSlider } from '@catpkgs/coffee-ui'

<RangeSlider
  label="Price"
  min={0}
  max={200}
  step={5}
  minDistance={10}
  value={price}
  onValueChange={setPrice}
  formatValue={(value) => \`$\${value}\`}
/>`

export default function RangeSliderPage() {
  const [price, setPrice] = useState<[number, number]>([40, 120])
  return (
    <PrimitivePage title="RangeSlider" description="Select a minimum and maximum with two thumbs. Each thumb is a native range input with its own label, so arrow keys and screen readers work on both. minDistance keeps them apart." code={code}>
      <div className="max-w-sm space-y-5">
        <RangeSlider label="Price" min={0} max={200} step={5} minDistance={10} value={price} onValueChange={setPrice} formatValue={(value) => `$${value}`} />
        <RangeSlider label="Roast level" hint="1 is lightest, 10 is darkest." min={1} max={10} defaultValue={[3, 7]} />
        <RangeSlider label="Locked" defaultValue={[20, 60]} disabled />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">Showing items from ${price[0]} to ${price[1]}.</p>
    </PrimitivePage>
  )
}
