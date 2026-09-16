import { useState } from 'react'
import { LineChart, SegmentedControl } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { LineChart } from '@catpkgs/coffee-ui'

// One series: add area for a soft wash under the line.
<LineChart
  label="Daily revenue"
  data={days}
  index="date"
  series={[{ key: 'revenue', label: 'Revenue' }]}
  area
  formatValue={(value) => \`$\${value.toLocaleString()}\`}
/>

// Up to four series get a legend and colors from the chart palette.
<LineChart
  label="Cups sold by drink"
  data={weeks}
  index="week"
  series={[
    { key: 'latte', label: 'Latte' },
    { key: 'coldBrew', label: 'Cold brew' },
    { key: 'espresso', label: 'Espresso' },
  ]}
/>`

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenue = months.map((month, index) => ({ month, revenue: Math.round(18000 + index * 1400 + Math.sin(index * 1.3) * 2600) }))
const drinks = months.map((month, index) => ({
  month,
  latte: Math.round(2400 + index * 90 + Math.sin(index) * 220),
  coldBrew: Math.round(900 + Math.max(0, 6 - Math.abs(index - 6)) * 380),
  espresso: Math.round(1500 + Math.cos(index * 0.8) * 160),
}))

export default function LineChartPage() {
  const [view, setView] = useState<'single' | 'multiple'>('multiple')
  return (
    <PrimitivePage title="LineChart" description="Trends over time for one to four series. Hover or focus the chart and use the arrow keys for a crosshair readout of every series; values are also exposed as a hidden table for screen readers. Colors come from the validated chart palette." code={code}>
      <div className="space-y-4">
        <SegmentedControl label="Example" value={view} onValueChange={setView} options={[{ value: 'single', label: 'Single series' }, { value: 'multiple', label: 'Multiple series' }]} />
        {view === 'single'
          ? <LineChart label="Monthly revenue" data={revenue} index="month" series={[{ key: 'revenue', label: 'Revenue' }]} area formatValue={(value) => `$${value.toLocaleString()}`} formatTick={(value) => `$${value / 1000}K`} />
          : <LineChart label="Cups sold by drink" data={drinks} index="month" series={[{ key: 'latte', label: 'Latte' }, { key: 'coldBrew', label: 'Cold brew' }, { key: 'espresso', label: 'Espresso' }]} />}
      </div>
    </PrimitivePage>
  )
}
