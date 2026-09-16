import { RadarChart } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { RadarChart } from '@catpkgs/coffee-ui'

<RadarChart
  label="Tasting notes"
  data={notes}
  index="attribute"
  series={[
    { key: 'ethiopia', label: 'Ethiopia' },
    { key: 'colombia', label: 'Colombia' },
  ]}
/>`

const notes = [
  { attribute: 'Acidity', ethiopia: 9, colombia: 6, sumatra: 3 },
  { attribute: 'Sweetness', ethiopia: 7, colombia: 8, sumatra: 5 },
  { attribute: 'Body', ethiopia: 4, colombia: 6, sumatra: 9 },
  { attribute: 'Aroma', ethiopia: 9, colombia: 7, sumatra: 6 },
  { attribute: 'Bitterness', ethiopia: 2, colombia: 4, sumatra: 7 },
  { attribute: 'Aftertaste', ethiopia: 8, colombia: 7, sumatra: 6 },
]

export default function RadarChartPage() {
  return (
    <PrimitivePage title="RadarChart" description="Compare a few profiles across the same attributes. Best with three to eight attributes and up to four series. Hover near an axis or use the arrow keys to read values." code={code}>
      <RadarChart
        label="Tasting notes by origin"
        data={notes}
        index="attribute"
        series={[{ key: 'ethiopia', label: 'Ethiopia' }, { key: 'colombia', label: 'Colombia' }, { key: 'sumatra', label: 'Sumatra' }]}
      />
    </PrimitivePage>
  )
}
