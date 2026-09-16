import { Stat } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Stat } from '@catpkgs/coffee-ui'

<Stat
  label="Revenue"
  value="$42.1K"
  delta={8.2}
  comparison="vs last month"
  trend={[31, 33, 32, 36, 35, 38, 40, 39, 42]}
/>

// For metrics where lower is better, flip goodDirection.
<Stat label="Wait time" value="3m 12s" delta={-12.4} goodDirection="down" />`

export default function StatPage() {
  return (
    <PrimitivePage title="Stat" description="A headline number with an optional change and trend. The change is colored by whether it's good, not just its direction, and always carries an arrow and sign so it never relies on color alone." code={code}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Revenue" value="$42.1K" delta={8.2} comparison="vs last month" trend={[31, 33, 32, 36, 35, 38, 40, 39, 42]} />
        <Stat label="Wait time" value="3m 12s" delta={-12.4} goodDirection="down" comparison="vs last month" trend={[4.1, 4, 3.9, 3.8, 3.7, 3.5, 3.4, 3.3, 3.2]} />
        <Stat label="Refunds" value="1.8%" delta={0.6} deltaLabel="+0.6 pts" goodDirection="down" comparison="vs last month" />
      </div>
    </PrimitivePage>
  )
}
