import { useState } from 'react'
import { BarChart, SegmentedControl } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { BarChart } from '@catpkgs/coffee-ui'

<BarChart label="Orders per day" data={days} index="day" series={[{ key: 'orders', label: 'Orders' }]} showValues />

<BarChart
  label="Orders by channel"
  data={days}
  index="day"
  layout="stacked" // or "grouped"
  series={[
    { key: 'store', label: 'In store' },
    { key: 'app', label: 'App' },
    { key: 'delivery', label: 'Delivery' },
  ]}
/>`

const data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => ({
  day,
  store: 180 + index * 14 + (index > 4 ? 60 : 0),
  app: 90 + index * 9,
  delivery: 40 + (index % 3) * 18,
}))
const totals = data.map((row) => ({ day: row.day, orders: row.store + row.app + row.delivery }))

export default function BarChartPage() {
  const [layout, setLayout] = useState<'single' | 'grouped' | 'stacked'>('stacked')
  const series = [{ key: 'store', label: 'In store' }, { key: 'app', label: 'App' }, { key: 'delivery', label: 'Delivery' }] as const
  return (
    <PrimitivePage title="BarChart" description="Compare values across categories with thin columns. Use one series, group up to four side by side, or stack them to show a total. Each column is its own hover and keyboard target with a tooltip listing every series." code={code}>
      <div className="space-y-4">
        <SegmentedControl label="Layout" value={layout} onValueChange={setLayout} options={[{ value: 'single', label: 'Single' }, { value: 'grouped', label: 'Grouped' }, { value: 'stacked', label: 'Stacked' }]} />
        {layout === 'single'
          ? <BarChart label="Orders per day" data={totals} index="day" series={[{ key: 'orders', label: 'Orders' }]} showValues />
          : <BarChart label="Orders per day by channel" data={data} index="day" layout={layout} series={series} />}
      </div>
    </PrimitivePage>
  )
}
