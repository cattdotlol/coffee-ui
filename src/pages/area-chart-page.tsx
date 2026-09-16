import { useState } from 'react'
import { AreaChart, SegmentedControl } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { AreaChart } from '@catpkgs/coffee-ui'

<AreaChart
  label="Revenue by channel"
  data={months}
  index="month"
  layout="stacked" // or "overlap"
  series={[
    { key: 'store', label: 'In store' },
    { key: 'app', label: 'App' },
    { key: 'delivery', label: 'Delivery' },
  ]}
  formatValue={(value) => \`$\${value.toLocaleString()}\`}
/>`

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const data = months.map((month, index) => ({
  month,
  store: Math.round(12000 + index * 300 + Math.sin(index * 0.9) * 1400),
  app: Math.round(4000 + index * 520),
  delivery: Math.round(2500 + Math.max(0, 6 - Math.abs(index - 6)) * 350),
}))
const series = [{ key: 'store', label: 'In store' }, { key: 'app', label: 'App' }, { key: 'delivery', label: 'Delivery' }] as const

export default function AreaChartPage() {
  const [layout, setLayout] = useState<'stacked' | 'overlap'>('stacked')
  return (
    <PrimitivePage title="AreaChart" description="Show how parts add up to a total over time with stacked areas, or compare trends with overlapping washes. The tooltip lists every series, plus the total when stacked." code={code}>
      <div className="space-y-4">
        <SegmentedControl label="Layout" value={layout} onValueChange={setLayout} options={[{ value: 'stacked', label: 'Stacked' }, { value: 'overlap', label: 'Overlap' }]} />
        <AreaChart label="Revenue by channel" data={data} index="month" layout={layout} series={series} formatValue={(value) => `$${Math.round(value / 1000)}k`} />
      </div>
    </PrimitivePage>
  )
}
