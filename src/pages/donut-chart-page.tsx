import { DonutChart } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { DonutChart } from '@catpkgs/coffee-ui'

<DonutChart
  label="Orders by channel"
  totalLabel="Orders"
  data={[
    { label: 'In store', value: 1240 },
    { label: 'Mobile app', value: 640 },
    { label: 'Delivery', value: 360 },
  ]}
/>`

export default function DonutChartPage() {
  return (
    <PrimitivePage title="DonutChart" description="Part-to-whole at a glance for a few segments. The legend doubles as a table with values and percentages. More than four segments fold the smallest into a neutral Other slice instead of adding colors." code={code}>
      <div className="grid gap-6 md:grid-cols-2">
        <DonutChart label="Orders by channel" totalLabel="Orders" data={[
          { label: 'In store', value: 1240 },
          { label: 'Mobile app', value: 640 },
          { label: 'Delivery', value: 360 },
        ]} />
        <DonutChart label="Beans by origin" totalLabel="kg roasted" formatValue={(value) => `${value}`} data={[
          { label: 'Ethiopia', value: 320 },
          { label: 'Colombia', value: 280 },
          { label: 'Brazil', value: 190 },
          { label: 'Guatemala', value: 90 },
          { label: 'Kenya', value: 60 },
          { label: 'Sumatra', value: 40 },
        ]} />
      </div>
    </PrimitivePage>
  )
}
