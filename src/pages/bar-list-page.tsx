import { BarList } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { BarList } from '@catpkgs/coffee-ui'

<BarList
  label="Top drinks"
  items={[
    { label: 'Flat white', value: 1284 },
    { label: 'Oat latte', value: 1032 },
    { label: 'Cold brew', value: 814 },
  ]}
/>`

export default function BarListPage() {
  return (
    <PrimitivePage title="BarList" description="A ranked list of horizontal bars with the value at each tip. Ideal for top-N breakdowns with long labels. Focus or hover a row to see its share of the total." code={code}>
      <BarList label="Top drinks by cups sold" className="max-w-md" items={[
        { label: 'Flat white', value: 1284 },
        { label: 'Oat latte', value: 1032 },
        { label: 'Cold brew', value: 814 },
        { label: 'Cortado', value: 692 },
        { label: 'Espresso tonic', value: 318 },
      ]} />
    </PrimitivePage>
  )
}
