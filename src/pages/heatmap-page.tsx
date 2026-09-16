import { Heatmap } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Heatmap } from '@catpkgs/coffee-ui'

<Heatmap
  label="Orders by day and hour"
  rows={['Mon', 'Tue', 'Wed']}
  columns={['7am', '8am', '9am']}
  values={[
    [12, 40, 32],
    [15, 44, null], // null marks missing data
    [11, 38, 30],
  ]}
/>`

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 13 }, (_, index) => {
  const hour = index + 7
  return hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`
})
const values = days.map((_, day) => hours.map((_, hour) => {
  if (day === 6 && hour > 10) return null
  const weekend = day >= 5
  const morning = Math.max(0, 5 - Math.abs(hour - (weekend ? 3 : 1))) * (weekend ? 7 : 11)
  const lunch = Math.max(0, 3 - Math.abs(hour - 5)) * 6
  return Math.round(6 + morning + lunch + ((day * 7 + hour * 3) % 5))
}))

export default function HeatmapPage() {
  return (
    <PrimitivePage title="Heatmap" description="Shows how a value changes across two dimensions, such as day and hour. Darker cells are higher. Arrow keys move across rows and columns, and missing values are outlined." code={code}>
      <Heatmap label="Orders by day and hour" rows={days} columns={hours} values={values} labelEvery={2} formatValue={(value) => `${value} orders`} />
    </PrimitivePage>
  )
}
