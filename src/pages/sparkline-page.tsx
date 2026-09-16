import { Sparkline } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Sparkline } from '@catpkgs/coffee-ui'

<Sparkline values={[12, 18, 15, 22, 19, 26, 31]} label="Orders trending up this week" />`

const rows = [
  { name: 'Flat white', values: [42, 45, 44, 48, 51, 49, 55, 58, 57, 61, 60, 64] },
  { name: 'Cold brew', values: [30, 28, 31, 27, 25, 24, 22, 23, 21, 19, 20, 18] },
  { name: 'Cortado', values: [18, 19, 18, 20, 19, 21, 20, 22, 21, 22, 23, 22] },
]

export default function SparklinePage() {
  return (
    <PrimitivePage title="Sparkline" description="A tiny trend line without axes, for use inside tiles, tables, and lists. History is muted and the latest period is highlighted. Pass a label when the trend isn't described by nearby text." code={code}>
      <ul className="max-w-md divide-y divide-border text-sm">
        {rows.map((row) => (
          <li key={row.name} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-4 py-2.5">
            <span>{row.name}</span>
            <Sparkline values={row.values} height={28} />
            <span className="text-right font-medium tabular-nums">{row.values.at(-1)}</span>
          </li>
        ))}
      </ul>
    </PrimitivePage>
  )
}
