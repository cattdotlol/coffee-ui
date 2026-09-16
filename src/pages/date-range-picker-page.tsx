import { useState } from 'react'
import { DateRangePicker } from '@catpkgs/coffee-ui'
import type { DateRange } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { DateRangePicker } from '@catpkgs/coffee-ui'

<DateRangePicker
  label="Trip dates"
  value={range}
  onValueChange={setRange}
  min={new Date()}
  startName="checkIn"
  endName="checkOut"
/>`

export default function DateRangePickerPage() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null })
  const nights = range.start && range.end ? Math.round((range.end.getTime() - range.start.getTime()) / 86_400_000) : 0
  return (
    <PrimitivePage title="DateRangePicker" description="Pick a start and end date from one calendar. The range previews as you hover or move with the keyboard, and dates can be chosen in either order." code={code}>
      <div className="max-w-sm">
        <DateRangePicker label="Trip dates" hint="Choose check-in, then check-out." value={range} onValueChange={setRange} min={new Date()} />
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{nights ? `${nights} ${nights === 1 ? 'night' : 'nights'} selected.` : 'No dates selected.'}</p>
    </PrimitivePage>
  )
}
